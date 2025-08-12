import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Camera, AtSign } from 'lucide-react';
import { useForm } from 'react-hook-form';
import Button from '../ui/Button';
import Input from '../ui/Input';

const SignupForm = ({ onSubmit, loading = false }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (data) => {
    const { confirmPassword: _confirmPassword, ...submitData } = data;
    const formData = {
      ...submitData,
      profilePic: profileImage,
    };
    onSubmit?.(formData);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-6 w-full">
      {/* Avatar Picker */}
      <div className="flex flex-col items-center gap-4 mb-2">
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-4 border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={32} className="text-gray-400" />
            )}
          </div>
          <label
            htmlFor="profile-image"
            className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors shadow-lg"
          >
            <Camera size={16} className="text-white" />
          </label>
          <input
            id="profile-image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
      </div>

      {/* First Name and Last Name Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="First Name"
          type="text"
          placeholder="Enter your first name"
          fullWidth
          required
          leftIcon={<User size={16} />}
          error={errors.firstName?.message}
          {...register('firstName', {
            required: 'First name is required',
            minLength: {
              value: 2,
              message: 'First name must be at least 2 characters',
            },
            pattern: {
              value: /^[a-zA-Z]+$/,
              message: 'First name can only contain letters',
            },
          })}
        />

        <Input
          label="Last Name"
          type="text"
          placeholder="Enter your last name"
          fullWidth
          required
          leftIcon={<User size={16} />}
          error={errors.lastName?.message}
          {...register('lastName', {
            required: 'Last name is required',
            minLength: {
              value: 2,
              message: 'Last name must be at least 2 characters',
            },
            pattern: {
              value: /^[a-zA-Z]+$/,
              message: 'Last name can only contain letters',
            },
          })}
        />
      </div>

      {/* Username Field */}
      <Input
        label="Username"
        type="text"
        placeholder="Choose a unique username"
        fullWidth
        required
        leftIcon={<AtSign size={16} />}
        error={errors.username?.message}
        {...register('username', {
          required: 'Username is required',
          minLength: {
            value: 3,
            message: 'Username must be at least 3 characters',
          },
          maxLength: {
            value: 20,
            message: 'Username must be less than 20 characters',
          },
          pattern: {
            value: /^[a-zA-Z0-9_]+$/,
            message: 'Username can only contain letters, numbers, and underscores',
          },
        })}
      />

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
      <Input
        label="Password"
        type={showPassword ? 'text' : 'password'}
        placeholder="Create a password"
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
        helperText="Password must be at least 8 characters with uppercase, lowercase, and number"
        {...register('password', {
          required: 'Password is required',
          minLength: {
            value: 8,
            message: 'Password must be at least 8 characters',
          },
          pattern: {
            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            message: 'Password must contain uppercase, lowercase, and number',
          },
        })}
      />

      {/* Confirm Password Field */}
      <Input
        label="Confirm Password"
        type={showConfirmPassword ? 'text' : 'password'}
        placeholder="Confirm your password"
        fullWidth
        required
        leftIcon={<Lock size={16} />}
        rightIcon={
          <button
            type="button"
            onClick={toggleConfirmPasswordVisibility}
            className="bg-transparent border-none cursor-pointer text-text-secondary p-0 flex items-center justify-center hover:text-text-primary transition-colors"
          >
            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        }
        error={errors.confirmPassword?.message}
        {...register('confirmPassword', {
          required: 'Please confirm your password',
          validate: (value) =>
            value === password || 'Passwords do not match',
        })}
      />

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="sm"
        fullWidth
        loading={loading}
        disabled={!isValid || loading}
      >
        {loading ? 'Creating account...' : 'Create Account'}
      </Button>

    <p className="text-center text-sm text-text-secondary">
      or
    </p>

      {/* Social Signup Buttons */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        fullWidth
        onClick={() => {
          // TODO: Implement Google signup
          console.log('Google signup clicked');
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

      {/* Login Prompt */}
      <div className="text-center text-sm text-text-secondary">
        Already have an account?{' '}
        <Link 
          to="/login" 
          className="text-primary font-medium hover:text-primary-hover transition-colors no-underline"
        >
          Sign in
        </Link>
      </div>
    </form>
  );
};

export default SignupForm;
