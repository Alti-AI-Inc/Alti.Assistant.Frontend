const fs = require('fs');
const path = require('path');

const langchainService = path.join(__dirname, 'Aphura Backend', 'src', 'app', 'modules', 'langchain', 'langchain.service.js');
let lcCode = fs.readFileSync(langchainService, 'utf8');
lcCode = lcCode.replace(/import \{ ChatGroq \} from '@langchain\/groq';/g, "import { ChatOpenAI } from '@langchain/openai';");
lcCode = lcCode.replace(/getGroqLLM/g, 'getOpenAILLM');
lcCode = lcCode.replace(/new ChatGroq/g, 'new ChatOpenAI');
lcCode = lcCode.replace(/GROQ_API_KEY/g, 'LLM_API_KEY');
fs.writeFileSync(langchainService, lcCode);

const llamaindexService = path.join(__dirname, 'Aphura Backend', 'src', 'app', 'services', 'llamaindex.service.js');
let liCode = fs.readFileSync(llamaindexService, 'utf8');
liCode = liCode.replace(/GroqLlamaModule/g, 'OpenAILlamaModule');
liCode = liCode.replace(/@llamaindex\/groq/g, '@llamaindex/openai');
liCode = liCode.replace(/const \{ Groq \}/g, 'const { OpenAI }');
liCode = liCode.replace(/new Groq\(\{/g, 'new OpenAI({');
liCode = liCode.replace(/GROQ_API_KEY/g, 'LLM_API_KEY');
liCode = liCode.replace(/Groq as the global LLM/g, 'OpenAI as the global LLM');
fs.writeFileSync(llamaindexService, liCode);

const temporalWorkflows = path.join(__dirname, 'Aphura Backend', 'src', 'app', 'modules', 'temporal', 'workflows.js');
let twCode = fs.readFileSync(temporalWorkflows, 'utf8');
twCode = twCode.replace(/Groq/g, 'LLM');
fs.writeFileSync(temporalWorkflows, twCode);

const activities = path.join(__dirname, 'Aphura Backend', 'src', 'app', 'modules', 'temporal', 'activities.js');
let acCode = fs.readFileSync(activities, 'utf8');
acCode = acCode.replace(/Groq/g, 'LLM');
fs.writeFileSync(activities, acCode);

const deepResearch = path.join(__dirname, 'Aphura Backend', 'src', 'app', 'modules', 'research', 'deepResearch.service.js');
let drCode = fs.readFileSync(deepResearch, 'utf8');
drCode = drCode.replace(/Groq/g, 'LLM');
fs.writeFileSync(deepResearch, drCode);

const monitor = path.join(__dirname, 'Aphura Backend', 'src', 'app', 'modules', 'monitor', 'proactiveMonitor.service.js');
let mCode = fs.readFileSync(monitor, 'utf8');
mCode = mCode.replace(/Groq/g, 'LLM');
fs.writeFileSync(monitor, mCode);

const openclaw = path.join(__dirname, 'Aphura Backend', 'src', 'app', 'modules', 'openclaw', 'openclaw.service.js');
let oCode = fs.readFileSync(openclaw, 'utf8');
oCode = oCode.replace(/Groq/g, 'LLM');
fs.writeFileSync(openclaw, oCode);

const uploadAudio = path.join(__dirname, 'Aphura Backend', 'src', 'app', 'middlewares', 'uploder', 'uploadAudio.js');
let uCode = fs.readFileSync(uploadAudio, 'utf8');
uCode = uCode.replace(/Groq/g, 'LLM');
fs.writeFileSync(uploadAudio, uCode);

const ragService = path.join(__dirname, 'Aphura Backend', 'src', 'app', 'modules', 'rag', 'rag.service.js');
let rCode = fs.readFileSync(ragService, 'utf8');
rCode = rCode.replace(/Groq/g, 'LLM');
fs.writeFileSync(ragService, rCode);

const telemetryService = path.join(__dirname, 'Aphura Backend', 'src', 'app', 'services', 'telemetry.service.js');
let tCode = fs.readFileSync(telemetryService, 'utf8');
tCode = tCode.replace(/groq/g, 'llm');
fs.writeFileSync(telemetryService, tCode);

console.log("Fixed all remaining groq references.");
