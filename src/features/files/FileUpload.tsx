import { Button, List, ListItem, ListItemText, TextField, Snackbar } from "@mui/material";
import React, { ChangeEvent, FormEvent, useState } from "react";
import axios from "axios";
import MuiAlert from "@mui/material/Alert";

const FileUpload: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [fileContent, setFileContent] = useState<string>("");
    const [uploadedFiles, setUploadedFiles] = useState<Array<{
        id: number;
        name: string;
        size: number;
        type: string;
        url: string;
    }>>([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const UPLOADCARE_PUBLIC_KEY = "795e9d708e3780c1f5b4"; 

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
        formData.append("UPLOADCARE_PUB_KEY", UPLOADCARE_PUBLIC_KEY);
        formData.append("UPLOADCARE_STORE", "1"); 
        formData.append("file", file);

        try {
            const response = await axios.post("https://upload.uploadcare.com/base/", formData);
            const fileUUID = response.data.file;

            const fileUrl = `https://ucarecdn.com/${fileUUID}/`;

            const newFile = {
                id: new Date().getTime(),
                name: file.name,
                size: file.size,
                type: file.type,
                url: fileUrl,
            };

            setUploadedFiles((prev) => [...prev, newFile]);
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

    const handleDelete = (id: number) => {
        setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
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
                    <div>
                        <img src={fileContent} alt="Preview" style={{ maxWidth: "100%", maxHeight: "300px" }} />
                    </div>
                </div>
            )}

            <List>
                {uploadedFiles.map((file) => (
                    <ListItem key={file.id}>
                    <ListItemText
                        primary={`Tên: ${file.name}`}
                        secondary={`Kích thước: ${(file.size / 1024).toFixed(2)} KB | Loại: ${file.type}`}
                    />
                        <Button sx={{ marginRight: 1 }} variant="contained" color="primary" onClick={() => window.open(file.url, "_blank")}>
                            Xem
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={async () => {
                                try {
                                    const fileUUID = file.url.split("/").slice(-2, -1)[0];
                                    await axios.delete(`https://api.uploadcare.com/files/${fileUUID}/`, {
                                        headers: {
                                            Authorization: `Uploadcare.Simple ${UPLOADCARE_PUBLIC_KEY}:df4288ce67f60455fa78`,
                                        },
                                    });
                                    handleDelete(file.id);
                                } catch (error) {
                                    console.error("Error deleting file:", error);
                                    setSnackbarMessage("Error deleting file!");
                                    setSnackbarOpen(true);
                                }
                            }}
                        >
                            Xóa
                        </Button>
                    </ListItem>
                ))}
            </List>

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <MuiAlert elevation={6} variant="filled" onClose={handleCloseSnackbar} severity={snackbarMessage.includes("Error") ? "error" : "success"}>
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </div>
    );
};

export default FileUpload;
