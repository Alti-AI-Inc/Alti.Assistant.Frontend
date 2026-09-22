const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'Aphura Backend', 'src', 'app', 'modules', 'llm');
if (fs.existsSync(dir)) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    if (f.endsWith('.js')) {
      const p = path.join(dir, f);
      let code = fs.readFileSync(p, 'utf8');
      code = code.replace(/groq/g, 'llm');
      code = code.replace(/Groq/g, 'Llm');
      code = code.replace(/GROQ/g, 'LLM');
      fs.writeFileSync(p, code);
      console.log('Fixed internals for', f);
    }
  }
}
