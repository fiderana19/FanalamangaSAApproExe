const { app, BrowserWindow, ipcMain, net, protocol, session, shell } = require("electron");
const fs = require("fs");
const path = require("path");
const updater = require("./updater.cjs");

const APP_SCHEME = "app";
const APP_HOST = "app";
const PRODUCT_NAME = "Fanalamanga SA Approvisionnement";

const DEFAULT_CONFIG = {
  baseUrl: "http://localhost:3002/api",
  stockUrl: "http://localhost:3066/api",
  stockApiKey: "",
  wsUrl: "",
  update: {
    enabled: true,
    autoCheckOnStartup: true,
    owner: "fiderana19",
    repo: "FanalamangaSAApproExe",
  },
};

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".map": "application/json",
};

const isDev = !app.isPackaged && process.argv.includes("--dev");
let splashWindow = null;
let mainWindow = null;
let backendOk = false;
let mainWindowReady = false;
let startupUpdateChecked = false;

protocol.registerSchemesAsPrivileged([
  {
    scheme: APP_SCHEME,
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      corsEnabled: true,
      stream: true,
    },
  },
]);

function getDistPath() {
  return path.join(__dirname, "..", "dist");
}

function getSplashPath() {
  return path.join(__dirname, "splash.html");
}

function getSplashLogoPath() {
  return path.join(__dirname, "splash-logo.png");
}

function loadAppConfig() {
  const candidates = app.isPackaged
    ? [path.join(path.dirname(process.execPath), "config.json")]
    : [path.join(__dirname, "..", "config.json")];

  for (const candidate of candidates) {
    try {
      if (fs.existsSync(candidate)) {
        const parsed = JSON.parse(fs.readFileSync(candidate, "utf-8"));
        return { ...DEFAULT_CONFIG, ...parsed };
      }
    } catch (error) {
      console.error(`[config] Impossible de lire ${candidate}:`, error.message);
    }
  }
  return { ...DEFAULT_CONFIG };
}

function registerAppProtocol() {
  const distPath = getDistPath();

  protocol.handle(APP_SCHEME, (request) => {
    let pathname;
    try {
      pathname = decodeURIComponent(new URL(request.url).pathname);
    } catch {
      return new Response("URL invalide", { status: 400 });
    }

    if (!pathname || pathname === "/") {
      pathname = "/index.html";
    }

    const resolvedPath = path.normalize(path.join(distPath, pathname));
    if (!resolvedPath.startsWith(distPath)) {
      return new Response("Acces refuse", { status: 403 });
    }

    let filePath = resolvedPath;
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(distPath, "index.html");
    }

    try {
      const content = fs.readFileSync(filePath);
      const contentType =
        MIME_TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream";
      return new Response(new Uint8Array(content), {
        headers: { "Content-Type": contentType },
      });
    } catch {
      return new Response("Ressource introuvable", { status: 404 });
    }
  });
}

function configureSessionPermissions() {
  const allowedPermissions = [
    "media",
    "mediaKeySystem",
    "media-gesture",
    "clipboard-read",
    "clipboard-sanitized-write",
    "fullscreen",
    "notifications",
    "pointerLock",
  ];

  session.defaultSession.setPermissionRequestHandler((_webContents, permission, callback) => {
    callback(allowedPermissions.includes(permission));
  });

  session.defaultSession.setPermissionCheckHandler((_webContents, permission) => {
    return allowedPermissions.includes(permission);
  });
}

function sendSplashStatus(status) {
  if (splashWindow && !splashWindow.isDestroyed()) {
    splashWindow.webContents.send("splash-status", status);
  }
}

function sendUpdateEvent(payload) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send("updater:event", payload);
  }
}

function scheduleStartupUpdateCheck(config) {
  if (startupUpdateChecked) return;
  startupUpdateChecked = true;

  const updateConfig = (config && config.update) || {};
  if (updateConfig.enabled === false || updateConfig.autoCheckOnStartup === false) {
    return;
  }

  setTimeout(() => {
    updater.checkForUpdates().catch((error) => {
      console.error("[updater] Verification initiale echouee:", error && error.message);
    });
  }, 4000);
}

async function checkBackend(config) {
  const base = String(config.baseUrl || "").trim();
  if (!base) return false;
  try {
    await fetch(base, { method: "GET", signal: AbortSignal.timeout(8000) });
    return true;
  } catch {
    try {
      await fetch(base, { method: "HEAD", signal: AbortSignal.timeout(8000) });
      return true;
    } catch {
      return false;
    }
  }
}

async function runBackendCheck(config, { manual = false } = {}) {
  sendSplashStatus({ state: "checking", manual });
  backendOk = await checkBackend(config);
  if (backendOk) {
    sendSplashStatus({ state: "ok" });
    maybeShowMainWindow();
    return;
  }
  sendSplashStatus({
    state: "error",
    message: `Le serveur ${config.baseUrl} est injoignable. Verifiez la connexion et le fichier config.json.`,
  });
}

function scheduleBackendCheck(config) {
  runBackendCheck(config).finally(() => {
    setTimeout(() => {
      if (!backendOk && splashWindow && !splashWindow.isDestroyed()) {
        scheduleBackendCheck(config);
      }
    }, 5000);
  });
}

function maybeShowMainWindow() {
  if (!backendOk || !mainWindowReady || !mainWindow) return;
  mainWindow.show();
  mainWindow.focus();
  if (splashWindow && !splashWindow.isDestroyed()) {
    splashWindow.close();
    splashWindow = null;
  }
}

function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 520,
    height: 340,
    resizable: false,
    maximizable: false,
    minimizable: false,
    frame: false,
    transparent: false,
    center: true,
    show: true,
    backgroundColor: "#f5f7f8",
    icon: getSplashLogoPath(),
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  splashWindow.setMenuBarVisibility(false);
  splashWindow.loadFile(getSplashPath());
  splashWindow.on("closed", () => {
    splashWindow = null;
  });
}

function createMainWindow(config) {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 700,
    show: false,
    backgroundColor: "#f5f7f8",
    title: PRODUCT_NAME,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      additionalArguments: [`--fanalamanga-config=${JSON.stringify(config)}`],
    },
  });

  mainWindow.setMenuBarVisibility(false);
  mainWindow.maximize();

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:\/\//i.test(url)) {
      shell.openExternal(url);
    }
    return { action: "deny" };
  });

  mainWindow.webContents.on("did-fail-load", (_event, errorCode, errorDescription) => {
    console.error("[main] Echec du chargement:", errorCode, errorDescription);
    sendSplashStatus({
      state: "error",
      message: `Impossible de charger l'application (code ${errorCode}).`,
    });
  });

  mainWindow.webContents.on("did-finish-load", () => {
    mainWindowReady = true;
    maybeShowMainWindow();
    scheduleStartupUpdateCheck(config);
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    mainWindow.loadURL(`${APP_SCHEME}://${APP_HOST}/`);
  }
}

app.whenReady().then(() => {
  const config = loadAppConfig();
  config.__configPath = app.isPackaged
    ? path.join(path.dirname(process.execPath), "config.json")
    : path.join(__dirname, "..", "config.json");

  registerAppProtocol();
  configureSessionPermissions();

  const gotTheLock = app.requestSingleInstanceLock();
  if (!gotTheLock) {
    app.quit();
    return;
  }

  ipcMain.on("splash-retry", () => {
    runBackendCheck(config, { manual: true });
  });

  ipcMain.handle("app:version", () => app.getVersion());
  ipcMain.handle("updater:check", () => updater.checkForUpdates());
  ipcMain.handle("updater:download", () => updater.downloadUpdate());
  ipcMain.handle("updater:install", () => updater.installUpdate());

  updater.setupUpdater({ config, isDev, sendEvent: sendUpdateEvent });

  createSplashWindow();
  createMainWindow(config);
  scheduleBackendCheck(config);
});

app.on("second-instance", () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.show();
    mainWindow.focus();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
