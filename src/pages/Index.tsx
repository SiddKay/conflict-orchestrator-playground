
import React, { useState } from 'react';
import { ConversationTree } from '@/components/ConversationTree';
import { RightSidebar } from '@/components/RightSidebar';
import { Button } from '@/components/ui/button';
import { PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen } from 'lucide-react';

const Index = () => {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [simulationStarted, setSimulationStarted] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const handleNodeSelect = (nodeId: string) => {
    setSelectedNodeId(nodeId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex w-full">
      {/* Left Sidebar - Conversation Tree */}
      <div className={`${leftSidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden border-r border-slate-700/50`}>
        <ConversationTree 
          simulationStarted={simulationStarted} 
          selectedNodeId={selectedNodeId}
          onNodeSelect={handleNodeSelect}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header with toggle buttons */}
        <div className="h-16 border-b border-slate-700/50 flex items-center justify-between px-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
            className="text-slate-300 hover:text-white hover:bg-slate-700/50"
          >
            {leftSidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
          </Button>

          <div className="text-center">
            <h1 className="font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-lg">
              AI Conflict Simulator
            </h1>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
            className="text-slate-300 hover:text-white hover:bg-slate-700/50"
          >
            {rightSidebarOpen ? <PanelRightClose size={18} /> : <PanelRightOpen size={18} />}
          </Button>
        </div>

        {/* Center Stage - Placeholder for 3D */}
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="w-full max-w-4xl h-96 flex gap-4">
            {/* Agent A Placeholder */}
            <div className="flex-1 border-2 border-dashed border-slate-600/50 rounded-lg flex items-center justify-center bg-slate-800/20">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-full mx-auto mb-4 border border-blue-500/30"></div>
                <p className="text-slate-400 font-medium">Agent A</p>
                <p className="text-sm text-slate-500">3D Visualization</p>
              </div>
            </div>

            {/* Agent B Placeholder */}
            <div className="flex-1 border-2 border-dashed border-slate-600/50 rounded-lg flex items-center justify-center bg-slate-800/20">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-full mx-auto mb-4 border border-purple-500/30"></div>
                <p className="text-slate-400 font-medium">Agent B</p>
                <p className="text-sm text-slate-500">3D Visualization</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Setup & Chat */}
      <div className={`${rightSidebarOpen ? 'w-96' : 'w-0'} transition-all duration-300 overflow-hidden border-l border-slate-700/50`}>
        <RightSidebar 
          simulationStarted={simulationStarted} 
          onSimulationStart={() => setSimulationStarted(true)}
          selectedNodeId={selectedNodeId}
        />
      </div>
    </div>
  );
};

export default Index;
