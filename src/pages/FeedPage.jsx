import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout/Layout';
import PageTransition from '../components/common/PageTransition';
import FeedContainer from '../components/feed/FeedContainer';
import CreatePost from '../components/feed/CreatePost';

const FeedPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading , user} = useAuth();

  useEffect(() => {
    // Check if user is authenticated
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <Layout showNavbar={true}>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout showNavbar={true}>
      <PageTransition>
        <div className="bg-gray-100" style={{ height: 'calc(100vh - 73px)' }}>
          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 h-full">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full pt-6">
              {/* Left Sidebar - Sticky */}
              <div className="lg:col-span-1 h-fit sticky top-6">
                <div className="space-y-4">
                  {/* Quick Actions */}
                  <div className="bg-white rounded-lg shadow-sm p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
                    <div className="space-y-2">
                      <button className="w-full flex items-center space-x-3 p-2 text-left hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-sm">📝</span>
                        </div>
                        <span className="text-gray-700">Create Post</span>
                      </button>
                      <button className="w-full flex items-center space-x-3 p-2 text-left hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 text-sm">👥</span>
                        </div>
                        <span className="text-gray-700">Find Friends</span>
                      </button>
                      <button className="w-full flex items-center space-x-3 p-2 text-left hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 text-sm">💬</span>
                        </div>
                        <span className="text-gray-700">Messages</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Feed - Scrollable */}
              <div className="lg:col-span-2 overflow-y-auto pb-6 scrollbar-hide" style={{ height: 'calc(100vh - 97px)' }}>
                <div className="space-y-6">
                  {/* Create Post Section */}
                  <CreatePost user={user} />

                  {/* Feed Container */}
                  <FeedContainer />
                </div>
              </div>

              {/* Right Sidebar - Sticky */}
              <div className="lg:col-span-1 h-fit sticky top-6">
                <div className="space-y-4">
                  {/* Suggested Friends */}
                  <div className="bg-white rounded-lg shadow-sm p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Suggested Friends</h3>
                    <div className="space-y-3">
                      {[
                        { name: 'John Doe', mutualFriends: 5, avatar: 'JD' },
                        { name: 'Jane Smith', mutualFriends: 3, avatar: 'JS' },
                        { name: 'Mike Johnson', mutualFriends: 8, avatar: 'MJ' },
                      ].map((friend, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                              <span className="text-gray-600 font-medium text-sm">{friend.avatar}</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{friend.name}</p>
                              <p className="text-gray-500 text-xs">{friend.mutualFriends} mutual friends</p>
                            </div>
                          </div>
                          <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors">
                            Add
                          </button>
                        </div>
                      ))}
                    </div>
                    <button className="w-full mt-3 text-blue-600 text-sm font-medium hover:text-blue-700">
                      See all suggestions
                    </button>
                  </div>

                  {/* Trending Topics */}
                  <div className="bg-white rounded-lg shadow-sm p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Trending Topics</h3>
                    <div className="space-y-2">
                      {[
                        { topic: '#Technology', posts: '1.2k posts' },
                        { topic: '#Travel', posts: '856 posts' },
                        { topic: '#Photography', posts: '642 posts' },
                        { topic: '#Food', posts: '534 posts' },
                      ].map((trend, index) => (
                        <div key={index} className="p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                          <p className="font-medium text-gray-900 text-sm">{trend.topic}</p>
                          <p className="text-gray-500 text-xs">{trend.posts}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    </Layout>
  );
};

export default FeedPage;
