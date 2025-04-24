// Mock user data for testing
const mockUsers = [
  {
    id: 1,
    email: 'admin@example.com',
    password: 'password123',
    name: 'Admin User',
    role: 'admin',
    status: 'active',
    createdAt: '2023-01-15T08:30:00Z'
  },
  {
    id: 2,
    email: 'user@example.com',
    password: 'password123',
    name: 'Regular User',
    role: 'user',
    status: 'active',
    createdAt: '2023-02-20T10:15:00Z'
  },
  {
    id: 3,
    email: 'inactive@example.com',
    password: 'password123',
    name: 'Inactive User',
    role: 'user',
    status: 'inactive',
    createdAt: '2023-03-10T14:45:00Z'
  }
];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock authentication service
const mockUserService = {
  // Login function
  login: async (email, password) => {
    // Simulate network delay
    await delay(800);
    
    const user = mockUsers.find(u => u.email === email);
    
    if (!user) {
      throw new Error('No account found with this email address');
    }
    
    if (user.password !== password) {
      throw new Error('The password you entered is incorrect');
    }
    
    if (user.status !== 'active') {
      throw new Error('This account has been deactivated. Please contact your administrator for assistance.');
    }
    
    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
  
  // Get user by ID
  getUserById: async (id) => {
    await delay(500);
    
    const user = mockUsers.find(u => u.id === id);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
  
  // Get all users
  getAllUsers: async () => {
    await delay(1000);
    
    // Return users without passwords
    return mockUsers.map(({ password: _, ...userWithoutPassword }) => userWithoutPassword);
  },
  
  // Update user
  updateUser: async (id, userData) => {
    await delay(700);
    
    const userIndex = mockUsers.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    // Update user data
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...userData,
      id // Ensure ID doesn't change
    };
    
    // Return updated user without password
    const { password: _, ...userWithoutPassword } = mockUsers[userIndex];
    return userWithoutPassword;
  }
};

export default mockUserService; 