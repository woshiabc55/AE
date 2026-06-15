import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn, ChildProcess } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null = null;
let backendProcess: ChildProcess | null = null;
const BACKEND_PORT = 4317;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1280,
    minHeight: 720,
    backgroundColor: '#0B0F14',
    title: 'FlowForge',
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 16, y: 16 },
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  const devUrl = process.env.VITE_DEV_SERVER_URL;
  if (devUrl) {
    mainWindow.loadURL(devUrl);
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function startBackend() {
  if (backendProcess) return;
  // 优先使用编译后的产物,其次用 tsx 直跑
  const isDev = !app.isPackaged;
  const script = isDev
    ? path.join(__dirname, '..', 'backend', 'server.ts')
    : path.join(__dirname, '..', 'dist-backend', 'server.js');

  const command = isDev ? 'npx' : 'node';
  const args = isDev
    ? ['tsx', script]
    : [script];

  backendProcess = spawn(command, args, {
    env: { ...process.env, FLOWFORGE_PORT: String(BACKEND_PORT) },
    stdio: 'inherit',
  });

  backendProcess.on('exit', () => {
    backendProcess = null;
  });
}

app.whenReady().then(() => {
  startBackend();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (backendProcess) {
    backendProcess.kill();
    backendProcess = null;
  }
  if (process.platform !== 'darwin') app.quit();
});

// IPC
ipcMain.handle('app:get-info', () => ({
  version: app.getVersion(),
  name: app.getName(),
  backendPort: BACKEND_PORT,
}));

ipcMain.handle('app:reveal', async (_e, p: string) => {
  const { shell } = await import('electron');
  return shell.showItemInFolder(p);
});
