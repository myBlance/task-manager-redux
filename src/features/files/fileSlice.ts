import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface File {
  id: number;
  name: string;
  size: number;
  type: string;
}

interface FileState {
  fileList: File[];
}

const loadFilesFromLocalStorage = (): File[] => {
  const savedFiles = localStorage.getItem("uploadedFiles");
  return savedFiles ? JSON.parse(savedFiles) : [];
};

const initialState: FileState = {
  fileList: loadFilesFromLocalStorage(),
};

const fileSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    addFile: (state, action: PayloadAction<File>) => {
      state.fileList.push(action.payload);
      localStorage.setItem("uploadedFiles", JSON.stringify(state.fileList));
    },
    removeFile: (state, action: PayloadAction<number>) => {
      state.fileList = state.fileList.filter((file) => file.id !== action.payload);
      localStorage.setItem("uploadedFiles", JSON.stringify(state.fileList));
    },
  },
});

export const { addFile, removeFile } = fileSlice.actions;
export default fileSlice.reducer;