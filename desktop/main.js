const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const { autoUpdater } = require('electron-updater');

const isDev = !app.isPackaged;
const SERVER_PORT = process.env.SERVER_PORT || '5000';
const SERVER_URL = `http://localhost:${SERVER_PORT}`;

let mainWindow;
let backendProcess;

const logFile = path.join(app.getPath('userData'), 'studybuddy.log');
const log = (msg) => {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  try {
    fs.appendFileSync(logFile, line);
  } catch {}
  if (isDev) console.log(line.trim());
};

const sendToWindow = (channel, data) => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send(channel, data);
  }
};

const getBackendPath = () => {
  return isDev
    ? path.join(__dirname, '../backend/server.js')
    : path.join(process.resourcesPath, 'backend/server.js');
};

const getIconPath = () => {
  return isDev
    ? path.join(__dirname, '../frontend/public/icon.ico')
    : path.join(process.resourcesPath, 'frontend/dist/icon.ico');
};

const startBackend = () => {
  if (isDev) return;

  const serverPath = getBackendPath();
  const env = {
    ...process.env,
    NODE_ENV: 'production',
    PORT: SERVER_PORT,
    JWT_SECRET: process.env.JWT_SECRET || 'studybuddy_desktop_secret_change_me',
    JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
    USE_MEMORY_DB: process.env.USE_MEMORY_DB || 'true',
    MONGOMS_DOWNLOAD_DIR: process.env.MONGOMS_DOWNLOAD_DIR || path.join(app.getPath('userData'), 'mongodb-binaries'),
    MONGOMS_DB_PATH: process.env.MONGOMS_DB_PATH || path.join(app.getPath('userData'), 'mongodb-data'),
    CLIENT_URL: SERVER_URL,
  };

  // In a packaged app there is no separate Node binary, so run the backend
  // with Electron in Node mode.
  backendProcess = spawn(process.execPath, [serverPath], {
    env: { ...env, ELECTRON_RUN_AS_NODE: '1' },
    stdio: 'pipe',
  });

  backendProcess.stdout?.on('data', (data) => {
    log(`[backend] ${data.toString().trim()}`);
  });

  backendProcess.stderr?.on('data', (data) => {
    log(`[backend] ${data.toString().trim()}`);
  });

  backendProcess.on('error', (error) => {
    log(`Failed to start backend: ${error.message}`);
    dialog.showErrorBox(
      'Backend Error',
      'Could not start the StudyBuddy server. Please try again or check the logs.'
    );
  });
};

const waitForBackend = async (retries = 300) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(`${SERVER_URL}/api/health`);
      if (response.ok) return true;
    } catch {
      // server not ready yet
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  return false;
};

const createWindow = async () => {
  const splash = new BrowserWindow({
    width: 500,
    height: 300,
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    icon: getIconPath(),
    webPreferences: { nodeIntegration: false, contextIsolation: true },
  });
  splash.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(`
    <!DOCTYPE html>
    <html style="height:100%;margin:0;display:flex;align-items:center;justify-content:center;background:#1e1b4b;color:#fff;font-family:sans-serif;text-align:center;">
      <div>
        <h2 style="margin:0 0 12px;">StudyBuddy</h2>
        <p style="margin:0;opacity:.8;">Starting up...</p>
        <p style="margin:8px 0 0;font-size:12px;opacity:.6;">First run may download the database. This can take a few minutes.</p>
      </div>
    </html>
  `)}`);

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    title: 'StudyBuddy',
    icon: getIconPath(),
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      backgroundThrottling: false,
    },
  });

  if (isDev) {
    splash.close();
    await mainWindow.loadURL('http://localhost:5173');
  } else {
    const ready = await waitForBackend();
    if (!ready) {
      splash.close();
      dialog.showErrorBox(
        'Server Timeout',
        'StudyBuddy server did not start in time. Please check your internet connection (first run may download MongoDB binaries) and try again.'
      );
      app.quit();
      return;
    }
    await mainWindow.loadURL(SERVER_URL);
  }

  mainWindow.once('ready-to-show', () => {
    splash.close();
    mainWindow.show();
    if (isDev) mainWindow.webContents.openDevTools();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

// Auto-updater setup
const setupAutoUpdater = () => {
  if (isDev) return;

  autoUpdater.logger = { info: (m) => log(`[updater] ${m}`), warn: (m) => log(`[updater] ${m}`), error: (m) => log(`[updater] ${m}`), debug: (m) => log(`[updater] ${m}`) };
  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on('checking-for-update', () => {
    sendToWindow('update:checking');
  });

  autoUpdater.on('update-available', (info) => {
    log(`Update available: ${info.version}`);
    sendToWindow('update:available', { version: info.version, releaseNotes: info.releaseNotes });
  });

  autoUpdater.on('update-not-available', (info) => {
    log(`No update available (current: ${info.version})`);
    sendToWindow('update:not-available', { version: info.version });
  });

  autoUpdater.on('error', (err) => {
    log(`Updater error: ${err.message}`);
    sendToWindow('update:error', { message: err.message });
  });

  autoUpdater.on('download-progress', (progress) => {
    sendToWindow('update:progress', { percent: progress.percent, transferred: progress.transferred, total: progress.total });
  });

  autoUpdater.on('update-downloaded', (info) => {
    log(`Update downloaded: ${info.version}`);
    sendToWindow('update:downloaded', { version: info.version });
  });

  ipcMain.handle('update:check', () => autoUpdater.checkForUpdates());
  ipcMain.handle('update:download', () => autoUpdater.downloadUpdate());
  ipcMain.handle('update:install', () => {
    autoUpdater.quitAndInstall(false, true);
  });
  ipcMain.handle('update:get-version', () => app.getVersion());

  // Check silently on startup after the window is ready.
  setTimeout(() => {
    autoUpdater.checkForUpdates().catch((err) => log(`Startup update check failed: ${err.message}`));
  }, 30000);
};

app.whenReady().then(() => {
  log('StudyBuddy starting');
  setupAutoUpdater();
  startBackend();
  createWindow();
});

app.on('window-all-closed', () => {
  if (backendProcess) {
    backendProcess.kill();
    backendProcess = null;
  }
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

process.on('uncaughtException', (err) => log(`Uncaught exception: ${err.message}\n${err.stack}`));
process.on('unhandledRejection', (reason) => log(`Unhandled rejection: ${reason}`));

ipcMain.handle('app:restart', () => {
  app.relaunch();
  app.quit();
});
