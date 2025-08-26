import React, { useState } from 'react';
import { Heart, MessageCircle, Share, MoreHorizontal, Play, MapPin, Eye } from 'lucide-react';
import Card from '../ui/Card';
import ImageLightbox from '../ui/ImageLightbox';
import postService from '../../services/postService';

const PostCard = ({ post, onLike, onViewIncrement }) => {
  const [liked, setLiked] = useState(post.is_liked || false);
  const [showComments, setShowComments] = useState(false);
  const [likeCount, setLikeCount] = useState(post.like_count || 0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handleLike = () => {
    const newLikedState = !liked;
    setLiked(newLikedState);
    setLikeCount(prev => newLikedState ? prev + 1 : prev - 1);
    
    // Call parent handler for API update
    if (onLike) {
      onLike(post.id);
    }
  };

  const handleViewIncrement = () => {
    if (onViewIncrement) {
      onViewIncrement(post.id);
    }
  };

  const handleImageClick = (mediaItem, index) => {
    handleViewIncrement();
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const renderMedia = () => {
    if (!post.media || post.media.length === 0) return null;

    return (
      <div className="mt-3">
        {post.media.length === 1 ? (
          // Single media item
          <div className="rounded-lg overflow-hidden">
            {post.media[0].media_type === 'image' ? (
              <img
                src={postService.getMediaUrl(post.media[0].file)}
                alt="Post media"
                className="w-full object-cover max-h-96 cursor-pointer hover:opacity-95 transition-opacity"
                onClick={() => handleImageClick(post.media[0], 0)}
              />
            ) : (
              <div className="relative bg-black rounded-lg aspect-video">
                <video
                  src={postService.getMediaUrl(post.media[0].file)}
                  poster={post.media[0].thumbnail ? postService.getMediaUrl(post.media[0].thumbnail) : undefined}
                  className="w-full h-full object-cover"
                  controls
                  onPlay={handleViewIncrement}
                />
                <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  {post.media[0].duration_seconds ? `${Math.floor(post.media[0].duration_seconds / 60)}:${(post.media[0].duration_seconds % 60).toString().padStart(2, '0')}` : 'Video'}
                </div>
              </div>
            )}
          </div>
        ) : post.media.length === 2 ? (
          // Two media items - side by side
          <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden">
            {post.media.map((mediaItem, index) => (
              <div key={mediaItem.id} className="relative aspect-square">
                {mediaItem.media_type === 'image' ? (
                  <img
                    src={postService.getMediaUrl(mediaItem.file)}
                    alt={`Post media ${index + 1}`}
                    className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                    onClick={() => handleImageClick(mediaItem, index)}
                  />
                ) : (
                  <div className="relative bg-black w-full h-full">
                    <video
                      src={postService.getMediaUrl(mediaItem.file)}
                      poster={mediaItem.thumbnail ? postService.getMediaUrl(mediaItem.thumbnail) : undefined}
                      className="w-full h-full object-cover"
                      muted
                    />
                    <div className="absolute inset-0 flex items-center justify-center cursor-pointer hover:bg-black hover:bg-opacity-20 transition-colors">
                      <Play className="w-12 h-12 text-white" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : post.media.length === 3 ? (
          // Three media items - Facebook style layout
          <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden">
            <div className="row-span-2">
              {post.media[0].media_type === 'image' ? (
                <img
                  src={postService.getMediaUrl(post.media[0].file)}
                  alt="Post media 1"
                  className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                  onClick={() => handleImageClick(post.media[0], 0)}
                />
              ) : (
                <div className="relative bg-black w-full h-full">
                  <video
                    src={postService.getMediaUrl(post.media[0].file)}
                    poster={post.media[0].thumbnail ? postService.getMediaUrl(post.media[0].thumbnail) : undefined}
                    className="w-full h-full object-cover"
                    muted
                  />
                  <div className="absolute inset-0 flex items-center justify-center cursor-pointer hover:bg-black hover:bg-opacity-20 transition-colors">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                </div>
              )}
            </div>
            <div className="grid grid-rows-2 gap-1">
              {post.media.slice(1, 3).map((mediaItem, index) => (
                <div key={mediaItem.id} className="relative">
                  {mediaItem.media_type === 'image' ? (
                    <img
                      src={postService.getMediaUrl(mediaItem.file)}
                      alt={`Post media ${index + 2}`}
                      className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                      onClick={() => handleImageClick(mediaItem, index + 1)}
                    />
                  ) : (
                    <div className="relative bg-black w-full h-full">
                      <video
                        src={postService.getMediaUrl(mediaItem.file)}
                        poster={mediaItem.thumbnail ? postService.getMediaUrl(mediaItem.thumbnail) : undefined}
                        className="w-full h-full object-cover"
                        muted
                      />
                      <div className="absolute inset-0 flex items-center justify-center cursor-pointer hover:bg-black hover:bg-opacity-20 transition-colors">
                        <Play className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Four or more media items - Facebook style with overlay
          <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden">
            <div className="row-span-2">
              {post.media[0].media_type === 'image' ? (
                <img
                  src={postService.getMediaUrl(post.media[0].file)}
                  alt="Post media 1"
                  className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                  onClick={() => handleImageClick(post.media[0], 0)}
                />
              ) : (
                <div className="relative bg-black w-full h-full">
                  <video
                    src={postService.getMediaUrl(post.media[0].file)}
                    poster={post.media[0].thumbnail ? postService.getMediaUrl(post.media[0].thumbnail) : undefined}
                    className="w-full h-full object-cover"
                    muted
                  />
                  <div className="absolute inset-0 flex items-center justify-center cursor-pointer hover:bg-black hover:bg-opacity-20 transition-colors">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                </div>
              )}
            </div>
            <div className="grid grid-rows-2 gap-1">
              {post.media.slice(1, 3).map((mediaItem, index) => (
                <div key={mediaItem.id} className="relative">
                  {mediaItem.media_type === 'image' ? (
                    <img
                      src={postService.getMediaUrl(mediaItem.file)}
                      alt={`Post media ${index + 2}`}
                      className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                      onClick={() => handleImageClick(mediaItem, index + 1)}
                    />
                  ) : (
                    <div className="relative bg-black w-full h-full">
                      <video
                        src={postService.getMediaUrl(mediaItem.file)}
                        poster={mediaItem.thumbnail ? postService.getMediaUrl(mediaItem.thumbnail) : undefined}
                        className="w-full h-full object-cover"
                        muted
                      />
                      <div className="absolute inset-0 flex items-center justify-center cursor-pointer hover:bg-black hover:bg-opacity-20 transition-colors">
                        <Play className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  )}
                  {/* Show count overlay for the last visible image if there are more */}
                  {index === 1 && post.media.length > 3 && (
                    <div 
                      className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center cursor-pointer hover:bg-opacity-70 transition-colors"
                      onClick={() => handleImageClick(mediaItem, index + 1)}
                    >
                      <span className="text-white text-2xl font-semibold">+{post.media.length - 3}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Card variant="elevated" padding="none">
      {/* Post Header */}
      <div className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center overflow-hidden">
              {post.user?.profile_image ? (
                <img
                  src={postService.getMediaUrl(post.user.profile_image)}
                  alt={post.user.name || post.user.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white font-medium text-sm">
                  {(post.user?.name || post.user?.username || 'U').charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {post.user?.name || post.user?.username || 'Unknown User'}
              </h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>{postService.formatPostDate(post.created_at)}</span>
                {post.location && (
                  <>
                    <span>•</span>
                    <div className="flex items-center space-x-1 cursor-pointer hover:text-blue-600 transition-colors">
                      <MapPin className="w-3 h-3" />
                      <span className="hover:underline">{post.location}</span>
                    </div>
                  </>
                )}
                {post.is_edited && (
                  <>
                    <span>•</span>
                    <span className="text-xs">Edited</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <MoreHorizontal className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Post Content */}
      <div className="px-4 py-3">
        {post.caption && (
          <div className="text-gray-800 leading-relaxed mb-3">
            {post.caption.split('\n').map((line, index) => (
              <p key={index} className={index > 0 ? 'mt-2' : ''}>
                {line.split(' ').map((word, wordIndex) => {
                  if (word.startsWith('#')) {
                    return (
                      <span key={wordIndex} className="text-blue-600 hover:text-blue-700 cursor-pointer">
                        {word}{' '}
                      </span>
                    );
                  }
                  return word + ' ';
                })}
              </p>
            ))}
          </div>
        )}
        {renderMedia()}
      </div>

      {/* Post Stats */}
      <div className="px-4 py-2 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <span>{likeCount} likes</span>
            <span>{post.comment_count} comments</span>
            <span>{post.view_count} views</span>
          </div>
          <span className="capitalize">{post.visibility}</span>
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

      {/* Image Lightbox */}
      <ImageLightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={post.media || []}
        initialIndex={lightboxIndex}
      />
    </>
  );
};

export default PostCard;
