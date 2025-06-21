
import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { ReportModal } from '@/components/ReportModal';
import { ChatHeader } from '@/components/ChatHeader';
import { MessageList } from '@/components/MessageList';
import { ChatControls } from '@/components/ChatControls';
import { useConversationContext } from '@/contexts/ConversationContext';
import { api } from '@/services/api';
import { ConversationAnalysis } from '@/types/models';


interface ChatInterfaceProps {
  simulationStarted: boolean;
  selectedNodeId?: string | null;
}

export const ChatInterface = ({
  simulationStarted,
  selectedNodeId
}: ChatInterfaceProps) => {
  const { 
    conversationId, 
    conversationTree,
    currentPath, 
    generateNextResponse, 
    sendUserMessage, 
    applyIntervention,
    loading
  } = useConversationContext();
  
  const [userInput, setUserInput] = useState('');
  const [isUserTurn, setIsUserTurn] = useState(false);
  const [currentAgent, setCurrentAgent] = useState('Alice');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportData, setReportData] = useState<ConversationAnalysis | null>(null);
  const [isLoadingReport, setIsLoadingReport] = useState(false);

  useEffect(() => {
    if (simulationStarted && conversationId && currentPath.length === 0) {
      // Generate first message
      generateNextResponse();
    }
  }, [simulationStarted, conversationId, currentPath.length, generateNextResponse]);

  // Determine current agent from the conversation setup
  useEffect(() => {
    if (currentPath.length > 0 && conversationTree) {
      const lastMessage = currentPath[currentPath.length - 1];
      // Determine which agent sent the last message and set the next agent
      const isAgentA = lastMessage.agent_id === conversationTree.setup.agent_a.id;
      const nextAgent = isAgentA ? conversationTree.setup.agent_b.name : conversationTree.setup.agent_a.name;
      setCurrentAgent(nextAgent);
    } else if (conversationTree) {
      // Start with agent A
      setCurrentAgent(conversationTree.setup.agent_a.name);
    }
  }, [currentPath, conversationTree]);

  const handleNext = async () => {
    await generateNextResponse();
  };

  const handleUserMessage = async () => {
    if (!userInput.trim() || !conversationId || !conversationTree) return;

    // Get the current agent ID from the conversation setup
    const agentId = currentAgent === conversationTree.setup.agent_a.name 
      ? conversationTree.setup.agent_a.id 
      : conversationTree.setup.agent_b.id;
    
    await sendUserMessage(userInput, agentId);
    setUserInput('');
    setIsUserTurn(false);
  };

  const handleEscalate = async () => {
    await applyIntervention('escalate');
  };

  const handleDeEscalate = async () => {
    await applyIntervention('de_escalate');
  };

  const handleReport = async () => {
    if (!conversationId) return;
    
    setIsLoadingReport(true);
    setIsReportModalOpen(true);
    
    try {
      const report = await api.analyzeConversation(conversationId);
      setReportData(report);
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setIsLoadingReport(false);
    }
  };

  if (!simulationStarted) {
    return (
      <div className="h-full flex items-center justify-center text-center p-8">
        <div>
          <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send size={24} className="text-slate-500" />
          </div>
          <p className="text-slate-400 text-sm">
            Complete the setup to start chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="h-full flex flex-col">
        <div className="flex-shrink-0">
          <ChatHeader currentAgent={currentAgent} />
        </div>
        
        <MessageList 
          messages={currentPath.map(msg => {
            const agentName = conversationTree && msg.agent_id === conversationTree.setup.agent_a.id
              ? conversationTree.setup.agent_a.name
              : conversationTree?.setup.agent_b.name || 'Unknown';
            
            return {
              id: msg.id,
              msg: msg.msg,
              mood: msg.mood,
              agent: agentName,
              timestamp: new Date(msg.timestamp)
            };
          })} 
          selectedNodeId={selectedNodeId} 
        />

        <div className="flex-shrink-0">
          <ChatControls
            isUserTurn={isUserTurn}
            userInput={userInput}
            currentAgent={currentAgent}
            onUserInputChange={setUserInput}
            onUserMessage={handleUserMessage}
            onNext={handleNext}
            onToggleUserTurn={() => setIsUserTurn(!isUserTurn)}
            onEscalate={handleEscalate}
            onDeEscalate={handleDeEscalate}
            onReport={handleReport}
            isLoading={loading}
            isLoadingReport={isLoadingReport}
          />
        </div>
      </div>

      <ReportModal 
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        reportData={reportData}
        isLoading={isLoadingReport}
      />
    </>
  );
};
