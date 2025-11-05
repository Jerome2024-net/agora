'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, type: 'organizer' | 'participant') => Promise<void>;
  signup: (name: string, email: string, password: string, type: 'organizer' | 'participant', profileImage?: string | null) => Promise<void>;
  logout: () => void;
  updateProfileImage: (imageUrl: string) => void;
  updateStripeAccount: (stripeData: Partial<User>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Charger l'utilisateur depuis le localStorage au démarrage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string, type: 'organizer' | 'participant') => {
    // Simulation de l'authentification
    // Dans une vraie app, vous feriez un appel API ici
    const mockUser: User = {
      id: Date.now().toString(),
      name: email.split('@')[0],
      email,
      type,
      createdAt: new Date().toISOString()
    };

    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const signup = async (name: string, email: string, password: string, type: 'organizer' | 'participant', profileImage?: string | null) => {
    // Simulation de l'inscription
    const mockUser: User = {
      id: Date.now().toString(),
      name,
      email,
      type,
      createdAt: new Date().toISOString(),
      profileImage: profileImage || undefined
    };

    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));

    // 🚀 CREATION AUTOMATIQUE DU COMPTE STRIPE CONNECT POUR LES ORGANISATEURS
    if (type === 'organizer') {
      try {
        console.log('🔄 Création automatique du compte Stripe Connect...');
        
        const response = await fetch('/api/stripe/connect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: mockUser.id,
            userEmail: email,
            userName: name,
          }),
        });

        const data = await response.json();

        if (data.success && data.accountId) {
          // Mettre à jour l'utilisateur avec l'accountId Stripe
          const updatedUser = {
            ...mockUser,
            stripeAccountId: data.accountId,
            stripeOnboardingComplete: false,
            stripeAccountStatus: 'pending' as const,
            needsStripeOnboarding: true // Flag pour rediriger vers onboarding
          };
          
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
          
          console.log('✅ Compte Stripe Connect créé automatiquement:', data.accountId);
        } else {
          console.warn('⚠️ Impossible de créer le compte Stripe automatiquement');
        }
      } catch (error) {
        console.error('❌ Erreur création automatique Stripe:', error);
        // L'inscription continue même si Stripe échoue
      }
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateProfileImage = (imageUrl: string) => {
    if (user) {
      const updatedUser = { ...user, profileImage: imageUrl };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const updateStripeAccount = (stripeData: Partial<User>) => {
    if (user) {
      // Vérifier si les données ont vraiment changé avant de mettre à jour
      const hasChanged = Object.keys(stripeData).some(
        key => user[key as keyof User] !== stripeData[key as keyof User]
      );
      
      if (hasChanged) {
        const updatedUser = { ...user, ...stripeData };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        console.log('✅ Compte utilisateur mis à jour:', stripeData);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      signup, 
      logout, 
      updateProfileImage,
      updateStripeAccount,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
