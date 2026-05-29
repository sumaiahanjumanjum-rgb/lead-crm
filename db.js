const low    = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path   = require('path');

const adapter = new FileSync(path.join(__dirname, '..', 'leads.json'));
const db      = low(adapter);

// Set defaults
db.defaults({ leads: [], nextId: 1 }).write();

console.log('✅ Database ready — leads.json');

module.exports = db;
