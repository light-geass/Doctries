import { createSlice } from "@reduxjs/toolkit";

const doctorAvailabilitySlice = createSlice({
  name: "availability",
  initialState: {
    list: [],
    status: "idle",
    error: null,
  },
  reducers: {
    setAvailability: (state, action) => {
      state.list = action.payload;
      state.status = "succeeded";
    },
  },
});

export const { setAvailability } = doctorAvailabilitySlice.actions;
export default doctorAvailabilitySlice.reducer;
