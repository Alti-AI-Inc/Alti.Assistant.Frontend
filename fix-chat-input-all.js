const fs = require('fs');
const file = 'src/components/ChatInput.tsx';
let code = fs.readFileSync(file, 'utf8');

const targetStr = `            } else if (chunk.type === 'metadata') {
              const metaPayload: any = {};
              if (chunk.reference || (chunk as any).references) {
                metaPayload.reference = deduplicateReferences(chunk.reference || (chunk as any).references || []);
              }
              if (chunk.citations) {
                metaPayload.citations = deduplicateReferences(chunk.citations || []);
              }
              if (chunk.status) {
                metaPayload.status = chunk.status;
              }`;

const replacementStr = `            } else if (chunk.type === 'metadata') {
              const metaPayload: any = {};
              const metadataChunk = chunk as any;
              if (metadataChunk.reference || metadataChunk.references) {
                metaPayload.reference = deduplicateReferences(metadataChunk.reference || metadataChunk.references || []);
              }
              if (metadataChunk.citations) {
                metaPayload.citations = deduplicateReferences(metadataChunk.citations || []);
              }
              if (metadataChunk.status) {
                metaPayload.status = metadataChunk.status;
              }`;

code = code.replace(targetStr, replacementStr);
fs.writeFileSync(file, code);
