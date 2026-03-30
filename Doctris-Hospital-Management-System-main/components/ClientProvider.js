'use client';

import { usePathname } from 'next/navigation';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import Header from '@/components/header';
import Footer from '@/components/footer';
import PatientInitializer from '@/features/patientInitializer';
import GlobalChatbot from '@/components/GlobalChatbot';
import ToastContainer from '@/components/ToastContainer';
import AuthGuard from '@/components/AuthGuard';

export default function ClientProvider({ children }) {
  const pathname = usePathname();
  const hideHeaderFooter = pathname === '/login' || pathname === '/register';

  return (
    <Provider store={store}>
      <PatientInitializer /> 
      {!hideHeaderFooter && <Header />}
      <AuthGuard>
        {children}
      </AuthGuard>
      {!hideHeaderFooter && <GlobalChatbot />}
      {!hideHeaderFooter && <Footer />}
    </Provider>
  );
}
