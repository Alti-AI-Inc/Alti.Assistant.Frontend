const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const backendSrc = path.join(__dirname, 'Aphura Backend', 'src');

function getFiles(dir, files = []) {
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules') getFiles(fullPath, files);
    } else {
      if (fullPath.endsWith('.js') || fullPath.endsWith('.ts')) {
        files.push(fullPath);
      }
    }
  }
  return files;
}

const allFiles = getFiles(backendSrc);

for (const file of allFiles) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  if (content.includes('groq.client.js')) {
    content = content.replace(/groq\.client\.js/g, 'llm.client.js');
    changed = true;
  }
  
  if (content.includes('groqChat')) {
    content = content.replace(/groqChat/g, 'llmChat');
    changed = true;
  }
  if (content.includes('groqStream')) {
    content = content.replace(/groqStream/g, 'llmStream');
    changed = true;
  }
  if (content.includes('groqToolCall')) {
    content = content.replace(/groqToolCall/g, 'llmToolCall');
    changed = true;
  }
  if (content.includes('groqLightChat')) {
    content = content.replace(/groqLightChat/g, 'llmLightChat');
    changed = true;
  }
  if (content.includes('groqLightStream')) {
    content = content.replace(/groqLightStream/g, 'llmLightStream');
    changed = true;
  }
  if (content.includes('groqLightToolCall')) {
    content = content.replace(/groqLightToolCall/g, 'llmLightToolCall');
    changed = true;
  }
  if (content.includes('groqClient')) {
    content = content.replace(/groqClient/g, 'llmClient');
    changed = true;
  }
  if (content.includes('getGroqClient')) {
    content = content.replace(/getGroqClient/g, 'getLlmClient');
    changed = true;
  }
  if (content.includes('config.groq')) {
    content = content.replace(/config\.groq/g, 'config.llm');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content);
    console.log('Updated:', file);
  }
}

// Rename the client file
const oldClient = path.join(backendSrc, 'app', 'services', 'groq.client.js');
const newClient = path.join(backendSrc, 'app', 'services', 'llm.client.js');
if (fs.existsSync(oldClient)) {
  fs.renameSync(oldClient, newClient);
}
console.log('Renamed client file.');
