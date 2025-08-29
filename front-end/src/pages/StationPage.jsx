import { useState } from "react";
import Navbar from "@components/Navbar";
import StationItem from "@components/stations/StationItem";
import AssignmentComp from "@components/stations/AssinmentComp";
import { useMe } from "@hooks/useMe";

const StationPage = () => {
  const [selectedStation, setSelectedStation] = useState(null);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const { me } = useMe();
  const isAdmin = !!me?.isAdmin;

  return (
    <div>
      <Navbar />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "2px",
          height: "90vh",
        }}
      >
        <div
          style={{
            flex: "1",
            background: "#f0f0f0",
            padding: "20px",
            overflowY: "auto",
          }}
        >
          <StationItem
            onSelectStation={setSelectedStation}
            onAssignmentButtonClick={() => setShowAssignmentForm(true)}
            isAdmin={isAdmin}
          />
        </div>
        <div
          style={{
            flex: "3",
            background: "#e0e0e0",
            padding: "20px",
            overflowY: "auto",
          }}
        >
          <AssignmentComp
            selectedStation={selectedStation}
            showForm={isAdmin && showAssignmentForm}
            onCloseForm={() => setShowAssignmentForm(false)}
            isAdmin={isAdmin}
          />
        </div>
      </div>
    </div>
  );
};

export default StationPage;
