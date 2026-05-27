import { PixelForgeApp } from './app/App';

const container = document.getElementById('app');
if (!container) {
  throw new Error('Root #app element not found');
}

const app = new PixelForgeApp(container);
app.init();
