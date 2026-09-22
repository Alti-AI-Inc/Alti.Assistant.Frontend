const fs = require('fs');
const file = 'src/app/(protected)/c/[id]/_components/FinancialWidget.tsx';
let code = fs.readFileSync(file, 'utf8');

// Fix string templates
code = code.replace(/\\`/g, "`");
code = code.replace(/\\\$/g, "$");

fs.writeFileSync(file, code);
