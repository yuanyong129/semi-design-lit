export async function loadMdFile(moduleName: string, fileName: string) {
  const res = await import(`../docs/${moduleName}/__demo__/${fileName}.md?raw`);
  return (res.default);
}