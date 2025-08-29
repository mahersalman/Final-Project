import Navbar from "@components/Navbar";
import DateTime from "@components/DateTime";
import UpdatesCards from "@components/UpdatesCards";
const HomePage = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <DateTime />
      <UpdatesCards />
    </div>
  );
};

export default HomePage;
