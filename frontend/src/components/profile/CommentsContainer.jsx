import { useEffect, useState } from 'react';
import { useUser } from '../../contexts/UserContext';
import { getImageUrl } from '../../utils/s3url';
import { getAllUserComments } from '../../services/comments';

const UserCommentsList = ({ onArtworkSelect }) => {
    const { user } = useUser();
    const [userComments, setUserComments] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchComments = async () => {
        try {
            const data = await getAllUserComments();
            const withImages = data.comments.map(comment => ({
            ...comment,
            imageUrl: getImageUrl(comment.artwork_id?.photos[0]),
            }));
            setUserComments(withImages);
        } catch (err) {
            setError(err.message || 'Error fetching comments');
        }
        };

        if (user?._id) {
        fetchComments();
        }
    }, [user]);

    if (error) return <p>Error: {error}</p>;

    return (
        <div className="tab-content-container">
        <h2>Your Comments on Artworks</h2>
        <ul>
            {userComments.map(({ _id, artwork_id, text, imageUrl }) => (
            <li key={_id} style={{ marginBottom: '24px' }}>
                <div
                className="artwork-header"
                onClick={() =>
                onArtworkSelect({
                ...artwork_id,
                imageUrl: getImageUrl(artwork_id.photos[0]),
                })
                }
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px' }}
                >
                {imageUrl && (
                    <img
                    src={imageUrl}
                    alt={artwork_id?.title}
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                )}
                <div className="artwork-text">
                    <h3 style={{ margin: 0 }}>{artwork_id.title}</h3>
                    <p style={{ margin: '4px 0' }}>{text}</p>
                </div>
                </div>
            </li>
            ))}
        </ul>
        </div>
    );
};

export default UserCommentsList;