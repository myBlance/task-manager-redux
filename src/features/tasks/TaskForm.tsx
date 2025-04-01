import { Button, TextField } from "@mui/material";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store"; // Import AppDispatch for typed dispatch
import { addTask } from "./taskSlice";

const TaskForm: React.FC = () => {
  const [title, setTitle] = useState<string>(""); // Typed state for the task title
  const dispatch = useDispatch<AppDispatch>(); // Typed useDispatch

  // Handle form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (title.trim() === "") return;

    dispatch(addTask({ id: Date.now(), title })); // Dispatch the addTask action
    setTitle(""); // Clear the input field
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
        onChange={handleChange} // Use the typed handleChange function
      />
      <Button type="submit" variant="contained" color="primary">
        Thêm
      </Button>
    </form>
  );
};

export default TaskForm;