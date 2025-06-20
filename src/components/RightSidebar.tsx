
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SetupForm } from '@/components/SetupForm';
import { ChatInterface } from '@/components/ChatInterface';
import { Settings, MessageSquare } from 'lucide-react';

interface RightSidebarProps {
  simulationStarted: boolean;
  onSimulationStart: () => void;
  selectedNodeId?: string | null;
}

export const RightSidebar = ({ simulationStarted, onSimulationStart, selectedNodeId }: RightSidebarProps) => {
  const [activeTab, setActiveTab] = useState('setup');

  const handleSimulationStart = () => {
    onSimulationStart();
    setActiveTab('chat');
  };

  return (
    <div className="h-full bg-slate-900/50 backdrop-blur-sm">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <div className="border-b border-slate-700/50 p-4">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
            <TabsTrigger 
              value="setup" 
              className="data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-300 text-slate-400"
            >
              <Settings size={16} className="mr-2" />
              Setup
            </TabsTrigger>
            <TabsTrigger 
              value="chat" 
              disabled={!simulationStarted}
              className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-300 text-slate-400 disabled:opacity-50"
            >
              <MessageSquare size={16} className="mr-2" />
              Chat
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="setup" className="h-full m-0">
            <SetupForm onStart={handleSimulationStart} />
          </TabsContent>

          <TabsContent value="chat" className="h-full m-0">
            <ChatInterface simulationStarted={simulationStarted} selectedNodeId={selectedNodeId} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
