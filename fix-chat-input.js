const fs = require('fs');
const file = 'src/components/ChatInput.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace("if (chunk.reference || chunk.references) {", "if (chunk.reference || (chunk as any).references) {");
code = code.replace("metaPayload.reference = deduplicateReferences(chunk.reference || chunk.references || []);", "metaPayload.reference = deduplicateReferences(chunk.reference || (chunk as any).references || []);");

fs.writeFileSync(file, code);
