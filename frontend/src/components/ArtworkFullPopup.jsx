import '../assets/styles/ArtworkFullPopup.css';
import BookmarkButton from './BookmarkButton';
import { useUser } from '../contexts/UserContext';
import VisitButton from './VisitButton';
import CommentsButton from "./CommentsButton";
import { useState, useEffect } from 'react';
import CommentItem from "./CommentItem";
import { getCommentsByArtworkId } from '../services/comments'; // Import the service

const ArtworkFullPopup = ({ artwork, onClose, isBookmarked, setIsBookmarked, isVisited, setIsVisited }) => {
    const { user } = useUser();
    const artworkId = artwork._id;
    
    const [comments, setComments] = useState([]);
    const [isLoadingComments, setIsLoadingComments] = useState(true);
    const [commentsError, setCommentsError] = useState(null);

    // Fetch comments when component mounts or artworkId changes
    useEffect(() => {
        const fetchComments = async () => {
            try {
                setIsLoadingComments(true);
                const { comments: fetchedComments } = await getCommentsByArtworkId(artworkId);
                setComments(fetchedComments);
            } catch (error) {
                console.error('Failed to fetch comments:', error);
                setCommentsError(error.message);
            } finally {
                setIsLoadingComments(false);
            }
        };

        fetchComments();
    }, [artworkId]);
    
    const handleCommentPosted = (newComment) => {
        setComments(prev => [newComment, ...prev]);
    };

    const handleDeleteComment = (deletedCommentId) => {
    setComments(prev => prev.filter(c => c._id !== deletedCommentId));
    };

    const handleUpdateComment = (updatedComment) => {
    setComments(prev => prev.map(c => 
    c._id === updatedComment._id ? updatedComment : c
    ));
    };

    return (
        <div className="artwork-full-popup artwork-popup">
            <div className="full-popup-header">
                <div className='header-left'>
                    <h2>{artwork.title}</h2>
                    {user._id && (
                        <>
                            <BookmarkButton
                                artworkId={artworkId}
                                isBookmarked={isBookmarked}
                                onToggle={setIsBookmarked}
                            />
                            <VisitButton
                                artworkId={artwork._id}
                                isVisited={isVisited}
                                onToggle={setIsVisited}
                            />
                            <CommentsButton
                                artworkId={artwork._id}
                                onCommentPosted={handleCommentPosted} 
                            />
                        </>
                    )}
                </div>
                <button className="close-btn" onClick={onClose}>×</button>
            </div>
            
            <div className="full-popup-content">
                {artwork.photos && (
                    <img 
                        src={artwork.imageUrl}
                        alt={artwork.title}
                        className="artwork-full-image"
                    />
                )}
                
                <div className="artwork-full-details">
                    {artwork.discoveryYear && <p><strong>Discovered:</strong> {artwork.discoveryYear}</p>}
                    {artwork.description && <p>{artwork.description}</p>}
                    {artwork?.address && (
                        <p><strong>Location:</strong> {artwork.address}</p>
                    )}
                </div>

                <div className="comments-section">
                    {isLoadingComments ? (
                        <div className="loading-comments">Loading comments...</div>
                    ) : commentsError ? (
                        <div className="comments-error">Error loading comments: {commentsError}</div>
                    ) : comments.length > 0 ? (
                        comments.map((comment, idx) => (
                            <CommentItem
                                key={idx}
                                comment={{ 
                                ...comment,
                                isOwner: comment.user_id?._id === user._id // Add ownership flag
                                }}
                                onDelete={handleDeleteComment}
                                onUpdate={handleUpdateComment}
                            />
                        ))
                    ) : (
                        <div className="no-comments">No comments yet</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ArtworkFullPopup;