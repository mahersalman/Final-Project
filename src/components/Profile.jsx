// src/pages/Profile.tsx
import Navbar from "../components/Navbar";
import DateTime from "../components/DateTime";
import { useMe } from "../hooks/useMe";
import { useState } from "react";
import { http } from "../api/http";

export default function Profile() {
  const { me, loading } = useMe();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordBusy, setPasswordBusy] = useState(false);

  const [message, setMessage] = useState(null);

  const notify = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleUpdatePassword = async () => {
    if (newPassword.length < 6)
      return notify("error", "הסיסמה חייבת להיות באורך 6 תווים לפחות.");
    if (newPassword !== confirmPassword)
      return notify("error", "הסיסמאות אינן תואמות.");

    try {
      setPasswordBusy(true);
      await http.put("/me/password", { newPassword }); // backend: router.put("/me/password")
      notify("success", "הסיסמה עודכנה בהצלחה.");
      setNewPassword("");
      setConfirmPassword("");
    } catch (e) {
      if (e?.response?.status === 401) {
        notify("error", "התחבר מחדש.");
        // e.g., navigate("/login");
      } else {
        notify("error", e?.response?.data?.message || "שגיאה בעדכון סיסמה.");
      }
    } finally {
      setPasswordBusy(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <DateTime />

      <div className="max-w-3xl mx-auto p-4">
        {message && (
          <div
            className={`mb-4 rounded-lg px-4 py-3 text-sm ${
              message.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-xl shadow p-6">
          <h1 className="text-2xl font-bold mb-4">
            Account Settings / הגדרות חשבון
          </h1>

          {loading ? (
            <div className="text-gray-500">טוען פרופיל…</div>
          ) : !me ? (
            <div className="text-red-600">לא נטען משתמש.</div>
          ) : (
            <>
              {/* Read-only profile info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="border rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">
                    First name / שם פרטי
                  </div>
                  <div className="font-semibold">{me.first_name || "-"}</div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">
                    Last name / שם משפחה
                  </div>
                  <div className="font-semibold">{me.last_name || "-"}</div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">
                    Username / שם משתמש
                  </div>
                  <div className="font-semibold">{me.username}</div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">
                    Department / מחלקה
                  </div>
                  <div className="font-semibold">{me.department || "-"}</div>
                </div>
              </div>

              {/* Email */}
              <div className="mb-6">
                <div className="border rounded-lg p-4 w-full">
                  <div className="text-sm text-gray-500 mb-1">Email / מייל</div>
                  <div className="font-semibold break-words">{me.email}</div>
                </div>
              </div>

              {/* Password change */}
              <div>
                <div className="mb-2">
                  <span className="text-base font-semibold">
                    Password / סיסמה
                  </span>
                </div>
                <div className="text-sm grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input
                    type="password"
                    className="rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-[#1F6231]"
                    placeholder="סיסמה חדשה"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <input
                    type="password"
                    className="rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-[#1F6231]"
                    placeholder="אשר סיסמה"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    onClick={handleUpdatePassword}
                    disabled={passwordBusy}
                    className={`px-6 py-2 rounded-lg text-white font-semibold ${
                      passwordBusy
                        ? "bg-gray-400"
                        : "bg-[#1F6231] hover:bg-[#309d49]"
                    }`}
                  >
                    {passwordBusy ? "מעדכן…" : "Change Password / עדכן סיסמה"}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">מינימום 6 תווים.</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
