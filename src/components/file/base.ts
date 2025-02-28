import { FileNode } from "../../types/types";


export const initialTree: FileNode[] = [

  {
    id: "0",
    name: "node_modules",
    type: "folder",
    children: [
      {
        id: "0-1",
        name: "react",
        type: "folder",
        children: [
          {
            id: "0-1-1",
            name: "index.js",
            type: "file",
            language: "javascript",
            content: `// Minimal stub for react.
module.exports = window.React;`,
          },
        ],
      },
      {
        id: "0-2",
        name: "react-dom",
        type: "folder",
        children: [
          {
            id: "0-2-1",
            name: "index.js",
            type: "file",
            language: "javascript",
            content: `// Minimal stub for react-dom.
module.exports = window.ReactDOM;`,
          },
        ],
      },
    ],
  },
  // The src folder with interlinked React files
  {
    id: "1",
    name: "src",
    type: "folder",
    children: [
      {
        id: "1-1",
        name: "main.jsx",
        type: "file",
        language: "javascript",
        content: `
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
        `,
      },
      {
        id: "1-2",
        name: "App.jsx",
        type: "file",
        language: "javascript",
        content: `const App = () => {
  return (
    <div>
      <h1>Hello, React!</h1>
      <p>This is a complete React component.</p>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
        `,
      },
      {
        id: "1-3",
        name: "index.css",
        type: "file",
        language: "css",
        content: "/* Add your styles here */",
      },
    ],
  },
  // The public folder with HTML template
  {
    id: "2",
    name: "public",
    type: "folder",
    children: [
      {
        id: "2-1",
        name: "index.html",
        type: "file",
        language: "html",
        content: `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite React App</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
        `,
      },
    ],
  },
  // A simple package.json
  {
    id: "3",
    name: "package.json",
    type: "file",
    language: "javascript",
    content: `
{
  "name": "my-vite-app",
  "version": "0.0.1",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "vite": "^4.0.0",
    "typescript": "^4.9.3"
  }
}
    `,
  },
];
