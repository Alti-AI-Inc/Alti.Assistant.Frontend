const fs = require('fs');
const path = 'Aphura Backend/src/app/services/llm.client.js';

const newCode = `
import Together from 'together-ai';
import config from '../../../config/index.js';

// Official Together AI SDK integration
const llmClient = new Together({
  apiKey: config.llm?.apiKey || process.env.TOGETHER_API_KEY || 'dummy_key',
});

/**
 * 1. Chat completion using Together AI
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
 * 2. Streaming chat completion using Together AI
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
 * 3. Tool calling (function calling) using Together AI
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
 * 4. Embeddings using Together AI
 */
export async function llmEmbed(text, options = {}) {
  try {
    const response = await llmClient.embeddings.create({
      model: options.model || 'togethercomputer/m2-bert-80M-8k-retrieval',
      input: text,
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error('Together Embeddings Error:', error.message);
    throw error;
  }
}

/**
 * 5. Image Generation using Together AI (e.g. FLUX)
 */
export async function llmGenerateImage(prompt, options = {}) {
  try {
    const response = await llmClient.images.generate({
      model: options.model || 'black-forest-labs/FLUX.1-schnell-Free',
      prompt,
      steps: 4,
      n: 1,
      height: 1024,
      width: 1024,
    });
    return response.data[0].url; // Returns base64 or URL
  } catch (error) {
    console.error('Together Image Generation Error:', error.message);
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
`

fs.writeFileSync(path, newCode);
console.log('Updated llm.client.js with all Together APIs (Chat, Tools, Embeddings, Image).');
