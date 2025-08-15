import { useState } from "react";
import { http } from "../api/http";
import Navbar from "../components/Navbar";
import DateTime from "../components/DateTime";

export default function ForgotPassword() {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  const submit = async () => {
    if (!emailOrUsername.trim()) return setMsg("נא להזין אימייל או שם משתמש.");
    try {
      setBusy(true);
      const body = emailOrUsername.includes("@")
        ? { email: emailOrUsername.trim() }
        : { username: emailOrUsername.trim() };
      await http.post("/forgot-password", body);
      setMsg("אם קיים חשבון, שלחנו קישור לאיפוס הסיסמה.");
    } catch {
      // Always generic on purpose
      setMsg("אם קיים חשבון, שלחנו קישור לאיפוס הסיסמה.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <DateTime />
      <div className="max-w-md mx-auto p-4">
        <div className="bg-white rounded-xl shadow p-6">
          <h1 className="text-xl font-bold mb-4">
            Forgot Password / שחזור סיסמה
          </h1>
          <input
            className="w-full rounded-lg border px-3 py-2 mb-3 outline-none focus:ring-2 focus:ring-[#1F6231]"
            placeholder="Email or Username / אימייל או שם משתמש"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
          />
          <button
            onClick={submit}
            disabled={busy}
            className={`w-full px-6 py-2 rounded-lg text-white font-semibold ${
              busy ? "bg-gray-400" : "bg-[#1F6231] hover:bg-[#309d49]"
            }`}
          >
            {busy ? "שולח…" : "Send reset link / שלח קישור איפוס"}
          </button>
          {msg && <div className="mt-3 text-sm text-gray-700">{msg}</div>}
        </div>
      </div>
    </div>
  );
}
