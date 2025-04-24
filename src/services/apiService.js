import axios from 'axios';

// Log the API URL for debugging
console.log('API URL:', import.meta.env.VITE_API_URL);

// Create an axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Uses the base URL from environment
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors here (e.g., 401 unauthorized, etc.)
    if (error.response && error.response.status === 401) {
      // Clear localStorage on authentication failure
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // You could redirect to login page here if needed
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const apiService = {
  // Authentication endpoints
  auth: {
    login: async (email, password) => {
      try {
        // Using the correct endpoint
        const response = await api.post('/user/login', { email, password });
        
        // Check if response contains the expected data - matches the actual API response structure
        if (response.data && response.data.status === 'success' && response.data.data) {
          // Return the data in a format expected by AuthContext
          return {
            token: response.data.data.token,
            user: response.data.data.user
          };
        } else {
          throw new Error('Invalid response from server');
        }
      } catch (error) {
        throw new Error(
          error.response?.data?.message || 
          'Login failed. Please check your credentials and try again.'
        );
      }
    },
    
    // Logout endpoint
    logout: async () => {
      try {
        const response = await api.post('/user/logout');
        return response.data;
      } catch (error) {
        console.error('Logout API error:', error);
        // Don't throw the error so logout still works client-side
      }
    },
    
    // Forgot password endpoint
    forgotPassword: async (email) => {
      try {
        const response = await api.post('/user/forgot-password', { email });
        
        // Check if response is successful
        if (response.data && response.data.status === 'success') {
          return response.data;
        } else if (response.data && response.data.status === 'fail') {
          // Handle failure status explicitly
          throw new Error(response.data.message || 'Failed to process forgot password request');
        } else {
          throw new Error('Failed to process forgot password request');
        }
      } catch (error) {
        console.error('Forgot password error:', error); // Add for debugging
        // If the error has a response, extract the message
        if (error.response && error.response.data) {
          throw new Error(error.response.data.message || 'Failed to send password reset email. Please try again.');
        }
        // Otherwise, use the error message or a default
        throw new Error(error.message || 'Failed to send password reset email. Please try again.');
      }
    },
    
    // Verify OTP endpoint
    verifyOtp: async (email, otp) => {
      try {
        const response = await api.post('/user/verify-otp', { email, otp });
        
        // Check if response is successful
        if (response.data && response.data.status === 'success') {
          return response.data;
        } else if (response.data && response.data.status === 'fail') {
          // Handle failure status explicitly
          throw new Error(response.data.message || 'Failed to verify OTP');
        } else {
          throw new Error('Failed to verify OTP');
        }
      } catch (error) {
        console.error('Verify OTP error:', error); // Add for debugging
        // If the error has a response, extract the message
        if (error.response && error.response.data) {
          throw new Error(error.response.data.message || 'Invalid or expired OTP. Please try again.');
        }
        // Otherwise, use the error message or a default
        throw new Error(error.message || 'Invalid or expired OTP. Please try again.');
      }
    },
    
    // Resend OTP endpoint
    resendOtp: async (email) => {
      try {
        const response = await api.post('/user/resend-otp', { email });
        
        // Check if response is successful
        if (response.data && response.data.status === 'success') {
          return response.data;
        } else if (response.data && response.data.status === 'fail') {
          // Handle failure status explicitly
          throw new Error(response.data.message || 'Failed to resend OTP');
        } else {
          throw new Error('Failed to resend OTP');
        }
      } catch (error) {
        console.error('Resend OTP error:', error); // Add for debugging
        // If the error has a response, extract the message
        if (error.response && error.response.data) {
          throw new Error(error.response.data.message || 'Failed to resend OTP. Please try again later.');
        }
        // Otherwise, use the error message or a default
        throw new Error(error.message || 'Failed to resend OTP. Please try again later.');
      }
    },
    
    // You can add other auth-related endpoints here as needed
    // register, refreshToken, etc.
  },
  
  // User endpoints
  users: {
    getProfile: async () => {
      try {
        const response = await api.get('/user/profile');
        
        // Check if response contains the expected data format
        if (response.data && response.data.status === 'success') {
          return response.data.data;
        } else {
          throw new Error('Invalid profile data received from server');
        }
      } catch (error) {
        throw new Error(
          error.response?.data?.message || 
          'Failed to fetch user profile.'
        );
      }
    },
    
    updateProfile: async (userData) => {
      try {
        const response = await api.put('/user/profile', userData);
        
        // Check if response contains the expected data format
        if (response.data && response.data.status === 'success') {
          return response.data.data;
        } else {
          throw new Error('Failed to update profile data');
        }
      } catch (error) {
        throw new Error(
          error.response?.data?.message || 
          'Failed to update profile.'
        );
      }
    },
  },
  
  // Add more slices for other API sections as needed
  polling: {
    // Add polling station related endpoints
    getAll: async () => {
      try {
        const response = await api.get('/polling/stations');
        if (response.data && response.data.status === 'success') {
          return response.data.data;
        } else {
          throw new Error('Invalid polling data received');
        }
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch polling stations');
      }
    }
    // Add more polling endpoints as needed
  }
  
  // You can add more API slices here (e.g., elections, results, etc.)
};

export default apiService; 