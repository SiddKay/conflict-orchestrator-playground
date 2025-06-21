
import React from 'react';

interface Message {
  id: string;
  msg: string;
  mood: 'positive' | 'neutral' | 'negative' | 'happy' | 'sad' | 'angry' | 'frustrated' | 'excited' | 'calm';
  agent: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
  isSelected: boolean;
  isHighlighted: boolean;
  messageRef: (el: HTMLDivElement | null) => void;
}

const getMoodColor = (mood: string, isSelected: boolean = false, isHighlighted: boolean = false) => {
  const baseColor = (() => {
    switch (mood) {
      case 'positive':
      case 'happy':
      case 'excited':
        return 'bg-green-500/20 border-green-400/30 text-green-100';
      case 'negative':
      case 'angry':
        return 'bg-red-500/20 border-red-400/30 text-red-100';
      case 'sad':
        return 'bg-blue-500/20 border-blue-400/30 text-blue-100';
      case 'frustrated':
        return 'bg-orange-500/20 border-orange-400/30 text-orange-100';
      case 'neutral':
      case 'calm':
        return 'bg-yellow-500/20 border-yellow-400/30 text-yellow-100';
      default:
        return 'bg-slate-500/20 border-slate-400/30 text-slate-100';
    }
  })();
  
  if (isHighlighted) {
    return `${baseColor} ring-4 ring-blue-400/60 ring-pulse animate-pulse scale-[1.05] shadow-lg shadow-blue-400/20`;
  }
  if (isSelected) {
    return `${baseColor} ring-2 ring-blue-400/50 scale-[1.02]`;
  }
  return baseColor;
};

const getAgentColor = (agent: string) => {
  // Dynamic agent color assignment based on agent name
  const hash = agent.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return hash % 2 === 0 ? 'text-blue-300' : 'text-purple-300';
};

export const ChatMessage = ({ message, isSelected, isHighlighted, messageRef }: ChatMessageProps) => {
  return (
    <div 
      ref={messageRef}
      data-message-id={message.id}
      className={`
        p-3 rounded-lg border transition-all duration-300 hover:scale-[1.01]
        ${getMoodColor(message.mood, isSelected, isHighlighted)}
      `}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className={`font-medium text-sm ${getAgentColor(message.agent)}`}>
          {message.agent}
        </div>
        <div className="text-xs text-slate-500">
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
      <p className="text-sm leading-relaxed">{message.msg}</p>
    </div>
  );
};
