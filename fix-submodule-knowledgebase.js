const fs = require('fs');
const file = 'Aphura Backend/frontend-workspace/src/actions/knowledgeBaseAction.ts';
if (fs.existsSync(file)) {
  let code = fs.readFileSync(file, 'utf8');
  const target = `export async function getFileBlob(file: KnowledgeBaseFile | KnowledgeBankFile) {
  try {
    const response = await apiClient(file.gcsUrl, { skipTenantHeader: true });
    const blob = await response.blob();

    return blob;
  } catch (error) {
    return undefined;
  }
}`;

  const replacement = `export async function getFileBlob(file: KnowledgeBaseFile | KnowledgeBankFile): Promise<Blob | undefined> {
  try {
    if (!file?.gcsUrl) return undefined;
    const response = await apiClient(file.gcsUrl, { skipTenantHeader: true });
    const blob = await response.blob();
    return blob;
  } catch (error) {
    return undefined;
  }
  return undefined;
}`;

  code = code.replace(target, replacement);
  fs.writeFileSync(file, code);
  console.log("Fixed submodule knowledgebase");
}
