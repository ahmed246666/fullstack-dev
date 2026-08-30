'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, setAuthToken, getAuthToken } from '@/lib/api';

export interface AgentUser {
  id: string;
  name: string;
  nameAr: string;
  email: string;
  role: 'ADMIN' | 'AGENT' | 'CUSTOMER';
  department?: string;
  avatarUrl?: string;
}

export const DEFAULT_AGENTS: AgentUser[] = [
  {
    id: 'admin-1',
    name: 'Ahmed Osama',
    nameAr: 'أحمد أسامة',
    email: 'admin@azmsquad.com',
    role: 'ADMIN',
    department: 'Executive Management',
    avatarUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'agent-sara',
    name: 'Sara Al-Ghamdi',
    nameAr: 'سارة الغامدي',
    email: 'sara.ghamdi@azmsquad.com',
    role: 'AGENT',
    department: 'Technical Support Specialist',
    avatarUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'agent-khalid',
    name: 'Khalid Al-Mansoor',
    nameAr: 'خالد المنصور',
    email: 'khalid.mansoor@azmsquad.com',
    role: 'AGENT',
    department: 'Enterprise Billing & Invoices',
    avatarUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'agent-noura',
    name: 'Noura Al-Shehri',
    nameAr: 'نورة الشهري',
    email: 'noura.shehri@azmsquad.com',
    role: 'AGENT',
    department: 'Customer Success Specialist',
    avatarUrl:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  }
];

interface AgentContextType {
  currentAgent: AgentUser;
  agents: AgentUser[];
  isAdmin: boolean;
  isAgent: boolean;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  switchAgent: (email: string) => Promise<void>;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export function AgentProvider({ children }: { children: React.ReactNode }) {
  const [currentAgent, setCurrentAgent] = useState<AgentUser>(DEFAULT_AGENTS[0]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);

  useEffect(() => {
    async function initAuth() {
      try {
        const token = getAuthToken();
        if (token) {
          const res = await api.getMe();
          if (res.success && res.user) {
            setCurrentAgent({
              id: res.user.id,
              name: res.user.name,
              nameAr: res.user.nameAr || res.user.name,
              email: res.user.email,
              role: res.user.role as 'ADMIN' | 'AGENT' | 'CUSTOMER',
              department: res.user.department || '',
              avatarUrl: res.user.avatarUrl || DEFAULT_AGENTS[0].avatarUrl
            });
            setIsAuthenticated(true);
          } else {
            setAuthToken(null);
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        setAuthToken(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoadingAuth(false);
      }
    }

    initAuth();
  }, []);

  const login = async (email: string, password: string = 'Password123!'): Promise<boolean> => {
    try {
      const res = await api.login({ email, password });
      if (res.success && res.token) {
        setAuthToken(res.token);
        setCurrentAgent({
          id: res.user.id,
          name: res.user.name,
          nameAr: res.user.nameAr || res.user.name,
          email: res.user.email,
          role: res.user.role as 'ADMIN' | 'AGENT' | 'CUSTOMER',
          department: res.user.department || '',
          avatarUrl: res.user.avatarUrl || DEFAULT_AGENTS[0].avatarUrl
        });
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const switchAgent = async (email: string) => {
    await login(email, 'Password123!');
  };

  const logout = () => {
    setAuthToken(null);
    setIsAuthenticated(false);
  };

  const isAdmin = currentAgent.role === 'ADMIN';
  const isAgent = currentAgent.role === 'AGENT' || currentAgent.role === 'ADMIN';

  return (
    <AgentContext.Provider
      value={{
        currentAgent,
        agents: DEFAULT_AGENTS,
        isAdmin,
        isAgent,
        isAuthenticated,
        isLoadingAuth,
        login,
        logout,
        switchAgent
      }}
    >
      {children}
    </AgentContext.Provider>
  );
}

export function useAgent() {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error('useAgent must be used within an AgentProvider');
  }
  return context;
}

