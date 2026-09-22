const fs = require('fs');
const path = require('path');

const backendSrc = path.join(__dirname, 'Aphura Backend', 'src');

// 1. Rename groq module folder
const oldGroqDir = path.join(backendSrc, 'app', 'modules', 'groq');
const newLlmDir = path.join(backendSrc, 'app', 'modules', 'llm');
if (fs.existsSync(oldGroqDir)) {
  fs.renameSync(oldGroqDir, newLlmDir);
  console.log('Renamed groq module to llm.');
  
  // Rename files inside
  const files = fs.readdirSync(newLlmDir);
  for (const f of files) {
    if (f.includes('groq')) {
      const newName = f.replace('groq', 'llm');
      fs.renameSync(path.join(newLlmDir, f), path.join(newLlmDir, newName));
    }
  }
}

// 2. Fix index.js routing
const indexPath = path.join(backendSrc, 'app', 'routes', 'index.js');
let index = fs.readFileSync(indexPath, 'utf8');
index = index.replace(/groq/g, 'llm');
index = index.replace(/Groq/g, 'Llm');
fs.writeFileSync(indexPath, index);

// 3. Fix config.js
const configPath = path.join(__dirname, 'Aphura Backend', 'config', 'index.js');
let config = fs.readFileSync(configPath, 'utf8');
config = config.replace(/groq:/g, 'llm:');
config = config.replace(/GROQ_API_KEY/g, 'LLM_API_KEY');
fs.writeFileSync(configPath, config);

// 4. Update the actual llm.client.js to use OpenAI sdk
const llmClientPath = path.join(backendSrc, 'app', 'services', 'llm.client.js');
const llmClientCode = `
import OpenAI from 'openai';
import config from '../../../config/index.js';

// Generic LLM Client using standard OpenAI interface.
// This allows drop-in replacement with any OpenAI-compatible endpoint 
// (e.g. vLLM, Together, Ollama, DeepSeek) by just changing baseURL in .env

const llmClient = new OpenAI({
  apiKey: config.llm?.apiKey || process.env.LLM_API_KEY || 'dummy_key',
  baseURL: process.env.LLM_BASE_URL, // e.g. "http://localhost:8000/v1" or other custom provider
});

/**
 * Chat completion using Generic LLM
 */
export async function llmChat(messages, options = {}) {
  try {
    const response = await llmClient.chat.completions.create({
      model: options.model || config.llm?.model || 'gpt-4o',
      messages,
      temperature: options.temperature ?? config.llm?.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? undefined,
    });
    return response;
  } catch (error) {
    console.error('LLM Chat Error:', error.message);
    throw error;
  }
}

/**
 * Streaming chat completion using Generic LLM
 */
export async function llmStream(messages, options = {}) {
  try {
    const stream = await llmClient.chat.completions.create({
      model: options.model || config.llm?.model || 'gpt-4o',
      messages,
      temperature: options.temperature ?? config.llm?.temperature ?? 0.7,
      stream: true,
    });
    return stream;
  } catch (error) {
    console.error('LLM Stream Error:', error.message);
    throw error;
  }
}

/**
 * Convenience method for simple string prompts
 */
export async function llmComplete(prompt, options = {}) {
  const response = await llmChat([{ role: 'user', content: prompt }], options);
  return response.choices[0].message.content;
}

/**
 * Tool calling (function calling) using Generic LLM
 */
export async function llmToolCall(messages, tools, options = {}) {
  try {
    const req = {
      model: options.model || config.llm?.model || 'gpt-4o',
      messages,
      temperature: options.temperature ?? config.llm?.temperature ?? 0.7,
    };
    if (tools && tools.length > 0) {
      req.tools = tools.map(t => ({ type: 'function', function: t }));
      req.tool_choice = 'auto';
    }
    const response = await llmClient.chat.completions.create(req);
    return response;
  } catch (error) {
    console.error('LLM ToolCall Error:', error.message);
    throw error;
  }
}

/**
 * Fast / Light model wrappers
 */
export async function llmLightChat(messages, options = {}) {
  return llmChat(messages, { ...options, model: options.model || config.llm?.lightModel || 'gpt-4o-mini' });
}

export async function llmLightStream(messages, options = {}) {
  return llmStream(messages, { ...options, model: options.model || config.llm?.lightModel || 'gpt-4o-mini' });
}

export async function llmLightToolCall(messages, tools, options = {}) {
  return llmToolCall(messages, tools, { ...options, model: options.model || config.llm?.lightModel || 'gpt-4o-mini' });
}

export function getLlmClient() {
  return llmClient;
}

export { llmClient };
export default llmClient;
`;

fs.writeFileSync(llmClientPath, llmClientCode);
console.log('Rewrote llm.client.js using OpenAI SDK.');

