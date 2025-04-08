import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface File {
  id: number;
  name: string;
  size: number;
  type: string;
  url: string;
}

interface FileState {
  fileList: File[];
}

const initialState: FileState = {
  fileList: [],
};

const fileSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    addFile: (state, action: PayloadAction<File>) => {
      state.fileList.push(action.payload);
      // API call to add file
      axios.post("https://upload.uploadcare.com/base/", action.payload).catch((error) => {
        console.error("Error adding file to API:", error);
      });
    },
    removeFile: (state, action: PayloadAction<{ id: number; url: string }>) => {
      const { id, url } = action.payload;
      state.fileList = state.fileList.filter((file) => file.id !== id);
      // API call to delete file
      const fileUUID = url.split("/").slice(-2, -1)[0];
      axios
        .delete(`https://api.uploadcare.com/files/${fileUUID}/`, {
          headers: {
            Authorization: `Uploadcare.Simple YOUR_PUBLIC_KEY:YOUR_SECRET_KEY`,
          },
        })
        .catch((error) => {
          console.error("Error removing file from API:", error);
        });
    },
  },
});

export const { addFile, removeFile } = fileSlice.actions;
export default fileSlice.reducer;