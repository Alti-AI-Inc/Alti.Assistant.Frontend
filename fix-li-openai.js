const fs = require('fs');
const path = 'Aphura Backend/src/app/services/llamaindex.service.js';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(/OpenAILlamaModule = await import\('@llamaindex\/openai'\);/g, "");
code = code.replace(/const \{ OpenAI \} = OpenAILlamaModule;/g, "const { OpenAI } = LlamaIndexModule;");
code = code.replace(/if \(LlamaIndexModule && OpenAILlamaModule\)/g, "if (LlamaIndexModule)");
code = code.replace(/return \{ LlamaIndexModule, OpenAILlamaModule, LlamaCloudModule \};/g, "return { LlamaIndexModule, LlamaCloudModule };");

fs.writeFileSync(path, code);
console.log("Fixed llamaindex.service.js");
