import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserType = {
  auth0Id: string;
  email: string;
  name?: string;
  city?: string;
  addressLine1?: string;
};

const initialState = {
  user: <UserType>{},
};

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserType>) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;
export { userSlice };
