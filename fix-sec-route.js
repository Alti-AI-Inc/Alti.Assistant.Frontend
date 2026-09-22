const fs = require('fs');
const path = 'Aphura Backend/src/app/modules/sec/sec.route.js';
let route = fs.readFileSync(path, 'utf8');

route = route.replace(/\\n/g, '\n');

fs.writeFileSync(path, route);
console.log("Fixed sec.route.js literal newlines");
