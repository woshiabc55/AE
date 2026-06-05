// 时间轴服务
import { seedEvents } from '../data/events.seed.js';
import { logger } from '../../app/utils/logger.js';

const events = [...seedEvents];
let counter = events.length;

export const timelineService = {
  list(limit = 24) {
    return events.slice(0, limit);
  },
  push({ level = 'INFO', message, code }) {
    counter += 1;
    const ev = {
      id: 'evt-' + Math.random().toString(36).slice(2, 8),
      code: code || 'EVT-' + String(counter).padStart(3, '0'),
      ts: Date.now(),
      level,
      message,
    };
    events.unshift(ev);
    if (events.length > 60) events.pop();
    logger.info(`时间轴: [${ev.code}] ${ev.message}`);
    return ev;
  },
};
