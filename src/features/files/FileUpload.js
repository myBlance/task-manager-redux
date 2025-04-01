import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addFile, removeFile } from "./fileSlice";
import { Button, TextField, List, ListItem, ListItemText } from "@mui/material";

const FileUpload = () => {
  const dispatch = useDispatch();
  const fileList = useSelector((state) => state.files.fileList);

  const [file, setFile] = useState(null);
  const [fileContent, setFileContent] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = (event) => {
        setFileContent(event.target.result);
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

  const handleUpload = (e) => {
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

  const handleDelete = (id) => {
    dispatch(removeFile(id)); // Dispatch the removeFile action
  };

  return (
    <div style={{ margin: "20px 0" }}>
      {/* Form upload */}
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

      {fileContent && (
        <div>
          <h3>File upload:</h3>
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