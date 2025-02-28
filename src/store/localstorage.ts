import { RootState } from './store';

export const loadState = (): Partial<RootState> | undefined => {
  try {
    const serializedState = localStorage.getItem('state');
    if (serializedState === null) {
      return undefined; 
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Error loading state', err);
    return undefined;
  }
};

export const saveState = (state: RootState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch (err) {
    console.error('Error saving state', err);
  }
};
