import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import CustomerPage from "./components/customer/CustomerPage";
import AdminLogin from "./components/admin/AdminLogin";
import AdminDashboard from "./components/admin/AdminDashboard";
import { isSupabaseConfigured, supabase } from "./lib/supabaseClient";

export default function App() {
  const [session, setSession] = useState(null);
  const [loadingSession, setLoadingSession] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoadingSession(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoadingSession(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loadingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f2e8] text-[#6e1f2b]">
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<CustomerPage />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminDashboard session={session} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
