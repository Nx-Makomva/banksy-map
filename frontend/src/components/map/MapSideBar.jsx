import { useState } from "react";
import ReportButton from "../ReportButton";
import ArtworkForm from "../ArtworkForm";
import "./MapSideBar.css"

const MapSideBar = () => {
    const [showArtworkForm, setShowArtworkForm] = useState(false);

    const handleOpenArtworkForm = () => {
        setShowArtworkForm(true);
    };

    const handleCloseArtworkForm = () => {
        setShowArtworkForm(false);
    };

    return (
        <>
        <div className="map-sidebar">
            <ReportButton
            src="/REPORT.png"
            onClick={handleOpenArtworkForm}
            />
        </div>

        {showArtworkForm && <ArtworkForm onClose={handleCloseArtworkForm} />}
        </>
    );
};

export default MapSideBar;