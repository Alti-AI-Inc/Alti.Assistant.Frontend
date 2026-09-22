const fs = require('fs');
const path = require('path');

const backendSrc = path.join(__dirname, 'Aphura Backend', 'src');

// 1. Rewrite llm.client.js to use Together
const llmClientPath = path.join(backendSrc, 'app', 'services', 'llm.client.js');
const llmClientCode = `
import Together from 'together-ai';
import config from '../../../config/index.js';

// Official Together AI SDK integration
const llmClient = new Together({
  apiKey: config.llm?.apiKey || process.env.TOGETHER_API_KEY || 'dummy_key',
});

/**
 * Chat completion using Together AI
 */
export async function llmChat(messages, options = {}) {
  try {
    const response = await llmClient.chat.completions.create({
      model: options.model || config.llm?.model || 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
      messages,
      temperature: options.temperature ?? config.llm?.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? undefined,
    });
    return response;
  } catch (error) {
    console.error('Together Chat Error:', error.message);
    throw error;
  }
}

/**
 * Streaming chat completion using Together AI
 */
export async function llmStream(messages, options = {}) {
  try {
    const stream = await llmClient.chat.completions.create({
      model: options.model || config.llm?.model || 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
      messages,
      temperature: options.temperature ?? config.llm?.temperature ?? 0.7,
      stream: true,
    });
    return stream;
  } catch (error) {
    console.error('Together Stream Error:', error.message);
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
 * Tool calling (function calling) using Together AI
 */
export async function llmToolCall(messages, tools, options = {}) {
  try {
    const req = {
      model: options.model || config.llm?.model || 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
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
    console.error('Together ToolCall Error:', error.message);
    throw error;
  }
}

/**
 * Fast / Light model wrappers
 */
export async function llmLightChat(messages, options = {}) {
  return llmChat(messages, { ...options, model: options.model || config.llm?.lightModel || 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo' });
}

export async function llmLightStream(messages, options = {}) {
  return llmStream(messages, { ...options, model: options.model || config.llm?.lightModel || 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo' });
}

export async function llmLightToolCall(messages, tools, options = {}) {
  return llmToolCall(messages, tools, { ...options, model: options.model || config.llm?.lightModel || 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo' });
}

export function getLlmClient() {
  return llmClient;
}

export { llmClient };
export default llmClient;
`;

fs.writeFileSync(llmClientPath, llmClientCode);
console.log('Rewrote llm.client.js using Together AI SDK.');

// 2. Rewrite modelRouter.service.js to use Together Models
const modelRouterPath = path.join(backendSrc, 'app', 'services', 'modelRouter.service.js');
let mrCode = fs.readFileSync(modelRouterPath, 'utf8');
mrCode = mrCode.replace(/'gpt-oss-20b'/g, "'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo'");
mrCode = mrCode.replace(/'gpt-oss-120b'/g, "'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo'");
fs.writeFileSync(modelRouterPath, mrCode);
console.log('Updated modelRouter.service.js for Together AI.');

// 3. Fix langchain.service.js
const langchainPath = path.join(backendSrc, 'app', 'modules', 'langchain', 'langchain.service.js');
let lcCode = fs.readFileSync(langchainPath, 'utf8');
lcCode = lcCode.replace(/import \{ ChatOpenAI \} from '@langchain\/openai';/g, "import { ChatTogetherAI } from '@langchain/together-ai';");
lcCode = lcCode.replace(/getOpenAILLM/g, 'getTogetherLLM');
lcCode = lcCode.replace(/new ChatOpenAI/g, 'new ChatTogetherAI');
fs.writeFileSync(langchainPath, lcCode);
console.log('Updated langchain.service.js for Together AI.');

