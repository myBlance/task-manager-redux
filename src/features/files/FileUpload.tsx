import { Button, List, ListItem, ListItemText, TextField } from "@mui/material";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { addFile, removeFile } from "./fileSlice";

const FileUpload: React.FC = () => {
  const dispatch = useDispatch();
  const fileList = useSelector((state: RootState) => state.files.fileList); 

  const [file, setFile] = useState<File | null>(null); 
  const [fileContent, setFileContent] = useState<string>(""); 
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

  const handleUpload = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    const newFile = {
      id: new Date().getTime(),
      name: file.name,
      size: file.size,
      type: file.type,
    };

    dispatch(addFile(newFile)); 
    setFile(null);
    setFileContent(""); 
  };

  const handleDelete = (id: number) => {
    dispatch(removeFile(id)); 
  };

  return (
    <div style={{ margin: "20px 0" }}>
      {/* File upload form */}
      <form onSubmit={handleUpload} style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <TextField
          type="file"
          onChange={handleFileChange}
          inputProps={{ accept: "*" }}
        />
        <Button type="submit" variant="contained" color="primary">
          Upload
        </Button>
      </form>

      {/* File preview */}
      {fileContent && (
        <div>
          <h3>File Preview:</h3>
          <img src={fileContent} alt="Preview" style={{ maxWidth: "100%", maxHeight: "300px" }} />
        </div>
      )}

      {/* List of uploaded files */}
      <List>
        {fileList.map((file) => (
          <ListItem key={file.id}>
            <ListItemText primary={file.name} />
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleDelete(file.id)}
            >
              Xóa
            </Button>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default FileUpload;