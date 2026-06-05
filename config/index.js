// 框架级配置
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

export const config = {
  port: Number(process.env.PORT) || 3000,
  host: process.env.HOST || '0.0.0.0',
  views: path.join(ROOT, 'src/views'),
  publicDir: path.join(ROOT, 'src/public'),
  theme: {
    name: 'rhodes',
    primary: '#ffb547',
    secondary: '#4dd0ff',
  },
};
