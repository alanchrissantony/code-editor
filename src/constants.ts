export const LANGUAGE_VERSIONS = {
  javascript: "18.15.0",
  typescript: "5.0.3",
  python: "3.10.0",
  react: "18.3.1",
  java: "15.0.2",
  csharp: "6.12.0",
  html: "5",
  css: "3",
};

export const CODE_SNIPPETS = {
  javascript: `
function greet(name) {
  console.log("Hello, " + name + "!");
}

greet("World");
`,
  typescript: `
type Params = {
  name: string;
}

function greet(data: Params) {
  console.log("Hello, " + data.name + "!");
}

greet({ name: "World" });
`,
  python: `
def greet(name):
    print("Hello, " + name + "!")
    
greet("World")
`,
  java: `
public class HelloWorld {
  public static void main(String[] args) {
    System.out.println("Hello World");
  }
}
`,
  csharp: `
using System;

namespace HelloWorld {
  class Hello {
    static void Main(string[] args) {
      Console.WriteLine("Hello World in C#");
    }
  }
}
`,
  html: `
<!DOCTYPE html>
<html>
  <head>
    <title>Hello World</title>
  </head>
  <body>
    <h1>Hello, World!</h1>
  </body>
</html>
`,
  css: `
body {
  background-color: #fff;
  color: #333;
}
`,
  react: `
const App = () => {
  return (
    <div>
      <h1>Hello, React!</h1>
      <p>This is a complete React component.</p>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
`,
};
