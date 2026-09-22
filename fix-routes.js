const fs = require('fs');
const path = 'Aphura Backend/src/app/routes/index.js';
let code = fs.readFileSync(path, 'utf8');

code = code.replace("const secRoutes = require('../modules/sec/sec.route');\\n\\nconst moduleRoutes = [\\n  { path: '/sec', route: secRoutes },", 
`const secRoutes = require('../modules/sec/sec.route');

const moduleRoutes = [
  { path: '/sec', route: secRoutes },`);

fs.writeFileSync(path, code);
