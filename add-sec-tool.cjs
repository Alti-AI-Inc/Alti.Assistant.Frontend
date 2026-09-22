const fs = require('fs');
const path = require('path');

const BACKEND_DIR = path.join(__dirname, 'Aphura Backend', 'src', 'app', 'modules', 'sec');
if (!fs.existsSync(BACKEND_DIR)) fs.mkdirSync(BACKEND_DIR, { recursive: true });

// 1. Service
fs.writeFileSync(path.join(BACKEND_DIR, 'sec.service.js'), `
const axios = require('axios');

const searchSECFillings = async (ticker) => {
  try {
    // SEC requires a custom User-Agent in the format: "Sample Company Name AdminContact@<sample company domain>.com"
    const headers = { 'User-Agent': 'AltiAI admin@alti.ai' };
    
    // Step 1: Get CIK from ticker
    const tickersRes = await axios.get('https://www.sec.gov/files/company_tickers.json', { headers });
    let cikStr = '';
    let title = '';
    for (const key in tickersRes.data) {
      if (tickersRes.data[key].ticker === ticker.toUpperCase()) {
        cikStr = String(tickersRes.data[key].cik_str).padStart(10, '0');
        title = tickersRes.data[key].title;
        break;
      }
    }
    
    if (!cikStr) return { error: 'Ticker not found' };

    // Step 2: Get Submissions
    const subRes = await axios.get(\`https://data.sec.gov/submissions/CIK\${cikStr}.json\`, { headers });
    
    return {
      ticker: ticker.toUpperCase(),
      title,
      cik: cikStr,
      recentFilings: subRes.data.filings.recent,
    };
  } catch (error) {
    console.error('SEC API Error:', error.message);
    throw new Error('Failed to fetch SEC data');
  }
};

module.exports = { searchSECFillings };
`);

// 2. Controller
fs.writeFileSync(path.join(BACKEND_DIR, 'sec.controller.js'), `
const { searchSECFillings } = require('./sec.service');

const searchFilings = async (req, res) => {
  try {
    const data = await searchSECFillings(req.query.ticker);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { searchFilings };
`);

// 3. Route
fs.writeFileSync(path.join(BACKEND_DIR, 'sec.route.js'), `
const express = require('express');
const { searchFilings } = require('./sec.controller');
const router = express.Router();

router.get('/search', searchFilings);

module.exports = router;
`);

// 4. Update Backend Routes
const routesFile = path.join(__dirname, 'Aphura Backend', 'src', 'app', 'routes', 'index.js');
let routesCode = fs.readFileSync(routesFile, 'utf8');
if (!routesCode.includes('/sec')) {
  routesCode = routesCode.replace(
    "const moduleRoutes = [",
    "const secRoutes = require('../modules/sec/sec.route');\\n\\nconst moduleRoutes = [\\n  { path: '/sec', route: secRoutes },"
  );
  fs.writeFileSync(routesFile, routesCode);
}

console.log("SEC Backend scaffolding complete.");
