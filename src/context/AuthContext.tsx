import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, LanguageCode, UserProfile } from '../types/marketplace';
import { INITIAL_USER_PROFILES } from '../data/initialData';

interface AuthContextType {
  currentUser: UserProfile;
  role: UserRole;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  switchRole: (role: UserRole) => void;
  isLoggedIn: boolean;
  loginWithOtp: (mobile: string, otp: string, selectedRole: UserRole) => boolean;
  completeOnboarding: (data: {
    name: string;
    role: UserRole;
    mobile: string;
    location: any;
    cropName?: string;
    quantityKg?: number;
    grade?: string;
  }) => void;
  logout: () => void;
  openLoginModal: () => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
  lowConnectivityMode: boolean;
  setLowConnectivityMode: (val: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('tradebridge_role') as UserRole;
    return saved === 'BUYER' ? 'BUYER' : 'FARMER';
  });
  const [language, setLanguageState] = useState<LanguageCode>('en');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem('tradebridge_logged_in');
    return saved === 'true';
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [lowConnectivityMode, setLowConnectivityMode] = useState<boolean>(false);

  const [profiles, setProfiles] = useState<Record<string, UserProfile>>(() => {
    const saved = localStorage.getItem('kisansetu_profiles');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_USER_PROFILES;
      }
    }
    return INITIAL_USER_PROFILES;
  });

  const currentUser = role === 'FARMER' ? profiles.farmer : profiles.buyer;

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('kisansetu_lang', lang);
  };

  useEffect(() => {
    const savedLang = localStorage.getItem('kisansetu_lang') as LanguageCode;
    if (savedLang && (savedLang === 'en' || savedLang === 'te' || savedLang === 'hi')) {
      setLanguageState(savedLang);
    }
  }, []);

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
    localStorage.setItem('tradebridge_role', newRole);
  };

  const loginWithOtp = (mobile: string, otp: string, selectedRole: UserRole): boolean => {
    if (otp.length === 6) {
      setRole(selectedRole);
      setIsLoggedIn(true);
      localStorage.setItem('tradebridge_logged_in', 'true');
      localStorage.setItem('tradebridge_role', selectedRole);
      return true;
    }
    return false;
  };

  const completeOnboarding = (data: {
    name: string;
    role: UserRole;
    mobile: string;
    location: any;
    cropName?: string;
    quantityKg?: number;
    grade?: string;
  }) => {
    const roleKey = data.role.toLowerCase();
    const updatedProfile: UserProfile = {
      id: data.role === 'FARMER' ? 'user-farmer-1' : 'user-buyer-1',
      name: data.name,
      mobile: data.mobile,
      role: data.role,
      language,
      location: data.location,
      businessName: data.role === 'BUYER' ? `${data.name} Agro Commodities` : undefined,
      ratingAvg: 4.9,
      ratingCount: 14,
      avatarUrl: data.role === 'FARMER'
        ? 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    };

    const newProfiles = {
      ...profiles,
      [roleKey]: updatedProfile
    };

    setProfiles(newProfiles);
    setRole(data.role);
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
    localStorage.setItem('kisansetu_profiles', JSON.stringify(newProfiles));
    localStorage.setItem('tradebridge_logged_in', 'true');
    localStorage.setItem('tradebridge_role', data.role);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setIsLoginModalOpen(true);
    localStorage.removeItem('tradebridge_logged_in');
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    const key = role.toLowerCase();
    const newProfiles = {
      ...profiles,
      [key]: {
        ...profiles[key],
        ...updated
      }
    };
    setProfiles(newProfiles);
    localStorage.setItem('kisansetu_profiles', JSON.stringify(newProfiles));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        language,
        setLanguage,
        switchRole,
        isLoggedIn,
        loginWithOtp,
        completeOnboarding,
        logout,
        openLoginModal,
        isLoginModalOpen,
        setIsLoginModalOpen,
        updateProfile,
        lowConnectivityMode,
        setLowConnectivityMode
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
