// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import filesReducer from './reducers/filesReducer';
import editorReducer from './reducers/editorReducer';
import { loadState, saveState } from './localstorage';

const rootReducer = combineReducers({
  files: filesReducer,
  editor: editorReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const preloadedState: Partial<RootState> | undefined = loadState();

const store = configureStore({
  reducer: rootReducer,
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {

        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});


store.subscribe(() => {
  saveState(store.getState());
});

export type AppDispatch = typeof store.dispatch;
export default store;
