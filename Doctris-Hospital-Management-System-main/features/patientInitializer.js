'use client';

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserSession, fetchPatientProfile, setLoading, setError } from "@/features/patients/patientsSlice";
import insforge from "@/utils/insforge";

const PatientInitializer = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.patients.user);

  // Restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      dispatch(setLoading()); // Trigger loading state
      const { data, error } = await insforge.auth.getCurrentSession();
      if (data?.session) {
        dispatch(setUserSession({
          user: data.session.user,
          session: { accessToken: data.session.accessToken },
        }));
      } else {
        dispatch(setError('No active session'));
      }
    };
    restoreSession();
  }, [dispatch]);

  // Once user is set, fetch patient profile from DB using thunk
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchPatientProfile(user.id));
    }
  }, [dispatch, user?.id]);

  return null;
};

export default PatientInitializer;
