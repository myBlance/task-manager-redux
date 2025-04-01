import { createSlice } from "@reduxjs/toolkit";

// Lấy danh sách công việc từ localStorage
const loadTasksFromLocalStorage = () => {
  const savedTasks = localStorage.getItem("tasks");
  return savedTasks ? JSON.parse(savedTasks) : [];
};

const initialState = {
  tasks: loadTasksFromLocalStorage(), // Khởi tạo từ localStorage
};

// Tạo slice cho tasks
const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.tasks.push(action.payload);
      localStorage.setItem("tasks", JSON.stringify(state.tasks)); // Lưu vào localStorage
    },    
    updateTask: (state, action) => {
      const index = state.tasks.findIndex((task) => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = {
          ...state.tasks[index], // Keep existing properties
          ...action.payload, // Overwrite with new properties
        };
      }
      localStorage.setItem("tasks", JSON.stringify(state.tasks)); // Persist changes
    },
    removeTask: (state, action) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      localStorage.setItem("tasks", JSON.stringify(state.tasks));
    },
  },
});

export const { addTask, updateTask, removeTask, } = taskSlice.actions;
export default taskSlice.reducer;
