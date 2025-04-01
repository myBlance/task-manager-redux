import React, { useState } from "react";
import { Button, Container, TextField, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "./features/auth/authSlice";
import FileUpload from "./features/files/FileUpload";
import TaskForm from "./features/tasks/TaskForm";
import TaskList from "./features/tasks/TaskList";
import { AppDispatch, RootState } from "./app/store";

interface User {
  username: string;
}

const App: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.auth.user) as User | null;
  const dispatch = useDispatch<AppDispatch>();

  const handleLogin = () => {
    if (username.trim() && password.trim()) {
      dispatch(login({ username, password }));
      setUsername("");
      setPassword("");
    }
  };

  const handleLogout = () => dispatch(logout());

  return (
    <Container maxWidth="sm" style={{ marginTop: "50px", textAlign: "center" }}>
      {isAuthenticated ? (
        <>
          <Typography variant="h4" gutterBottom>Welcome, {user?.username || "Guest"}!</Typography>
          <Button variant="contained" color="secondary" onClick={handleLogout} sx={{ mb: 2 }}>
            Logout
          </Button>
          <Container sx={containerStyle}>
            <FileUpload />
          </Container>
          <Container sx={containerStyle}>
            <TaskForm />
            <TaskList />
          </Container>
        </>
      ) : (
        <Container sx={containerStyle}>
          <Typography variant="h4" gutterBottom>Login</Typography>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 2, width: "100%" }}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2, width: "100%" }}
          />
          <Button variant="contained" color="primary" onClick={handleLogin}>
            Login
          </Button>
        </Container>
      )}
    </Container>
  );
};

const containerStyle = {
  mt: 2,
  p: 2,
  border: "1px solid #ccc",
  borderRadius: "10px",
  textAlign: "center",
};

export default App;
