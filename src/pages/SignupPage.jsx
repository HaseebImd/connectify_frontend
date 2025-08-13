import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Logo from '../components/common/Logo';
import SignupForm from '../components/forms/SignupForm';
import { useAuth } from '../context/AuthContext';

const SignupPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (data) => {
    setLoading(true);

    try {
      const result = await signup(data);

      console.log('Signup data:', data);

      if (result.success) {
        setTimeout(() => {
          setSuccess(true);
        }, 3000);
        setLoading(false);
        navigate('/login', {
          state: {
            message: 'Account created successfully! Please sign in.'
          }
        });
      } else {
        setError(result.error || 'Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }

  };

  return (
    <Layout showNavbar={true}>
      <div
        className="min-h-screen flex items-center justify-center p-6"
        style={{
          background: 'linear-gradient(135deg, #E8F5E8 0%, #F0F2F5 100%)'
        }}
      >
        <div className="w-full max-w-md flex flex-col gap-8">
          {/* Header */}
          <div className="text-center">

            <h1 className="text-3xl font-bold text-gray-900 mb-2 ">
              Join Connectify
            </h1>
            <p className="text-base text-gray-600 leading-relaxed">
              Create your account and start connecting with people around the world.
            </p>
          </div>

          {/* Signup Form Card */}
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
                  <p className="text-sm text-green-600">signup successful! Redirecting...</p>
                </div>
              </div>
            )}
            <SignupForm onSubmit={handleSignup} loading={loading} />
          </Card>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500">
            <p>
              By creating an account, you agree to our{' '}
              <a href="/terms" className="text-blue-600 hover:text-blue-700 transition-colors">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-blue-600 hover:text-blue-700 transition-colors">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SignupPage;
