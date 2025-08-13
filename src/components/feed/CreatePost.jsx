import React from 'react';
import { Image, Video, FileText, Smile } from 'lucide-react';
import Card from '../ui/Card';

const CreatePost = ({ user }) => {
    return (
        <Card variant="elevated" padding="md">
            <div className="space-y-4">
                {/* User Avatar and Input */}
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center overflow-hidden">
                        {user?.profile_image ? (
                            <img
                                src={`http://127.0.0.1:7000${user.profile_image}`}
                                alt={user.name || 'User'}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-white font-medium text-sm">
                                {user?.username?.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder={`What's on your mind, ${user?.username || 'User'}?`}
                            className="w-full px-4 py-3 bg-gray-100 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-700 placeholder-gray-500"
                        />
                    </div>
                </div>

                {/* Divider */}
                <hr className="border-gray-200" />

                {/* Action Buttons */}
                <div className="flex items-center justify-around">
                    <button className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <Video className="w-5 h-5 text-red-500" />
                        <span className="text-gray-600 font-medium">Live video</span>
                    </button>

                    <button className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <Image className="w-5 h-5 text-green-500" />
                        <span className="text-gray-600 font-medium">Photo/video</span>
                    </button>

                    <button className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <Smile className="w-5 h-5 text-yellow-500" />
                        <span className="text-gray-600 font-medium">Feeling/activity</span>
                    </button>
                </div>
            </div>
        </Card>
    );
};

export default CreatePost;
