const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  restartApp: () => ipcRenderer.invoke('app:restart'),
  platform: process.platform,

  // Auto-updater
  getVersion: () => ipcRenderer.invoke('update:get-version'),
  checkForUpdates: () => ipcRenderer.invoke('update:check'),
  downloadUpdate: () => ipcRenderer.invoke('update:download'),
  installUpdate: () => ipcRenderer.invoke('update:install'),
  onUpdateChecking: (cb) => ipcRenderer.on('update:checking', cb),
  onUpdateAvailable: (cb) => ipcRenderer.on('update:available', cb),
  onUpdateNotAvailable: (cb) => ipcRenderer.on('update:not-available', cb),
  onUpdateProgress: (cb) => ipcRenderer.on('update:progress', cb),
  onUpdateDownloaded: (cb) => ipcRenderer.on('update:downloaded', cb),
  onUpdateError: (cb) => ipcRenderer.on('update:error', cb),
  removeUpdateListeners: () => {
    ipcRenderer.removeAllListeners('update:checking');
    ipcRenderer.removeAllListeners('update:available');
    ipcRenderer.removeAllListeners('update:not-available');
    ipcRenderer.removeAllListeners('update:progress');
    ipcRenderer.removeAllListeners('update:downloaded');
    ipcRenderer.removeAllListeners('update:error');
  },
});
