// NewUser.jsx
import { useState } from "react";
import { http } from "../api/http";
import { DEPARTMENTS } from "constants/departments";

export default function NewUser() {
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    isAdmin: false,
    department: "",
    email: "",
    phone: "",
  });
  const [msg, setMsg] = useState("");

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await http.post("/register", newUser); // protected by requireAdmin
      setMsg("נוצר בהצלחה");
      // optional: clear
      setNewUser({
        username: "",
        password: "",
        isAdmin: false,
        department: "",
        email: "",
        phone: "",
      });
    } catch (err) {
      setMsg(err.response?.data?.message || "שגיאה ביצירת משתמש");
    }
  };

  return (
    <form
      dir="ltr"
      onSubmit={handleSubmit}
      className="space-y-4 max-w-md mx-auto bg-white p-4 rounded shadow"
    >
      <h2 className="text-xl font-semibold">משתמש חדש</h2>

      <label className="block">
        <span className="block mb-1">Username</span>
        <input
          id="username"
          value={newUser.username}
          onChange={handleInputChange}
          required
          className="w-full border rounded p-2"
        />
      </label>

      <label className="block">
        <span className="block mb-1">Password</span>
        <input
          type="password"
          id="password"
          value={newUser.password}
          onChange={handleInputChange}
          required
          minLength={8}
          className="w-full border rounded p-2"
        />
      </label>

      <label className="block">
        <span className="block mb-1">Department</span>
        <select
          id="department"
          value={newUser.department}
          onChange={handleInputChange}
          required
          className="w-full border rounded p-2"
        >
          <option value="" disabled>
            בחר מחלקה
          </option>
          {DEPARTMENTS.map((dep) => (
            <option key={dep} value={dep}>
              {dep}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="block mb-1">Email</span>
        <input
          type="email"
          id="email"
          value={newUser.email}
          onChange={handleInputChange}
          className="w-full border rounded p-2"
        />
      </label>

      <label className="block">
        <span className="block mb-1">Phone</span>
        <input
          type="tel"
          id="phone"
          value={newUser.phone}
          onChange={handleInputChange}
          className="w-full border rounded p-2"
        />
      </label>

      <label className="inline-flex items-center gap-2">
        <input
          type="checkbox"
          id="isAdmin"
          checked={newUser.isAdmin}
          onChange={handleInputChange}
          className="h-4 w-4"
        />
        <span>Admin</span>
      </label>

      <button
        type="submit"
        className="w-full bg-[#1F6231] hover:bg-[#309d49] text-white font-bold py-2 px-4 rounded"
      >
        יצירת משתמש
      </button>

      {msg && <div className="text-center text-sm mt-2">{msg}</div>}
    </form>
  );
}
