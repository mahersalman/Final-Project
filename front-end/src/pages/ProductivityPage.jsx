import ShlokerCheck from "@components/reports/ShlokerCheck";
import Navbar from "@components/Navbar";
import ReportGenerator from "@components/reports/ReportGenerator";

const ProductivityPage = () => {
  return (
    <div>
      <Navbar />
      <ShlokerCheck />
      <ReportGenerator />
    </div>
  );
};

export default ProductivityPage;
