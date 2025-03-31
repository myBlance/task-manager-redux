import React, { useState, useEffect } from "react";
import { Button, TextField, List, ListItem, ListItemText } from "@mui/material";


const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [fileContent, setFileContent] = useState(""); // State to store file content

    // Load danh sách file từ localStorage 
    useEffect(() => {
        const savedFiles = JSON.parse(localStorage.getItem("uploadedFiles")) || [];
        setFileList(savedFiles);
    }, []);

    // Khi người dùng chọn file
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
                reader.readAsDataURL(selectedFile); // Read image files as Data URL for preview
            } else {
                reader.readAsText(selectedFile); // Read other files as text
            }
        }
    };

    // Lưu file vào localStorage
    const handleUpload = (e) => {
        e.preventDefault();
        if (!file) return;

        const newFile = {
            id: new Date().getTime(), // ID duy nhất
            name: file.name,
            size: file.size,
            type: file.type
        };

        const updatedFileList = [...fileList, newFile];

        // Lưu vào localStorage
        localStorage.setItem("uploadedFiles", JSON.stringify(updatedFileList));
        setFileList(updatedFileList);
        setFile(null);
    };

    // Xóa file khỏi localStorage
    const handleDelete = (id) => {
        const updatedFileList = fileList.filter(file => file.id !== id);
        localStorage.setItem("uploadedFiles", JSON.stringify(updatedFileList));
        setFileList(updatedFileList);
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
            {/* Danh sách file đã lưu */}
            <List>
                {fileList.map((file) => (
                    <ListItem key={file.id}>
                        <ListItemText primary={file.name}  />
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
