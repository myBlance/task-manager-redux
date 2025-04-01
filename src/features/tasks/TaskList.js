import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeTask, updateTask } from "./taskSlice";
import { Button, List, ListItem, ListItemText, TextField } from "@mui/material";

const TaskList = () => {
    const tasks = useSelector((state) => state.tasks.tasks);
    const dispatch = useDispatch();

    const [editingIndex, setEditingIndex] = useState(null); 
    const [taskTitle, setTaskTitle] = useState(""); 

    const editTask = (index) => {
        setEditingIndex(index);
        setTaskTitle(tasks[index].title); 
    };

    // Save updated task
    const saveTask = (id) => {
        dispatch(updateTask({ id, title: taskTitle })); 
        setEditingIndex(null); 
        setTaskTitle(""); 
    };

    return (
        <List>
            {tasks.map((task, index) => (
                <ListItem key={task.id}>
                    {editingIndex === index ? (
                        <TextField
                            value={taskTitle}
                            onChange={(e) => setTaskTitle(e.target.value)}
                            onBlur={() => saveTask(task.id)} 
                            autoFocus
                        />
                    ) : (
                        <ListItemText primary={task.title} />
                    )}
                    <Button
                        sx={{ margin: "10px" }}
                        variant="contained"
                        color="primary"
                        onClick={() => editTask(index)}
                    >
                        Sửa
                    </Button>
                    
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => dispatch(removeTask(task.id))}
                    >
                        Xóa
                    </Button>
                </ListItem>
            ))}
        </List>
    );
};

export default TaskList;