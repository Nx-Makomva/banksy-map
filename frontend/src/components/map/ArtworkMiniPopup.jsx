// ArtworkMiniPopup.jsx
import '../../assets/styles/ArtworkMiniPopup.css'
import BookmarkButton from '../BookmarkButton';
import VisitButton from "../VisitButton"
import { useUser } from '../../contexts/UserContext';

const ArtworkMiniPopup = ({ artwork, onClose, onArtworkSelect, isBookmarked, setIsBookmarked, isVisited, setIsVisited }) => {
    const { user } = useUser();

    // Determine authentication class
    const getAuthInfo = () => {
    if (artwork.isAuthenticated === true) {
        return { class: 'authenticated', badge: 'Verified' };
    } else if (artwork.isAuthenticated === false) {
        return { class: 'unverified', badge: 'Unverified' };
    } else if (artwork.isAuthenticated === null || artwork.isAuthenticated === undefined) {
        return { class: 'pending', badge: 'Pending' };
    }
    return { class: '', badge: '' };
    };

    const authInfo = getAuthInfo();

    return (
        <div 
            className={`artwork-mini-popup ${authInfo.class}`}
            onClick={(e) => e.stopPropagation()}
        >
            <button className="close-btn" onClick={onClose}>×</button>
            <div className="auth-badge">{authInfo.badge}</div>
            <div className="mini-content">
                {artwork.photos && artwork.photos.length > 0 && (
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