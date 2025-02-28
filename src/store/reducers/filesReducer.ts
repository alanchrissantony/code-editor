import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FileNode } from '../../types/types';
import { addNodeToTree, deleteNodeFromTree, renameNodeInTree, updateFileInTree } from '../../utils/helper';

interface FilesState {
  files: FileNode[];
  currentFile: FileNode | null;
}

const initialState: FilesState = {
  files: [],
  currentFile: null,
};

const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
   
    setFiles: (state, action: PayloadAction<FileNode[]>) => {
      state.files = action.payload;
    },
    setCurrentFile: (state, action: PayloadAction<FileNode | null>) => {
      console.log(action.payload);
      
      state.currentFile = action.payload;
    },
    updateFileContent: (state, action: PayloadAction<{ content: string }>) => {
      if (state.currentFile) {
        const updatedFile = {
          ...state.currentFile,
          content: action.payload.content,
        };
        state.currentFile = updatedFile;
        state.files = updateFileInTree(state.files, updatedFile.id, updatedFile);
      }
    },
    addFile: (state, action: PayloadAction<{ node: FileNode; parentId?: string }>) => {
      const { node, parentId } = action.payload;
      state.files = addNodeToTree(state.files, node, parentId);
      state.currentFile = node;
    },
    deleteFile: (state, action: PayloadAction<string>) => {
      const fileId = action.payload;
      state.files = deleteNodeFromTree(state.files, fileId);
      if (state.currentFile?.id === fileId) {
        state.currentFile = state.files.find(f => f.type === "file") || null;
      }
    },
    renameFile: (state, action: PayloadAction<{ id: string; newName: string }>) => {
      const { id, newName } = action.payload;
      state.files = renameNodeInTree(state.files, id, newName);
      if (state.currentFile?.id === id) {
        state.currentFile = { ...state.currentFile, name: newName };
      }
    },
  },
});

export const { setFiles, setCurrentFile, updateFileContent, addFile, deleteFile, renameFile } = filesSlice.actions;
export default filesSlice.reducer;
