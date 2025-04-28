export async function loadMdFile(moduleName: string, fileName: string) {
  const res = await fetch(`src/arco-lit-docs/${moduleName}/__demo__/${fileName}.md`);
  return (await res.blob()).text();
}