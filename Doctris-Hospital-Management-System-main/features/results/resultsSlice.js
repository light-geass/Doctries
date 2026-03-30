import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import insforge from "@/utils/insforge";

export const fetchScanResults = createAsyncThunk(
  "results/fetchScanResults",
  async (userId, { rejectWithValue }) => {
    try {
      const { data, error } = await insforge.database
        .from('scan_results')
        .select('*, scans(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchResultById = createAsyncThunk(
  "results/fetchResultById",
  async (id, { rejectWithValue }) => {
    try {
      const { data, error } = await insforge.database
        .from('scan_results')
        .select('*, scans(*)')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const resultsSlice = createSlice({
  name: "results",
  initialState: {
    items: [],
    selectedResult: null,
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {
    clearSelectedResult: (state) => {
      state.selectedResult = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchScanResults.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchScanResults.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchScanResults.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchResultById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchResultById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedResult = action.payload;
      })
      .addCase(fetchResultById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearSelectedResult } = resultsSlice.actions;
export default resultsSlice.reducer;
