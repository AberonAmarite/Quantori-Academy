import { combineReducers, configureStore } from '@reduxjs/toolkit';
import taskReducer from './taskSlice';

const rootReducer = combineReducers({
  tasks: taskReducer
});

const store = configureStore({
  reducer: rootReducer
});

export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store;