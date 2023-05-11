import { createSlice } from "@reduxjs/toolkit";
import { Task } from "../interfaces/Task";

export interface TasksState {
    tasks: Task[];
  }

const initialState: TasksState = {
    tasks: [],
  };
  
  const tasksSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
        setTasks: (state, action) => {
        state.tasks = action.payload;
      },
      addTask: (state, action) => {
        state.tasks.push(action.payload);
      },
      deleteTask: (state, action) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload.id);
      },
      completeTask: (state, action) => {
        const task = state.tasks.find((task) => task.id === action.payload.id);
        if (task) {
          task.isCompleted = true;
        }
      },
    },
  });

  export const { setTasks, addTask, deleteTask, completeTask } = tasksSlice.actions;

  export default tasksSlice.reducer;