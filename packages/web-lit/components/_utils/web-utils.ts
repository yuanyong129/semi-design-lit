export const handleClsList = (clsList: string[]) => {
  return clsList.filter(item => Boolean(item)).join(' ').trim();
}