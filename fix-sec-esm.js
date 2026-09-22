const fs = require('fs');

const servicePath = 'Aphura Backend/src/app/modules/sec/sec.service.js';
let service = fs.readFileSync(servicePath, 'utf8');
service = service.replace("const axios = require('axios');", "import axios from 'axios';");
service = service.replace("module.exports = { searchSECFillings };", "export { searchSECFillings };");
fs.writeFileSync(servicePath, service);

const controllerPath = 'Aphura Backend/src/app/modules/sec/sec.controller.js';
let controller = fs.readFileSync(controllerPath, 'utf8');
controller = controller.replace("const { searchSECFillings } = require('./sec.service');", "import { searchSECFillings } from './sec.service.js';");
controller = controller.replace("module.exports = { searchFilings };", "export default { searchFilings };");
fs.writeFileSync(controllerPath, controller);

const routePath = 'Aphura Backend/src/app/modules/sec/sec.route.js';
let route = fs.readFileSync(routePath, 'utf8');
route = route.replace("const express = require('express');", "import express from 'express';");
route = route.replace("const { searchFilings } = require('./sec.controller');", "import secController from './sec.controller.js';");
route = route.replace("const router = express.Router();", "import auth from '../../middlewares/auth/auth.js';\\n\\nconst router = express.Router();\\n\\nrouter.use(auth());");
route = route.replace("router.get('/search', searchFilings);", "router.get('/search', secController.searchFilings);");
route = route.replace("module.exports = router;", "export const secRoutes = router;");
fs.writeFileSync(routePath, route);

const indexPath = 'Aphura Backend/src/app/routes/index.js';
let index = fs.readFileSync(indexPath, 'utf8');
index = index.replace("const secRoutes = require('../modules/sec/sec.route');", "import { secRoutes } from '../modules/sec/sec.route.js';");
fs.writeFileSync(indexPath, index);

const agentPath = 'Aphura Backend/src/app/modules/orchestrator/agent.service.js';
let agent = fs.readFileSync(agentPath, 'utf8');
agent = agent.replace("const { searchSECFillings } = require('../sec/sec.service');", "import { searchSECFillings } from '../sec/sec.service.js';");
fs.writeFileSync(agentPath, agent);

console.log("Fixed ES modules");
