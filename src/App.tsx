// App.tsx
import React, { useEffect, MouseEvent } from "react";
import { useSelector, useDispatch } from "react-redux";
import Editor from "@monaco-editor/react";
import { CODE_SNIPPETS, LANGUAGE_VERSIONS } from "./constants";
import { FileNode } from "./types/types";
import { findParentId, updateFileInTree, addNodeToTree } from "./utils/helper";
import FileIcon from "./components/svgs/file";
import { PreviewCodeIcon, RunCodeIcon, Spinner } from "./components/svgs/controls";
import { transpileReact } from "./utils/babelTranspile";
import { initialTree } from "./components/file/base";
import Sidebar from "./components/sidebar/sidebar";
import { executeCode } from "./api/api";
import { RootState, AppDispatch } from "./store/store";
import {
  setFiles,
  setCurrentFile,
  updateFileContent,
  addFile,
  deleteFile,
  renameFile,
} from "./store/reducers/filesReducer";
import { setOutput, toggleOutput, setLoading, setLanguage } from "./store/reducers/editorReducer";


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
  const dispatch = useDispatch<AppDispatch>();

  const { files, currentFile } = useSelector((state: RootState) => state.files);
  const { output, showOutput, loading, selectedLanguage } = useSelector((state: RootState) => state.editor);

  useEffect(() => {
    if (!files || files.length === 0) {
      dispatch(setFiles(initialTree));
      if (initialTree.length > 0) {
        dispatch(setCurrentFile(initialTree[0]));
      }
    }
  }, [files, dispatch]);

  useEffect(() => {
    if (currentFile && currentFile.type === "file" && currentFile.language !== selectedLanguage) {
      const updatedName = updateFileNameExtension(currentFile.name, selectedLanguage);
      const updatedFile: FileNode = {
        ...currentFile,
        language: selectedLanguage,
        content: CODE_SNIPPETS[selectedLanguage] || "// new file",
        name: updatedName,
      };
      dispatch(setCurrentFile(updatedFile));
      dispatch(setFiles(updateFileInTree(files, currentFile.id, updatedFile)));
    }
  }, [selectedLanguage, currentFile, files, dispatch]);
  

  const [newFileParentId, setNewFileParentId] = React.useState<string | null>(null);
  const [newFileTempName, setNewFileTempName] = React.useState<string>("");
  const [renameTargetId, setRenameTargetId] = React.useState<string | null>(null);
  const [renameTempName, setRenameTempName] = React.useState<string>("");

  useEffect(() => {
    const handleClick = () => setContextMenu({ visible: false, x: 0, y: 0, targetNode: null });
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);
  const [contextMenu, setContextMenu] = React.useState<{
    visible: boolean;
    x: number;
    y: number;
    targetNode: FileNode | null;
  }>({ visible: false, x: 0, y: 0, targetNode: null });

  const handleContextMenu = (node: FileNode, e: MouseEvent) => {
    e.preventDefault();
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY, targetNode: node });
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
    dispatch(renameFile({ id: nodeId, newName: renameTempName }));
    if (currentFile && currentFile.id === nodeId) {
      dispatch(setCurrentFile({ ...currentFile, name: renameTempName }));
    }
    setRenameTargetId(null);
  };

  const handleDelete = (node: FileNode) => {
    if (window.confirm(`Delete ${node.name}?`)) {
      dispatch(deleteFile(node.id));
    }
  };

  const handleNewFileContext = (node: FileNode) => {
    let parentId: string | undefined;
    if (node.type === "folder") {
      parentId = node.id;
    } else {
      parentId = findParentId(files, node.id) || undefined;
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
    dispatch(addFile({ node: newNode, parentId }));
    dispatch(setCurrentFile(newNode));
    setNewFileParentId(null);
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
    const name = window.prompt(`Enter ${type} name`, type === "file" ? defaultFileNames[selectedLanguage] : "newFolder");
    if (!name) return;
    const newNode: FileNode = {
      id: Date.now().toString(),
      name,
      type,
      language: type === "file" ? selectedLanguage : undefined,
      content: type === "file" ? CODE_SNIPPETS[selectedLanguage] || "// new file" : undefined,
      children: type === "folder" ? [] : undefined,
    };
    if (type === "file") {
      dispatch(addFile({ node: newNode, parentId }));
      dispatch(setCurrentFile(newNode));
    } else {
      // For folders, update the files tree directly
      dispatch(setFiles(
        parentId ? addNodeToTree(files, newNode, parentId) : addNodeToTree(files, newNode)
      ));
    }
  };

  const handleRun = async () => {
    if (!currentFile) return;
    try {
      dispatch(setLoading(true));
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
        dispatch(setOutput(""));
      } else {
        const version = LANGUAGE_VERSIONS[language];
        const codeToRun = currentFile.content || "";
        const result = await executeCode(language, version, codeToRun);
        dispatch(setOutput(result?.run?.output));
      }
    } catch (error) {
      alert("Error running code: " + error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handlePreview = () => {
    dispatch(toggleOutput());
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
    dispatch(setLanguage(e.target.value as "javascript" | "typescript" | "python" | "java" | "csharp" | "html" | "css" | "react"));
  };

  return (
    <div className="flex h-screen relative">
      <Sidebar
        tree={files}
        selectedId={currentFile ? currentFile.id : ""}
        onSelect={(node) => {
          if (node.type === "file") {
            dispatch(setCurrentFile(node));
            dispatch(setLanguage(node.language || "javascript"));
            dispatch(setOutput(""));
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
              <FileIcon extension={currentFile ? currentFile.name.split(".").pop() || "" : ""} />
            </span>
            <span className="text-sm text-gray-200 truncate">
              {currentFile ? currentFile.name : "No file selected"}
            </span>
          </div>
          <div className="flex space-x-2">
            <button onClick={handleRun} className="p-1 rounded hover:bg-[#094771] text-gray-200 cursor-pointer" title="Run">
              {loading ? <Spinner /> : <RunCodeIcon />}
            </button>
            <button onClick={handlePreview} className="p-1 rounded hover:bg-[#094771] text-gray-200 cursor-pointer" title="Preview">
              <PreviewCodeIcon />
            </button>
          </div>
        </div>
      
        <div className="flex flex-1 relative">
          <div className={`${showOutput ? "w-1/2" : "w-full"} border-r border-[#3c3c3c]`}>
            <Editor
              height="100%"
              language={currentFile ? (currentFile.language === "react" ? "javascript" : currentFile.language) : "javascript"}
              value={currentFile ? currentFile.content : ""}
              theme="vs-dark"
              options={{ automaticLayout: true }}
              onChange={(value) => {
                if (value !== undefined && currentFile) {
                  dispatch(updateFileContent({ content: value }));
                }
              }}
            />
          </div>
          {showOutput && (
            <div id="output-container" className="w-1/2 bg-[#1e1e1e] p-4 text-gray-300 overflow-auto">
              {currentFile && currentFile.language !== "react" && (
                <pre className="text-sm">{output || 'No output. Click "Run" or "Preview" above.'}</pre>
              )}
            </div>
          )}
        </div>
      </div>
      
      {contextMenu.visible && (
        <div
          className="absolute bg-[#252526] border border-[#3c3c3c] text-gray-300 text-sm rounded shadow-lg z-50"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <div className="px-4 py-2 hover:bg-[#37373d] cursor-pointer" onClick={() => onContextMenuItemClick("rename")}>
            Rename
          </div>
          <div className="px-4 py-2 hover:bg-[#37373d] cursor-pointer" onClick={() => onContextMenuItemClick("delete")}>
            Delete
          </div>
          <div className="px-4 py-2 hover:bg-[#37373d] cursor-pointer" onClick={() => onContextMenuItemClick("newFile")}>
            New File
          </div>
          {contextMenu.targetNode?.type === "folder" && (
            <div className="px-4 py-2 hover:bg-[#37373d] cursor-pointer" onClick={() => onContextMenuItemClick("newFolder")}>
              New Folder
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
