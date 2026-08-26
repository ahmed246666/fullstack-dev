'use client';

import React, { createContext, useContext, useState } from 'react';

export interface AgentUser {
  id: string;
  name: string;
  nameAr: string;
  email: string;
  role: 'ADMIN' | 'AGENT' | 'CUSTOMER';
  department: string;
  avatarUrl: string;
}

const DEFAULT_AGENTS: AgentUser[] = [
  {
    id: 'admin-1',
    name: 'Ahmed Osama',
    nameAr: 'أحمد أسامة',
    email: 'admin@azmsquad.com',
    role: 'ADMIN',
    department: 'Management',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'agent-sara',
    name: 'Sara Al-Ghamdi',
    nameAr: 'سارة الغامدي',
    email: 'sara.ghamdi@azmsquad.com',
    role: 'AGENT',
    department: 'Technical',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'agent-khalid',
    name: 'Khalid Al-Mansoor',
    nameAr: 'خالد المنصور',
    email: 'khalid.mansoor@azmsquad.com',
    role: 'AGENT',
    department: 'Billing',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'agent-noura',
    name: 'Noura Al-Shehri',
    nameAr: 'نورة الشهري',
    email: 'noura.shehri@azmsquad.com',
    role: 'AGENT',
    department: 'Support',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  }
];

interface AgentContextType {
  currentAgent: AgentUser;
  agents: AgentUser[];
  switchAgent: (agentId: string) => void;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export function AgentProvider({ children }: { children: React.ReactNode }) {
  const [currentAgent, setCurrentAgent] = useState<AgentUser>(DEFAULT_AGENTS[0]);

  const switchAgent = (agentId: string) => {
    const found = DEFAULT_AGENTS.find(a => a.id === agentId);
    if (found) {
      setCurrentAgent(found);
    }
  };

  return (
    <AgentContext.Provider value={{ currentAgent, agents: DEFAULT_AGENTS, switchAgent }}>
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
