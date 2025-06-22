
import React from 'react';
import { MoodEnum } from '@/types/models';
import { getChatMessageColors, getMoodAccentClasses } from '@/lib/colorMapping';
import { TrendingUp, TrendingDown, User } from 'lucide-react';

interface Message {
  id: string;
  msg: string;
  mood: MoodEnum;
  agent: string;
  timestamp: Date;
  is_user_override?: boolean;
  intervention_type?: 'escalate' | 'de_escalate';
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

const getInterventionIndicator = (message: Message) => {
  if (message.is_user_override) {
    return (
      <div className="flex items-center gap-1 px-2 py-1 bg-blue-600/20 border border-blue-500/30 rounded-md text-blue-300">
        <User size={12} />
        <span className="text-xs font-medium">Custom</span>
      </div>
    );
  }
  
  if (message.intervention_type === 'escalate') {
    return (
      <div className="flex items-center gap-1 px-2 py-1 bg-red-600/20 border border-red-500/30 rounded-md text-red-300">
        <TrendingUp size={12} />
        <span className="text-xs font-medium">Escalated</span>
      </div>
    );
  }
  
  if (message.intervention_type === 'de_escalate') {
    return (
      <div className="flex items-center gap-1 px-2 py-1 bg-green-600/20 border border-green-500/30 rounded-md text-green-300">
        <TrendingDown size={12} />
        <span className="text-xs font-medium">De-escalated</span>
      </div>
    );
  }
  
  return null;
};

export const ChatMessage = ({ message, isSelected, isHighlighted, messageRef }: ChatMessageProps) => {
  const moodAccents = getMoodAccentClasses(message.mood);
  const interventionIndicator = getInterventionIndicator(message);
  
  return (
    <div 
      ref={messageRef}
      data-message-id={message.id}
      className={`
        p-3 rounded-lg transition-all duration-300 hover:scale-[1.01] relative overflow-hidden
        ${getMoodColor(message.mood, isSelected, isHighlighted)}
      `}
    >
      {/* Mood indicator with dot and text */}
      <div className="absolute top-3 right-3 flex items-center gap-2">
        <span className={`text-xs font-medium capitalize ${moodAccents.border.replace('border-l-', 'text-')} opacity-80`}>
          {message.mood}
        </span>
        <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${moodAccents.gradient} animate-pulse shadow-sm`} />
      </div>
      
      <div className="flex items-center gap-2 mb-2">
        <div className={`font-medium text-sm ${getAgentColor(message.agent)}`}>
          {message.agent}
        </div>
        <div className="text-xs text-slate-500">
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
      
      {/* Intervention indicator */}
      {interventionIndicator && (
        <div className="mb-2">
          {interventionIndicator}
        </div>
      )}
      
      <p className="text-sm leading-relaxed pr-20">{message.msg}</p>
    </div>
  );
};
