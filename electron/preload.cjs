const { contextBridge, ipcRenderer } = require("electron");

function readAppConfig() {
  const argPrefix = "--fanalamanga-config=";
  const raw = process.argv.find((arg) => arg.startsWith(argPrefix));
  if (!raw) return {};
  try {
    return JSON.parse(raw.slice(argPrefix.length));
  } catch {
    return {};
  }
}

contextBridge.exposeInMainWorld("appConfig", readAppConfig());

contextBridge.exposeInMainWorld("electronAPI", {
  retryBackend: () => ipcRenderer.send("splash-retry"),
  onSplashStatus: (callback) => {
    const listener = (_event, status) => callback(status);
    ipcRenderer.on("splash-status", listener);
    return () => ipcRenderer.removeListener("splash-status", listener);
  },
  getAppVersion: () => ipcRenderer.invoke("app:version"),
  checkForUpdates: () => ipcRenderer.invoke("updater:check"),
  downloadUpdate: () => ipcRenderer.invoke("updater:download"),
  installUpdate: () => ipcRenderer.invoke("updater:install"),
  onUpdateEvent: (callback) => {
    const listener = (_event, payload) => callback(payload);
    ipcRenderer.on("updater:event", listener);
    return () => ipcRenderer.removeListener("updater:event", listener);
  },
});
