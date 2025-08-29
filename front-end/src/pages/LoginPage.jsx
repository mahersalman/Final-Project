import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { http } from "../api/http";

const LoginPage = () => {
  // login form
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // forgot-password form
  const [forgotPasswordSection, setForgotPasswordSection] = useState(false);
  const [email, setEmail] = useState("");

  // UI state
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const [busy, setBusy] = useState(false);

  const navigate = useNavigate();

  const resetMessages = () => {
    setError(null);
    setInfo(null);
  };

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    resetMessages();
    setBusy(true);

    try {
      const { data } = await http.post("/login", { username, password });
      if (data?.success && data?.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user || {}));
        navigate("/home");
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message || "An error occurred during login"
      );
    } finally {
      setBusy(false);
    }
  };

  const handleToggleForgot = () => {
    if (busy) return; // avoid toggling while sending
    resetMessages();
    setForgotPasswordSection((v) => !v);
  };

  const handleSubmitForgotPassword = async () => {
    resetMessages();

    // Basic email validation
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email.trim())) {
      setError("Email is not legal");
      return;
    }

    setBusy(true);
    try {
      const response = await http.post("/forgot-password", {
        email: email.trim(),
      });

      if (response.data?.success) {
        setInfo(
          response.data.message || "Check your email for the new password."
        );
      } else {
        setError(response.data?.message || "Something went wrong.");
      }
    } catch (e) {
      setError(e?.response?.data?.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url('/loginPic.jpg')` }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="z-10 max-w-md w-full mx-auto p-8 bg-white bg-opacity-90 rounded-lg shadow-lg">
        {forgotPasswordSection ? (
          <>
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
              שחזור סיסמה
            </h2>

            {error && (
              <div className="mb-4 rounded-lg px-4 py-3 text-sm bg-red-100 text-red-800">
                {error}
              </div>
            )}
            {info && (
              <div className="mb-4 rounded-lg px-4 py-3 text-sm bg-green-100 text-green-800">
                {info}
              </div>
            )}

            <div className="mb-4 w-full">
              <label className="block text-gray-700 text-sm font-bold mb-2 text-center">
                אימייל
              </label>
              <input
                type="email"
                id="email"
                value={email}
                disabled={busy}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="הכנס את האימייל שלך"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <button
              onClick={handleSubmitForgotPassword}
              disabled={busy}
              className={`w-full text-white font-bold py-2 px-4 rounded-lg mb-4 ${
                busy
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-700"
              }`}
            >
              {busy ? "שולח…" : "שלח"}
            </button>

            <button
              type="button"
              onClick={handleToggleForgot}
              className="w-full text-blue-500 hover:text-blue-700"
              disabled={busy}
            >
              חזור
            </button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
              התחברות
            </h2>

            {error && (
              <div className="mb-4 rounded-lg px-4 py-3 text-sm bg-red-100 text-red-800">
                {error}
              </div>
            )}
            {info && (
              <div className="mb-4 rounded-lg px-4 py-3 text-sm bg-green-100 text-green-800">
                {info}
              </div>
            )}

            <form
              onSubmit={handleSubmitLogin}
              className="flex flex-col items-center"
            >
              <div className="mb-4 w-full">
                <label className="block text-gray-700 text-sm font-bold mb-2 text-center">
                  שם משתמש
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={busy}
                  placeholder="הכנס את שם המשתמש שלך"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="mb-6 w-full">
                <label className="block text-gray-700 text-sm font-bold mb-2 text-center">
                  סיסמה
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={busy}
                  placeholder="הכנס את הסיסמה שלך"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={busy}
                className={`w-full text-white font-bold py-2 px-4 rounded-lg mb-4 ${
                  busy
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-700"
                }`}
              >
                {busy ? "מתחבר…" : "התחברות"}
              </button>
            </form>

            <button
              type="button"
              onClick={handleToggleForgot}
              className="w-full text-blue-500 hover:text-blue-700"
              disabled={busy}
            >
              שכחת סיסמה?
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
