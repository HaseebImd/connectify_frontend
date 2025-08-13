import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth';
import Layout from '../components/layout/Layout';
import PageTransition from '../components/common/PageTransition';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { User, Camera, Save, X, MapPin, Calendar, Link as LinkIcon } from 'lucide-react';
import { colors } from '../constants/theme';

const ProfilePage = () => {
  const { user, isAuthenticated, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profileData, setProfileData] = useState({
    username: '',
    name: '',
    email: '',
    bio: '',
    is_private: false,
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username || '',
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        is_private: user.is_private || false,
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await authService.updateUserProfile(profileData);

      if (result.success) {
        setSuccess('Profile updated successfully!');
        setEditing(false);
        // Update the user context with the new data
        updateUser(result.data);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original user data
    if (user) {
      setProfileData({
        username: user.username || '',
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        is_private: user.is_private || false,
      });
    }
    setEditing(false);
    setError('');
    setSuccess('');
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <Card padding="xl">
            <p className="text-center text-gray-600">Please log in to view your profile.</p>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
          <div className="max-w-4xl mx-auto px-4">
            {/* Cover Image */}
            <div className="relative mb-8">
              <div className="h-48 rounded-2xl shadow-xl relative overflow-hidden">
                {user?.cover_image ? (
                  <img
                    src={`http://127.0.0.1:7000${user.cover_image}`}
                    alt="Cover"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600"></div>
                )}

              </div>

              {/* Profile Image */}
              <div className="absolute -bottom-12 left-6">
                <div className="relative">
                  {user?.profile_image ? (
                    <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden relative">
                      <img
                        src={`http://127.0.0.1:7000${user.profile_image}`}
                        alt={user.username || 'Profile'}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center border-4 border-white shadow-xl">
                      <User size={32} color={colors.textSecondary} />
                    </div>
                  )}
                  {editing && (
                    <button className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 shadow-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105">
                      <Camera size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Profile Info */}
              <div className="lg:col-span-2">
                <Card variant="elevated" padding="xl" className="backdrop-blur-sm bg-white bg-opacity-80 border border-white border-opacity-50">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Information</h2>
                      <p className="text-gray-600">{user?.bio || 'No bio available'}</p>
                    </div>
                    {!editing && (
                      <Button
                        variant="primary"
                        onClick={() => setEditing(true)}
                        className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        <span>Edit Profile</span>
                      </Button>
                    )}
                  </div>

                  {/* Profile Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">0</div>
                      <div className="text-sm text-gray-600">Posts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">0</div>
                      <div className="text-sm text-gray-600">Following</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">0</div>
                      <div className="text-sm text-gray-600">Followers</div>
                    </div>
                  </div>

                  {/* Profile Details */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Username</p>
                        <p className="font-medium text-gray-900">{user?.username || 'Not set'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-sm">@</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium text-gray-900">{user?.email}</p>
                      </div>
                    </div>
                    {/* show user location */}
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <MapPin size={16} className="text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium text-gray-900">{user?.location || 'Not set'}</p>
                      </div>
                    </div>
                    {/* show user website */}

                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <LinkIcon size={16} className="text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Website</p>
                        <p className="font-medium text-gray-900">{user?.website || 'Not set'}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Calendar size={16} className="text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Joined</p>
                        <p className="font-medium text-gray-900">
                          {user.date_joined ? new Date(user.date_joined).toLocaleString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                          }) : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <Card variant="elevated" padding="lg" className="backdrop-blur-sm bg-white bg-opacity-80 border border-white border-opacity-50">
                  <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-lg transition-all duration-200">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-sm">📝</span>
                      </div>
                      <span className="text-gray-700">Create Post</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-lg transition-all duration-200">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-sm">👥</span>
                      </div>
                      <span className="text-gray-700">Find Friends</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-lg transition-all duration-200">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 text-sm">⚙️</span>
                      </div>
                      <span className="text-gray-700">Settings</span>
                    </button>
                  </div>
                </Card>

                {/* Privacy Settings */}
                <Card variant="elevated" padding="lg" className="backdrop-blur-sm bg-white bg-opacity-80 border border-white border-opacity-50">
                  <h3 className="font-semibold text-gray-900 mb-4">Privacy</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Private Profile</p>
                      <p className="text-sm text-gray-500">Only followers can see your posts</p>
                    </div>
                    <div className={`w-12 h-6 rounded-full ${user?.is_private ? 'bg-blue-600' : 'bg-gray-300'} relative transition-colors duration-200`}>
                      <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform duration-200 ${user?.is_private ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Edit Form */}
            {editing && (
              <div className="mt-6">
                <Card variant="elevated" padding="xl" className="backdrop-blur-sm bg-white bg-opacity-80 border border-white border-opacity-50">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Edit Profile</h2>
                    <div className="flex space-x-3">
                      <Button
                        variant="primary"
                        onClick={handleSave}
                        loading={loading}
                        disabled={loading}
                        className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        <Save size={16} />
                        <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={loading}
                        className="flex items-center space-x-2"
                      >
                        <X size={16} />
                        <span>Cancel</span>
                      </Button>
                    </div>
                  </div>

                  {/* Messages */}
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}
                  {success && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-600">{success}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Username */}
                    <Input
                      label="Username"
                      name="username"
                      value={profileData.username}
                      onChange={handleInputChange}
                      placeholder="Enter your username"
                      fullWidth
                      required
                    />

                    {/* Name */}
                    <Input
                      label="Display Name"
                      name="name"
                      value={profileData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your display name"
                      fullWidth
                    />

                    {/* Email */}
                    <Input
                      label="Email"
                      name="email"
                      type="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      fullWidth
                      required
                    />

                    {/* Privacy Setting */}
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="is_private"
                        name="is_private"
                        checked={profileData.is_private}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="is_private" className="text-sm font-medium text-gray-700">
                        Make my profile private
                      </label>
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={profileData.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us about yourself..."
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </PageTransition>
    </Layout>
  );
};

export default ProfilePage;
