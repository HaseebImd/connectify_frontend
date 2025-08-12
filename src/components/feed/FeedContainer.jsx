import React from 'react';
import PostCard from './PostCard';

const FeedContainer = () => {
  // Dummy posts data
  const posts = [
    // Image Posts
    {
      id: 1,
      type: 'image',
      author: {
        name: 'Sarah Johnson',
        avatar: 'SJ'
      },
      content: 'Just had an amazing weekend getaway in the mountains! The view was absolutely breathtaking. Nature has a way of refreshing the soul. 🏔️✨',
      media: {
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        alt: 'Mountain landscape'
      },
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      likes: 124,
      comments: 18,
      shares: 7,
      sampleComments: [
        { author: 'Mike Chen', text: 'Wow, what a stunning view! Where is this?' },
        { author: 'Emma Davis', text: 'So jealous! I need a vacation like this.' }
      ]
    },
    {
      id: 2,
      type: 'image',
      author: {
        name: 'David Rodriguez',
        avatar: 'DR'
      },
      content: 'Tried making homemade pasta for the first time today! It was quite the adventure, but the results were delicious. Cooking is definitely therapeutic. 🍝👨‍🍳',
      media: {
        url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2132&q=80',
        alt: 'Homemade pasta dish'
      },
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      likes: 89,
      comments: 12,
      shares: 3,
      sampleComments: [
        { author: 'Lisa Wang', text: 'That looks absolutely delicious! Recipe please?' },
        { author: 'Tom Wilson', text: 'Making me hungry! Great job on your first attempt.' }
      ]
    },

    // Video Posts
    {
      id: 3,
      type: 'video',
      author: {
        name: 'Alex Thompson',
        avatar: 'AT'
      },
      content: 'Check out this amazing guitar performance I recorded yesterday! Been practicing this piece for months. Music is my passion and I love sharing it with you all. 🎸🎵',
      media: {
        title: 'Acoustic Guitar Performance - "Wonderwall"',
        duration: '3:42',
        thumbnail: 'guitar-performance.jpg'
      },
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      likes: 256,
      comments: 34,
      shares: 15,
      sampleComments: [
        { author: 'Maria Garcia', text: 'Incredible talent! You should perform professionally.' },
        { author: 'James Lee', text: 'Gave me chills! Beautiful performance.' }
      ]
    },
    {
      id: 4,
      type: 'video',
      author: {
        name: 'Rachel Green',
        avatar: 'RG'
      },
      content: 'Morning workout session complete! 💪 Starting the day with some high-intensity training. Remember, consistency is key to achieving your fitness goals. Who else is working out today?',
      media: {
        title: 'Morning HIIT Workout Routine',
        duration: '15:30',
        thumbnail: 'workout-video.jpg'
      },
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      likes: 178,
      comments: 28,
      shares: 9,
      sampleComments: [
        { author: 'Kevin Park', text: 'Motivation at its finest! Thanks for the inspiration.' },
        { author: 'Sophie Brown', text: 'Just finished my workout too! Great energy.' }
      ]
    },

    // PDF/Document Posts
    {
      id: 5,
      type: 'pdf',
      author: {
        name: 'Dr. Jennifer Martinez',
        avatar: 'JM'
      },
      content: 'Excited to share my latest research paper on sustainable technology innovations! This comprehensive study explores how emerging technologies can help combat climate change. Would love to hear your thoughts and feedback from the community.',
      media: {
        title: 'Sustainable Technology Innovations: A Path to Carbon Neutrality',
        description: 'A comprehensive analysis of emerging technologies and their potential impact on environmental sustainability, including renewable energy systems, carbon capture methods, and green manufacturing processes.',
        pages: 24,
        size: '2.3 MB'
      },
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      likes: 342,
      comments: 67,
      shares: 89,
      sampleComments: [
        { author: 'Prof. Anderson', text: 'Excellent research! The methodology is particularly impressive.' },
        { author: 'Climate Activist', text: 'This gives me hope for our future. Thank you for this work.' }
      ]
    },
    {
      id: 6,
      type: 'pdf',
      author: {
        name: 'Michael Chang',
        avatar: 'MC'
      },
      content: 'Sharing my comprehensive guide on modern web development best practices. This document covers everything from React patterns to deployment strategies. Perfect for developers looking to level up their skills! 🚀',
      media: {
        title: 'Modern Web Development: Best Practices Guide 2024',
        description: 'An in-depth guide covering React development patterns, state management, testing strategies, performance optimization, and modern deployment techniques for scalable web applications.',
        pages: 156,
        size: '8.7 MB'
      },
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      likes: 567,
      comments: 123,
      shares: 234,
      sampleComments: [
        { author: 'Sarah Dev', text: 'This is gold! Bookmarked for future reference.' },
        { author: 'Junior Coder', text: 'Exactly what I needed to improve my skills. Thank you!' }
      ]
    },
    {
      id: 7,
      type: 'pdf',
      author: {
        name: 'Lisa Chen',
        avatar: 'LC'
      },
      content: 'Published my quarterly market analysis report! This document provides insights into current market trends, investment opportunities, and economic forecasts. Essential reading for anyone interested in financial markets.',
      media: {
        title: 'Q4 2024 Market Analysis & Investment Outlook',
        description: 'Detailed analysis of global market trends, sector performance, emerging investment opportunities, and economic indicators with forecasts for the upcoming quarter.',
        pages: 89,
        size: '5.2 MB'
      },
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      likes: 234,
      comments: 45,
      shares: 67,
      sampleComments: [
        { author: 'Investor Joe', text: 'Great insights on the tech sector trends!' },
        { author: 'Finance Pro', text: 'Your analysis helped me make some key decisions.' }
      ]
    },
    {
      id: 8,
      type: 'pdf',
      author: {
        name: 'Robert Kim',
        avatar: 'RK'
      },
      content: 'Completed my thesis on artificial intelligence in healthcare! This research explores how AI can revolutionize patient care and medical diagnostics. Excited to contribute to this important field.',
      media: {
        title: 'AI in Healthcare: Transforming Patient Care Through Technology',
        description: 'Research thesis examining the applications of artificial intelligence in medical diagnostics, treatment planning, and patient care optimization, with case studies and implementation frameworks.',
        pages: 198,
        size: '12.4 MB'
      },
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
      likes: 445,
      comments: 78,
      shares: 156,
      sampleComments: [
        { author: 'Dr. Smith', text: 'Groundbreaking research! The implications are fascinating.' },
        { author: 'Med Student', text: 'This will definitely influence my career path. Amazing work!' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default FeedContainer;
