// ArtworkMiniPopup.jsx
import '../../assets/styles/ArtworkMiniPopup.css'
import BookmarkButton from '../BookmarkButton';
import { getImageUrl } from '../../utils/s3url';
import VisitButton from "../VisitButton"
import { useUser } from '../../contexts/UserContext';

const ArtworkMiniPopup = ({ artwork, onClose, onArtworkSelect, isBookmarked, setIsBookmarked, isVisited, setIsVisited }) => {
    const { user } = useUser();
    const image = getImageUrl(artwork.photos[0]);
    console.log(image)

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
                <div className='button-group-mini-popup'>
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
                </div>
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