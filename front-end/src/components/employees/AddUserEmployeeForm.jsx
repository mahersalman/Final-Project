import React, { useState } from "react";
import { http } from "../../api/http";
import DepartmentDropdown from "../DepartmentDropdown";
import StationSelector from "../StationSelector";
import StatusDropdown from "./StatusDropdown";

export default function AddUserEmployeeForm({ onClose, onCreated }) {
  const [form, setForm] = useState({
    person_id: "",
    username: "",
    first_name: "",
    last_name: "",
    password: "", // optional; backend can generate if blank
    isAdmin: false,
    department: "",
    email: "",
    phone: "",
    role: "Employee",
    status: "פעיל",
  });

  const [stations, setStations] = useState([]);
  const [stationAverages, setStationAverages] = useState({});
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  // NEW: success state (and data to show)
  const [createdUser, setCreatedUser] = useState(null);

  const onChange = (e) => {
    const { id, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [id]: type === "checkbox" ? checked : value }));
  };

  const generatePassword = (length = 12) => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let pwd = "";
    for (let i = 0; i < length; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pwd;
  };

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setBusy(true);
    try {
      const payload = {
        person_id: form.person_id.trim(),
        username: form.username.trim() || form.person_id.trim(),
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        password: form.password.trim(), // can be empty (backend may generate)
        isAdmin: form.isAdmin,
        department: form.department,
        email: form.email.trim(),
        phone: form.phone.trim(),
        role: form.role,
        status: form.status,
      };

      const res = await http.post("/register", payload); // protected (admin)
      const created = res.data?.user;

      // Post qualifications if any
      if (created?.person_id && Object.keys(stationAverages).length) {
        const requests = Object.entries(stationAverages).map(([station, avg]) =>
          http.post("/qualifications", {
            person_id: created.person_id,
            station_name: station,
            avg: parseFloat(avg),
          })
        );
        await Promise.all(requests);
      }

      setMsg("נוצר בהצלחה");
      setCreatedUser({
        ...created,
        // expose what operator just entered (useful if backend generated it, this may be empty)
        username: created?.username ?? payload.username,
        tempPassword: form.password || "(נוצרה סיסמה אוטומטית/נשלחה במייל)",
      });
      onCreated?.(created);
    } catch (err) {
      setMsg(err?.response?.data?.message || "שגיאה ביצירת משתמש");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-xl rounded-lg shadow-lg flex flex-col max-h-[90vh]">
        <h2 className="text-xl sm:text-2xl font-bold p-6 pb-0">
          הוספת עובד/משתמש
        </h2>

        <div className="overflow-y-auto flex-grow p-6 pt-4">
          {/* SUCCESS VIEW */}
          {createdUser ? (
            <div className="space-y-4">
              <div className="rounded-lg border p-4 bg-green-50 text-green-800">
                <div className="font-semibold mb-1">נוצר בהצלחה</div>
                <div className="text-sm">
                  המשתמש נוצר במערכת. להלן פרטים עיקריים:
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border rounded-lg p-3">
                  <div className="text-sm text-gray-500">person_id</div>
                  <div className="font-semibold break-words">
                    {createdUser.person_id || "-"}
                  </div>
                </div>
                <div className="border rounded-lg p-3">
                  <div className="text-sm text-gray-500">Username</div>
                  <div className="font-semibold break-words">
                    {createdUser.username || "-"}
                  </div>
                </div>
                <div className="border rounded-lg p-3">
                  <div className="text-sm text-gray-500">שם פרטי</div>
                  <div className="font-semibold break-words">
                    {createdUser.first_name || "-"}
                  </div>
                </div>
                <div className="border rounded-lg p-3">
                  <div className="text-sm text-gray-500">שם משפחה</div>
                  <div className="font-semibold break-words">
                    {createdUser.last_name || "-"}
                  </div>
                </div>
                <div className="border rounded-lg p-3 sm:col-span-2">
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="font-semibold break-words">
                    {createdUser.email || "-"}
                  </div>
                </div>
                <div className="border rounded-lg p-3 sm:col-span-2">
                  <div className="text-sm text-gray-500">סיסמה </div>
                  <div className="font-semibold break-words">
                    {createdUser.tempPassword}
                  </div>
                </div>
              </div>

              {msg && (
                <div
                  className={`rounded px-3 py-2 text-sm ${
                    msg.includes("שגיאה")
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {msg}
                </div>
              )}
            </div>
          ) : (
            // FORM VIEW
            <form
              onSubmit={submit}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {/* Identity */}
              <label className="block">
                <span className="block mb-1 text-sm font-medium">
                  תעודת זהות / person_id
                </span>
                <input
                  id="person_id"
                  value={form.person_id}
                  onChange={onChange}
                  required
                  className="w-full border p-2 rounded text-sm"
                />
              </label>
              <label className="block">
                <span className="block mb-1 text-sm font-medium">Username</span>
                <input
                  id="username"
                  value={form.username}
                  onChange={onChange}
                  placeholder="ברירת מחדל: person_id"
                  className="w-full border p-2 rounded text-sm"
                />
              </label>

              <label className="block">
                <span className="block mb-1 text-sm font-medium">שם פרטי</span>
                <input
                  id="first_name"
                  value={form.first_name}
                  onChange={onChange}
                  required
                  className="w-full border p-2 rounded text-sm"
                />
              </label>
              <label className="block">
                <span className="block mb-1 text-sm font-medium">שם משפחה</span>
                <input
                  id="last_name"
                  value={form.last_name}
                  onChange={onChange}
                  required
                  className="w-full border p-2 rounded text-sm"
                />
              </label>

              {/* Account */}
              <label className="block">
                <span className="block mb-1 text-sm font-medium">Password</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="password"
                    value={form.password}
                    onChange={onChange}
                    className="flex-grow border p-2 rounded text-sm"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setForm((p) => ({ ...p, password: generatePassword(12) }))
                    }
                    className="px-3 py-2 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                  >
                    Generate
                  </button>
                </div>
              </label>
              <label className="inline-flex items-center gap-2 mt-6">
                <input
                  type="checkbox"
                  id="isAdmin"
                  checked={form.isAdmin}
                  onChange={onChange}
                  className="h-4 w-4"
                />
                <span className="text-sm">Admin</span>
              </label>

              {/* Contact */}
              <label className="block">
                <span className="block mb-1 text-sm font-medium">Email</span>
                <input
                  type="email"
                  id="email"
                  value={form.email}
                  onChange={onChange}
                  className="w-full border p-2 rounded text-sm"
                />
              </label>
              <label className="block">
                <span className="block mb-1 text-sm font-medium">Phone</span>
                <input
                  type="tel"
                  id="phone"
                  value={form.phone}
                  onChange={onChange}
                  className="w-full border p-2 rounded text-sm"
                />
              </label>

              {/* Org */}
              <div className="sm:col-span-2">
                <span className="block mb-1 text-sm font-medium">מחלקה</span>
                <DepartmentDropdown
                  value={form.department}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, department: e.target.value }))
                  }
                  className="w-full p-2 text-sm"
                />
              </div>

              <label className="block">
                <span className="block mb-1 text-sm font-medium">סטטוס</span>
                <StatusDropdown
                  value={form.status}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, status: e.target.value }))
                  }
                  className="w-full p-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="block mb-1 text-sm font-medium">תפקיד</span>
                <input
                  id="role"
                  value={form.role}
                  onChange={onChange}
                  className="w-full border p-2 rounded text-sm"
                />
              </label>

              {/* Qualifications */}
              <div className="sm:col-span-2">
                <StationSelector
                  selectedStations={stations}
                  onChange={setStations}
                  onAverageChange={setStationAverages}
                />
              </div>

              {msg && (
                <div
                  className={`sm:col-span-2 rounded px-3 py-2 text-sm ${
                    msg.includes("שגיאה")
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {msg}
                </div>
              )}
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 border-t flex justify-between">
          {/* If success, show only Close button */}
          {createdUser ? (
            <div className="ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-[#1F6231] hover:bg-[#309d49] text-white rounded text-sm font-medium"
              >
                סגור
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 rounded text-sm font-medium hover:bg-gray-400"
              >
                ביטול
              </button>
              <button
                onClick={submit}
                disabled={busy}
                className="px-4 py-2 rounded bg-[#1F6231] text-white text-sm font-medium hover:bg-[#309d49]"
              >
                {busy ? "שומר…" : "יצירת עובד/משתמש"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
