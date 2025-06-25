import { useState } from 'react';
import { deleteComment, updateComment } from '../services/comments';
import "../assets/styles/CommentsItem.css";

const CommentItem = ({ comment, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.text);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    
    setIsLoading(true);
    try {
      await deleteComment(comment._id);
      onDelete(comment._id);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (editedText.trim() === comment.text) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    try {
      const updatedComment = await updateComment(comment._id, editedText);
      onUpdate(updatedComment);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="comment">
      <div className="comment-header">
        <span className="comment-author">
          {comment.user_id?.firstName} {comment.user_id?.lastName}
        </span>
        <span className="comment-time">
          {new Date(comment.createdAt).toLocaleString()}
        </span>
        
        {comment.isOwner && (
          <div className="comment-actions">
            {!isEditing ? (
              <>
                <button 
                  onClick={() => setIsEditing(true)}
                  disabled={isLoading}
                  className="edit-btn"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="delete-btn"
                >
                  {isLoading ? 'Deleting...' : 'Delete'}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleUpdate}
                  disabled={isLoading}
                  className="save-btn"
                >
                  {isLoading ? 'Saving...' : 'Save'}
                </button>

                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedText(comment.text);
                  }}
                  disabled={isLoading}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {isEditing ? (
        <textarea
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          className="comment-edit-input"
          disabled={isLoading}
        />
      ) : (
        <p className="comment-text">{comment.text}</p>
      )}

      {error && <div className="comment-error">{error}</div>}
    </div>
  );
};

export default CommentItem;