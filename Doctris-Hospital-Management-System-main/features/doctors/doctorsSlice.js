import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import insforge from "@/utils/insforge";

// Thunk to fetch all doctors
export const fetchDoctors = createAsyncThunk(
  "doctors/fetchDoctors",
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await insforge.database
        .from("doctors")
        .select("*");
      if (error) throw error;
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const doctorsSlice = createSlice({
  name: "doctors",
  initialState: {
    doctorsList: [],
    selectedDoctor: null,
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {
    setSelectedDoctor: (state, action) => {
      state.selectedDoctor = action.payload;
    },
    resetDoctorsStatus: (state) => {
      state.status = "idle";
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctors.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.doctorsList = action.payload;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setSelectedDoctor, resetDoctorsStatus } = doctorsSlice.actions;
export default doctorsSlice.reducer;
