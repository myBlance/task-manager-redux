import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "../features/auth/authSlice";
import fileReducer from "../features/files/fileSlice";
import taskReducer from "../features/tasks/taskSlice";

// Cấu hình Redux Persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "tasks", "files"], // Chỉ lưu trữ các reducer cần thiết
};

// Kết hợp reducers
const rootReducer = combineReducers({
  auth: authReducer,
  tasks: taskReducer,
  files: fileReducer,
});

// Tạo reducer có persist
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Khởi tạo store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Bỏ kiểm tra serializable để tránh lỗi Redux Persist
    }),
  devTools: process.env.NODE_ENV !== "production", // Bật Redux DevTools ở môi trường dev
});

// Tạo persistor để quản lý trạng thái lưu trữ
export const persistor = persistStore(store);

// Định nghĩa kiểu dữ liệu cho state và dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
