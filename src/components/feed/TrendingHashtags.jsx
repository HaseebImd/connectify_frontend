import React, { useState, useEffect } from 'react';
import { Hash, TrendingUp } from 'lucide-react';
import Card from '../ui/Card';
import postService from '../../services/postService';

/**
 * Trending Hashtags Component
 * Displays top 4 trending hashtags
 */
const TrendingHashtags = () => {
  const [hashtags, setHashtags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHashtags();
  }, []);

  const fetchHashtags = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await postService.fetchHashtags(4);
      
      if (result.success) {
        setHashtags(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('Error fetching hashtags:', err);
      setError('Failed to load hashtags');
    } finally {
      setLoading(false);
    }
  };

  const handleHashtagClick = (hashtag) => {
    // TODO: Implement hashtag search/filter functionality
    console.log('Clicked hashtag:', hashtag);
  };

  if (loading) {
    return (
      <Card variant="elevated" padding="md">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-32 animate-pulse"></div>
          </div>
          {[...Array(4)].map((_, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-300 rounded w-20 animate-pulse"></div>
              </div>
              <div className="h-3 bg-gray-300 rounded w-8 animate-pulse"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card variant="elevated" padding="md">
        <div className="text-center py-4">
          <p className="text-sm text-red-600 mb-2">{error}</p>
          <button
            onClick={fetchHashtags}
            className="text-xs text-blue-600 hover:text-blue-700"
          >
            Try again
          </button>
        </div>
      </Card>
    );
  }

  if (hashtags.length === 0) {
    return null;
  }

  return (
    <Card variant="elevated" padding="md">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Trending Hashtags</h3>
        </div>

        {/* Hashtags List */}
        <div className="space-y-3">
          {hashtags.map((hashtag, index) => (
            <button
              key={hashtag.id}
              onClick={() => handleHashtagClick(hashtag)}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left group"
            >
              <div className="flex items-center space-x-2">
                <Hash className="w-4 h-4 text-blue-500 group-hover:text-blue-600" />
                <span className="font-medium text-gray-900 group-hover:text-blue-600">
                  {hashtag.name}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">
                  {hashtag.usage_count} posts
                </span>
                <div className="flex items-center">
                  <span className="text-xs font-medium text-blue-600">
                    #{index + 1}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            Updated based on recent activity
          </p>
        </div>
      </div>
    </Card>
  );
};

export default TrendingHashtags;
