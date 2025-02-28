import { FileNode } from "../types/types";

export const addNodeToTree = (
  nodes: FileNode[],
  newNode: FileNode,
  parentId?: string
): FileNode[] => {
  if (!parentId) return [...nodes, newNode];
  return nodes.map((node) => {
    if (node.id === parentId && node.type === "folder") {
      return { ...node, children: node.children ? [...node.children, newNode] : [newNode] };
    }
    if (node.type === "folder" && node.children) {
      return { ...node, children: addNodeToTree(node.children, newNode, parentId) };
    }
    return node;
  });
};

export const deleteNodeFromTree = (nodes: FileNode[], nodeId: string): FileNode[] => {
  return nodes
    .filter((node) => node.id !== nodeId)
    .map((node) =>
      node.type === "folder" && node.children
        ? { ...node, children: deleteNodeFromTree(node.children, nodeId) }
        : node
    );
};

export const renameNodeInTree = (nodes: FileNode[], nodeId: string, newName: string): FileNode[] => {
  return nodes.map((node) => {
    if (node.id === nodeId) return { ...node, name: newName };
    if (node.type === "folder" && node.children) {
      return { ...node, children: renameNodeInTree(node.children, nodeId, newName) };
    }
    return node;
  });
};

export const findParentId = (nodes: FileNode[], childId: string, parentId: string | null = null): string | null => {
  for (const node of nodes) {
    if (node.id === childId) return parentId;
    if (node.type === "folder" && node.children) {
      const result = findParentId(node.children, childId, node.id);
      if (result) return result;
    }
  }
  return null;
};


export const updateFileInTree = (
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