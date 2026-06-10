// IconPark 风格 - 24x24, 2px stroke, square ends
import type { IconCategory } from '../api/types';

export const ICONPARK_ICONS: Array<{
  name: string;
  displayName: string;
  category: IconCategory;
  tags: string[];
  d: string;
}> = [
  { name: 'home', displayName: 'Home', category: 'general', tags: ['home'], d: 'M22 9L12 2L2 9V20a2 2 0 0 0 2 2h6V14h4v8h6a2 2 0 0 0 2-2V9Z M12 6.5L4 12' },
  { name: 'people', displayName: 'User', category: 'general', tags: ['user'], d: 'M16 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM8 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM16 13c-2.7 0-8 1.3-8 4v3h16v-3c0-2.7-5.3-4-8-4Z' },
  { name: 'setting', displayName: 'Setting', category: 'system', tags: ['setting'], d: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z M21 13.5v-3l-2.3-.3a7 7 0 0 0-.7-1.7l1.4-1.9-2.1-2.1-1.9 1.4a7 7 0 0 0-1.7-.7L13.4 3h-3l-.3 2.3a7 7 0 0 0-1.7.7l-1.9-1.4-2.1 2.1 1.4 1.9a7 7 0 0 0-.7 1.7L3 10.5v3l2.3.3a7 7 0 0 0 .7 1.7l-1.4 1.9 2.1 2.1 1.9-1.4a7 7 0 0 0 1.7.7l.3 2.3h3l.3-2.3a7 7 0 0 0 1.7-.7l1.9 1.4 2.1-2.1-1.4-1.9a7 7 0 0 0 .7-1.7l2.3-.3Z' },
  { name: 'search', displayName: 'Search', category: 'general', tags: ['find'], d: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm10 2-4.3-4.3' },
  { name: 'like', displayName: 'Heart', category: 'general', tags: ['love'], d: 'M22 8.5c0-3-2.5-5.5-5.5-5.5-2 0-3.8 1-4.5 2.5C11.3 4 9.5 3 7.5 3 4.5 3 2 5.5 2 8.5c0 3.5 2 6.5 5 9.5l5 4 5-4c3-3 5-6 5-9.5Z' },
  { name: 'star', displayName: 'Star', category: 'general', tags: ['rate'], d: 'M12 2L14.6 8.4 21.6 9.2 16.3 13.6 17.9 20.4 12 16.8 6.1 20.4 7.7 13.6 2.4 9.2 9.4 8.4 12 2Z' },
  { name: 'notice', displayName: 'Bell', category: 'communication', tags: ['notify'], d: 'M12 2C8.7 2 6 4.7 6 8v6l-2 3v1h16v-1l-2-3V8c0-3.3-2.7-6-6-6ZM10 20c0 1.1.9 2 2 2s2-.9 2-2' },
  { name: 'mail', displayName: 'Mail', category: 'communication', tags: ['email'], d: 'M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7ZM3 7l9 6 9-6' },
  { name: 'calendar', displayName: 'Calendar', category: 'system', tags: ['date'], d: 'M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6Z M3 10h18 M8 2v4M16 2v4' },
  { name: 'camera', displayName: 'Camera', category: 'media', tags: ['photo'], d: 'M14.5 4h-5L7 6H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3l-2.5-2Z M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z' },
  { name: 'picture', displayName: 'Image', category: 'media', tags: ['picture'], d: 'M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5Z M3 16l5-5 5 5 M14 14l1-1 6 6' },
  { name: 'play', displayName: 'Play', category: 'media', tags: ['start'], d: 'M6 4v16l14-8L6 4Z' },
  { name: 'pause', displayName: 'Pause', category: 'media', tags: ['stop'], d: 'M6 4h4v16H6V4Zm8 0h4v16h-4V4Z' },
  { name: 'arrow-right', displayName: 'Arrow Right', category: 'arrow', tags: ['next'], d: 'M5 12h14M13 5l7 7-7 7' },
  { name: 'arrow-left', displayName: 'Arrow Left', category: 'arrow', tags: ['back'], d: 'M19 12H5M11 5l-7 7 7 7' },
  { name: 'arrow-up', displayName: 'Arrow Up', category: 'arrow', tags: ['up'], d: 'M12 19V5M5 12l7-7 7 7' },
  { name: 'arrow-down', displayName: 'Arrow Down', category: 'arrow', tags: ['down'], d: 'M12 5v14M5 12l7 7 7-7' },
  { name: 'plus', displayName: 'Plus', category: 'system', tags: ['add'], d: 'M12 5v14M5 12h14' },
  { name: 'minus', displayName: 'Minus', category: 'system', tags: ['sub'], d: 'M5 12h14' },
  { name: 'close', displayName: 'Close', category: 'system', tags: ['close'], d: 'M18 6 6 18M6 6l12 12' },
  { name: 'check', displayName: 'Check', category: 'system', tags: ['done'], d: 'M5 12l5 5L20 7' },
  { name: 'edit', displayName: 'Edit', category: 'editor', tags: ['pencil'], d: 'M12 20h9M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5Z' },
  { name: 'delete', displayName: 'Trash', category: 'system', tags: ['bin'], d: 'M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14Z' },
  { name: 'download', displayName: 'Download', category: 'system', tags: ['save'], d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3' },
  { name: 'upload', displayName: 'Upload', category: 'system', tags: ['send'], d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12' },
  { name: 'share', displayName: 'Share', category: 'communication', tags: ['forward'], d: 'M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm12 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM8.6 13.5l6.8 4M15.4 6.5l-6.8 4' },
  { name: 'copy', displayName: 'Copy', category: 'editor', tags: ['dup'], d: 'M9 9h11a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V11a2 2 0 0 1 2-2Z M5 15H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2' },
  { name: 'folder', displayName: 'Folder', category: 'file', tags: ['dir'], d: 'M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2v11Z' },
  { name: 'file', displayName: 'File', category: 'file', tags: ['doc'], d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Zm0 0v6h6' },
  { name: 'shopping-cart', displayName: 'Cart', category: 'commerce', tags: ['shop'], d: 'M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6 M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm9 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z' },
  { name: 'pay', displayName: 'Card', category: 'commerce', tags: ['pay'], d: 'M1 4a2 2 0 0 1 2-2h18a2 2 0 0 1 2 2v2H1V4Zm0 4h22v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8Z' },
  { name: 'phone', displayName: 'Phone', category: 'communication', tags: ['call'], d: 'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7 12.8 12.8 0 0 0 .7 2.8 2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4 12.8 12.8 0 0 0 2.8.7 2 2 0 0 1 1.7 2Z' },
  { name: 'video', displayName: 'Video', category: 'media', tags: ['movie'], d: 'm23 7-7 5 7 5V7ZM1 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H1V5Z' },
  { name: 'microphone', displayName: 'Mic', category: 'media', tags: ['record'], d: 'M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3ZM19 10v2a7 7 0 0 1-14 0v-2 M12 19v4M8 23h8' },
  { name: 'sun', displayName: 'Sun', category: 'weather', tags: ['light'], d: 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4' },
  { name: 'moon', displayName: 'Moon', category: 'weather', tags: ['night'], d: 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z' },
  { name: 'cloud', displayName: 'Cloud', category: 'weather', tags: ['sky'], d: 'M18 10h-1.3A8 8 0 1 0 4 16.9 M18 10a4 4 0 0 1 0 8H6a4 4 0 0 1 0-8' },
  { name: 'globe', displayName: 'Globe', category: 'general', tags: ['world'], d: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM2 12h20 M12 2a15 15 0 0 1 0 20 M12 2a15 15 0 0 0 0 20' },
  { name: 'eye', displayName: 'Eye', category: 'general', tags: ['view'], d: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12Zm11 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z' },
  { name: 'lock', displayName: 'Lock', category: 'system', tags: ['lock'], d: 'M5 11h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2ZM7 11V7a5 5 0 1 1 10 0v4' },
  { name: 'map', displayName: 'Pin', category: 'general', tags: ['map'], d: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0Z' },
  { name: 'wifi', displayName: 'Wifi', category: 'system', tags: ['wifi'], d: 'M5 12.5a10 10 0 0 1 14 0M1.5 9a14 14 0 0 1 21 0M8.5 16a5 5 0 0 1 7 0M12 20h.01' },
  { name: 'battery', displayName: 'Battery', category: 'system', tags: ['battery'], d: 'M2 7h18a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Zm22 3v4' },
  { name: 'menu', displayName: 'Menu', category: 'system', tags: ['menu'], d: 'M3 6h18M3 12h18M3 18h18' },
  { name: 'filter', displayName: 'Filter', category: 'system', tags: ['filter'], d: 'M22 3H2l8 9.5V19l4 2v-8.5L22 3Z' },
  { name: 'refresh', displayName: 'Refresh', category: 'system', tags: ['refresh'], d: 'M3 12a9 9 0 0 1 15-6.7L21 8 M21 3v5h-5 M21 12a9 9 0 0 1-15 6.7L3 16 M3 21v-5h5' },
  { name: 'bookmark', displayName: 'Bookmark', category: 'general', tags: ['bookmark'], d: 'M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16Z' },
  { name: 'tag', displayName: 'Tag', category: 'commerce', tags: ['tag'], d: 'M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8Z M7 7h.01' },
];
