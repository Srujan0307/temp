import { useState } from 'react';
import { comments as initialComments } from './filing-comments.data';
export const FilingComments = () => {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');
  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([
        ...comments,
        {
          id: `${comments.length + 1}`,
          author: 'Current User',
          content: newComment,
        },
      ]);
      setNewComment('');
    }
  };
  return (
    <div>
      <h2 className="text-lg font-bold">Comments</h2>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            <strong>{comment.author}:</strong> {comment.content}
          </li>
        ))}
      </ul>
      <div>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment"
        />
        <button onClick={handleAddComment}>Add Comment</button>
      </div>
    </div>
  );
};
