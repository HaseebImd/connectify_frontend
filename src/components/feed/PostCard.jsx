import React, { useState } from 'react';
import { Heart, MessageCircle, Share, MoreHorizontal, Play, Download, Eye } from 'lucide-react';
import Card from '../ui/Card';

const PostCard = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInHours = Math.floor((now - postTime) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h`;
    return `${Math.floor(diffInHours / 24)}d`;
  };

  const renderMedia = () => {
    switch (post.type) {
      case 'image':
        return (
          <div className="mt-3">
            <img
              src={post.media.url}
              alt={post.media.alt}
              className="w-full rounded-lg object-cover max-h-96"
            />
          </div>
        );
      
      case 'video':
        return (
          <div className="mt-3 relative">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg aspect-video flex items-center justify-center relative overflow-hidden">
              {/* Video thumbnail background */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              
              {/* Play button and info */}
              <div className="text-center text-white relative z-10">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 mb-3 inline-flex">
                  <Play className="w-8 h-8 text-white fill-white" />
                </div>
                <p className="text-sm font-medium mb-1">{post.media.title}</p>
                <p className="text-xs opacity-80">{post.media.duration}</p>
              </div>
              
              {/* Video preview pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="w-full h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
              </div>
            </div>
          </div>
        );
      
      case 'pdf':
        return (
          <div className="mt-3">
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-start space-x-3">
                <div className="w-12 h-16 bg-red-500 rounded flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">PDF</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">{post.media.title}</h4>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{post.media.description}</p>
                  <div className="flex items-center space-x-4 mt-3">
                    <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm">
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-700 text-sm">
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Card variant="elevated" padding="none">
      {/* Post Header */}
      <div className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">{post.author.name.charAt(0)}</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
              <p className="text-sm text-gray-500">{formatTime(post.timestamp)}</p>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <MoreHorizontal className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Post Content */}
      <div className="px-4 py-3">
        <p className="text-gray-800 leading-relaxed">{post.content}</p>
        {renderMedia()}
      </div>

      {/* Post Stats */}
      <div className="px-4 py-2 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <span>{post.likes} likes</span>
            <span>{post.comments} comments</span>
          </div>
          <span>{post.shares} shares</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 py-2 border-t border-gray-100">
        <div className="flex items-center justify-around">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors ${
              liked ? 'text-red-500' : 'text-gray-600'
            }`}
          >
            <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
            <span className="font-medium">Like</span>
          </button>
          
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="font-medium">Comment</span>
          </button>
          
          <button className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600">
            <Share className="w-5 h-5" />
            <span className="font-medium">Share</span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
          <div className="space-y-3">
            {post.sampleComments?.map((comment, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-600 text-xs font-medium">{comment.author.charAt(0)}</span>
                </div>
                <div className="bg-white rounded-lg px-3 py-2 flex-1">
                  <p className="text-sm font-medium text-gray-900">{comment.author}</p>
                  <p className="text-sm text-gray-700">{comment.text}</p>
                </div>
              </div>
            ))}
            
            {/* Add Comment */}
            <div className="flex items-center space-x-2 mt-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">A</span>
              </div>
              <input
                type="text"
                placeholder="Write a comment..."
                className="flex-1 px-3 py-2 bg-white rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default PostCard;
