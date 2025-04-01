import { configureStore } from '@reduxjs/toolkit';
import taskReducer from '../features/tasks/taskSlice';
import fileReducer from '../features/tasks/fileSlice';

export const store = configureStore({
  reducer: {
    tasks: taskReducer,
    files: fileReducer,
  },
});
