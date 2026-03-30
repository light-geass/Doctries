import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import insforge from "@/utils/insforge";

// Thunk to fetch all blogs
export const fetchBlogs = createAsyncThunk(
  "blogs/fetchBlogs",
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await insforge.database
        .from("blogs")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const blogsSlice = createSlice({
  name: "blogs",
  initialState: {
    list: [],
    status: "idle", // idle | loading | succeeded | failed
    error: null,
    successMessage: null,
  },
  reducers: {
    clearBlogState: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    resetBlogsStatus: (state) => {
      state.status = "idle";
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearBlogState, resetBlogsStatus } = blogsSlice.actions;
export default blogsSlice.reducer;
