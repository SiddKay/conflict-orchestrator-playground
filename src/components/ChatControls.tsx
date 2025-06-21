
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, SkipForward, User, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

interface ChatControlsProps {
  isUserTurn: boolean;
  userInput: string;
  currentAgent: string;
  onUserInputChange: (value: string) => void;
  onUserMessage: () => void;
  onNext: () => void;
  onToggleUserTurn: () => void;
  onEscalate: () => void;
  onDeEscalate: () => void;
  onReport: () => void;
}

const getAgentColor = (agent: string) => {
  return agent === 'Alice' ? 'text-blue-300' : 'text-purple-300';
};

export const ChatControls = ({
  isUserTurn,
  userInput,
  currentAgent,
  onUserInputChange,
  onUserMessage,
  onNext,
  onToggleUserTurn,
  onEscalate,
  onDeEscalate,
  onReport
}: ChatControlsProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onUserMessage();
    }
  };

  return (
    <div className="p-4 border-t border-slate-700/50 space-y-3">
      {isUserTurn && (
        <div className="flex gap-2">
          <Input 
            value={userInput} 
            onChange={(e) => onUserInputChange(e.target.value)} 
            placeholder={`Type as ${currentAgent}...`} 
            className="bg-slate-700/50 border-slate-600/50 text-slate-200 placeholder:text-slate-500" 
            onKeyDown={handleKeyDown} 
          />
          <Button onClick={onUserMessage} size="sm" className="bg-blue-600/80 hover:bg-blue-600">
            <Send size={16} />
          </Button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between gap-2 px-0">
        <div className="flex gap-2">
          <Button onClick={onEscalate} size="sm" className="bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-200" variant="outline">
            <TrendingUp size={16} className="mr-1" />
            Escalate
          </Button>
          <Button onClick={onDeEscalate} size="sm" className="bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 text-green-200" variant="outline">
            <TrendingDown size={16} className="mr-1" />
            De-escalate
          </Button>
        </div>
        <Button onClick={onReport} size="sm" className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 text-blue-200" variant="outline">
          <BarChart3 size={16} className="mr-1" />
          Report
        </Button>
      </div>

      <div className="flex gap-2">
        <Button onClick={onNext} className="flex-1 bg-gradient-to-r from-purple-600/80 to-blue-600/80 hover:from-purple-600 hover:to-blue-600">
          <SkipForward size={16} className="mr-2" />
          Next ({currentAgent})
        </Button>
        <Button onClick={onToggleUserTurn} variant="outline" className="border-slate-600/50 text-slate-300 hover:bg-slate-700/50">
          <User size={16} />
        </Button>
      </div>
    </div>
  );
};
