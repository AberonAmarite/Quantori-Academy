import { combineReducers, configureStore } from '@reduxjs/toolkit';
import taskReducer from './taskSlice';

const rootReducer = combineReducers({
  tasks: taskReducer
});

const store = configureStore({
  reducer: rootReducer
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store;