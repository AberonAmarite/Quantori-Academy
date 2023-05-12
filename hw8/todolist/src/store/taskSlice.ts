import { createSlice } from "@reduxjs/toolkit";
import { Task } from "../interfaces/Task";

export interface TasksState {
  tasks: Task[];
  modalType: string;
  modalVisibility: boolean;
  currentTaskId: number;
  }

const initialState: TasksState = {
  tasks: [],
  modalType: "Add Task",
  modalVisibility: false,
  currentTaskId: -1
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
      editTask: (state, action) => {
        const updatedTask = action.payload;
        state.tasks = state.tasks.map((task) =>
          task.id === state.currentTaskId ? updatedTask : task
        );
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
      setModalType: (state, action) => {
        state.modalType = action.payload;
      },
      toggleModalVisibility: (state) => {
        state.modalVisibility = !state.modalVisibility;
      },
      setCurrentTaskId: (state, action) => {
        state.currentTaskId = action.payload;
      },
    },
  });

  export const { setTasks, addTask, deleteTask, completeTask, setModalType, toggleModalVisibility, editTask, setCurrentTaskId } = tasksSlice.actions;

  export default tasksSlice.reducer;