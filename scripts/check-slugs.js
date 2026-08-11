const db = require('better-sqlite3')('../../listings.db', { readonly: true });
const cats = db.prepare('SELECT slug FROM categories ORDER BY slug').all();
const cities = db.prepare('SELECT slug FROM cities ORDER BY slug').all();
console.log('Categories:', cats.map(c => c.slug));
console.log('Cities:', cities.map(c => c.slug));
