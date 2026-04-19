const fs = require('fs');

// We'll just create dummy transparent pixel PNGs for the demo if ImageMagick isn't available
// The PWA will still work, it will just show a default or empty icon
const dummyPng = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==', 'base64');

fs.writeFileSync('pwa-192x192.png', dummyPng);
fs.writeFileSync('pwa-512x512.png', dummyPng);
fs.writeFileSync('apple-touch-icon.png', dummyPng);
