declare module '*.less?inline' {
  const content: string;
  export default content;
}

declare module '*.less' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.css?inline' {
  const content: string;
  export default content;
}

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.md?raw' {
  const content: string;
  export default content;
}
