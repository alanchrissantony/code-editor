import { LANGUAGE_VERSIONS } from '../../constants';
import { FileNode } from '../../types/types';
import FileTreeNode from '../file/file';



interface SidebarProps {
    tree: FileNode[];
    selectedId: string;
    onSelect: (node: FileNode) => void;
    onContextMenu: (node: FileNode, e: React.MouseEvent) => void;
    renameTargetId: string | null;
    renameTempName: string;
    onRenameNameChange: (name: string) => void;
    onRenameSubmit: (nodeId: string) => void;
    newFileParentId: string | null;
    newFileTempName: string;
    onNewFileNameChange: (name: string) => void;
    onNewFileSubmit: (parentId: string) => void;
    handleLanguageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    selectedLanguage: string
}

const Sidebar = ({
    tree,
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
    handleLanguageChange,
    selectedLanguage,
}: SidebarProps) => {

    
    return (
        <div className="w-64 bg-[#252526] h-full flex flex-col border-r border-[#3c3c3c]">
            <div className="px-4 py-2 border-b border-[#3c3c3c] flex items-center justify-between">
                <h2 className="text-xs uppercase tracking-widest text-gray-400">Explorer</h2>
                <select
                    value={selectedLanguage}
                    onChange={handleLanguageChange}
                    className="bg-[#252526] text-gray-300 text-xs border border-gray-500 rounded p-1"
                >
                    {Object.keys(LANGUAGE_VERSIONS).map((language) => (
                        <option key={language} value={language}>
                            {language}
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex-1 overflow-y-auto">
                {tree.map((node) => (
                    <FileTreeNode
                        key={node.id}
                        node={node}
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
            </div>
        </div>
    );
};

export default Sidebar;
