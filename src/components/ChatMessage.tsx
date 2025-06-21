
import React from 'react';

interface Message {
  id: string;
  msg: string;
  mood: 'positive' | 'neutral' | 'negative';
  agent: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
  isHighlighted: boolean;
  messageRef: (el: HTMLDivElement | null) => void;
}

const getMoodColor = (mood: string, isHighlighted: boolean = false) => {
  const baseColor = (() => {
    switch (mood) {
      case 'positive':
        return 'bg-green-500/20 border-green-400/30 text-green-100';
      case 'negative':
        return 'bg-red-500/20 border-red-400/30 text-red-100';
      case 'neutral':
        return 'bg-yellow-500/20 border-yellow-400/30 text-yellow-100';
      default:
        return 'bg-slate-500/20 border-slate-400/30 text-slate-100';
    }
  })();
  return isHighlighted ? `${baseColor} ring-2 ring-blue-400/50 scale-[1.02]` : baseColor;
};

const getAgentColor = (agent: string) => {
  return agent === 'Alice' ? 'text-blue-300' : 'text-purple-300';
};

export const ChatMessage = ({ message, isHighlighted, messageRef }: ChatMessageProps) => {
  return (
    <div 
      ref={messageRef} 
      className={`
        p-3 rounded-lg border transition-all duration-200 hover:scale-[1.01]
        ${getMoodColor(message.mood, isHighlighted)}
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
