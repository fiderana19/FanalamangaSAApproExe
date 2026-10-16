const { autoUpdater } = require("electron-updater");

let sendEvent = () => {};
let initialized = false;

function emit(payload) {
  try {
    sendEvent(payload);
  } catch (error) {
    console.error("[updater] Emission impossible:", error.message);
  }
}

function normalizeNotes(notes) {
  if (!notes) return "";
  if (typeof notes === "string") return notes;
  if (Array.isArray(notes)) {
    return notes
      .map((entry) => {
        const version = entry.version ? `${entry.version}\n` : "";
        return `${version}${entry.note || ""}`.trim();
      })
      .filter(Boolean)
      .join("\n\n");
  }
  return "";
}

function setupUpdater({ config, isDev, sendEvent: sender }) {
  const updateConfig = (config && config.update) || {};
  if (updateConfig.enabled === false) {
    return false;
  }

  sendEvent = sender || sendEvent;

  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = false;
  autoUpdater.forceDevUpdateConfig = !!isDev;

  if (updateConfig.owner && updateConfig.repo) {
    autoUpdater.setFeedURL({
      provider: "github",
      owner: updateConfig.owner,
      repo: updateConfig.repo,
    });
  }

  autoUpdater.logger = {
    info: (message) => console.log("[updater]", message),
    warn: (message) => console.warn("[updater]", message),
    error: (message) => console.error("[updater]", message),
    debug: (message) => console.log("[updater:debug]", message),
  };

  autoUpdater.on("checking-for-update", () => emit({ state: "checking" }));

  autoUpdater.on("update-available", (info) =>
    emit({
      state: "available",
      version: info.version,
      releaseName: info.releaseName,
      releaseNotes: normalizeNotes(info.releaseNotes),
      releaseDate: info.releaseDate,
    }),
  );

  autoUpdater.on("update-not-available", () => emit({ state: "not-available" }));

  autoUpdater.on("download-progress", (progress) =>
    emit({
      state: "progress",
      percent: progress.percent,
      transferred: progress.transferred,
      total: progress.total,
      bytesPerSecond: progress.bytesPerSecond,
    }),
  );

  autoUpdater.on("update-downloaded", (info) =>
    emit({ state: "downloaded", version: info.version }),
  );

  autoUpdater.on("error", (error) =>
    emit({ state: "error", message: (error && error.message) || String(error) }),
  );

  initialized = true;
  return true;
}

async function checkForUpdates() {
  if (!initialized) return { skipped: true };
  return autoUpdater.checkForUpdates();
}

async function downloadUpdate() {
  if (!initialized) return { skipped: true };
  return autoUpdater.downloadUpdate();
}

function installUpdate() {
  if (!initialized) return;
  autoUpdater.quitAndInstall(false, true);
}

module.exports = { setupUpdater, checkForUpdates, downloadUpdate, installUpdate };
