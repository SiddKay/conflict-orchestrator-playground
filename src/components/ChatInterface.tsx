import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, SkipForward, User, TrendingUp, TrendingDown, FileText } from 'lucide-react';
interface Message {
  id: string;
  msg: string;
  mood: 'positive' | 'neutral' | 'negative';
  agent: string;
  timestamp: Date;
}
interface ChatInterfaceProps {
  simulationStarted: boolean;
  selectedNodeId?: string | null;
}
export const ChatInterface = ({
  simulationStarted,
  selectedNodeId
}: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isUserTurn, setIsUserTurn] = useState(false);
  const [currentAgent, setCurrentAgent] = useState('Alice');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<{
    [key: string]: HTMLDivElement | null;
  }>({});
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  const scrollToMessage = (messageId: string) => {
    const messageElement = messageRefs.current[messageId];
    if (messageElement) {
      messageElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  useEffect(() => {
    if (selectedNodeId && messageRefs.current[selectedNodeId]) {
      scrollToMessage(selectedNodeId);
    }
  }, [selectedNodeId]);
  useEffect(() => {
    if (simulationStarted && messages.length === 0) {
      // Initialize with first message
      // TODO: Replace with API call to generate first agent response
      const firstMessage: Message = {
        id: '1',
        msg: "I think we should try that new Italian place for our anniversary dinner.",
        mood: 'positive',
        agent: 'Alice',
        timestamp: new Date()
      };
      setMessages([firstMessage]);
      setCurrentAgent('Bob');
    }
  }, [simulationStarted]);
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
  const handleNext = () => {
    // TODO: API call to generate next agent response
    const nextMessage: Message = {
      id: Date.now().toString(),
      msg: currentAgent === 'Bob' ? "Italian again? We always go Italian. Can't we try something different for once?" : "I suggested it because I know you love pasta. I was trying to be thoughtful.",
      mood: currentAgent === 'Bob' ? 'negative' : 'neutral',
      agent: currentAgent,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, nextMessage]);
    setCurrentAgent(currentAgent === 'Alice' ? 'Bob' : 'Alice');
  };
  const handleUserMessage = () => {
    if (!userInput.trim()) return;

    // TODO: API call to process user message and determine mood
    const userMessage: Message = {
      id: Date.now().toString(),
      msg: userInput,
      mood: 'neutral',
      // This should come from API analysis
      agent: currentAgent,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setCurrentAgent(currentAgent === 'Alice' ? 'Bob' : 'Alice');
    setIsUserTurn(false);
  };
  const handleEscalate = () => {
    // TODO: Connect to appropriate API endpoint for escalation
    console.log('Escalate button clicked');
  };
  const handleDeEscalate = () => {
    // TODO: Connect to appropriate API endpoint for de-escalation
    console.log('De-escalate button clicked');
  };
  const handleSummarize = () => {
    // TODO: Fetch actual summary content from API endpoint
    const placeholderMarkdown = `# Conversation Summary

## Participants
- Alice
- Bob

## Key Points
- Discussion about anniversary dinner location
- Preference differences regarding Italian cuisine
- Communication style analysis

## Mood Analysis
- Initial positive sentiment
- Shift to negative sentiment
- Neutral resolution attempt

*This is placeholder content. Replace with actual API data.*
`;
    const blob = new Blob([placeholderMarkdown], {
      type: 'text/markdown'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'summary.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  if (!simulationStarted) {
    return <div className="h-full flex items-center justify-center text-center p-8">
        <div>
          <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send size={24} className="text-slate-500" />
          </div>
          <p className="text-slate-400 text-sm">
            Complete the setup to start chatting
          </p>
        </div>
      </div>;
  }
  return <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-700/50">
        <h3 className="font-semibold text-slate-200 mb-1">Conversation</h3>
        <p className="text-xs text-slate-400">
          Next: <span className={getAgentColor(currentAgent)}>{currentAgent}</span>
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(message => {
        const isHighlighted = selectedNodeId === message.id;
        return <div key={message.id} ref={el => messageRefs.current[message.id] = el} className={`
                p-3 rounded-lg border transition-all duration-200 hover:scale-[1.01]
                ${getMoodColor(message.mood, isHighlighted)}
              `}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`font-medium text-sm ${getAgentColor(message.agent)}`}>
                  {message.agent}
                </div>
                <div className="text-xs text-slate-500">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
              <p className="text-sm leading-relaxed">{message.msg}</p>
            </div>;
      })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Controls */}
      <div className="p-4 border-t border-slate-700/50 space-y-3">
        {isUserTurn ? <div className="flex gap-2">
            <Input value={userInput} onChange={e => setUserInput(e.target.value)} placeholder={`Type as ${currentAgent}...`} className="bg-slate-700/50 border-slate-600/50 text-slate-200 placeholder:text-slate-500" onKeyDown={e => e.key === 'Enter' && handleUserMessage()} />
            <Button onClick={handleUserMessage} size="sm" className="bg-blue-600/80 hover:bg-blue-600">
              <Send size={16} />
            </Button>
          </div> : null}

        {/* Action Buttons */}
        <div className="flex justify-between gap-2 px-0">
          <div className="flex gap-2">
            <Button onClick={handleEscalate} size="sm" className="bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-200" variant="outline">
              <TrendingUp size={16} className="mr-1" />
              Escalate
            </Button>
            <Button onClick={handleDeEscalate} size="sm" className="bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 text-green-200" variant="outline">
              <TrendingDown size={16} className="mr-1" />
              De-escalate
            </Button>
          </div>
          <Button onClick={handleSummarize} size="sm" className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 text-blue-200" variant="outline">
            <FileText size={16} className="mr-1" />
            Summarize
          </Button>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleNext} className="flex-1 bg-gradient-to-r from-purple-600/80 to-blue-600/80 hover:from-purple-600 hover:to-blue-600">
            <SkipForward size={16} className="mr-2" />
            Next ({currentAgent})
          </Button>
          <Button onClick={() => setIsUserTurn(!isUserTurn)} variant="outline" className="border-slate-600/50 text-slate-300 hover:bg-slate-700/50">
            <User size={16} />
          </Button>
        </div>
      </div>
    </div>;
};
