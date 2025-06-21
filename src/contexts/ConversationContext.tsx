// ABOUTME: React context for global conversation state management
// ABOUTME: Provides conversation data and methods throughout the app

import React, { createContext, useContext, ReactNode } from 'react';
import { useConversation } from '@/hooks/useConversation';

type ConversationContextType = ReturnType<typeof useConversation>;

const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

export const ConversationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const conversationState = useConversation();

  return (
    <ConversationContext.Provider value={conversationState}>
      {children}
    </ConversationContext.Provider>
  );
};

export const useConversationContext = () => {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error('useConversationContext must be used within a ConversationProvider');
  }
  return context;
};