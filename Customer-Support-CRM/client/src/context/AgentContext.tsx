'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AgentUser {
  id: string;
  name: string;
  nameAr: string;
  email: string;
  role: 'ADMIN' | 'AGENT' | 'CUSTOMER';
  department: string;
  avatarUrl: string;
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
  isAuthenticated: boolean;
  login: (agentIdOrEmail: string) => boolean;
  logout: () => void;
  switchAgent: (agentId: string) => void;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export function AgentProvider({ children }: { children: React.ReactNode }) {
  const [currentAgent, setCurrentAgent] = useState<AgentUser>(DEFAULT_AGENTS[0]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  useEffect(() => {
    try {
      const savedAgentId = localStorage.getItem('azm_active_agent_id');
      const savedAuth = localStorage.getItem('azm_is_authenticated');
      if (savedAgentId) {
        const found = DEFAULT_AGENTS.find((a) => a.id === savedAgentId);
        if (found) setCurrentAgent(found);
      }
      if (savedAuth !== null) {
        setIsAuthenticated(savedAuth === 'true');
      }
    } catch {
      // LocalStorage fallback for SSR
    }
  }, []);

  const switchAgent = (agentId: string) => {
    const found = DEFAULT_AGENTS.find((a) => a.id === agentId);
    if (found) {
      setCurrentAgent(found);
      setIsAuthenticated(true);
      try {
        localStorage.setItem('azm_active_agent_id', found.id);
        localStorage.setItem('azm_is_authenticated', 'true');
      } catch {}
    }
  };

  const login = (agentIdOrEmail: string): boolean => {
    const found = DEFAULT_AGENTS.find(
      (a) =>
        a.id === agentIdOrEmail || a.email.toLowerCase() === agentIdOrEmail.toLowerCase().trim()
    );
    if (found) {
      setCurrentAgent(found);
      setIsAuthenticated(true);
      try {
        localStorage.setItem('azm_active_agent_id', found.id);
        localStorage.setItem('azm_is_authenticated', 'true');
      } catch {}
      return true;
    }
    // Default fallback to first admin
    setCurrentAgent(DEFAULT_AGENTS[0]);
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.setItem('azm_is_authenticated', 'false');
    } catch {}
  };

  const isAdmin = currentAgent.role === 'ADMIN';

  return (
    <AgentContext.Provider
      value={{
        currentAgent,
        agents: DEFAULT_AGENTS,
        isAdmin,
        isAuthenticated,
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
