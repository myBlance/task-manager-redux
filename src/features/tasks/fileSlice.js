import { createSlice } from "@reduxjs/toolkit";

const loadFilesFromLocalStorage = () => {
  const savedFiles = localStorage.getItem("uploadedFiles");
  return savedFiles ? JSON.parse(savedFiles) : [];
};

const fileSlice = createSlice({
  name: "files",
  initialState: {
    fileList: loadFilesFromLocalStorage(),
  },
  reducers: {
    addFile: (state, action) => {
      state.fileList.push(action.payload);
      localStorage.setItem("uploadedFiles", JSON.stringify(state.fileList));
    },
    removeFile: (state, action) => {
      state.fileList = state.fileList.filter((file) => file.id !== action.payload);
      localStorage.setItem("uploadedFiles", JSON.stringify(state.fileList));
    },
  },
});

export const { addFile, removeFile } = fileSlice.actions;
export default fileSlice.reducer;