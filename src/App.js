import React from "react";
import { Container } from "@mui/material";
import TaskForm from "./features/tasks/TaskForm";
import TaskList from "./features/tasks/TaskList";

const App = () => {
    return (
        <div>
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
    );
};

export default App;
