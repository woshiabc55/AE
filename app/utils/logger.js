// 简单的彩色控制台 logger
const COLOR = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  amber: '\x1b[38;5;214m',
};

function ts() {
  return new Date().toISOString().slice(11, 23);
}

export const logger = {
  info: (msg, ...rest) => console.log(`${COLOR.dim}${ts()}${COLOR.reset} ${COLOR.cyan}INFO${COLOR.reset}  ${msg}`, ...rest),
  ok: (msg, ...rest) => console.log(`${COLOR.dim}${ts()}${COLOR.reset} ${COLOR.green} OK ${COLOR.reset}  ${msg}`, ...rest),
  warn: (msg, ...rest) => console.log(`${COLOR.dim}${ts()}${COLOR.reset} ${COLOR.yellow}WARN${COLOR.reset}  ${msg}`, ...rest),
  err: (msg, ...rest) => console.log(`${COLOR.dim}${ts()}${COLOR.reset} ${COLOR.red}ERR ${COLOR.reset}  ${msg}`, ...rest),
  tag: (tag, msg, ...rest) => console.log(`${COLOR.dim}${ts()}${COLOR.reset} ${COLOR.amber}${tag.padEnd(5)}${COLOR.reset} ${msg}`, ...rest),
};
