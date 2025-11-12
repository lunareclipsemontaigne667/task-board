import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Generate UUID v4
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

interface AuthContextType {
  anonymousUserId: string;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [anonymousUserId, setAnonymousUserId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get or create anonymous user ID
    let userId = localStorage.getItem('anonymous_user_id');
    
    if (!userId) {
      // Generate new UUID for first-time visitor
      userId = generateUUID();
      localStorage.setItem('anonymous_user_id', userId);
    }
    
    setAnonymousUserId(userId);
    setLoading(false);
  }, []);

  const value = {
    anonymousUserId,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

