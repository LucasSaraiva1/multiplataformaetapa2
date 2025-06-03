const fs = require('fs');
const path = require('path');

function readJSON(filename) {
  const data = fs.readFileSync(path.join(__dirname, '../DB', filename));
  return JSON.parse(data);
}

function writeJSON(filename, data) {
  fs.writeFileSync(path.join(__dirname, '../DB', filename), JSON.stringify(data, null, 2));
}

module.exports = { readJSON, writeJSON };
