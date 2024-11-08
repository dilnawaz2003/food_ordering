import { createSlice } from "@reduxjs/toolkit";

type InitialStateType = {
  showDrawer: boolean;
  showUserModel: boolean;
};

const initialState: InitialStateType = {
  showDrawer: false,
  showUserModel: false,
};
const uiSlice = createSlice({
  name: "uislice",
  initialState: initialState,
  reducers: {
    openDrawer: (state) => {
      state.showDrawer = true;
    },
    closeDrawer: (state) => {
      state.showDrawer = false;
    },

    openUserModel: (state) => {
      state.showUserModel = true;
    },
    closeUserModel: (state) => {
      state.showUserModel = false;
    },
  },
});

export const { openDrawer, closeDrawer, openUserModel, closeUserModel } =
  uiSlice.actions;
export { uiSlice };
