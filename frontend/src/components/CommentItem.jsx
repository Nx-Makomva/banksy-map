// components/CommentItem.jsx
const CommentItem = ({ comment }) => {
  return (
    <div className="comment">
      <div className="comment-header">
        <span className="comment-author">
          {comment.user_id?.firstName} {comment.user_id?.lastName}
        </span>
        <span className="comment-time">
          {new Date(comment.createdAt).toLocaleString()}
        </span>
      </div>
      <p className="comment-text">{comment.text}</p>
    </div>
  );
};

export default CommentItem;