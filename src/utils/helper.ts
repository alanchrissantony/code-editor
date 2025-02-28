import { FileNode } from '../types/types';

export function findParentId(
  nodes: FileNode[],
  childId: string,
  parentId: string | null = null
): string | null {
  for (const node of nodes) {
    if (node.id === childId) return parentId;
    if (node.type === 'folder' && node.children) {
      const result = findParentId(node.children, childId, node.id);
      if (result) return result;
    }
  }
  return null;
}

export function deleteNodeFromTree(
  nodes: FileNode[],
  nodeId: string
): FileNode[] {
  return nodes
    .filter((node) => node.id !== nodeId)
    .map((node) =>
      node.type === 'folder' && node.children
        ? { ...node, children: deleteNodeFromTree(node.children, nodeId) }
        : node
    );
}

export function renameNodeInTree(
  nodes: FileNode[],
  nodeId: string,
  newName: string
): FileNode[] {
  return nodes.map((node) => {
    if (node.id === nodeId) return { ...node, name: newName };
    if (node.type === 'folder' && node.children) {
      return { ...node, children: renameNodeInTree(node.children, nodeId, newName) };
    }
    return node;
  });
}

export function addNodeToTree(
  nodes: FileNode[],
  newNode: FileNode,
  parentId?: string
): FileNode[] {
  if (!parentId) return [...nodes, newNode];
  return nodes.map((node) => {
    if (node.id === parentId && node.type === 'folder') {
      return {
        ...node,
        children: node.children ? [...node.children, newNode] : [newNode],
      };
    } else if (node.type === 'folder' && node.children) {
      return { ...node, children: addNodeToTree(node.children, newNode, parentId) };
    }
    return node;
  });
}
