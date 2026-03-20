declare module '*.less?inline' {
  const content: string;
  export default content;
}

declare module '*.less' {
  const content: { [className: string]: string };
  export default content;
}
