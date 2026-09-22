const fs = require('fs');
const file = 'tsconfig.json';
let code = fs.readFileSync(file, 'utf8');

code = code.replace('"exclude": ["node_modules"]', '"exclude": ["node_modules", "Aphura Backend"]');

fs.writeFileSync(file, code);
