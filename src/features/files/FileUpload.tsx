import { 
    Button, 
    List, 
    ListItem, 
    ListItemText, 
    TextField, 
    Snackbar 
} from "@mui/material";
import React, { 
    ChangeEvent, 
    FormEvent, 
    useState, 
    useEffect 
} from "react";
import MuiAlert from "@mui/material/Alert";
import uploadcareService from "../../services/uploadcareService"; // Import the service

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

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const files = await uploadcareService.fetchFiles();
                setUploadedFiles(files);
            } catch (error) {
                console.error("Error fetching files from API:", error);
                setSnackbarMessage("Error fetching files!");
                setSnackbarOpen(true);
            }
        };

        fetchFiles();
    }, []);

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

        try {
            const newFile = await uploadcareService.uploadFile(file);
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

    const handleDelete = async (id: number, fileUrl: string) => {
        try {
            await uploadcareService.deleteFile(fileUrl);
            setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
            setSnackbarMessage("File deleted successfully!");
        } catch (error) {
            console.error("Error deleting file:", error);
            setSnackbarMessage("Error deleting file!");
        } finally {
            setSnackbarOpen(true);
        }
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
                            onClick={() => handleDelete(file.id, file.url)}
                        >
                            Xóa
                        </Button>
                    </ListItem>
                ))}
            </List>

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <MuiAlert 
                    elevation={6} 
                    variant="filled" 
                    onClose={handleCloseSnackbar} 
                    severity={snackbarMessage.includes("Error") ? "error" : "success"}
                >
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </div>
    );
};

export default FileUpload;
