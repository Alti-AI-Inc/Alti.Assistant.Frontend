const fs = require('fs');
const path = 'Aphura Backend/src/app/modules/orchestrator/agent.service.js';
let code = fs.readFileSync(path, 'utf8');

const importStr = "const { searchCensusData } = require('../census/census.service');";
if (!code.includes("searchSECFillings")) {
  code = code.replace(importStr, importStr + "\\nconst { searchSECFillings } = require('../sec/sec.service');");
}

const toolDef = `          {
            name: 'get_census_data',`;
const newToolDef = `          {
            name: 'search_sec_filings',
            description: 'Get SEC EDGAR filings for a US public company by stock ticker symbol.',
            inputSchema: {
              type: 'object',
              properties: { ticker: { type: 'string', description: 'Stock ticker (e.g., AAPL)' } },
              required: ['ticker']
            }
          },
          {
            name: 'get_census_data',`;
if (!code.includes("search_sec_filings")) {
  code = code.replace(toolDef, newToolDef);
}

const toolCase = `        case 'get_census_data':`;
const newToolCase = `        case 'search_sec_filings':
          console.log('Fetching SEC data for:', args.ticker);
          const secData = await searchSECFillings(args.ticker);
          
          let secSummary = "SEC Filings found for " + secData.title + ".";
          if (secData.recentFilings) {
            secSummary += "\\nRecent forms: " + secData.recentFilings.form.slice(0, 5).join(', ');
          }

          customMetadata = {
            domain: 'sec_edgar',
            ticker: args.ticker,
            companyName: secData.title,
            cik: secData.cik,
            filings: secData.recentFilings ? secData.recentFilings.form.map((form, i) => ({
              form,
              accessionNumber: secData.recentFilings.accessionNumber[i],
              filingDate: secData.recentFilings.filingDate[i],
              primaryDocument: secData.recentFilings.primaryDocument[i]
            })).slice(0, 10) : []
          };

          return {
            output: secSummary,
            references: [{ type: 'sec', url: \`https://www.sec.gov/edgar/browse/?CIK=\${secData.cik}\` }]
          };

        case 'get_census_data':`;
if (!code.includes("case 'search_sec_filings':")) {
  code = code.replace(toolCase, newToolCase);
}

fs.writeFileSync(path, code);
console.log("Patched agent.service.js with SEC EDGAR");
