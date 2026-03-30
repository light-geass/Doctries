import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import insforge from "@/utils/insforge";
import { uploadAndAnalyzeScan } from "@/actions/scan-action";

export const uploadScanThunk = createAsyncThunk(
  "scans/uploadScan",
  async ({ file, userId, patientData }, { rejectWithValue }) => {
    try {
      const result = await uploadAndAnalyzeScan(file, userId, patientData);
      return result;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchUserScans = createAsyncThunk(
  "scans/fetchUserScans",
  async (userId, { rejectWithValue }) => {
    try {
      const { data, error } = await insforge.database
        .from('scans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const scansSlice = createSlice({
  name: "scans",
  initialState: {
    items: [],
    uploadStatus: "idle", // idle | loading | succeeded | failed
    fetchStatus: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadScanThunk.pending, (state) => {
        state.uploadStatus = "loading";
      })
      .addCase(uploadScanThunk.fulfilled, (state, action) => {
        state.uploadStatus = "succeeded";
        // Optionally add to items list
        state.items.unshift({ id: action.payload.scanId, status: 'completed' });
      })
      .addCase(uploadScanThunk.rejected, (state, action) => {
        state.uploadStatus = "failed";
        state.error = action.payload;
      })
      .addCase(fetchUserScans.pending, (state) => {
        state.fetchStatus = "loading";
      })
      .addCase(fetchUserScans.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchUserScans.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.error = action.payload;
      });
  },
});

export default scansSlice.reducer;
