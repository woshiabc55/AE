import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('flowforge', {
  getInfo: () => ipcRenderer.invoke('app:get-info'),
  reveal: (p: string) => ipcRenderer.invoke('app:reveal', p),
  platform: process.platform,
});
