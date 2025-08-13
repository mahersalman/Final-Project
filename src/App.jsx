import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import WorkersPage from "./pages/WorkersPage";
import ProductivityPage from "./pages/ProductivityPage";
import StationPage from "./pages/StationPage";
import NewUser from "./components/NewUser";
function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/employees" element={<WorkersPage />} />
      <Route path="/productivity" element={<ProductivityPage />} />
      <Route path="/station" element={<StationPage />} />
      <Route path="/admin/new-user" element={<NewUser />} />
    </Routes>
  );
}

export default App;
