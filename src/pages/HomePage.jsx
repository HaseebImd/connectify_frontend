import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Users, MessageCircle, Heart, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout/Layout';
import PageTransition from '../components/common/PageTransition';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { colors, spacing } from '../constants/theme';

const HomePage = () => {
  const { user } = useAuth();

  const pageStyles = {
    minHeight: '100vh',
    backgroundColor: colors.background,
  };

  const containerStyles = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: spacing.lg,
  };

  const heroStyles = {
    textAlign: 'center',
    padding: `${spacing.xxl} 0`,
    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
    color: 'white',
    borderRadius: '16px',
    marginBottom: spacing.xl,
  };

  const heroTitleStyles = {
    fontSize: '48px',
    fontWeight: '700',
    marginBottom: spacing.lg,
    lineHeight: '1.2',
  };

  const heroSubtitleStyles = {
    fontSize: '20px',
    marginBottom: spacing.xl,
    opacity: 0.9,
    maxWidth: '600px',
    margin: `0 auto ${spacing.xl} auto`,
  };

  const featuresGridStyles = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: spacing.xl,
    marginBottom: spacing.xxl,
  };

  const featureCardStyles = {
    textAlign: 'center',
    padding: spacing.xl,
  };

  const featureIconStyles = {
    width: '64px',
    height: '64px',
    backgroundColor: colors.primaryLight,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: `0 auto ${spacing.lg} auto`,
    color: colors.primary,
  };

  const featureTitleStyles = {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: spacing.md,
    color: colors.textPrimary,
  };

  const featureDescriptionStyles = {
    fontSize: '16px',
    color: colors.textSecondary,
    lineHeight: '1.6',
  };

  const ctaStyles = {
    textAlign: 'center',
    padding: spacing.xxl,
    backgroundColor: colors.surface,
    borderRadius: '16px',
    border: `1px solid ${colors.borderLight}`,
  };

  const ctaTitleStyles = {
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: spacing.md,
    color: colors.textPrimary,
  };

  const ctaSubtitleStyles = {
    fontSize: '18px',
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    maxWidth: '500px',
    margin: `0 auto ${spacing.xl} auto`,
  };

  const buttonGroupStyles = {
    display: 'flex',
    gap: spacing.md,
    justifyContent: 'center',
    flexWrap: 'wrap',
  };

  const features = [
    {
      icon: <Users size={32} />,
      title: 'Connect with Friends',
      description: 'Find and connect with friends, family, and people who share your interests.',
    },
    {
      icon: <MessageCircle size={32} />,
      title: 'Share Your Story',
      description: 'Post updates, photos, and thoughts to keep your network updated on your life.',
    },
    {
      icon: <Heart size={32} />,
      title: 'Build Communities',
      description: 'Join groups and communities based on your hobbies, interests, and passions.',
    },
  ];

  // If user is logged in, redirect to feed
  if (user) {
    return <Navigate to="/feed" replace />;
  }

  // Landing page for non-logged-in users
  return (
    <Layout user={user}>
      <PageTransition>
        <div style={pageStyles}>
          {/* Hero Section */}
          <div style={heroStyles}>
            <div style={containerStyles}>
              <h1 style={heroTitleStyles}>Connect with the World</h1>
              <p style={heroSubtitleStyles}>
                Join millions of people sharing their stories, connecting with friends, 
                and building communities on Connectify.
              </p>
              <div style={buttonGroupStyles}>
                <Link to="/signup" style={{ textDecoration: 'none' }}>
                  <Button variant="secondary" size="sm">
                    Get Started
                  </Button>
                </Link>
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <Button variant="outline" size="sm" style={{ color: 'white', borderColor: 'white' }}>
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div style={containerStyles}>
            {/* Features Section */}
            <div style={featuresGridStyles}>
              {features.map((feature, index) => (
                <Card key={index} variant="elevated" style={featureCardStyles}>
                  <div style={featureIconStyles}>
                    {feature.icon}
                  </div>
                  <h3 style={featureTitleStyles}>{feature.title}</h3>
                  <p style={featureDescriptionStyles}>{feature.description}</p>
                </Card>
              ))}
            </div>

            {/* Call to Action */}
            <div style={ctaStyles}>
              <h2 style={ctaTitleStyles}>Ready to get started?</h2>
              <p style={ctaSubtitleStyles}>
                Join Connectify today and start building meaningful connections with people around the world.
              </p>
              <div style={buttonGroupStyles}>
                <Link to="/signup" style={{ textDecoration: 'none' }}>
                  <Button variant="primary" size="sm">
                    Create Account
                  </Button>
                </Link>
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    </Layout>
  );
};

export default HomePage;
