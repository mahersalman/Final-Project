// src/pages/ResetPassword.tsx
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { http } from "../api/http";
import Navbar from "../components/Navbar";
import DateTime from "../components/DateTime";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = params.get("token") || "";
  const uid = params.get("uid") || "";

  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if (!token || !uid) setMsg("קישור לא תקין.");
  }, [token, uid]);

  const submit = async () => {
    if (!token || !uid) return;
    if (pwd.length < 6)
      return setMsg("הסיסמה חייבת להיות באורך 6 תווים לפחות.");
    if (pwd !== confirm) return setMsg("הסיסמאות אינן תואמות.");
    try {
      setBusy(true);
      await http.post("/reset-password", { uid, token, newPassword: pwd });
      setMsg("הסיסמה עודכנה בהצלחה. מעביר לעמוד ההתחברות…");
      setTimeout(() => navigate("/login"), 1500);
    } catch (e) {
      setMsg(e?.response?.data?.message || "הקישור לא תקף או פג תוקף.");
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
            Reset Password / איפוס סיסמה
          </h1>
          <input
            type="password"
            className="w-full rounded-lg border px-3 py-2 mb-3 outline-none focus:ring-2 focus:ring-[#1F6231]"
            placeholder="סיסמה חדשה"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
          />
          <input
            type="password"
            className="w-full rounded-lg border px-3 py-2 mb-3 outline-none focus:ring-2 focus:ring-[#1F6231]"
            placeholder="אשר סיסמה"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          <button
            onClick={submit}
            disabled={busy || !token || !uid}
            className={`w-full px-6 py-2 rounded-lg text-white font-semibold ${
              busy ? "bg-gray-400" : "bg-[#1F6231] hover:bg-[#309d49]"
            }`}
          >
            {busy ? "מעדכן…" : "Set new password / קבע סיסמה"}
          </button>
          {msg && <div className="mt-3 text-sm text-gray-700">{msg}</div>}
        </div>
      </div>
    </div>
  );
}
