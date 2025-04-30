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
    
    // Reset password endpoint
    resetPassword: async (email, otp, password, confirmPassword) => {
      try {
        const response = await api.post('/user/reset-password', { 
          email, 
          otp, 
          password,
          confirmPassword 
        });
        
        // Check if response is successful
        if (response.data && response.data.status === 'success') {
          return response.data;
        } else if (response.data && response.data.status === 'fail') {
          // Handle failure status explicitly
          throw new Error(response.data.message || 'Failed to reset password');
        } else {
          throw new Error('Failed to reset password');
        }
      } catch (error) {
        console.error('Reset password error:', error); // Add for debugging
        // If the error has a response, extract the message
        if (error.response && error.response.data) {
          throw new Error(error.response.data.message || 'Failed to reset password. Please try again.');
        }
        // Otherwise, use the error message or a default
        throw new Error(error.message || 'Failed to reset password. Please try again.');
      }
    },
    
    // You can add other auth-related endpoints here as needed
    // register, refreshToken, etc.
  },
  
  // Feedback endpoints
  feedback: {
    getAllFeedback: async (page = 1, limit = 10) => {
      try {
        const response = await api.get(`/feedback/get-all-feedback?page=${page}&limit=${limit}`);
        
        // Check if response is successful
        if (response.data && response.data.status === 'success') {
          return response.data;
        } else {
          throw new Error('Failed to fetch feedback data');
        }
      } catch (error) {
        console.error('Error fetching feedback:', error);
        throw new Error(
          error.response?.data?.message || 
          'Failed to load feedback. Please try again later.'
        );
      }
    }
  },
  
  // Notifications endpoints
  notifications: {
    getAll: async (page = 1, limit = 10) => {
      try {
        const response = await api.get(`/notification/get-all-notifications?page=${page}&limit=${limit}`);
        
        if (response.data && response.data.status === 'success') {
          return response.data;
        } else {
          throw new Error('Failed to fetch notifications');
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
        throw new Error(
          error.response?.data?.message || 
          'Failed to load notifications. Please try again later.'
        );
      }
    },
    
    create: async (notificationData) => {
      try {
        const response = await api.post('/notification/add-notification', {
          title: notificationData.title,
          body: notificationData.message
        });
        
        if (response.data && response.data.status === 'success') {
          return response.data;
        } else {
          throw new Error('Failed to create notification');
        }
      } catch (error) {
        console.error('Error creating notification:', error);
        throw new Error(
          error.response?.data?.message || 
          'Failed to create notification. Please try again later.'
        );
      }
    },
    
    delete: async (id) => {
      try {
        const response = await api.delete(`/notification/delete-notification/${id}`);
        
        if (response.data && response.data.status === 'success') {
          return response.data;
        } else {
          throw new Error('Failed to delete notification');
        }
      } catch (error) {
        console.error('Error deleting notification:', error);
        throw new Error(
          error.response?.data?.message || 
          'Failed to delete notification. Please try again later.'
        );
      }
    }
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
    
    createAdministrator: async (userData) => {
      try {
        const response = await api.post('/user/register', {
          name: userData.name,
          email: userData.email,
          password: userData.password
        });
        
        // Check if response contains the expected data format
        if (response.data && response.data.status === 'success') {
          return response.data.data;
        } else {
          throw new Error('Failed to create administrator account');
        }
      } catch (error) {
        console.error('Create administrator error:', error);
        // If the error has a response, extract the message
        if (error.response && error.response.data) {
          throw new Error(error.response.data.message || 'Failed to create administrator account. Please try again.');
        }
        // Otherwise, use the error message or a default
        throw new Error(error.message || 'Failed to create administrator account. Please try again.');
      }
    },
    
    getUserByEmail: async (email) => {
      try {
        const response = await api.get(`/user/by-email/${email}`);
        
        // Check if response contains the expected data format
        if (response.data && response.data.status === 'success') {
          return response.data.data;
        } else {
          throw new Error('Invalid user data received from server');
        }
      } catch (error) {
        throw new Error(
          error.response?.data?.message || 
          'Failed to fetch user information.'
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
  },
  
  // Centre management endpoints
  centres: {
    // Register a new electoral centre
    register: async (centreData) => {
      try {
        const response = await api.post('/centre/register-centre', centreData);
        
        // Check if response is successful
        if (response.data && response.data.status === 'success') {
          return response.data.data;
        } else if (response.data && response.data.status === 'fail') {
          // Handle failure status explicitly
          throw new Error(response.data.message || 'Failed to register centre');
        } else {
          throw new Error('Failed to register centre');
        }
      } catch (error) {
        console.error('Centre registration error:', error); // Add for debugging
        // If the error has a response, extract the message
        if (error.response && error.response.data) {
          throw new Error(error.response.data.message || 'Failed to register electoral centre. Please try again.');
        }
        // Otherwise, use the error message or a default
        throw new Error(error.message || 'Failed to register electoral centre. Please try again.');
      }
    },
    
    // Upload Excel file for bulk centre registration
    uploadBulk: async (formData) => {
      try {
        const response = await api.post('/centre/upload-centre-bulk', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        // Check if response is successful
        if (response.data && response.data.status === 'success') {
          return response.data;
        } else if (response.data && response.data.status === 'fail') {
          // Handle failure status explicitly
          throw new Error(response.data.message || 'Failed to upload centres');
        } else {
          throw new Error('Failed to upload centres');
        }
      } catch (error) {
        console.error('Centre bulk upload error:', error);
        // If the error has a response, extract the message
        if (error.response && error.response.data) {
          throw new Error(error.response.data.message || 'Failed to upload centres. Please try again.');
        }
        // Otherwise, use the error message or a default
        throw new Error(error.message || 'Failed to upload centres. Please try again.');
      }
    },
    
    // Bulk register multiple electoral centres
    registerBulk: async (centresData) => {
      try {
        const response = await api.post('/centre/upload-centre-bulk', centresData);
        
        // Check if response is successful
        if (response.data && response.data.status === 'success') {
          return response.data;
        } else if (response.data && response.data.status === 'fail') {
          // Handle failure status explicitly
          throw new Error(response.data.message || 'Failed to register centres in bulk');
        } else {
          throw new Error('Failed to register centres in bulk');
        }
      } catch (error) {
        console.error('Bulk centre registration error:', error); // Add for debugging
        // If the error has a response, extract the message
        if (error.response && error.response.data) {
          throw new Error(error.response.data.message || 'Failed to register electoral centres in bulk. Please try again.');
        }
        // Otherwise, use the error message or a default
        throw new Error(error.message || 'Failed to register electoral centres in bulk. Please try again.');
      }
    },
    
    // Get all centres with pagination
    getAllCentres: async (page = 1, limit = 10) => {
      try {
        const response = await api.get(`/centre/get-all-centres?page=${page}&limit=${limit}`);
        
        if (response.data && response.data.status === 'success') {
          return response.data.data;
        } else {
          throw new Error('Failed to fetch centres');
        }
      } catch (error) {
        console.error('Get all centres error:', error);
        if (error.response && error.response.data) {
          throw new Error(error.response.data.message || 'Failed to fetch centres. Please try again.');
        }
        throw new Error(error.message || 'Failed to fetch centres. Please try again.');
      }
    },
    
    // Get all centres - placeholder for future implementation
    getAll: async () => {
      try {
        const response = await api.get('/centre/centres');
        if (response.data && response.data.status === 'success') {
          return response.data.data;
        } else {
          throw new Error('Invalid centres data received');
        }
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch electoral centres');
      }
    },
    
    // Delete an electoral centre
    deleteCentre: async (centreId) => {
      try {
        const response = await api.delete(`/centre/delete-centre/${centreId}`);
        
        if (response.data && response.data.status === 'success') {
          return response.data.data;
        } else if (response.data && response.data.status === 'fail') {
          throw new Error(response.data.message || 'Failed to delete centre');
        } else {
          throw new Error('Failed to delete centre');
        }
      } catch (error) {
        console.error('Delete centre error:', error);
        if (error.response && error.response.data) {
          throw new Error(error.response.data.message || 'Failed to delete electoral centre. Please try again.');
        }
        throw new Error(error.message || 'Failed to delete electoral centre. Please try again.');
      }
    },
    
    // Update an electoral centre
    updateCentre: async (centreId, centreData) => {
      try {
        const response = await api.put(`/centre/update-centre/${centreId}`, centreData);
        
        if (response.data && response.data.status === 'success') {
          return response.data.data;
        } else if (response.data && response.data.status === 'fail') {
          throw new Error(response.data.message || 'Failed to update centre');
        } else {
          throw new Error('Failed to update centre');
        }
      } catch (error) {
        console.error('Update centre error:', error);
        if (error.response && error.response.data) {
          throw new Error(error.response.data.message || 'Failed to update electoral centre. Please try again.');
        }
        throw new Error(error.message || 'Failed to update electoral centre. Please try again.');
      }
    }
    // Add more centre endpoints as needed
  },
  
  // Candidate management endpoints
  candidates: {
    // Register a new candidate with photo
    register: async (candidateData) => {
      try {
        // Create FormData to handle file upload
        const formData = new FormData();
        
        // Add all text fields directly
        formData.append('name', candidateData.fullName);
        formData.append('party_id', candidateData.party);
        formData.append('position', candidateData.position);
        formData.append('region', candidateData.region);
        formData.append('election_type', candidateData.election_type);
        
        // Add the photo file with the correct field name
        if (candidateData.photo) {
          formData.append('candidate_image', candidateData.photo);
        }
        
        // Debug: Log form data
        console.log('Candidate form data being sent:');
        console.log('- name:', formData.get('name'));
        console.log('- party_id:', formData.get('party_id'));
        console.log('- position:', formData.get('position'));
        console.log('- region:', formData.get('region'));
        console.log('- election_type:', formData.get('election_type'));
        console.log('- candidate_image:', formData.get('candidate_image') ? 'File attached' : 'No file');
        
        const response = await api.post('/candidate/register-candidate', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        // Check if response is successful
        if (response.data && response.data.status === 'success') {
          return response.data.data;
        } else if (response.data && (response.data.status === 'fail' || response.data.status === 'error')) {
          // For validation errors, throw with the full error object
          throw response.data;
        } else {
          throw new Error('Failed to register candidate');
        }
      } catch (error) {
        console.error('Candidate registration error:', error);
        // If the error is already our custom error with details, just re-throw it
        if (error.status && (error.message || error.details)) {
          throw error;
        }
        // If the error has a response from the server, throw that
        if (error.response && error.response.data) {
          throw error.response.data;
        }
        // Otherwise, throw a generic error
        throw new Error(error.message || 'Failed to register candidate. Please try again.');
      }
    },
    
    // Get all candidates with pagination
    getAll: async (page = 1, limit = 10) => {
      try {
        const response = await api.get(`/candidate/get-all-candidates?page=${page}&limit=${limit}`);
        
        if (response.data && response.data.status === 'success') {
          return response.data.data;
        } else {
          throw new Error('Failed to fetch candidates');
        }
      } catch (error) {
        console.error('Get all candidates error:', error);
        if (error.response && error.response.data) {
          throw new Error(error.response.data.message || 'Failed to fetch candidates. Please try again.');
        }
        throw new Error(error.message || 'Failed to fetch candidates. Please try again.');
      }
    },
    
    // Delete a candidate
    deleteCandidate: async (candidateId) => {
      try {
        const response = await api.delete(`/candidate/delete-candidate/${candidateId}`);
        
        if (response.data && response.data.status === 'success') {
          return response.data.data;
        } else if (response.data && response.data.status === 'fail') {
          throw new Error(response.data.message || 'Failed to delete candidate');
        } else {
          throw new Error('Failed to delete candidate');
        }
      } catch (error) {
        console.error('Delete candidate error:', error);
        if (error.response && error.response.data) {
          throw new Error(error.response.data.message || 'Failed to delete candidate. Please try again.');
        }
        throw new Error(error.message || 'Failed to delete candidate. Please try again.');
      }
    },
    
    // Update a candidate
    updateCandidate: async (candidateId, candidateData) => {
      try {
        // Create FormData to handle file upload if needed
        const formData = new FormData();
        
        // Append all fields to FormData
        Object.keys(candidateData).forEach(key => {
          // If the value is a File object or it's not a string URL path (for images)
          if (candidateData[key] && 
              (candidateData[key] instanceof File || 
               (key === 'candidate_image' && typeof candidateData[key] !== 'string'))) {
            formData.append(key, candidateData[key]);
          } else if (candidateData[key] !== null && candidateData[key] !== undefined) {
            formData.append(key, candidateData[key]);
          }
        });
        
        const response = await api.put(
          `/candidate/update-candidate/${candidateId}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        
        if (response.data && response.data.status === 'success') {
          return response.data.data;
        } else if (response.data && response.data.status === 'fail') {
          throw new Error(response.data.message || 'Failed to update candidate');
        } else {
          throw new Error('Failed to update candidate');
        }
      } catch (error) {
        console.error('Update candidate error:', error);
        if (error.response && error.response.data) {
          throw new Error(error.response.data.message || 'Failed to update candidate. Please try again.');
        }
        throw new Error(error.message || 'Failed to update candidate. Please try again.');
      }
    }
    // Add more candidate endpoints as needed
  },
  
  // Party management endpoints
  parties: {
    // Get all parties
    getAll: async () => {
      try {
        const response = await api.get('/party/get-parties');
        
        // Check if response is successful
        if (response.data && response.data.status === 'success') {
          return response.data;
        } else {
          throw new Error('Failed to fetch parties');
        }
      } catch (error) {
        console.error('Fetch parties error:', error);
        throw error;
      }
    },
    
    // Get a specific party by ID
    getPartyById: async (partyId) => {
      try {
        const response = await api.get(`/party/get-party/${partyId}`);
        
        // Return the complete response data
        return response.data;
      } catch (error) {
        console.error(`Get party by ID (${partyId}) error:`, error);
        if (error.response && error.response.data) {
          throw error.response.data;
        }
        throw new Error(error.message || 'Failed to fetch party details. Please try again.');
      }
    }
    // Add more party endpoints as needed
  },
  
  // Guides endpoints
  guides: {
    uploadGuide: async (formData) => {
      try {
        // Log what we're sending
        console.log('Calling guide/add-guide endpoint');
        
        // Log form data contents
        console.log('FormData contents:');
        for (let pair of formData.entries()) {
          if (pair[0] === 'file') {
            console.log(pair[0], 'File object:', pair[1].name, pair[1].type, pair[1].size);
          } else {
            console.log(pair[0], pair[1]);
          }
        }
        
        const response = await api.post('/guide/add-guide', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        // Log the response
        console.log('API response:', response.data);
        
        // Check if response is successful
        if (response.data && response.data.status === 'success') {
          return response.data;
        } else if (response.data && response.data.status === 'fail') {
          throw new Error(response.data.message || 'Failed to upload guide');
        } else {
          throw new Error('Failed to upload guide');
        }
      } catch (error) {
        console.error('Guide upload error:', error);
        // Log detailed error information
        if (error.response) {
          console.error('Error response status:', error.response.status);
          console.error('Error response data:', error.response.data);
          console.error('Error response headers:', error.response.headers);
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else {
          console.error('Error setting up request:', error.message);
        }
        
        if (error.response && error.response.data) {
          throw new Error(error.response.data.message || 'Failed to upload guide. Please try again.');
        }
        throw new Error(error.message || 'Failed to upload guide. Please try again.');
      }
    },
    
    // Get all guides
    getGuides: async (page = 1, limit = 10) => {
      try {
        const response = await api.get(`/guide/get-guides?page=${page}&limit=${limit}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching guides:', error);
        throw new Error(
          error.response?.data?.message || 
          'Failed to load guides. Please try again later.'
        );
      }
    },
    deleteGuide: async (id) => {
      try {
        const response = await api.delete(`/guide/delete-guide/${id}`);
        if (response.data && response.data.status === 'success') {
          return response.data;
        } else {
          throw new Error('Failed to delete guide');
        }
      } catch (error) {
        console.error('Error deleting guide:', error);
        throw new Error(
          error.response?.data?.message || 
          'Failed to delete guide. Please try again later.'
        );
      }
    }
  },
  
  // Analytics endpoints
  analytics: {
    // Get candidates grouped by party
    getCandidatesByParty: async () => {
      try {
        const response = await api.get('/analytics/candidates-by-party');
        
        if (response.data && response.data.status === 'success') {
          return response.data;
        } else {
          throw new Error('Failed to fetch candidates by party data');
        }
      } catch (error) {
        console.error('Fetch candidates by party error:', error);
        if (error.response && error.response.data) {
          throw new Error(error.response.data.message || 'Failed to fetch candidates by party. Please try again.');
        }
        throw new Error(error.message || 'Failed to fetch candidates by party. Please try again.');
      }
    },
    
    // Get centres grouped by region
    getCentresByRegion: async () => {
      try {
        const response = await api.get('/analytics/centres-by-region');
        
        if (response.data && response.data.status === 'success') {
          return response.data;
        } else {
          throw new Error('Failed to fetch centres by region data');
        }
      } catch (error) {
        console.error('Fetch centres by region error:', error);
        if (error.response && error.response.data) {
          throw new Error(error.response.data.message || 'Failed to fetch centres by region. Please try again.');
        }
        throw new Error(error.message || 'Failed to fetch centres by region. Please try again.');
      }
    },
    
    // Get candidates grouped by position
    getCandidatesByPosition: async () => {
      try {
        const response = await api.get('/analytics/candidates-by-position');
        
        if (response.data && response.data.status === 'success') {
          return response.data;
        } else {
          throw new Error('Failed to fetch candidates by position data');
        }
      } catch (error) {
        console.error('Fetch candidates by position error:', error);
        if (error.response && error.response.data) {
          throw new Error(error.response.data.message || 'Failed to fetch candidates by position. Please try again.');
        }
        throw new Error(error.message || 'Failed to fetch candidates by position. Please try again.');
      }
    }
  },

  // Settings endpoints
  settings: {
    addSetting: async (settingData) => {
      try {
        const response = await api.post('/setting/add-setting', settingData);
        
        if (response.data && response.data.status === 'success') {
          return response.data;
        } else {
          throw new Error(response.data?.message || 'Failed to add setting');
        }
      } catch (error) {
        console.error('Add setting error:', error);
        if (error.response && error.response.data) {
          throw new Error(error.response.data.message || 'Failed to add setting. Please try again.');
        }
        throw new Error(error.message || 'Failed to add setting. Please try again.');
      }
    },

    getAllSettings: async (page = 1, limit = 10) => {
      try {
        const response = await api.get(`/setting/get-all-settings?page=${page}&limit=${limit}`);
        
        if (response.data && response.data.status === 'success') {
          return response.data;
        } else {
          throw new Error(response.data?.message || 'Failed to fetch settings');
        }
      } catch (error) {
        console.error('Get all settings error:', error);
        if (error.response && error.response.data) {
          throw new Error(error.response.data.message || 'Failed to fetch settings. Please try again.');
        }
        throw new Error(error.message || 'Failed to fetch settings. Please try again.');
      }
    },

    getSettingById: async (id) => {
      try {
        const response = await api.get(`/setting/get-setting/${id}`);
        
        if (response.data && response.data.status === 'success') {
          return response.data;
        } else {
          throw new Error(response.data?.message || 'Failed to fetch setting');
        }
      } catch (error) {
        console.error('Get setting by ID error:', error);
        if (error.response && error.response.data) {
          throw new Error(error.response.data.message || 'Failed to fetch setting. Please try again.');
        }
        throw new Error(error.message || 'Failed to fetch setting. Please try again.');
      }
    },

    updateSetting: async (id, data) => {
      try {
        const response = await api.put(`/setting/update-setting/${id}`, data);
        if (response.data.status === 'success') {
          return response.data;
        } else {
          throw new Error(response.data.message || 'Failed to update setting');
        }
      } catch (error) {
        console.error('Error updating setting:', error);
        throw error;
      }
    },

    deleteSetting: async (id) => {
      try {
        const response = await api.delete(`/setting/delete-setting/${id}`);
        if (response.data.status === 'success') {
          return response.data;
        } else {
          throw new Error(response.data.message || 'Failed to delete setting');
        }
      } catch (error) {
        console.error('Error deleting setting:', error);
        throw error;
      }
    }


    
  },

  // Activities endpoints
  activities: {
    getAll: async () => {
      try {
        const response = await api.get('/activities');
        
        if (response.data && response.data.status === 'success') {
          return response.data;
        } else {
          throw new Error('Failed to fetch activities');
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
        throw new Error(
          error.response?.data?.message || 
          'Failed to load activities. Please try again later.'
        );
      }
    }
  }
};

export default apiService; 