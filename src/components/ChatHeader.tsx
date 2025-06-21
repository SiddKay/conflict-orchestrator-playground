
import React from 'react';

interface ChatHeaderProps {
  currentAgent: string;
}

const getAgentColor = (agent: string) => {
  return agent === 'Alice' ? 'text-blue-300' : 'text-purple-300';
};

export const ChatHeader = ({ currentAgent }: ChatHeaderProps) => {
  return (
    <div className="p-4 border-b border-slate-700/50">
      <h3 className="font-semibold text-slate-200 mb-1">Conversation</h3>
      <p className="text-xs text-slate-400">
        Next: <span className={getAgentColor(currentAgent)}>{currentAgent}</span>
      </p>
    </div>
  );
};
