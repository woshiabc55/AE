import { BrowserWindow, screen } from "electron";
import fs from "fs";
import path from "path";
import { globalLogger } from "../core/logger";

interface WindowConfig {
  id: string;
  title: string;
  width: number;
  height: number;
  minWidth?: number;
  minHeight?: number;
  parent?: string;
  modal?: boolean;
  webPreferences: Electron.WebPreferences;
}

interface WindowState {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isMaximized: boolean;
  isFullScreen: boolean;
}

class WindowManager {
  private windows: Map<string, BrowserWindow>;
  private states: Map<string, WindowState>;
  private stateFilePath: string;

  constructor() {
    this.windows = new Map();
    this.states = new Map();
    this.stateFilePath = path.join(
      process.env.USERDATA_PATH ?? path.join(process.cwd(), "data"),
      "window-states.json"
    );
    this.loadStates();
  }

  createWindow(config: WindowConfig): BrowserWindow {
    const existing = this.windows.get(config.id);
    if (existing && !existing.isDestroyed()) {
      return existing;
    }

    const savedState = this.states.get(config.id);
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;

    const x = savedState?.x ?? Math.floor((screenWidth - config.width) / 2);
    const y = savedState?.y ?? Math.floor((screenHeight - config.height) / 2);
    const width = savedState?.width ?? config.width;
    const height = savedState?.height ?? config.height;

    const parentWindow = config.parent ? this.windows.get(config.parent) : undefined;

    const windowOptions: Electron.BrowserWindowConstructorOptions = {
      id: config.id as unknown as number,
      title: config.title,
      width,
      height,
      x,
      y,
      minWidth: config.minWidth,
      minHeight: config.minHeight,
      parent: parentWindow && !parentWindow.isDestroyed() ? parentWindow : undefined,
      modal: config.modal ?? false,
      show: false,
      webPreferences: config.webPreferences,
    };

    const win = new BrowserWindow(windowOptions);

    this.windows.set(config.id, win);

    win.once("ready-to-show", () => {
      if (savedState?.isMaximized) {
        win.maximize();
      }
      if (savedState?.isFullScreen) {
        win.setFullScreen(true);
      }
      win.show();
    });

    win.on("close", () => {
      this.saveWindowState(config.id, win);
    });

    win.on("closed", () => {
      this.windows.delete(config.id);
    });

    win.on("maximize", () => {
      this.updateState(config.id, { isMaximized: true });
    });

    win.on("unmaximize", () => {
      this.updateState(config.id, { isMaximized: false });
    });

    win.on("enter-full-screen", () => {
      this.updateState(config.id, { isFullScreen: true });
    });

    win.on("leave-full-screen", () => {
      this.updateState(config.id, { isFullScreen: false });
    });

    globalLogger.info(`Window created: ${config.id}`);
    return win;
  }

  getWindow(id: string): BrowserWindow | null {
    const win = this.windows.get(id);
    if (!win || win.isDestroyed()) {
      return null;
    }
    return win;
  }

  destroyWindow(id: string): boolean {
    const win = this.windows.get(id);
    if (!win || win.isDestroyed()) {
      this.windows.delete(id);
      return false;
    }

    this.saveWindowState(id, win);
    win.destroy();
    this.windows.delete(id);
    globalLogger.info(`Window destroyed: ${id}`);
    return true;
  }

  focusWindow(id: string): boolean {
    const win = this.getWindow(id);
    if (!win) return false;

    if (win.isMinimized()) {
      win.restore();
    }
    win.focus();
    return true;
  }

  hideWindow(id: string): boolean {
    const win = this.getWindow(id);
    if (!win) return false;
    win.hide();
    return true;
  }

  showWindow(id: string): boolean {
    const win = this.getWindow(id);
    if (!win) return false;
    win.show();
    return true;
  }

  getWindowIds(): string[] {
    return Array.from(this.windows.keys());
  }

  getWindowCount(): number {
    return this.windows.size;
  }

  destroyAllWindows(): void {
    for (const [id, win] of this.windows.entries()) {
      if (!win.isDestroyed()) {
        this.saveWindowState(id, win);
        win.destroy();
      }
    }
    this.windows.clear();
    this.persistStates();
  }

  sendToWindow(id: string, channel: string, ...args: unknown[]): boolean {
    const win = this.getWindow(id);
    if (!win) return false;
    win.webContents.send(channel, ...args);
    return true;
  }

  broadcast(channel: string, ...args: unknown[]): void {
    for (const win of this.windows.values()) {
      if (!win.isDestroyed()) {
        win.webContents.send(channel, ...args);
      }
    }
  }

  private saveWindowState(id: string, win: BrowserWindow): void {
    if (win.isDestroyed()) return;

    const bounds = win.getBounds();
    const state: WindowState = {
      id,
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
      isMaximized: win.isMaximized(),
      isFullScreen: win.isFullScreen(),
    };

    this.states.set(id, state);
    this.persistStates();
  }

  private updateState(id: string, partial: Partial<WindowState>): void {
    const current = this.states.get(id);
    if (current) {
      this.states.set(id, { ...current, ...partial });
    }
  }

  private loadStates(): void {
    try {
      if (fs.existsSync(this.stateFilePath)) {
        const content = fs.readFileSync(this.stateFilePath, "utf-8");
        const data = JSON.parse(content) as WindowState[];
        for (const state of data) {
          this.states.set(state.id, state);
        }
      }
    } catch (err) {
      globalLogger.warn("Failed to load window states", { error: String(err) });
    }
  }

  private persistStates(): void {
    try {
      const dir = path.dirname(this.stateFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const data = Array.from(this.states.values());
      fs.writeFileSync(this.stateFilePath, JSON.stringify(data, null, 2), "utf-8");
    } catch (err) {
      globalLogger.warn("Failed to persist window states", { error: String(err) });
    }
  }
}

export { WindowManager };
export type { WindowConfig, WindowState };
