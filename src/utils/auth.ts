import { User, LoginCredentials, RegisterData, AuthState } from '../types/auth';
import { generateId } from './storage';

const AUTH_STORAGE_KEY = 'boltcv-auth';
const USERS_STORAGE_KEY = 'boltcv-users';

// Mock users database
const mockUsers: User[] = [
  {
    id: '1',
    firstName: 'Demo',
    lastName: 'User',
    email: 'demo@boltcv.ne',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    preferences: {
      theme: 'light',
      language: 'fr',
      emailNotifications: true
    }
  }
];

// Initialize users in localStorage if not exists
if (!localStorage.getItem(USERS_STORAGE_KEY)) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(mockUsers));
}

export const hashPassword = (password: string): string => {
  // Simple hash simulation - in reality use bcrypt or similar
  return btoa(password + 'bolt-cv-salt');
};

export const verifyPassword = (password: string, hashedPassword: string): boolean => {
  return hashPassword(password) === hashedPassword;
};

export const getStoredUsers = (): User[] => {
  try {
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    return users ? JSON.parse(users) : mockUsers;
  } catch (error) {
    console.error('Error getting stored users:', error);
    return mockUsers;
  }
};

export const saveUser = (user: User): void => {
  try {
    const users = getStoredUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);
    
    if (existingIndex !== -1) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving user:', error);
  }
};

export const findUserByEmail = (email: string): User | null => {
  const users = getStoredUsers();
  return users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
};

export const login = async (credentials: LoginCredentials): Promise<{ success: boolean; user?: User; error?: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = findUserByEmail(credentials.email);
      
      if (!user) {
        resolve({ success: false, error: 'Utilisateur non trouvé' });
        return;
      }
      
      // For demo purposes, accept any password for demo user, or 'password' for others
      const isValidPassword = 
        credentials.email === 'demo@boltcv.ne' || 
        credentials.password === 'password';
      
      if (!isValidPassword) {
        resolve({ success: false, error: 'Mot de passe incorrect' });
        return;
      }
      
      // Update last login
      const updatedUser = {
        ...user,
        lastLogin: new Date().toISOString()
      };
      saveUser(updatedUser);
      
      // Save auth state
      const authState: AuthState = {
        isAuthenticated: true,
        user: updatedUser,
        rememberMe: credentials.rememberMe || false
      };
      
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
      
      resolve({ success: true, user: updatedUser });
    }, 1000); // Simulate network delay
  });
};

export const register = async (data: RegisterData): Promise<{ success: boolean; user?: User; error?: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Validate data
      if (data.password !== data.confirmPassword) {
        resolve({ success: false, error: 'Les mots de passe ne correspondent pas' });
        return;
      }
      
      if (data.password.length < 6) {
        resolve({ success: false, error: 'Le mot de passe doit contenir au moins 6 caractères' });
        return;
      }
      
      // Check if user already exists
      if (findUserByEmail(data.email)) {
        resolve({ success: false, error: 'Un compte avec cet email existe déjà' });
        return;
      }
      
      if (!data.acceptTerms) {
        resolve({ success: false, error: 'Vous devez accepter les conditions d\'utilisation' });
        return;
      }
      
      // Create new user
      const newUser: User = {
        id: generateId(),
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        preferences: {
          theme: 'light',
          language: 'fr',
          emailNotifications: true
        }
      };
      
      saveUser(newUser);
      
      // Auto-login after registration
      const authState: AuthState = {
        isAuthenticated: true,
        user: newUser,
        rememberMe: false
      };
      
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
      
      resolve({ success: true, user: newUser });
    }, 1500);
  });
};

export const logout = (): void => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  window.location.reload(); // Force app refresh
};

export const getCurrentAuthState = (): AuthState => {
  try {
    const authData = localStorage.getItem(AUTH_STORAGE_KEY);
    if (authData) {
      return JSON.parse(authData);
    }
  } catch (error) {
    console.error('Error getting auth state:', error);
  }
  
  return {
    isAuthenticated: false,
    user: null,
    rememberMe: false
  };
};

export const updateUserProfile = (updates: Partial<User>): User | null => {
  const currentAuth = getCurrentAuthState();
  if (!currentAuth.user) return null;
  
  const updatedUser = { ...currentAuth.user, ...updates };
  saveUser(updatedUser);
  
  // Update auth state
  const newAuthState: AuthState = {
    ...currentAuth,
    user: updatedUser
  };
  
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newAuthState));
  
  return updatedUser;
};

export const changePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // For demo purposes, accept any current password
      if (newPassword.length < 6) {
        resolve({ success: false, error: 'Le nouveau mot de passe doit contenir au moins 6 caractères' });
        return;
      }
      
      resolve({ success: true });
    }, 1000);
  });
};

export const deleteAccount = async (): Promise<{ success: boolean; error?: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const currentAuth = getCurrentAuthState();
      if (currentAuth.user) {
        // Remove user from storage
        const users = getStoredUsers();
        const filteredUsers = users.filter(u => u.id !== currentAuth.user!.id);
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(filteredUsers));
        
        // Clear auth and all user data
        localStorage.removeItem(AUTH_STORAGE_KEY);
        localStorage.removeItem('boltcv-data');
        localStorage.removeItem('boltcv-letters');
        localStorage.removeItem('boltcv-preferences');
      }
      
      resolve({ success: true });
    }, 1000);
  });
};

export const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = findUserByEmail(email);
      if (!user) {
        resolve({ success: false, error: 'Aucun compte trouvé avec cet email' });
        return;
      }
      
      // In a real app, send reset email
      resolve({ success: true });
    }, 1500);
  });
};

// Helper function to require authentication
export const requireAuth = (): User | null => {
  const authState = getCurrentAuthState();
  if (!authState.isAuthenticated || !authState.user) {
    // Redirect to login
    window.location.hash = 'login';
    return null;
  }
  return authState.user;
};