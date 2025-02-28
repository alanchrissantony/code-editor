
import { createStore, combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; 


export interface EditorState {
  tree: any; 
  currentFile: any; 
  output: any
}

const initialEditorState: EditorState = {
  tree: [],
  currentFile: null,
  output: null,
};


const editorReducer = (
  state = initialEditorState,
  action: { type: string; payload?: any }
): EditorState => {
  switch (action.type) {
    case "SET_TREE":
      return { ...state, tree: action.payload };
    case "SET_CURRENT_FILE":
      return { ...state, currentFile: action.payload };
    case "SET_OUTPUT":
      return { ...state, output: action.payload };
    
    default:
      return state;
  }
};


const rootReducer = combineReducers({
  editor: editorReducer,
});


const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);


export const store = createStore(persistedReducer);


export const persistor = persistStore(store);
