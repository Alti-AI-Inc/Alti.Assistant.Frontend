const fs = require('fs');
const path = 'src/app/(protected)/c/[id]/_components/DynamicWidgetRenderer.tsx';
let dCode = fs.readFileSync(path, 'utf8');
dCode = dCode.replace(/\\n/g, '\n');
fs.writeFileSync(path, dCode);
console.log("Fixed DynamicWidgetRenderer.tsx");
