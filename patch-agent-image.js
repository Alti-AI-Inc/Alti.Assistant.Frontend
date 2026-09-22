const fs = require('fs');
const path = 'Aphura Backend/src/app/modules/orchestrator/agent.service.js';
let code = fs.readFileSync(path, 'utf8');

const importStr = "import { llmToolCall, llmStream } from '../../services/llm.client.js';";
if (!code.includes("llmGenerateImage")) {
  code = code.replace(importStr, "import { llmToolCall, llmStream, llmGenerateImage } from '../../services/llm.client.js';");
}

const newToolDef = `          {
            name: 'generate_image',
            description: 'Generate an AI image based on a prompt using Together AI FLUX.',
            inputSchema: {
              type: 'object',
              properties: { prompt: { type: 'string', description: 'Detailed image description' } },
              required: ['prompt']
            }
          },
          {
            name: 'search_sec_filings',`;

if (!code.includes("name: 'generate_image'")) {
  code = code.replace("{_\\n            name: 'search_sec_filings',".replace('_',''), newToolDef);
}

const newToolCase = `        case 'generate_image':
          console.log('Generating image with Together AI for prompt:', args.prompt);
          const imageUrl = await llmGenerateImage(args.prompt);
          
          customMetadata = {
            domain: 'image_generation',
            prompt: args.prompt,
            imageUrl: imageUrl
          };

          return {
            output: "Generated an image based on the prompt: " + args.prompt,
            references: [{ type: 'image', url: imageUrl }]
          };

        case 'search_sec_filings':`;

if (!code.includes("case 'generate_image':")) {
  code = code.replace("case 'search_sec_filings':", newToolCase);
}

fs.writeFileSync(path, code);
console.log("Patched agent.service.js with Image Generation");
