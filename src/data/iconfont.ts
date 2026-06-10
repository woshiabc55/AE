// Iconfont 风格 - 24x24, filled
import type { IconCategory } from '../api/types';

export const ICONFONT_ICONS: Array<{
  name: string;
  displayName: string;
  category: IconCategory;
  tags: string[];
  d: string;
}> = [
  { name: 'home', displayName: 'Home', category: 'general', tags: ['home'], d: 'M12 3 2 12h3v9h6v-6h2v6h6v-9h3L12 3Z' },
  { name: 'user', displayName: 'User', category: 'general', tags: ['user'], d: 'M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-5 0-9 2.5-9 6v2h18v-2c0-3.5-4-6-9-6Z' },
  { name: 'setting', displayName: 'Setting', category: 'system', tags: ['setting'], d: 'M19.4 13a7 7 0 0 0 0-2l2-1.6-2-3.4-2.4 1a7 7 0 0 0-1.7-1L15 3h-6l-.3 3a7 7 0 0 0-1.7 1l-2.4-1-2 3.4 2 1.6a7 7 0 0 0 0 2l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 1.7 1L9 21h6l.3-3a7 7 0 0 0 1.7-1l2.4 1 2-3.4-2-1.6Zm-7.4 2.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z' },
  { name: 'search', displayName: 'Search', category: 'general', tags: ['find'], d: 'M15.5 14h-.8l-.3-.3a6.5 6.5 0 1 0-.7.7l.3.3v.8L19 20.5 20.5 19 15.5 14Zm-6 0a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9Z' },
  { name: 'heart', displayName: 'Heart', category: 'general', tags: ['love'], d: 'M12 21.4 10.6 20C5.4 15.4 2 12.3 2 8.5 2 5.5 4.4 3 7.5 3c1.7 0 3.4.8 4.5 2.1C13.1 3.8 14.8 3 16.5 3 19.6 3 22 5.5 22 8.5c0 3.8-3.4 6.9-8.6 11.5L12 21.4Z' },
  { name: 'star', displayName: 'Star', category: 'general', tags: ['rate'], d: 'm12 2 3.1 6.3 6.9 1L17 14.1l1.2 6.8L12 17.8 5.8 20.9 7 14.1 2 9.3l6.9-1L12 2Z' },
  { name: 'bell', displayName: 'Bell', category: 'communication', tags: ['bell'], d: 'M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2Zm6.5-6V11a6.5 6.5 0 0 0-5-6.3V4a1.5 1.5 0 1 0-3 0v.7A6.5 6.5 0 0 0 5.5 11v5L4 18.5V20h16v-1.5L18.5 16Z' },
  { name: 'mail', displayName: 'Mail', category: 'communication', tags: ['mail'], d: 'M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z' },
  { name: 'calendar', displayName: 'Calendar', category: 'system', tags: ['date'], d: 'M19 4h-2V2h-2v2H9V2H7v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 16H5V10h14v10Z' },
  { name: 'camera', displayName: 'Camera', category: 'media', tags: ['camera'], d: 'M9 2 7 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3l-2-2H9Zm3 15a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z' },
  { name: 'image', displayName: 'Image', category: 'media', tags: ['image'], d: 'M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2Zm-12.5-5.5 2.5 3 3.5-4.5 4.5 6H5l3.5-4.5Z' },
  { name: 'play', displayName: 'Play', category: 'media', tags: ['play'], d: 'M8 5v14l11-7L8 5Z' },
  { name: 'pause', displayName: 'Pause', category: 'media', tags: ['pause'], d: 'M6 5h4v14H6V5Zm8 0h4v14h-4V5Z' },
  { name: 'arrow-right', displayName: 'Arrow Right', category: 'arrow', tags: ['arrow'], d: 'M12 4 10.6 5.4 16.2 11H4v2h12.2l-5.6 5.6L12 20l8-8-8-8Z' },
  { name: 'arrow-left', displayName: 'Arrow Left', category: 'arrow', tags: ['arrow'], d: 'M20 11H7.8l5.6-5.6L12 4l-8 8 8 8 1.4-1.4L7.8 13H20v-2Z' },
  { name: 'arrow-up', displayName: 'Arrow Up', category: 'arrow', tags: ['arrow'], d: 'M4 12l1.4 1.4L11 7.8V20h2V7.8l5.6 5.6L20 12l-8-8-8 8Z' },
  { name: 'arrow-down', displayName: 'Arrow Down', category: 'arrow', tags: ['arrow'], d: 'M20 12l-1.4-1.4L13 16.2V4h-2v12.2L5.4 10.6L4 12l8 8 8-8Z' },
  { name: 'plus', displayName: 'Plus', category: 'system', tags: ['add'], d: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2Z' },
  { name: 'minus', displayName: 'Minus', category: 'system', tags: ['minus'], d: 'M19 13H5v-2h14v2Z' },
  { name: 'close', displayName: 'Close', category: 'system', tags: ['close'], d: 'M19 6.4 17.6 5 12 10.6 6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4 17.6 19 19 17.6 13.4 12 19 6.4Z' },
  { name: 'check', displayName: 'Check', category: 'system', tags: ['check'], d: 'M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2Z' },
  { name: 'edit', displayName: 'Edit', category: 'editor', tags: ['pencil'], d: 'M3 17.2V21h3.8L17.8 10l-3.8-3.8L3 17.2Z' },
  { name: 'delete', displayName: 'Trash', category: 'system', tags: ['bin'], d: 'M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12ZM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4Z' },
  { name: 'download', displayName: 'Download', category: 'system', tags: ['download'], d: 'M19 9h-4V3H9v6H5l7 7 7-7Zm-14 9v2h14v-2H5Z' },
  { name: 'upload', displayName: 'Upload', category: 'system', tags: ['upload'], d: 'M9 16h6v-6h4l-7-7-7 7h4v6Zm-4 2h14v2H5v-2Z' },
  { name: 'share', displayName: 'Share', category: 'communication', tags: ['share'], d: 'M18 16a3 3 0 0 0-2.3 1.1L8.9 13a3 3 0 0 0 0-2L15.7 6.9a3 3 0 1 0-1-2.3L8 9.7a3 3 0 1 0 0 4.6l6.7 5.1A3 3 0 1 0 18 16Z' },
  { name: 'copy', displayName: 'Copy', category: 'editor', tags: ['copy'], d: 'M16 1H4a2 2 0 0 0-2 2v14h2V3h12V1Zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z' },
  { name: 'folder', displayName: 'Folder', category: 'file', tags: ['folder'], d: 'M10 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8l-2-2Z' },
  { name: 'file', displayName: 'File', category: 'file', tags: ['file'], d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z' },
  { name: 'cart', displayName: 'Cart', category: 'commerce', tags: ['cart'], d: 'M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM7.2 14.6 8 12h7.5a2 2 0 0 0 1.9-1.4l3-7.5L19 1H5L3.6 6.7' },
  { name: 'card', displayName: 'Card', category: 'commerce', tags: ['card'], d: 'M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 14H4v-6h16v6Zm0-10H4V6h16v2Z' },
  { name: 'phone', displayName: 'Phone', category: 'communication', tags: ['phone'], d: 'M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11 11 0 0 0 3.6.6 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A18 18 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11 11 0 0 0 .6 3.6 1 1 0 0 1-.25 1l-2.25 2.2Z' },
  { name: 'video', displayName: 'Video', category: 'media', tags: ['video'], d: 'M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4Z' },
  { name: 'mic', displayName: 'Mic', category: 'media', tags: ['mic'], d: 'M12 14a3 3 0 0 0 3-3V5a3 3 0 1 0-6 0v6a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.9V21h2v-3.1a7 7 0 0 0 6-6.9h-2Z' },
  { name: 'sun', displayName: 'Sun', category: 'weather', tags: ['sun'], d: 'M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0-5a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1Zm0 18a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1ZM3 12a1 1 0 0 1-1 1H0a1 1 0 1 1 0-2h2a1 1 0 0 1 1 1Zm21-1h-2a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2Z' },
  { name: 'moon', displayName: 'Moon', category: 'weather', tags: ['moon'], d: 'M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.4 5.4 0 0 1-4.5 2.6 5.5 5.5 0 0 1-5.5-5.5c0-1.6.9-3 2.2-4A9 9 0 0 0 12 3Z' },
  { name: 'cloud', displayName: 'Cloud', category: 'weather', tags: ['cloud'], d: 'M19 18H6a4 4 0 0 1-.6-7.9 6 6 0 0 1 11.7 1.5A4 4 0 0 1 19 18Z' },
  { name: 'globe', displayName: 'Globe', category: 'general', tags: ['globe'], d: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1 17.9A8 8 0 0 1 6.3 9.7l4.7 2.1v8.1Zm5-2.4-3.5 1.5-.5-7.5 5.5-1A8 8 0 0 1 16 17.5Zm-3-12.5 4.7 1.6A8 8 0 0 1 19 9.7l-5.5 1L13 5Z' },
  { name: 'eye', displayName: 'Eye', category: 'general', tags: ['eye'], d: 'M12 4.5C7 4.5 2.7 7.6 1 12c1.7 4.4 6 7.5 11 7.5s9.3-3.1 11-7.5c-1.7-4.4-6-7.5-11-7.5Zm0 12.5a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z' },
  { name: 'lock', displayName: 'Lock', category: 'system', tags: ['lock'], d: 'M18 8h-1V6a5 5 0 0 0-10 0v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2Z' },
  { name: 'pin', displayName: 'Pin', category: 'general', tags: ['pin'], d: 'M12 2a8 8 0 0 0-8 8c0 5.4 7 12 7 12s7-6.6 7-12a8 8 0 0 0-8-8Zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z' },
  { name: 'wifi', displayName: 'Wifi', category: 'system', tags: ['wifi'], d: 'M1 9l2 2a14 14 0 0 1 18 0l2-2a17 17 0 0 0-22 0Zm4 4 2 2a8 8 0 0 1 10 0l2-2a11 11 0 0 0-14 0Zm4 4 3 3 3-3a4 4 0 0 0-6 0Z' },
  { name: 'battery', displayName: 'Battery', category: 'system', tags: ['battery'], d: 'M15 4V2H9v2H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2Z' },
  { name: 'menu', displayName: 'Menu', category: 'system', tags: ['menu'], d: 'M3 6h18v2H3V6Zm0 5h18v2H3v-2Zm0 5h18v2H3v-2Z' },
  { name: 'filter', displayName: 'Filter', category: 'system', tags: ['filter'], d: 'M4.2 3h15.6a1 1 0 0 1 .8 1.6L14 13.4V20a1 1 0 0 1-1.5.9l-4-2.4a1 1 0 0 1-.5-.9v-4.2L3.4 4.6A1 1 0 0 1 4.2 3Z' },
  { name: 'refresh', displayName: 'Refresh', category: 'system', tags: ['refresh'], d: 'M17.7 7.7a8 8 0 1 0 .7 7.5l-1.9-.7a6 6 0 1 1-.5-5.5L13 12h7V5l-2.3 2.7Z' },
  { name: 'bookmark', displayName: 'Bookmark', category: 'general', tags: ['bookmark'], d: 'M17 3H7a2 2 0 0 0-2 2v16l7-3 7 3V5a2 2 0 0 0-2-2Z' },
  { name: 'tag', displayName: 'Tag', category: 'commerce', tags: ['tag'], d: 'M21.4 11.6 12.4 2.6A2 2 0 0 0 11 2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 .6 1.4l9 9a2 2 0 0 0 2.8 0l7-7a2 2 0 0 0 0-2.8Z' },
];
