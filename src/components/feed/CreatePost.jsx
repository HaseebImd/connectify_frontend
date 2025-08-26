import React, { useState, useContext } from 'react';
import { Image, Video, Smile } from 'lucide-react';
import AuthContext from '../../context/AuthContext';
import Card from '../ui/Card';
import CreatePostModal from './CreatePostModal';
import { ToastContainer } from '../ui/Toast';
import useToast from '../../hooks/useToast';

/**
 * Create Post Trigger Component
 * Opens the CreatePostModal when clicked
 */
const CreatePost = ({ onPostCreated }) => {
    const { user } = useContext(AuthContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { toasts, removeToast } = useToast();

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
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
                            <button
                                onClick={handleOpenModal}
                                className="w-full px-4 py-3 bg-gray-100 rounded-full border-0 text-left hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-500 transition-colors duration-200"
                            >
                                {`What's on your mind, ${user?.username || 'User'}?`}
                            </button>
                        </div>
                    </div>

                    {/* Divider */}
                    <hr className="border-gray-200" />

                    {/* Action Buttons */}
                    <div className="flex items-center justify-around">
                        <button 
                            onClick={handleOpenModal}
                            className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                        >
                            <Video className="w-5 h-5 text-red-500" />
                            <span className="text-gray-600 font-medium">Live video</span>
                        </button>

                        <button 
                            onClick={handleOpenModal}
                            className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                        >
                            <Image className="w-5 h-5 text-green-500" />
                            <span className="text-gray-600 font-medium">Photo/video</span>
                        </button>

                        <button 
                            onClick={handleOpenModal}
                            className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                        >
                            <Smile className="w-5 h-5 text-yellow-500" />
                            <span className="text-gray-600 font-medium">Feeling/activity</span>
                        </button>
                    </div>
                </div>
            </Card>

            {/* Create Post Modal */}
            <CreatePostModal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal}
                onPostCreated={onPostCreated}
            />

            {/* Toast Notifications */}
            <ToastContainer 
                toasts={toasts} 
                onRemoveToast={removeToast} 
            />
        </>
    );
};

export default CreatePost;
