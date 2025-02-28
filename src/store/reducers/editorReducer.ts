import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EditorState {
    output: string;
    showOutput: boolean;
    loading: boolean;
    selectedLanguage: "javascript" | "typescript" | "python" | "react" | "java" | "csharp" | "html" | "css";
  }
  
  const initialState: EditorState = {
    output: '',
    showOutput: true,
    loading: false,
    selectedLanguage: 'javascript'
  };

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setOutput: (state, action: PayloadAction<string>) => {
      state.output = action.payload;
    },
    toggleOutput: (state) => {
      state.showOutput = !state.showOutput;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setLanguage: (state, action: PayloadAction<"javascript" | "typescript" | "python" | "java" | "csharp" | "html" | "css" | "react">) => {
      state.selectedLanguage = action.payload;
    }
  }
});

export const { setOutput, toggleOutput, setLoading, setLanguage } = editorSlice.actions;
export default editorSlice.reducer;