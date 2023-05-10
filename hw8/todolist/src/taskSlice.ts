import { createSlice } from "@reduxjs/toolkit";
import { AppThunk } from "./store";
import { Task } from "./interfaces/Task";

interface TasksState {
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

export const fetchTasks = (): AppThunk => async (dispatch) => {
    const response = await fetch("http://localhost:3004/tasks");
    const tasks: Task[] = await response.json();
    dispatch(setTasks(tasks));
  };

export default tasksSlice.reducer;
