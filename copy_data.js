const fs = require('fs');
const content = fs.readFileSync('../typescript-projects/src/data/listings.ts', 'utf8');
const arrayStr = content.replace(/import.*?;/g, '').replace('export const LISTINGS_DATA =', 'module.exports =');
fs.writeFileSync('./mockData.js', arrayStr);
