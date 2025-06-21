
import React from 'react';
import { MoodEnum } from '@/types/models';
import { getChatMessageColors, getMoodAccentClasses } from '@/lib/colorMapping';

interface Message {
  id: string;
  msg: string;
  mood: MoodEnum;
  agent: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
  isSelected: boolean;
  isHighlighted: boolean;
  messageRef: (el: HTMLDivElement | null) => void;
}

const getMoodColor = (mood: MoodEnum, isSelected: boolean = false, isHighlighted: boolean = false) => {
  const baseColor = getChatMessageColors(mood);
  
  if (isHighlighted) {
    return `${baseColor} ring-4 ring-blue-400/60 ring-pulse animate-pulse scale-[1.05]`;
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
  const moodAccents = getMoodAccentClasses(message.mood);
  
  return (
    <div 
      ref={messageRef}
      data-message-id={message.id}
      className={`
        p-3 rounded-lg transition-all duration-300 hover:scale-[1.01] relative overflow-hidden
        ${getMoodColor(message.mood, isSelected, isHighlighted)}
      `}
    >
      {/* Mood indicator dot */}
      <div className={`absolute top-3 right-3 w-3 h-3 rounded-full bg-gradient-to-br ${moodAccents.gradient} animate-pulse`} />
      
      <div className="flex items-center gap-2 mb-2">
        <div className={`font-medium text-sm ${getAgentColor(message.agent)}`}>
          {message.agent}
        </div>
        <div className="text-xs text-slate-500">
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
      <p className="text-sm leading-relaxed pr-6">{message.msg}</p>
    </div>
  );
};
