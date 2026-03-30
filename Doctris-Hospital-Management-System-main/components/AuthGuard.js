'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { usePathname, useRouter } from 'next/navigation';

// Define strictly protected routes that require authentication
const PROTECTED_ROUTES = ['/profile', '/scan-upload', '/results', '/appointment'];

// Define routes that only Doctors can access (RBAC)
const DOCTOR_ROUTES = ['/doctor-dashboard', '/prescriptions']; // Future-proofing

export default function AuthGuard({ children }) {
  const { user, status } = useSelector((state) => state.patients);
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // We wait for the initial auth check to finish. 
    // If status is still 'loading' or untouched 'idle' (before first check), we wait.
    if (status === 'loading' || status === 'idle') return;

    const isProtected = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
    const isDoctorRoute = DOCTOR_ROUTES.some(route => pathname.startsWith(route));

    if (isProtected && !user) {
      console.warn('Unauthorized access attempt: Redirecting to login.');
      router.push('/login');
    } else if (isDoctorRoute && user?.user_metadata?.role !== 'doctor') {
      console.warn('Access denied: Doctors only.');
      router.push('/profile'); // Redirect patients away from doctor routes
    } else {
      setIsAuthorized(true);
    }
  }, [user, status, pathname, router]);

  const isProtected = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  
  // Display a loading state while checking protected routes
  if (isProtected && !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="spinner w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-500 tracking-wide">Authenticating securely...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
