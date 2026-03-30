import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import insforge from "@/utils/insforge";

// --- Async Thunks ---

/**
 * Register a new patient
 * 1. Auth SignUp
 * 2. Create entry in 'patients' table
 */
export const registerPatient = createAsyncThunk(
  "patients/registerPatient",
  async ({ email, password, firstName, lastName }, { rejectWithValue }) => {
    try {
      const { data, error } = await insforge.auth.signUp({
        email,
        password,
        name: `${firstName} ${lastName}`,
      });

      if (error) throw error;

      if (data?.user?.id) {
        // Create initial patient record
        const { error: dbError } = await insforge.database
          .from("patients")
          .insert({
            user_id: data.user.id,
            first_name: firstName,
            last_name: lastName,
          });
        if (dbError) console.error("Database insert error:", dbError);
      }

      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/**
 * Login patient
 * 1. Auth SignIn
 * 2. Result returns session + user
 */
export const loginPatient = createAsyncThunk(
  "patients/loginPatient",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data, error } = await insforge.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/**
 * Fetch basic profile from 'patients' table
 */
export const fetchPatientProfile = createAsyncThunk(
  "patients/fetchPatientProfile",
  async (userId, { rejectWithValue }) => {
    try {
      const { data, error } = await insforge.database
        .from("patients")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/**
 * Fetch complex medical data from 'patient_medical_data' table
 */
export const fetchPatientMedicalData = createAsyncThunk(
  "patients/fetchPatientMedicalData",
  async (userId, { rejectWithValue }) => {
    try {
      if (!userId) throw new Error("No user ID provided");
      const { data, error } = await insforge.database
        .from("patient_medical_data")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/**
 * Logout
 */
export const logoutPatientAction = createAsyncThunk(
  "patients/logout",
  async (_, { dispatch }) => {
    await insforge.auth.signOut();
    dispatch(patientSlice.actions.resetState());
  }
);

const initialState = {
  user: null,
  session: null,
  patient: null,       // Profile from 'patients'
  medicalData: null,   // Medical history from 'patient_medical_data'
  status: "idle",      // auth status: idle | loading | succeeded | failed
  profileStatus: "idle",
  medicalStatus: "idle",
  error: null,
};

const patientSlice = createSlice({
  name: "patients",
  initialState,
  reducers: {
    setUserSession: (state, action) => {
      state.user = action.payload.user;
      state.session = action.payload.session;
      state.status = "succeeded";
      state.error = null;
    },
    resetState: () => initialState,
    setLoading: (state) => {
      state.status = "loading";
    },
    setError: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerPatient.pending, (state) => {
        state.status = "loading";
      })
      .addCase(registerPatient.fulfilled, (state, action) => {
        state.status = "succeeded";
        // data.user and data.accessToken (if not requiring verification)
        if (action.payload?.user) {
          state.user = action.payload.user;
          state.session = { accessToken: action.payload.accessToken };
        }
        state.error = null;
      })
      .addCase(registerPatient.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Login
      .addCase(loginPatient.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginPatient.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.session = { accessToken: action.payload.accessToken };
        state.error = null;
      })
      .addCase(loginPatient.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Profile
      .addCase(fetchPatientProfile.pending, (state) => {
        state.profileStatus = "loading";
      })
      .addCase(fetchPatientProfile.fulfilled, (state, action) => {
        state.profileStatus = "succeeded";
        state.patient = action.payload;
      })
      .addCase(fetchPatientProfile.rejected, (state, action) => {
        state.profileStatus = "failed";
      })
      // Medical Data
      .addCase(fetchPatientMedicalData.pending, (state) => {
        state.medicalStatus = "loading";
      })
      .addCase(fetchPatientMedicalData.fulfilled, (state, action) => {
        state.medicalStatus = "succeeded";
        state.medicalData = action.payload;
      })
      .addCase(fetchPatientMedicalData.rejected, (state, action) => {
        state.medicalStatus = "failed";
      });
  },
});

export const { setUserSession, resetState, setLoading, setError } = patientSlice.actions;
export default patientSlice.reducer;
