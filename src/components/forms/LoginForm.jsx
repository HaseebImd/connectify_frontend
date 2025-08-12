import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import Button from '../ui/Button';
import Input from '../ui/Input';

const LoginForm = ({ onSubmit, loading = false }) => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleFormSubmit = (data) => {
    onSubmit?.(data);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-6 w-full">
      {/* Email Field */}
      <Input
        label="Email Address"
        type="email"
        placeholder="Enter your email"
        fullWidth
        required
        leftIcon={<Mail size={16} />}
        error={errors.email?.message}
        {...register('email', {
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Please enter a valid email address',
          },
        })}
      />

      {/* Password Field */}
      <div>
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter your password"
          fullWidth
          required
          leftIcon={<Lock size={16} />}
          rightIcon={
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="bg-transparent border-none cursor-pointer text-text-secondary p-0 flex items-center justify-center hover:text-text-primary transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 4,
              message: 'Password must be at least 6 characters',
            },
          })}
        />
        
        <div className="text-right mt-4">
          <Link 
            to="/forgot-password" 
            className="text-primary text-sm font-medium hover:text-primary-hover transition-colors no-underline"
          >
            Forgot password?
          </Link>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="sm"
        fullWidth
        loading={loading}
        disabled={!isValid || loading}
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>

      {/* Divider */}
      <p className="text-center text-sm text-text-secondary">
        or
      </p>
      {/* Social Login Buttons */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        fullWidth
        onClick={() => {
          // TODO: Implement Google login
          console.log('Google login clicked');
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" className="mr-2">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </Button>

      {/* Sign Up Prompt */}
      <div className="text-center text-sm text-text-secondary">
        Don't have an account?{' '}
        <Link 
          to="/signup" 
          className="text-primary font-medium hover:text-primary-hover transition-colors no-underline"
        >
          Sign up
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;
