import {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  MenuItemConstructorOptions,
} from "electron";
import path from "path";
import { WindowManager } from "./window-manager";
import { IPCHandlers } from "./ipc-handlers";
import { BackendService } from "../backend/index";
import { ConfigManager } from "../core/config-manager";
import { globalLogger, LogLevel } from "../core/logger";
import { globalEventBus } from "../core/event-bus";
import { PluginSystem } from "../core/plugin-system";
import { ModuleLoader } from "../core/module-loader";

class Application {
  private windowManager: WindowManager;
  private ipcHandlers: IPCHandlers;
  private backendService: BackendService;
  private configManager: ConfigManager;
  private pluginSystem: PluginSystem;
  private moduleLoader: ModuleLoader;
  private isQuitting: boolean;

  constructor() {
    this.windowManager = new WindowManager();
    this.ipcHandlers = new IPCHandlers();
    this.backendService = new BackendService();
    this.configManager = new ConfigManager({
      configDir: path.join(app.getPath("userData"), "config"),
      watchForChanges: true,
    });
    this.pluginSystem = new PluginSystem();
    this.moduleLoader = new ModuleLoader();
    this.isQuitting = false;
  }

  async initialize(): Promise<void> {
    app.on("window-all-closed", this.onWindowAllClosed.bind(this));
    app.on("before-quit", this.onBeforeQuit.bind(this));
    app.on("activate", this.onActivate.bind(this));

    await app.whenReady();

    await this.configManager.initialize();
    const logLevel = this.configManager.get<LogLevel>("app.logLevel", LogLevel.INFO);
    globalLogger.setLevel(logLevel);

    await this.backendService.initialize(this.configManager, this.pluginSystem);

    this.ipcHandlers.register(
      this.backendService,
      this.configManager,
      this.pluginSystem,
      this.moduleLoader
    );

    this.buildApplicationMenu();

    await this.createMainWindow();

    globalEventBus.emit("app:ready");
    globalLogger.info("Application initialized successfully");
  }

  private async createMainWindow(): Promise<void> {
    const mainWindow = this.windowManager.createWindow({
      id: "main",
      title: "Electron AI Framework",
      width: 1280,
      height: 800,
      minWidth: 960,
      minHeight: 600,
      webPreferences: {
        preload: path.join(__dirname, "../preload/index.js"),
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true,
      },
    });

    const isDev = process.env.NODE_ENV === "development";
    if (isDev) {
      await mainWindow.loadURL("http://localhost:3000");
      mainWindow.webContents.openDevTools();
    } else {
      await mainWindow.loadFile(
        path.join(__dirname, "../renderer/index.html")
      );
    }

    mainWindow.on("closed", () => {
      if (!this.isQuitting) {
        this.windowManager.destroyWindow("main");
      }
    });
  }

  private buildApplicationMenu(): void {
    const template: MenuItemConstructorOptions[] = [
      {
        label: "File",
        submenu: [
          { label: "New Window", accelerator: "CmdOrCtrl+N", click: () => this.onActivate() },
          { type: "separator" },
          { label: "Settings", accelerator: "CmdOrCtrl+,", click: () => this.openSettings() },
          { type: "separator" },
          { role: "quit" },
        ],
      },
      {
        label: "Edit",
        submenu: [
          { role: "undo" },
          { role: "redo" },
          { type: "separator" },
          { role: "cut" },
          { role: "copy" },
          { role: "paste" },
          { role: "selectAll" },
        ],
      },
      {
        label: "View",
        submenu: [
          { role: "reload" },
          { role: "forceReload" },
          { role: "toggleDevTools" },
          { type: "separator" },
          { role: "resetZoom" },
          { role: "zoomIn" },
          { role: "zoomOut" },
          { type: "separator" },
          { role: "togglefullscreen" },
        ],
      },
      {
        label: "Help",
        submenu: [
          {
            label: "About",
            click: () => {
              globalEventBus.emit("app:about");
            },
          },
        ],
      },
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }

  private openSettings(): void {
    const settingsWindow = this.windowManager.getWindow("settings");
    if (settingsWindow) {
      this.windowManager.focusWindow("settings");
      return;
    }

    const win = this.windowManager.createWindow({
      id: "settings",
      title: "Settings",
      width: 600,
      height: 500,
      minWidth: 400,
      minHeight: 400,
      parent: "main",
      modal: true,
      webPreferences: {
        preload: path.join(__dirname, "../preload/index.js"),
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true,
      },
    });

    win.loadFile(path.join(__dirname, "../renderer/index.html"));
  }

  private onWindowAllClosed(): void {
    if (process.platform !== "darwin") {
      app.quit();
    }
  }

  private async onBeforeQuit(): Promise<void> {
    this.isQuitting = true;
    globalEventBus.emit("app:quitting");

    await this.backendService.shutdown();
    await this.moduleLoader.unloadAll();
    await globalLogger.close();

    this.windowManager.destroyAllWindows();
  }

  private onActivate(): void {
    if (this.windowManager.getWindow("main") === null) {
      this.createMainWindow();
    } else {
      this.windowManager.focusWindow("main");
    }
  }
}

const application = new Application();
application.initialize().catch((err: Error) => {
  globalLogger.error("Failed to initialize application", { error: err.message });
  app.quit();
});
