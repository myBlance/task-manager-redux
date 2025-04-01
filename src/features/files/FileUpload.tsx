import { Button, List, ListItem, ListItemText, TextField, Snackbar } from "@mui/material";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { addFile, removeFile } from "./fileSlice";
import axios from "axios";
import MuiAlert from "@mui/material/Alert";

const FileUpload: React.FC = () => {
  const dispatch = useDispatch();
  const fileList = useSelector((state: RootState) => 
        state.files.fileList as Array<{ 
            id: number; 
            name: string; 
            size: number; 
            type: string; 
            url: string 
        }>);

  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = (event) => {
        setFileContent(event.target?.result as string);
      };

      reader.onerror = (error) => {
        console.error("Error reading file:", error);
      };

      if (selectedFile.type.startsWith("image/")) {
        reader.readAsDataURL(selectedFile);
      } else {
        reader.readAsText(selectedFile);
      }
    }
  };

  const handleUpload = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      // Upload file lên GoFile.io
      const response = await axios.post("https://store1.gofile.io/uploadFile", formData);
      
      if (response.data.status !== "ok") {
        throw new Error("Upload failed");
      }

      const fileUrl = response.data.data.downloadPage;
  
      // Tạo object file mới
      const newFile = {
        id: new Date().getTime(),
        name: file.name,
        size: file.size,
        type: file.type,
        url: fileUrl, 
      };
  
      // Dispatch để lưu vào Redux
      dispatch(addFile(newFile));
  
      // Reset input
      setFile(null);
      setFileContent("");
      setSnackbarMessage("File uploaded successfully!");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error uploading file:", error);
      setSnackbarMessage("Error uploading file!");
      setSnackbarOpen(true);
    }
  };
  

  const handleDelete = async (id: number) => {
    dispatch(removeFile(id));
    setSnackbarMessage("File deleted successfully!");
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div style={{ margin: "20px 0" }}>
      <form onSubmit={handleUpload} style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <TextField type="file" onChange={handleFileChange} inputProps={{ accept: "*" }} />
        <Button type="submit" variant="contained" color="primary">
          Upload
        </Button>
      </form>

      {fileContent && (
        <div>
          <h3>File Preview:</h3>
          <img src={fileContent} alt="Preview" style={{ maxWidth: "100%", maxHeight: "300px" }} />
        </div>
      )}

      <List>
        {fileList.map((file) => (
          <ListItem key={file.id}>
            <ListItemText primary={file.name} />
            <Button sx={{marginRight:1}} variant="contained" color="primary" onClick={() => window.open(file.url, "_blank")}>
              Xem
            </Button>
            <Button variant="contained" color="secondary" onClick={() => handleDelete(file.id)}>
              Xóa
            </Button>
          </ListItem>
        ))}
      </List>

      {/* Snackbar for success/error messages */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <MuiAlert elevation={6} variant="filled" onClose={handleCloseSnackbar} severity={snackbarMessage.includes("Error") ? "error" : "success"}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default FileUpload;
