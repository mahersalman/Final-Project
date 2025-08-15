import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import WorkersPage from "./pages/WorkersPage";
import ProductivityPage from "./pages/ProductivityPage";
import StationPage from "./pages/StationPage";
import NewUser from "./components/NewUser";
import Profile from "./components/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/employees" element={<WorkersPage />} />
      <Route path="/productivity" element={<ProductivityPage />} />
      <Route path="/station" element={<StationPage />} />
      <Route path="/my-account" element={<Profile />} />
      <Route path="/admin/new-user" element={<NewUser />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  );
}

export default App;
