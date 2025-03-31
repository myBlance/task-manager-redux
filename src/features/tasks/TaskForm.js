import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addTask } from "./taskSlice";
import { TextField, Button } from "@mui/material";

const TaskForm = () => {
  const [title, setTitle] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() === "") return;
    dispatch(addTask({ id: Date.now(), title }));
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: "50px" }}>
      <TextField
        label="Nhập công việc"
        variant="outlined"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Button type="submit" variant="contained" color="primary">
        Thêm
      </Button>
    </form>
  );
};

export default TaskForm;
