import React, { forwardRef, useImperativeHandle } from 'react';
import PostCard from './PostCard';
import useFeed from '../../hooks/useFeed';
import Button from '../ui/Button';

const FeedContainer = forwardRef((props, ref) => {
  const {
    posts,
    loading,
    error,
    hasMore,
    isEmpty,
    isFirstLoad,
    loadMore,
    refresh,
    toggleLike,
    incrementViewCount
  } = useFeed();

  // Expose refresh function to parent component
  useImperativeHandle(ref, () => ({
    refresh
  }));

  // Loading state for first load
  if (isFirstLoad) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 animate-pulse">
            <div className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/6"></div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
              <div className="mt-4 h-48 bg-gray-300 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error && isEmpty) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-medium text-red-800 mb-2">Unable to load posts</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={refresh} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Empty state
  if (isEmpty) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
          <h3 className="text-lg font-medium text-gray-800 mb-2">No posts yet</h3>
          <p className="text-gray-600 mb-4">
            Be the first to share something with the community!
          </p>
          <Button onClick={refresh} variant="primary">
            Refresh Feed
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Posts */}
      {posts.map(post => (
        <PostCard 
          key={post.id} 
          post={post} 
          onLike={toggleLike}
          onViewIncrement={incrementViewCount}
        />
      ))}

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center py-6">
          <Button
            onClick={loadMore}
            loading={loading}
            disabled={loading}
            variant="outline"
            size="lg"
          >
            {loading ? 'Loading more posts...' : 'Load More Posts'}
          </Button>
        </div>
      )}

      {/* End of feed message */}
      {!hasMore && posts.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">
            You've reached the end of your feed
          </p>
          <Button
            onClick={refresh}
            variant="ghost"
            size="sm"
            className="mt-2"
          >
            Refresh to see new posts
          </Button>
        </div>
      )}

      {/* Error message for load more */}
      {error && posts.length > 0 && (
        <div className="text-center py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-red-600 text-sm mb-2">{error}</p>
            <Button onClick={loadMore} variant="outline" size="sm">
              Try Again
            </Button>
          </div>
        </div>
      )}
    </div>
  );
});

export default FeedContainer;
