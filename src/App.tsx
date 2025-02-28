import React, { useState, useEffect, MouseEvent } from "react";
import Editor from "@monaco-editor/react";
import { CODE_SNIPPETS, LANGUAGE_VERSIONS } from "./constants";
import { FileNode } from "./types/types";
import {
  addNodeToTree,
  deleteNodeFromTree,
  findParentId,
  renameNodeInTree,
} from "./utils/helper";

import FileIcon from "./components/svgs/file";
import { PreviewCodeIcon, RunCodeIcon, Spinner } from "./components/svgs/controls";
import { transpileReact } from "./utils/babelTranspile";
import { initialTree } from "./components/file/base";
import Sidebar from "./components/sidebar/sidebar";
import { executeCode } from "./api/api";


const updateFileInTree = (
  nodes: FileNode[],
  fileId: string,
  newProps: Partial<FileNode>
): FileNode[] =>
  nodes.map((node) => {
    if (node.id === fileId && node.type === "file") {
      return { ...node, ...newProps };
    } else if (node.type === "folder" && node.children) {
      return { ...node, children: updateFileInTree(node.children, fileId, newProps) };
    }
    return node;
  });

const updateFileNameExtension = (
  fileName: string,
  language: keyof typeof CODE_SNIPPETS
): string => {
  const extensionMapping: Record<keyof typeof CODE_SNIPPETS, string> = {
    javascript: "js",
    typescript: "ts",
    python: "py",
    java: "java",
    csharp: "cs",
    html: "html",
    css: "css",
    react: "jsx",
  };
  const baseName = fileName.includes(".") ? fileName.split(".")[0] : fileName;
  return `${baseName}.${extensionMapping[language]}`;
};

const App: React.FC = () => {
  const [tree, setTree] = useState<FileNode[]>(initialTree);
  const getAllFiles = (nodes: FileNode[]): FileNode[] => {
    let files: FileNode[] = [];
    nodes.forEach((node) => {
      if (node.type === "file") files.push(node);
      else if (node.type === "folder" && node.children)
        files = files.concat(getAllFiles(node.children));
    });
    return files;
  };

  const initialFile = getAllFiles(tree)[0];
  const [currentFile, setCurrentFile] = useState<FileNode>(initialFile);
  const [output, setOutput] = useState<string>("");
  const [showOutput, setShowOutput] = useState(true);
  const [loading, setLoading] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    targetNode: FileNode | null;
  }>({ visible: false, x: 0, y: 0, targetNode: null });

  // State for inline new file creation and renaming
  const [newFileParentId, setNewFileParentId] = useState<string | null>(null);
  const [newFileTempName, setNewFileTempName] = useState<string>("");
  const [renameTargetId, setRenameTargetId] = useState<string | null>(null);
  const [renameTempName, setRenameTempName] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<keyof typeof CODE_SNIPPETS>("javascript");

  useEffect(() => {
    const handleClick = () =>
      setContextMenu({ visible: false, x: 0, y: 0, targetNode: null });
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    if (currentFile.type === "file") {
      const updatedName = updateFileNameExtension(currentFile.name, selectedLanguage);
      const updatedFile: FileNode = {
        ...currentFile,
        language: selectedLanguage,
        content: CODE_SNIPPETS[selectedLanguage] || "// new file",
        name: updatedName,
      };
      setCurrentFile(updatedFile);
      setTree(updateFileInTree(tree, currentFile.id, updatedFile));
    }
  }, [selectedLanguage]);

  const handleContextMenu = (node: FileNode, e: MouseEvent) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      targetNode: node,
    });
  };

  const handleRename = (node: FileNode) => {
    setRenameTargetId(node.id);
    setRenameTempName(node.name);
  };

  const handleRenameSubmit = (nodeId: string) => {
    if (renameTempName.trim() === "") {
      setRenameTargetId(null);
      return;
    }
    setTree(renameNodeInTree(tree, nodeId, renameTempName));
    if (nodeId === currentFile.id) {
      setCurrentFile({ ...currentFile, name: renameTempName });
    }
    setRenameTargetId(null);
  };

  const handleDelete = (node: FileNode) => {
    if (window.confirm(`Delete ${node.name}?`)) {
      const newTree = deleteNodeFromTree(tree, node.id);
      setTree(newTree);
      if (node.id === currentFile.id) {
        const files = getAllFiles(newTree);
        setCurrentFile(
          files[0] || { id: "", name: "", type: "file", language: "", content: "" }
        );
      }
    }
  };

  const handleNewFileContext = (node: FileNode) => {
    let parentId: string | undefined;
    if (node.type === "folder") {
      parentId = node.id;
    } else {
      parentId = findParentId(tree, node.id) || undefined;
    }
    setNewFileParentId(parentId || null);
    setNewFileTempName("");
  };

  const handleNewFileSubmit = (parentId: string) => {
    if (newFileTempName.trim() === "") {
      setNewFileParentId(null);
      return;
    }
    const newNode: FileNode = {
      id: Date.now().toString(),
      name: newFileTempName,
      type: "file",
      language: selectedLanguage,
      content: CODE_SNIPPETS[selectedLanguage] || "// new file",
    };
    const updatedTree = addNodeToTree(tree, newNode, parentId);
    setTree(updatedTree);
    setNewFileParentId(null);
    setCurrentFile(newNode);
  };

  const handleAdd = (type: "file" | "folder", parentId?: string) => {
    const defaultFileNames: Record<keyof typeof CODE_SNIPPETS, string> = {
      javascript: "main.js",
      typescript: "main.ts",
      python: "main.py",
      java: "main.java",
      csharp: "main.cs",
      html: "main.html",
      css: "main.css",
      react: "main.jsx",
    };

    const name = window.prompt(
      `Enter ${type} name`,
      type === "file" ? defaultFileNames[selectedLanguage] : "newFolder"
    );
    if (!name) return;
    const newNode: FileNode = {
      id: Date.now().toString(),
      name,
      type,
      language: type === "file" ? selectedLanguage : undefined,
      content: type === "file" ? CODE_SNIPPETS[selectedLanguage] || "// new file" : undefined,
      children: type === "folder" ? [] : undefined,
    };
    const updatedTree = parentId
      ? addNodeToTree(tree, newNode, parentId)
      : addNodeToTree(tree, newNode);
    setTree(updatedTree);
  };

  
  const handleRun = async () => {
    if (!currentFile) return;
    try {
      setLoading(true);
      const langCandidate = currentFile.language;
      const language: keyof typeof LANGUAGE_VERSIONS =
        typeof langCandidate === "string" && langCandidate in LANGUAGE_VERSIONS
          ? (langCandidate as keyof typeof LANGUAGE_VERSIONS)
          : "javascript";
      const outputContainer = document.getElementById("output-container");
      if (language === "react") {
        const transpiledCode = transpileReact(currentFile.content || "");
        const html = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>React Output</title>
      <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
      <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
      <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    </head>
    <body style="color:#ffffff">
      <div id="root"></div>
      <script type="text/babel">
        (function() {
          try {
            ${transpiledCode}
            
            // Modern React 18 rendering
            const rootElement = document.getElementById('root');
            const root = ReactDOM.createRoot(rootElement);
            root.render(<App />);
          } catch (e) {
            console.error(e);
            const rootElement = document.getElementById('root');
            if (rootElement) {
              rootElement.innerHTML = '<pre style="color: red">' + e.toString() + '</pre>';
            }
          }
        })();
      </script>
    </body>
  </html>
        `;
  
        if (outputContainer) {
          outputContainer.innerHTML = "";
          const iframe = document.createElement("iframe");
          iframe.style.width = "100%";
          iframe.style.height = "100%";
          iframe.style.border = "none";
          iframe.srcdoc = html;
          outputContainer.appendChild(iframe);
        }
        setOutput("");
      } else { 
        const version = LANGUAGE_VERSIONS[language];
        const codeToRun = currentFile.content || "";
        const result = await executeCode(language, version, codeToRun);
        console.log(result);
        setOutput(result?.run?.output);
      }
    } catch (error) {
      alert("Error running code: " + error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    setShowOutput(!showOutput);
  };

  const onContextMenuItemClick = (action: string) => {
    if (!contextMenu.targetNode) return;
    const node = contextMenu.targetNode;
    switch (action) {
      case "rename":
        handleRename(node);
        break;
      case "delete":
        handleDelete(node);
        break;
      case "newFile":
        handleNewFileContext(node);
        break;
      case "newFolder":
        if (node.type === "folder") handleAdd("folder", node.id);
        break;
      default:
        break;
    }
    setContextMenu({ visible: false, x: 0, y: 0, targetNode: null });
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value as keyof typeof CODE_SNIPPETS);
  };

  return (
    <div className="flex h-screen relative">
      <Sidebar
        tree={tree}
        selectedId={currentFile.id}
        onSelect={(node) => {
          if (node.type === "file") {
            setCurrentFile(node);
            setOutput("");
          }
        }}
        onContextMenu={handleContextMenu}
        renameTargetId={renameTargetId}
        renameTempName={renameTempName}
        onRenameNameChange={setRenameTempName}
        onRenameSubmit={handleRenameSubmit}
        newFileParentId={newFileParentId}
        newFileTempName={newFileTempName}
        onNewFileNameChange={setNewFileTempName}
        onNewFileSubmit={handleNewFileSubmit}
        handleLanguageChange={handleLanguageChange}
        selectedLanguage={selectedLanguage}
      />
      <div className="flex-1 flex flex-col">
        {/* Editor header */}
        <div className="flex items-center justify-between bg-[#1e1e1e] border-b border-[#3c3c3c] px-3 py-2">
          <div className="flex items-center">
            <span className="mr-2 text-sm">
              <FileIcon extension={currentFile.name.split(".").pop() || ""} />
            </span>
            <span className="text-sm text-gray-200 truncate">{currentFile.name}</span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleRun}
              className="p-1 rounded hover:bg-[#094771] text-gray-200 cursor-pointer"
              title="Run"
            >
              {loading ? <Spinner /> : <RunCodeIcon />}
            </button>
            <button
              onClick={handlePreview}
              className="p-1 rounded hover:bg-[#094771] text-gray-200 cursor-pointer"
              title="Preview"
            >
              <PreviewCodeIcon />
            </button>
          </div>
        </div>
        {/* Main area: Editor and Output */}
        <div className="flex flex-1 relative">
          <div className={`${showOutput ? "w-1/2" : "w-full"} border-r border-[#3c3c3c]`}>
            <Editor
              height="100%"
              language={currentFile.language=='react'?'javascript':currentFile.language}
              value={currentFile.content}
              theme="vs-dark"
              options={{ automaticLayout: true }}
              onChange={(value) => {
                if (value !== undefined) {
                  const updatedContent = value;
                  setCurrentFile({ ...currentFile, content: updatedContent });
                  setTree((prevTree) =>
                    updateFileInTree(prevTree, currentFile.id, { content: updatedContent })
                  );
                }
              }}
            />
          </div>
          {showOutput && (
            <div id="output-container" className="w-1/2 bg-[#1e1e1e] p-4 text-gray-300 overflow-auto">
              {currentFile.language !== "react" && (
                <pre className="text-sm">
                  {output || 'No output. Click "Run" or "Preview" above.'}
                </pre>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Custom Context Menu */}
      {contextMenu.visible && (
        <div
          className="absolute bg-[#252526] border border-[#3c3c3c] text-gray-300 text-sm rounded shadow-lg z-50"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <div
            className="px-4 py-2 hover:bg-[#37373d] cursor-pointer"
            onClick={() => onContextMenuItemClick("rename")}
          >
            Rename
          </div>
          <div
            className="px-4 py-2 hover:bg-[#37373d] cursor-pointer"
            onClick={() => onContextMenuItemClick("delete")}
          >
            Delete
          </div>
          <div
            className="px-4 py-2 hover:bg-[#37373d] cursor-pointer"
            onClick={() => onContextMenuItemClick("newFile")}
          >
            New File
          </div>
          {contextMenu.targetNode?.type === "folder" && (
            <div
              className="px-4 py-2 hover:bg-[#37373d] cursor-pointer"
              onClick={() => onContextMenuItemClick("newFolder")}
            >
              New Folder
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
