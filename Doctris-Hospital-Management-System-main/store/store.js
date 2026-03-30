import { configureStore } from '@reduxjs/toolkit';
import doctorsReducer from '../features/doctors/doctorsSlice';
import patientsReducer from '../features/patients/patientsSlice';
import scansReducer from "../features/scans/scansSlice";
import resultsReducer from "../features/results/resultsSlice";
import doctorAvailabilityReducer from "../features/doctors/doctorAvailabilitySlice";
import blogsReducer from "../features/blogs/blogsSlice";
import uiReducer from "../features/ui/uiSlice";

export const store = configureStore({
  reducer: {
    doctors: doctorsReducer,
    patients: patientsReducer,
    scans: scansReducer,
    results: resultsReducer,
    availability: doctorAvailabilityReducer,
    blogs: blogsReducer,
    ui: uiReducer,
  },
});