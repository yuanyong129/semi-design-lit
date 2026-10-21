import { unsafeCSS } from "lit";

export const handleClsList = (clsList: string[]) => {
  return clsList.filter(item => Boolean(item)).join(' ').trim();
}

export const clsMap = (clsInfo: Record<string, boolean>) => {
  const list = [];
  for(const clsName in clsInfo) {
    if(clsInfo[clsName]) list.push(clsName);
  }
  return list.join(' ').trim();
}

export function styleToUnsafeCss<T = Record<string, string>>(tokenStyle: T) {
  const result = {} as Record<keyof typeof tokenStyle, ReturnType<typeof unsafeCSS>>;
  for(const key in tokenStyle) {
    result[key] = unsafeCSS(tokenStyle[key]); 
  }
  return result;
}