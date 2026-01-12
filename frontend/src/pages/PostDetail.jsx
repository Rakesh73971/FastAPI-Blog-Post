import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postsAPI, votesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './PostDetail.css';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const data = await postsAPI.getById(id);
      setPost(data);
    } catch (error) {
      setError('Post not found');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (direction) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setVoting(true);
      // Get post ID from current post state
      let postId;
      if (Array.isArray(post)) {
        postId = post[0].id;
      } else if (post.Post) {
        postId = post.Post.id;
      } else {
        postId = post.id;
      }
      await votesAPI.vote(postId, direction);
      // Refresh post to get updated vote count
      await fetchPost();
    } catch (error) {
      alert(error.response?.data?.detail || 'Failed to vote');
    } finally {
      setVoting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      setDeleting(true);
      let postId;
      if (Array.isArray(post)) {
        postId = post[0].id;
      } else if (post.Post) {
        postId = post.Post.id;
      } else {
        postId = post.id;
      }
      await postsAPI.delete(postId);
      navigate('/');
    } catch (error) {
      alert(error.response?.data?.detail || 'Failed to delete post');
      setDeleting(false);
    }
  };

  const isOwner = () => {
    if (!isAuthenticated || !user || !post) return false;
    let postData;
    if (Array.isArray(post)) {
      postData = post[0];
    } else if (post.Post) {
      postData = post.Post;
    } else {
      postData = post;
    }
    return postData.owner?.email === user.email;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <div className="loading">Loading post...</div>;
  }

  if (error || !post) {
    return (
      <div className="error-container">
        <p>{error || 'Post not found'}</p>
        <Link to="/">Back to Posts</Link>
      </div>
    );
  }

  // Handle different response structures
  let postData, votes;
  if (Array.isArray(post)) {
    postData = post[0];
    votes = post[1] || 0;
  } else if (post.Post) {
    postData = post.Post;
    votes = post.votes || 0;
  } else {
    postData = post;
    votes = 0;
  }

  return (
    <div className="post-detail-container">
      <Link to="/" className="back-link">
        ← Back to Posts
      </Link>
      <article className="post-detail">
        <header className="post-detail-header">
          <h1>{postData.title}</h1>
          <div className="post-detail-meta">
            <span>By {postData.owner?.email || 'Unknown'}</span>
            <span>{formatDate(postData.created_at)}</span>
          </div>
        </header>
        <div className="post-detail-content">{postData.content}</div>
        <div className="post-detail-footer">
          <div className="vote-section">
            <button
              onClick={() => handleVote(1)}
              disabled={voting}
              className="vote-button upvote"
            >
              ↑ Upvote
            </button>
            <span className="vote-count">{votes} votes</span>
            <button
              onClick={() => handleVote(0)}
              disabled={voting}
              className="vote-button downvote"
            >
              ↓ Remove Vote
            </button>
          </div>
          {isOwner() && (
            <div className="post-actions">
              <button
                onClick={() => navigate(`/posts/${postData.id}/edit`)}
                className="edit-button"
              >
                Edit Post
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="delete-button"
              >
                {deleting ? 'Deleting...' : 'Delete Post'}
              </button>
            </div>
          )}
        </div>
      </article>
    </div>
  );
};

export default PostDetail;

