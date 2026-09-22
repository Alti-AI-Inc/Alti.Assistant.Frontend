const fs = require('fs');
const file = 'src/app/(protected)/c/[id]/_components/DynamicWidgetRenderer.tsx';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes('import ImageWidget')) {
  code = code.replace("import SecWidget from './SecWidget';", "import SecWidget from './SecWidget';\\nimport ImageWidget from './ImageWidget';");
  
  code = code.replace("const isSec = domain === 'sec_edgar';", "const isSec = domain === 'sec_edgar';\\n  const isImage = domain === 'image_generation';");
  
  code = code.replace("{isSec && <SecWidget secData={metadata} />}", "{isSec && <SecWidget secData={metadata} />}\\n      {isImage && <ImageWidget imageData={metadata} />}");
  
  fs.writeFileSync(file, code);
  console.log("Added ImageWidget to DynamicWidgetRenderer");
}
