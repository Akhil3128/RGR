import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isSupabaseConfigured, supabase } from "../../lib/supabaseClient";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!isSupabaseConfigured) {
      setMessage("Supabase is not configured. Add .env variables first.");
      return;
    }
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      navigate("/admin", { replace: true });
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f2e8] px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-2xl border border-[#d9c7a6] bg-white p-6 shadow"
      >
        <h1 className="text-2xl font-bold text-[#6e1f2b]">Admin Login</h1>
        <p className="mt-2 text-sm text-slate-600">
          Secure login for Ranganayaki Godavari Ruchulu dashboard
        </p>

        <div className="mt-5 space-y-3">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Admin email"
            required
            className="w-full rounded-lg border border-[#d9c7a6] px-3 py-2"
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full rounded-lg border border-[#d9c7a6] px-3 py-2"
          />
          <button
            disabled={loading}
            className="w-full rounded-lg bg-[#214632] px-4 py-2 font-semibold text-white hover:bg-[#1a3527] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
          {message ? <p className="text-sm text-[#6e1f2b]">{message}</p> : null}
          {!isSupabaseConfigured ? (
            <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
              Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> in{" "}
              <code>.env</code> to enable admin login.
            </p>
          ) : null}
        </div>
      </form>
    </div>
  );
}
