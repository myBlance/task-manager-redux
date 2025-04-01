import { configureStore, combineReducers } from '@reduxjs/toolkit';
import taskReducer from '../features/tasks/taskSlice';
import fileReducer from '../features/files/fileSlice';
import authReducer from '../features/auth/authSlide';
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; 

// Cấu hình Redux Persist
const persistConfig = {
  key: "root",
  storage,
};

// Kết hợp reducers
const rootReducer = combineReducers({
  auth:  authReducer,
  tasks: taskReducer,
  files: fileReducer,
});

export const persistedReducer = persistReducer(persistConfig, rootReducer);

// Tạo store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});

