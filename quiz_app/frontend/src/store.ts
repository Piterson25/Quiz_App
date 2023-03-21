import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import questionSlice from './reducers/questions';

const store = configureStore({
  reducer: {
    questions: questionSlice
  },
  middleware: [...getDefaultMiddleware(), logger],
});

export type AppState = ReturnType<typeof store.getState>;
export default store;