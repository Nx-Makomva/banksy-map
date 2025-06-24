// ArtworkMiniPopup.jsx
import '../../assets/styles/ArtworkMiniPopup.css'
import BookmarkButton from '../BookmarkButton';
import VisitButton from "../VisitButton"
import { useUser } from '../../contexts/UserContext';

const ArtworkMiniPopup = ({ artwork, onClose, onArtworkSelect, isBookmarked, setIsBookmarked, isVisited, setIsVisited }) => {
    const { user } = useUser();

    return (
        <div 
            className="artwork-mini-popup"
            onClick={(e) => e.stopPropagation()}
        >
            <button className="close-btn" onClick={onClose}>×</button>
            <div className="mini-content">
                {artwork.photos && (
                    <img 
                    key={artwork.id}
                    src={artwork.imageUrl} // grabs the name of the first file
                    alt={artwork.title}
                    className="artwork-mini-image"
                    />
                )}
                
                <div className="artwork-mini-details">
                    <h2>{artwork.title}</h2>
                    {artwork.discoveryYear && <p><strong>Discovered:</strong> {artwork.discoveryYear}</p>}
                    {artwork.description && <p>{artwork.description}</p>}
                    {artwork?.address && (
                    <p><strong>Location:</strong> {artwork.address}</p>
                    )}
                </div>
            {user._id && (
                <BookmarkButton
                artworkId={artwork._id}
                isBookmarked={isBookmarked}
                onToggle={setIsBookmarked}
                /> )}
            {user._id && (
                <VisitButton
                artworkId={artwork._id}
                isVisited={isVisited}
                onToggle={setIsVisited}
                />)}
                <button 
                    className="expand-btn"
                    onClick={() => onArtworkSelect(artwork)}
                >
                    View Big →
                </button>
            </div>
        </div>
    );
};

export default ArtworkMiniPopup;