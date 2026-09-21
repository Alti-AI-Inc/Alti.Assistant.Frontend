const fs = require('fs');
let code = fs.readFileSync('src/components/ChatInput.tsx', 'utf8');
code = code.replace(/const results = turn\.results \|\| \[\];/g, 
  "const results = Array.isArray(turn) ? turn : (turn.results || (Array.isArray(turn.data) ? turn.data : []));");
fs.writeFileSync('src/components/ChatInput.tsx', code);
