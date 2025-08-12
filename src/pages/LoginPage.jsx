import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout/Layout';
import PageTransition from '../components/common/PageTransition';
import Card from '../components/ui/Card';
import Logo from '../components/common/Logo';
import LoginForm from '../components/forms/LoginForm';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  // If user is already logged in, redirect to feed
  if (isAuthenticated) {
    return <Navigate to="/feed" replace />;
  }

  const handleLogin = async (data) => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const result = await login(data);

      if (result.success) {
        setSuccess(true);
        // Add a delay with success animation before navigation
        setTimeout(() => {
          navigate('/feed');
        }, 1500);
      } else {
        setError(result.error);
        setLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Layout showNavbar={true}>
      <PageTransition>
        <div
          className="h-screen flex items-center justify-center p-6 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #E7F3FF 0%, #F0F2F5 100%)',
            height: 'calc(100vh - 64px)' // Subtract navbar height
          }}
        >
          <div className="w-full max-w-sm flex flex-col gap-6">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h1>
              <p className="text-sm text-gray-600 leading-relaxed">
                Please log in to your account.
              </p>
            </div>

            {/* Login Form Card */}
            <Card variant="elevated" padding="xl">
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
              {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
                    <p className="text-sm text-green-600">Login successful! Redirecting...</p>
                  </div>
                </div>
              )}
              <LoginForm onSubmit={handleLogin} loading={loading} />
            </Card>
          </div>
        </div>
      </PageTransition>
    </Layout>
  );
};

export default LoginPage;
