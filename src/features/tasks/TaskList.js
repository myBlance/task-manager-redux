import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeTask } from "./taskSlice";
import { Button, List, ListItem, ListItemText } from "@mui/material";

const TaskList = () => {
    const tasks = useSelector((state) => state.tasks.tasks);
    const dispatch = useDispatch();

    return (
        <List>
            {tasks.map((task) => (
                <ListItem key={task.id}>
                <ListItemText primary={task.title}  />
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
