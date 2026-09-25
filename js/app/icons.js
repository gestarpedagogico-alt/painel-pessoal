/* ============ ICONS ============ */
export const ICONS = {
  home:'<path d="M3 10.5 10 4l7 6.5"/><path d="M5 9v7h10V9"/>',
  week:'<rect x="3" y="4" width="14" height="13" rx="2"/><path d="M3 8h14M7 2v4M13 2v4"/>',
  month:'<rect x="3" y="4" width="14" height="13" rx="2"/><path d="M3 8h14"/><circle cx="7" cy="12" r="1"/><circle cx="10" cy="12" r="1"/><circle cx="13" cy="12" r="1"/>',
  bim:'<path d="M4 10a6 6 0 1 1 6 6"/><path d="M10 16l-3 3M10 16l1 4"/><circle cx="4" cy="10" r="1.4"/>',
  tri:'<path d="M10 3l7 14H3z"/><path d="M10 8v4"/><circle cx="10" cy="14.3" r=".6" fill="currentColor"/>',
  pdi:'<path d="M4 4h9l3 3v9H4z"/><path d="M13 4v3h3"/><path d="M7 10h6M7 13h6"/>',
  map:'<path d="M3 6l5-2 4 2 5-2v10l-5 2-4-2-5 2z"/><path d="M8 4v10M12 6v10"/>',
  check:'<path d="M4 10.5l4 4 8-9"/>',
  lock:'<rect x="5" y="9" width="10" height="7" rx="1.5"/><path d="M7 9V6a3 3 0 0 1 6 0v3"/>',
  reset:'<path d="M4 4v5h5"/><path d="M4.5 12a6 6 0 1 0 1.6-6.1L4 8.5"/>',
  bell:'<path d="M6 8a4 4 0 0 1 8 0c0 4 1.5 5 1.5 5h-11S6 12 6 8Z"/><path d="M8.5 15.5a1.7 1.7 0 0 0 3 0"/>',
  flag:'<path d="M5 3v14"/><path d="M5 4h9l-2 3 2 3H5"/>',
  target:'<circle cx="10" cy="10" r="6.5"/><circle cx="10" cy="10" r="3.3"/><circle cx="10" cy="10" r=".6" fill="currentColor"/>',
  chart:'<path d="M3 3v14h14"/><path d="M6.5 14v-4M10.5 14V7M14.5 14v-6"/>',
  ranking:'<rect x="2.5" y="11" width="4" height="6"/><rect x="8" y="6" width="4" height="11"/><rect x="13.5" y="9" width="4" height="8"/>',
};
export function icon(name){ return '<svg class="icon" viewBox="0 0 20 20">'+ICONS[name]+'</svg>'; }
