import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import StationItem from '../components/stations/StationItem';
import AssinmentComp from '../components/stations/AssinmentComp';

const StationPage = () => {
    const [selectedStation, setSelectedStation] = useState(null);

    const handleStationSelect = (station) => {
        setSelectedStation(station);
    };

    return (
        <div>
            <Navbar />
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '2px',
                    height: '90vh',
                }}
            >
                <div
                    style={{
                        flex: '1',
                        backgroundColor: '#f0f0f0',
                        padding: '20px',
                        overflowY: 'auto',
                    }}
                >
                    <StationItem onSelectStation={handleStationSelect} />
                </div>
                <div
                    style={{
                        flex: '3',
                        backgroundColor: '#e0e0e0',
                        padding: '20px',
                        overflowY: 'auto',
                    }}
                >
                    <AssinmentComp selectedStation={selectedStation} />
                </div>
            </div>
        </div>
    );
};

export default StationPage;