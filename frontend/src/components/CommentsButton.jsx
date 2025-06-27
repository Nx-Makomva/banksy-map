import { addComment } from "../services/comments";
import { FaRegComment } from "react-icons/fa";
import { useUser } from "../contexts/UserContext";
import { useState } from 'react';
import ModalPortal from './ModalPortal';
import '../assets/styles/CommentModal.css';
import "../assets/styles/CommentsButton.css";

const CommentButton = ({artworkId, onCommentPosted}) => {
const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <button
      className='comments-button'
      onClick={() => setIsOpen(true)}>
        <FaRegComment  data-testid="comment-icon"/>
      </button>
      
      {isOpen && (
        <CommentForm 
          artworkId={artworkId}
          onClose={() => setIsOpen(false)}
          onCommentPosted={onCommentPosted}
        />
      )}
    </>
  );
};

const CommentForm = ({ artworkId, onClose, onCommentPosted }) => {
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useUser(); 

  const handleSubmit = async (e) => {
  e.preventDefault();


  if (!text.trim()) {
    setError('Please enter a comment');
    return;
  }

  setIsSubmitting(true);
  setError(null); // Clear previous errors

  try {
    const newComment = await addComment(artworkId, text);
    
    onClose();
    onCommentPosted({
      ...newComment,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName
      },
      createdAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('Submission error:', err);
    setError('Failed to add comment');
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <ModalPortal>
      <div className="modal-overlay">
        <div className="modal-content">
          <form onSubmit={handleSubmit} data-testid="comment-form">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Share your thoughts..."
              disabled={isSubmitting}
            />
            
            {error && <div className="error-message">{error}</div>}
            
            <div className="modal-actions">
              <button 
                type="button" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting || !text.trim()}
              >
                {isSubmitting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ModalPortal>
  );
};

export default CommentButton;