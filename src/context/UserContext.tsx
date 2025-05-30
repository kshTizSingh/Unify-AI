import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  name: string;
  credits: number;
  isLoggedIn: boolean;
  jwt?: string;
}

interface UserContextType {
  user: User;
  promptCount: number;
  login: (user: Partial<User> & { jwt: string }) => void;
  logout: () => void;
  incrementPrompt: () => void;
  addCredits: (amount: number) => void;
}

const GUEST_PROMPT_LIMIT = 5;
const INITIAL_USER: User = {
  name: '',
  credits: 0,
  isLoggedIn: false,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : INITIAL_USER;
  });
  const [promptCount, setPromptCount] = useState<number>(() => {
    const stored = localStorage.getItem('promptCount');
    return stored ? parseInt(stored, 10) : 0;
  });

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('promptCount', promptCount.toString());
  }, [promptCount]);

  const login = (info: Partial<User> & { jwt: string }) => {
    // Only give 100 credits if this is a new login
    setUser(prev => {
      if (!prev.isLoggedIn) {
        return {
          name: info.name || '',
          credits: 100,
          isLoggedIn: true,
          jwt: info.jwt,
        };
      } else {
        return {
          ...prev,
          ...info,
          isLoggedIn: true,
        };
      }
    });
    setPromptCount(0); // Reset guest prompt count on login
  };

  const logout = () => {
    setUser(INITIAL_USER);
    setPromptCount(0);
  };

  const incrementPrompt = () => {
    if (!user.isLoggedIn && promptCount < GUEST_PROMPT_LIMIT) {
      setPromptCount(c => c + 1);
    }
  };

  const addCredits = (amount: number) => {
    setUser(prev => ({ ...prev, credits: prev.credits + amount }));
  };

  return (
    <UserContext.Provider value={{ user, promptCount, login, logout, incrementPrompt, addCredits }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within a UserProvider');
  return ctx;
}; 