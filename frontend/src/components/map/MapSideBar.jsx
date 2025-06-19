import { useState } from "react";
import ReportButton from "../ReportButton";
import ArtworkForm from "../ArtworkForm";
import "../../assets/styles/MapSideBar.css"

const MapSideBar = () => {
    const [showArtworkForm, setShowArtworkForm] = useState(false);
    const [fileName, setFileName] = useState("");

    const handleFileChange = (e) => {
    const file = e.target.files[0];
        setFileName(file ? file.name : "");
    };

    const handleOpenArtworkForm = () => {
        setShowArtworkForm(true);
    };

    const handleCloseArtworkForm = () => {
        setFileName("");
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

        {showArtworkForm && <ArtworkForm onClose={handleCloseArtworkForm} handleFileChange={handleFileChange} fileName={fileName} />}
        </>
    );
};

export default MapSideBar;