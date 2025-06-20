// ArtworkFullPopup.jsx
import '../assets/styles/ArtworkFullPopup.css';

const ArtworkFullPopup = ({ artwork, onClose }) => {
    return (
        <div className="artwork-full-popup artwork-popup">
        <div className="full-popup-header">
            <h2>{artwork.title}</h2>
            <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="full-popup-content">
            {artwork.photos && (
            <img 
                src={artwork.photos} 
                alt={artwork.title}
                className="artwork-full-image"
            />
            )}
            
            <div className="artwork-full-details">
            {artwork.discoveryYear && <p><strong>Discovered:</strong> {artwork.discoveryYear}</p>}
            {artwork.description && <p>{artwork.description}</p>}
            {artwork?.streetName && (
                <p><strong>Location:</strong> {artwork.streetName}</p>
            )}
            
            {/* Add any other artwork details you want to show */}
            </div>
        </div>
        </div>
    );
};

export default ArtworkFullPopup;