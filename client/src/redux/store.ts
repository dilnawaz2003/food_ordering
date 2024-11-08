import { configureStore } from "@reduxjs/toolkit";
import { uiSlice } from "./ui-slice";
import { userSlice } from "./user-slice";

const store = configureStore({
  reducer: {
    [uiSlice.name]: uiSlice.reducer,
    [userSlice.name]: userSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export { store };
