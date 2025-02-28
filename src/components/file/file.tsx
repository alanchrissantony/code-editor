import React, { useState, MouseEvent, KeyboardEvent } from 'react';
import { FileNode } from '../../types/types';
import { FolderIcon, FolderOpenIcon } from '../svgs/folder';
import FileIcon from '../svgs/file';


const inlineInputStyle =
  'bg-transparent border-b border-gray-500 text-sm text-white focus:outline-none w-full p-1';

interface FileTreeNodeProps {
  node: FileNode;
  selectedId: string;
  onSelect: (node: FileNode) => void;
  onContextMenu: (node: FileNode, e: MouseEvent) => void;

  renameTargetId: string | null;
  renameTempName: string;
  onRenameNameChange: (name: string) => void;
  onRenameSubmit: (nodeId: string) => void;

  newFileParentId: string | null;
  newFileTempName: string;
  onNewFileNameChange: (name: string) => void;
  onNewFileSubmit: (parentId: string) => void;
}

const FileTreeNode: React.FC<FileTreeNodeProps> = ({
  node,
  selectedId,
  onSelect,
  onContextMenu,
  renameTargetId,
  renameTempName,
  onRenameNameChange,
  onRenameSubmit,
  newFileParentId,
  newFileTempName,
  onNewFileNameChange,
  onNewFileSubmit,
}) => {
  const [expanded, setExpanded] = useState(true);

  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    onContextMenu(node, e);
  };

  const renderRenameInput = () => (
    <input
      type="text"
      value={renameTempName}
      onChange={(e) => onRenameNameChange(e.target.value)}
      onBlur={() => onRenameSubmit(node.id)}
      onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') onRenameSubmit(node.id);
      }}
      className={inlineInputStyle}
      autoFocus
    />
  );

  if (node.type === 'folder') {
    return (
      <div className="ml-2">
        <div
          onClick={() => setExpanded(!expanded)}
          onContextMenu={handleContextMenu}
          className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-[#37373d] text-gray-300"
        >
          <div className="flex items-center">
            <span className="mr-2 text-sm">
              {expanded ? <FolderOpenIcon /> : <FolderIcon />}
            </span>
            {renameTargetId === node.id ? (
              renderRenameInput()
            ) : (
              <span className="text-sm truncate">{node.name}</span>
            )}
          </div>
        </div>
        {expanded && node.children && (
          <div>
            {node.children.map((child) => (
              <FileTreeNode
                key={child.id}
                node={child}
                selectedId={selectedId}
                onSelect={onSelect}
                onContextMenu={onContextMenu}
                renameTargetId={renameTargetId}
                renameTempName={renameTempName}
                onRenameNameChange={onRenameNameChange}
                onRenameSubmit={onRenameSubmit}
                newFileParentId={newFileParentId}
                newFileTempName={newFileTempName}
                onNewFileNameChange={onNewFileNameChange}
                onNewFileSubmit={onNewFileSubmit}
              />
            ))}
            {newFileParentId === node.id && (
              <div className="ml-8 px-3 py-1">
                <input
                  type="text"
                  value={newFileTempName}
                  onChange={(e) => onNewFileNameChange(e.target.value)}
                  onBlur={() => onNewFileSubmit(node.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') onNewFileSubmit(node.id);
                  }}
                  placeholder="New file name"
                  className={inlineInputStyle}
                  autoFocus
                />
              </div>
            )}
          </div>
        )}
      </div>
    );
  } else {

    const extension = node.name.split('.').pop() || '';
    return (
      <div
        onClick={() => onSelect(node)}
        onContextMenu={handleContextMenu}
        className={`flex items-center justify-between pl-4 pr-3 py-2 cursor-pointer hover:bg-[#37373d] ${
          selectedId === node.id ? 'bg-[#094771] text-white' : 'text-gray-300'
        }`}
      >
        <span className="flex items-center">
          <span className="mr-2 text-sm">
            <FileIcon extension={extension} />
          </span>
          {renameTargetId === node.id ? renderRenameInput() : (
            <span className="text-sm truncate">{node.name}</span>
          )}
        </span>
      </div>
    );
  }
};

export default FileTreeNode;
