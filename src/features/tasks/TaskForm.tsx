import { Button, TextField } from "@mui/material";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store"; 
import { addTask } from "./taskSlice";

const TaskForm: React.FC = () => {
  const [title, setTitle] = useState<string>(""); 
  const dispatch = useDispatch<AppDispatch>(); 

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (title.trim() === "") return;

    dispatch(addTask({ id: Date.now(), title })); 
    setTitle(""); 
  };

  // Handle input change
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: "50px" }}>
      <TextField
        label="Nhập công việc"
        variant="outlined"
        value={title}
        onChange={handleChange} 
      />
      <Button type="submit" variant="contained" color="primary">
        Thêm
      </Button>
    </form>
  );
};

export default TaskForm;