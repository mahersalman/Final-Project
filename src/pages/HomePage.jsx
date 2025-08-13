import Navbar from "../components/Navbar";
import DateTime from "../components/DateTime";
import UpdatesCards from "../components/UpdatesCards";
import { useNavigate } from "react-router-dom";
import { useMe } from "../hooks/useMe";
const HomePage = () => {
  const { me } = useMe();
  const navigate = useNavigate();
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <DateTime />
      <UpdatesCards />

      {me?.isAdmin && (
        <div className="p-4 flex justify-center">
          <button
            onClick={() => navigate("/admin/new-user")}
            className="px-6 py-3 bg-[#1F6231] hover:bg-[#309d49] text-white font-bold rounded-lg"
          >
            יצירת משתמש חדש
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
