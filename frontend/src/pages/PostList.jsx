import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postsAPI } from '../services/api';
import './PostList.css';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const limit = 10;

  useEffect(() => {
    fetchPosts();
  }, [page, search]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await postsAPI.getAll(limit, page * limit, search);
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading && posts.length === 0) {
    return <div className="loading">Loading posts...</div>;
  }

  return (
    <div className="post-list-container">
      <div className="post-list-header">
        <h1>Blog Posts</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="no-posts">No posts found.</div>
      ) : (
        <>
          <div className="posts-grid">
            {posts.map((postData, index) => {
              // Handle different response structures
              let post, votes;
              if (Array.isArray(postData)) {
                // If it's a tuple/array [Post, votes]
                post = postData[0];
                votes = postData[1] || 0;
              } else if (postData.Post) {
                // If it's an object with Post and votes
                post = postData.Post;
                votes = postData.votes || 0;
              } else {
                // If it's just the post object
                post = postData;
                votes = 0;
              }
              
              return (
                <div key={post.id || index} className="post-card">
                  <Link to={`/posts/${post.id}`} className="post-link">
                    <h2 className="post-title">{post.title}</h2>
                    <p className="post-content-preview">
                      {post.content?.substring(0, 150) || ''}
                      {post.content?.length > 150 ? '...' : ''}
                    </p>
                    <div className="post-meta">
                      <span className="post-author">
                        By {post.owner?.email || 'Unknown'}
                      </span>
                      <span className="post-date">
                        {formatDate(post.created_at)}
                      </span>
                      <span className="post-votes">
                        {votes} votes
                      </span>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="pagination">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="pagination-button"
            >
              Previous
            </button>
            <span className="pagination-info">Page {page + 1}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={posts.length < limit}
              className="pagination-button"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PostList;