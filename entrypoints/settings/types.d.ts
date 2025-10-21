/// <reference types="vite/client" />

// HTML module declarations for ?raw imports
declare module '*.html?raw' {
  const content: string;
  export default content;
}

declare module '*.html' {
  const content: string;
  export default content;
}

