const fs = require('fs');
let code = fs.readFileSync('src/components/ChatInput.tsx', 'utf8');
code = code.replace(/const results = Array\.isArray\(turn\)\n\s*\? turn\n\s*: turn\.results \|\| Array\.isArray\(turn\.data\)\n\s*\? turn\.data\n\s*: \[\];/g, 
  "const results = Array.isArray(turn) ? turn : (turn.results || (Array.isArray(turn.data) ? turn.data : []));");
fs.writeFileSync('src/components/ChatInput.tsx', code);
