import { useEffect, useState } from 'react';
import VisitButton from '../VisitButton';
import { useUser } from '../../contexts/UserContext';
import { getImageUrl } from '../../utils/s3url';

const VisitedArtworksList = ({ setIsVisited, onArtworkSelect }) => {

    const { user } = useUser()
    const userId = user._id
    const [visitedArtworks, setVisitedArtworks] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVisits = async () => {
        try {
            const data = user.visitedArtworks || [];
            const transformed = data.map((artwork) => ({
                ...artwork,
                imageUrl: getImageUrl(artwork.photos[0]),
            }));
            setVisitedArtworks(transformed);
        } catch (err) {
            setError(err.message || "Error fetching visits");
        }
        };

        if (userId) {
        fetchVisits();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    const handleVisitToggle = (newVisitState, artworkId) => {
        console.log('handleVisitToggle called with:', { newVisitState, artworkId });
        
        if (!newVisitState) {
            setVisitedArtworks(prev => 
            prev.filter(artwork => artwork._id !== artworkId)
            );
        };
        
        if (setIsVisited) {
            setIsVisited(newVisitState);
        };
    };

    if (error) return <p>Error: {error}</p>;

    return (
        <div className="tab-content-container">
        <h2>Your Visited Artworks</h2>
        <ul>
            {visitedArtworks.map((artwork) => (
            <li key={artwork._id}>
                <div className="artwork-header">
                    <div className="artwork-text"
                    style={{ cursor: 'pointer' }} 
                    onClick={() => onArtworkSelect(artwork)}>
                        <h3>{artwork.title}</h3>
                        <p>{artwork.description}</p>
                    </div>
                    <VisitButton
                    artworkId={artwork._id}
                    isVisited={true}
                    onToggle={handleVisitToggle}
                    />
                </div>
                {artwork.photos && (
                    <img
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    style={{ width: '100px', borderRadius: '8px' }}
                    />
                )}
            </li>
            ))}
        </ul>
        </div>
    );
};

export default VisitedArtworksList;