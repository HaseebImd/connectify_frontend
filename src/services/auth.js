import api from './api';

export const authService = {
  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/users/login/', credentials);
      const { access, refresh, user } = response.data;

      // Store tokens and user data
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isAuthenticated', 'true');

      return { success: true, data: response.data };
    } catch (error) {
      console.error('Login error:', error);

      let errorMessage = 'Login failed. Please try again.';

      if (error.response?.status === 401) {
        errorMessage = 'Invalid email or password.';
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data?.detail || 'Invalid credentials.';
      } else if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        errorMessage = 'Unable to connect to server. Please check your connection.';
      }

      return { success: false, error: errorMessage };
    }
  },

  signup: async (data) => {
    try {
      const response = await api.post('/users/register/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.error('Signup error:', error);
      let errorMessage = 'Signup failed. Please try again.';

      if (error.response?.status === 400) {
        const errData = error.response.data;

        if (typeof errData === 'object' && !Array.isArray(errData)) {
          // Example: { email: ["user with this email address already exists."] }
          const firstKey = Object.keys(errData)[0];
          errorMessage = errData[firstKey]?.[0] || 'Invalid signup data.';
        } else if (Array.isArray(errData)) {
          // Example: ["Some general error"]
          errorMessage = errData[0];
        } else if (errData?.detail) {
          // Example: { detail: "Some detail message" }
          errorMessage = errData.detail;
        }
      } else if (
        error.code === 'ECONNREFUSED' ||
        error.code === 'ERR_NETWORK'
      ) {
        errorMessage = 'Unable to connect to server. Please check your connection.';
      }

      return { success: false, error: errorMessage };
    }
  }
  ,

  // Logout user
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('accessToken');
    const isAuth = localStorage.getItem('isAuthenticated');
    return !!(token && isAuth === 'true');
  },

  // Get access token
  getAccessToken: () => {
    return localStorage.getItem('accessToken');
  },

  // Get refresh token
  getRefreshToken: () => {
    return localStorage.getItem('refreshToken');
  },

  // Get user profile
  getUserProfile: async () => {
    try {
      const response = await api.get('/users/me/');
      console.log('Get profile response:', response);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Get profile error:', error);
      return { success: false, error: 'Failed to fetch profile' };
    }
  },

  // Update user profile
  updateUserProfile: async (profileData) => {
    try {
      const response = await api.patch('/users/me/', profileData);

      // Update stored user data
      localStorage.setItem('user', JSON.stringify(response.data));

      return { success: true, data: response.data };
    } catch (error) {
      console.error('Update profile error:', error);

      let errorMessage = 'Failed to update profile';
      if (error.response?.status === 400) {
        errorMessage = error.response.data?.detail || 'Invalid profile data';
      }

      return { success: false, error: errorMessage };
    }
  }
};

export default authService;
