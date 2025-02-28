export const LANGUAGE_VERSIONS = {
  javascript: "18.15.0",
  typescript: "5.0.3",
  python: "3.10.0",
  react: "18.3.1",
  java: "15.0.2",
  csharp: "6.12.0",
  html: "5",
};

export const CODE_SNIPPETS = {
  javascript: `\nfunction greet(name) {\n\tconsole.log("Hello, " + name + "!");\n}\n\ngreet("World");\n`,
  typescript: `\ntype Params = {\n\tname: string;\n}\n\nfunction greet(data: Params) {\n\tconsole.log("Hello, " + data.name + "!");\n}\n\ngreet({ name: "World" });\n`,
  python: `\ndef greet(name):\n\tprint("Hello, " + name + "!")\n\ngreet("World")\n`,
  java: `\npublic class HelloWorld {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello World");\n\t}\n}\n`,
  csharp: 'using System;\n\nnamespace HelloWorld\n{\n\tclass Hello {\n\t\tstatic void Main(string[] args) {\n\t\t\tConsole.WriteLine("Hello World in C#");\n\t\t}\n\t}\n}\n',
  html: `\n<!DOCTYPE html>\n<html>\n  <head>\n    <title>Hello World</title>\n  </head>\n  <body>\n    <h1>Hello, World!</h1>\n  </body>\n</html>\n`,
  css: `\nbody {\n  background-color: #fff;\n  color: #333;\n}\n`,
  react: `
import React from 'react';

const App = () => {
  return (
    <div>
      <h1>Hello, World!</h1>
      <p>This is a sample React component.</p>
    </div>
  );
};

export default App;
  `,
};

