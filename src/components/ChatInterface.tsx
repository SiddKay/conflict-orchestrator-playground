
import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { ReportModal } from '@/components/ReportModal';
import { ChatHeader } from '@/components/ChatHeader';
import { MessageList } from '@/components/MessageList';
import { ChatControls } from '@/components/ChatControls';

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
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [isLoadingReport, setIsLoadingReport] = useState(false);

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

  const handleReport = async () => {
    setIsLoadingReport(true);
    setIsReportModalOpen(true);
    
    // TODO: Replace with actual API call
    // Simulate API call delay
    setTimeout(() => {
      const mockReportData = {
        conversation_id: "c-56f7f929-9819-434b-9007-9bd1af191182",
        total_messages: 5,
        escalation_points: [
          {
            from_index: "0",
            to_index: "1",
            from_mood: "sad",
            to_mood: "angry",
            message: "What do you mean, 'talk about what to do next'? You just shattered my favorite mug! You need to take..."
          }
        ],
        de_escalation_points: [],
        mood_progression: [
          {
            message_index: "0",
            agent_id: "a-4dfc53a4-aa53-4766-85a9-a085a9aa267f",
            mood: "sad",
            snippet: "Oh no! I just accidentally dropped your favorite m..."
          },
          {
            message_index: "1",
            agent_id: "a-5d56c625-e6c5-4611-b14f-95670048fc64",
            mood: "angry",
            snippet: "What do you mean, 'talk about what to do next'? Yo..."
          },
          {
            message_index: "2",
            agent_id: "a-4dfc53a4-aa53-4766-85a9-a085a9aa267f",
            mood: "frustrated",
            snippet: "Whoa, B! It's not like I did it on purpose! Accide..."
          },
          {
            message_index: "3",
            agent_id: "a-5d56c625-e6c5-4611-b14f-95670048fc64",
            mood: "angry",
            snippet: "Just a mug? Are you kidding me? It was my favorite..."
          },
          {
            message_index: "4",
            agent_id: "a-4dfc53a4-aa53-4766-85a9-a085a9aa267f",
            mood: "frustrated",
            snippet: "You know what, B? Maybe you're overreacting just a..."
          }
        ],
        summary: "The conversation between A and B reflects a classic conflict dynamic where one party (B) is highly emotional and aggressive due to the loss of a valued personal item, while the other party (A) demonstrates naivety and a lack of understanding of the emotional significance of the mug. A's attempts to address the situation are met with hostility from B, leading to an escalation in conflict. The conversation lacks empathetic understanding, with A downplaying B's feelings and B responding with heightened anger instead of seeking resolution. This creates a cycle of defensiveness and blame, preventing any constructive dialogue from happening.",
        suggestions: [
          "A should acknowledge B's feelings and express understanding of the mug's importance to B.",
          "B should practice active listening and allow A to explain the situation without interruption.",
          "Both A and B should focus on collaborative problem-solving rather than blame, discussing potential ways to replace or compensate for the lost mug.",
          "A could offer to help find a replacement mug or suggest a different way to make amends.",
          "B might consider using 'I' statements to express feelings without attacking A's character, e.g., 'I feel upset because that mug had sentimental value to me.'"
        ],
        analysis_markdown: "# Executive Summary\nThe dialogue between A and B highlights a conflict characterized by emotional responses and a lack of mutual understanding. A's naive perspective clashes with B's aggressive stance, resulting in an escalation of the conflict without any attempts at resolution. Effective communication is absent, as both parties fail to empathize with each other's emotions, leading to defensiveness and blame.\n\n# Conflict Progression Analysis\n1. **Initial Incident**: A accidentally drops B's favorite mug, leading to immediate emotional distress for B.\n2. **Escalation**: B responds with anger, demanding accountability from A, which A perceives as an overreaction, leading to mutual frustration.\n3. **Continued Tension**: A's attempt to downplay the situation only serves to aggravate B further, resulting in a cycle of blame and defensiveness.\n\n# Key Turning Points\n- The most significant turning point occurs when A tells B to 'chill' and suggests that B is overreacting. This marks a shift from a potential resolution to a deeper conflict as both parties entrench in their positions.\n\n# Communication Patterns\n- **A**: Attempts to apologize but lacks the emotional depth needed to connect with B's feelings of loss. A's naive perspective leads to dismissive comments.\n- **B**: Responds with aggression and demands responsibility but fails to articulate feelings in a non-confrontational manner. B's communication is centered around blame.\n\n# Recommendations for Each Agent\n- **For A**: A should actively listen to B's feelings and validate them. A could also express a desire to make amends rather than deflecting blame.\n- **For B**: B should use 'I' statements to communicate feelings without attacking A. B could also recognize A's remorse as a step towards resolution rather than perpetuating anger.\n\n# Overall Conclusions\nThe conflict between A and B illustrates the challenges of miscommunication in emotionally charged situations. Both parties need to develop skills in empathy, active listening, and constructive feedback to navigate conflicts more effectively. By reframing the conversation towards understanding and collaboration, it is possible to move from a cycle of blame to a resolution-oriented dialogue."
      };
      
      setReportData(mockReportData);
      setIsLoadingReport(false);
    }, 2000);
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
        <ChatHeader currentAgent={currentAgent} />
        
        <MessageList 
          messages={messages} 
          selectedNodeId={selectedNodeId} 
        />

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
        />
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
