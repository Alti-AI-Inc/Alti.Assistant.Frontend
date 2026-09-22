const fs = require('fs');
const file = 'src/app/(protected)/c/[id]/_components/DynamicWidgetRenderer.tsx';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes('import SecWidget')) {
  code = code.replace("import CensusWidget from './CensusWidget';", "import CensusWidget from './CensusWidget';\\nimport SecWidget from './SecWidget';");
  
  code = code.replace("const isCensus = domain === 'census_bps';", "const isCensus = domain === 'census_bps';\\n  const isSec = domain === 'sec_edgar';");
  
  code = code.replace("{isCensus && <CensusWidget censusData={metadata} />}", "{isCensus && <CensusWidget censusData={metadata} />}\\n      {isSec && <SecWidget secData={metadata} />}");
  
  fs.writeFileSync(file, code);
  console.log("Added SEC to DynamicWidgetRenderer");
}
