import { Button, List, ListItem, ListItemText, TextField } from "@mui/material";
import React, { ChangeEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { removeTask, updateTask } from "./taskSlice";

interface Task {
  id: number;
  title: string;
}

const TaskList: React.FC = () => {
  const tasks = useSelector((state: RootState) => state.tasks.tasks); 
  const dispatch = useDispatch<AppDispatch>(); 
  const [editingIndex, setEditingIndex] = useState<number | null>(null); 
  const [taskTitle, setTaskTitle] = useState<string>(""); 

  // Start editing task
  const editTask = (index: number) => {
    setEditingIndex(index);
    setTaskTitle(tasks[index].title); 
  };

  // Save updated task
  const saveTask = (id: number) => {
    dispatch(updateTask({ id, title: taskTitle })); 
    setEditingIndex(null); 
    setTaskTitle(""); 
  };

  return (
    <List>
      {tasks.map((task: Task, index: number) => (
        <ListItem key={task.id}>
          {editingIndex === index ? (
            <TextField
              value={taskTitle}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setTaskTitle(e.target.value)}
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