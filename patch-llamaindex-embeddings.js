const fs = require('fs');
const path = 'Aphura Backend/src/app/services/llamaindex.service.js';
let code = fs.readFileSync(path, 'utf8');

// Replace CloudflareEmbedding with TogetherEmbedding
const oldEmbeddingClass = `    // 2. Configure Custom Cloudflare AI Embedding Model
    class CloudflareEmbedding extends BaseEmbedding {
      constructor() {
        super();
        this.accountId = config.cloudflare?.accountId || process.env.CLOUDFLARE_ACCOUNT_ID;
        this.apiToken = config.cloudflare?.apiToken || process.env.CLOUDFLARE_API_TOKEN;
        this.model = '@cf/baai/bge-base-en-v1.5';
      }

      async getTextEmbedding(text) {
        if (!this.accountId || !this.apiToken) {
           return new Array(768).fill(0.01); // Mock fallback if keys missing
        }
        const res = await fetch(
          \`https://api.cloudflare.com/client/v4/accounts/\${this.accountId}/ai/run/\${this.model}\`,
          {
            method: 'POST',
            headers: {
              Authorization: \`Bearer \${this.apiToken}\`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: [text] }),
          }
        );
        const data = await res.json();
        return data.result.data[0]; // Returns 768-dim float array
      }

      async getQueryEmbedding(query) {
        return this.getTextEmbedding(query);
      }
    }`;

const newEmbeddingClass = `    // 2. Configure Custom Together AI Embedding Model
    class TogetherEmbedding extends BaseEmbedding {
      constructor() {
        super();
        this.apiKey = config.llm?.apiKey || process.env.TOGETHER_API_KEY;
        this.model = 'togethercomputer/m2-bert-80M-8k-retrieval';
      }

      async getTextEmbedding(text) {
        if (!this.apiKey) {
           return new Array(768).fill(0.01); // Mock fallback if keys missing
        }
        const res = await fetch(
          \`https://api.together.xyz/v1/embeddings\`,
          {
            method: 'POST',
            headers: {
              Authorization: \`Bearer \${this.apiKey}\`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              model: this.model,
              input: text 
            }),
          }
        );
        const data = await res.json();
        return data.data[0].embedding; 
      }

      async getQueryEmbedding(query) {
        return this.getTextEmbedding(query);
      }
    }`;

code = code.replace(oldEmbeddingClass, newEmbeddingClass);
code = code.replace('new CloudflareEmbedding()', 'new TogetherEmbedding()');

fs.writeFileSync(path, code);
console.log('Patched LlamaIndex to use Together Embeddings');
