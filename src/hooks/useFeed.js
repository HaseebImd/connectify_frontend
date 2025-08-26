import { useState, useEffect, useCallback } from 'react';
import postService from '../services/postService';

/**
 * Custom hook for managing feed posts
 * Handles fetching, pagination, and state management for posts
 */
export const useFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  /**
   * Fetch posts from API
   */
  const fetchPosts = useCallback(async (page = 1, append = false) => {
    try {
      if (page === 1) {
        setLoading(true);
      }
      setError(null);

      const result = await postService.fetchPosts({ page, limit: 10 });

      if (result.success) {
        const { results, count, next } = result.data;
        
        if (append) {
          setPosts(prev => [...prev, ...results]);
        } else {
          setPosts(results);
        }
        
        setTotalCount(count);
        setHasMore(!!next);
        setCurrentPage(page);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('Feed fetch error:', err);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Load more posts (pagination)
   */
  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    
    const nextPage = currentPage + 1;
    await fetchPosts(nextPage, true);
  }, [hasMore, loading, currentPage, fetchPosts]);

  /**
   * Refresh posts (pull to refresh)
   */
  const refresh = useCallback(async () => {
    setCurrentPage(1);
    await fetchPosts(1, false);
  }, [fetchPosts]);

  /**
   * Add a new post to the beginning of the feed
   * Used when a new post is created
   */
  const addNewPost = useCallback((newPost) => {
    setPosts(prev => [newPost, ...prev]);
    setTotalCount(prev => prev + 1);
  }, []);

  /**
   * Update a post in the feed
   */
  const updatePost = useCallback((postId, updatedPost) => {
    setPosts(prev => 
      prev.map(post => 
        post.id === postId ? { ...post, ...updatedPost } : post
      )
    );
  }, []);

  /**
   * Remove a post from the feed
   */
  const removePost = useCallback((postId) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
    setTotalCount(prev => prev - 1);
  }, []);

  /**
   * Like/unlike a post
   */
  const toggleLike = useCallback((postId) => {
    setPosts(prev => 
      prev.map(post => {
        if (post.id === postId) {
          const isLiked = post.is_liked; // Assuming backend provides this
          return {
            ...post,
            is_liked: !isLiked,
            like_count: isLiked ? post.like_count - 1 : post.like_count + 1
          };
        }
        return post;
      })
    );
  }, []);

  /**
   * Increment view count for a post
   */
  const incrementViewCount = useCallback((postId) => {
    setPosts(prev => 
      prev.map(post => 
        post.id === postId 
          ? { ...post, view_count: post.view_count + 1 }
          : post
      )
    );
  }, []);

  // Initial load
  useEffect(() => {
    fetchPosts(1);
  }, [fetchPosts]);

  return {
    // Data
    posts,
    loading,
    error,
    hasMore,
    currentPage,
    totalCount,
    
    // Actions
    fetchPosts,
    loadMore,
    refresh,
    addNewPost,
    updatePost,
    removePost,
    toggleLike,
    incrementViewCount,
    
    // Computed values
    isEmpty: posts.length === 0 && !loading,
    isFirstLoad: loading && posts.length === 0
  };
};

export default useFeed;
