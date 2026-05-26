import { CANVAS_WIDTH, CANVAS_HEIGHT } from './utils/constants';
import { GameEngine } from './engine/GameEngine';
import './style.css';

const canvas = document.getElementById('game') as HTMLCanvasElement;
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

canvas.getContext('2d')!.imageSmoothingEnabled = false;

function resize() {
  const windowW = window.innerWidth;
  const windowH = window.innerHeight;
  const scale = Math.min(windowW / CANVAS_WIDTH, windowH / CANVAS_HEIGHT);
  canvas.style.width = `${CANVAS_WIDTH * scale}px`;
  canvas.style.height = `${CANVAS_HEIGHT * scale}px`;
}

window.addEventListener('resize', resize);
resize();

const engine = new GameEngine(canvas);
engine.start();
