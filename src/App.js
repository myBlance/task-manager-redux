import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { login, logout } from "./features/auth/authSlide";
import { Button, TextField, Container } from "@mui/material";
import TaskForm from "./features/tasks/TaskForm";
import TaskList from "./features/tasks/TaskList";
import FileUpload from "./features/files/FileUpload";

const App = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();

    const handleLogin = () => {
        if (username.trim() !== "") {
            dispatch(login({ username }));
            setUsername("");
        }
    };

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <div>
            {isAuthenticated ? (
                <div>
                    <div style={{ textAlign: "center", marginTop: "20px" }}>
                        <h2>Welcome, {user.username}!</h2>
                        <Button variant="contained" color="secondary" onClick={handleLogout}>
                            Logout
                        </Button>
                    </div>
                    <Container
                        style={{
                            width: "400px",
                            marginTop: "20px",
                            borderRadius: "10px",
                            border: "1px solid #ccc",
                            padding: "20px",
                        }}
                    >
                        <FileUpload />
                    </Container>
                    <Container
                        style={{
                            width: "400px",
                            marginTop: "20px",
                            borderRadius: "10px",
                            border: "1px solid #ccc",
                            padding: "20px",
                        }}
                    >
                        <TaskForm />
                        <TaskList />
                    </Container>
                </div>
            ) : (
                <Container 
                    style={{ 
                        width: "600px",
                        textAlign: "center", 
                        marginTop: "50px",
                        borderRadius: "10px",
                        border: "1px solid #ccc",
                        padding: "20px", 
                    }}
                >
                    <h2>Login</h2>
                    <TextField
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ marginRight: "10px" }}
                    />
                    <TextField
                        label="Password"
                        type="password" // Password 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ marginRight: "10px" }}
                    />
                    <Button variant="contained" color="primary" onClick={handleLogin}>
                        Login
                    </Button>
                </Container>
            )}
        </div>
    );
};

export default App;