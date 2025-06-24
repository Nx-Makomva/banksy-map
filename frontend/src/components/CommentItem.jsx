// components/CommentItem.jsx
const CommentItem = ({ comment }) => {
  return (
    <div className="comment">
      <div className="comment-header">
        <span className="comment-author">
          {comment.user?.firstName} {comment.user?.lastName}
        </span>
        <span className="comment-time">
          {new Date(comment.createdAt).toLocaleString()}
        </span>
      </div>
      <p className="comment-text">{comment.comment?.text}</p>
    </div>
  );
};

export default CommentItem;