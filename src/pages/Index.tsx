
import React, { useState } from 'react';
import { LeftPanel } from '@/components/LeftPanel';
import { RightSidebar } from '@/components/RightSidebar';
import { ConversationProvider } from '@/contexts/ConversationContext';

const Index = () => {
  const [simulationStarted, setSimulationStarted] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const handleNodeSelect = (nodeId: string) => {
    setSelectedNodeId(nodeId);
  };

  const handleSimulationStart = () => {
    setSimulationStarted(true);
  };

  return (
    <ConversationProvider>
      <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col w-full overflow-hidden">
      {/* Header */}
      <div className="h-16 border-b border-slate-700/50 flex items-center justify-center px-6 bg-slate-900/50 backdrop-blur-sm flex-shrink-0">
        <h1 className="font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-lg">
          AI Conflict Simulator
        </h1>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="flex w-full flex-1 overflow-hidden">
        {/* Left Panel - Tree View & 3D Visualization */}
        <div className="w-1/2 border-r border-slate-700/50">
          <LeftPanel 
            simulationStarted={simulationStarted} 
            selectedNodeId={selectedNodeId}
            onNodeSelect={handleNodeSelect}
          />
        </div>

        {/* Right Panel - Setup & Chat */}
        <div className="w-1/2">
          <RightSidebar 
            simulationStarted={simulationStarted} 
            onSimulationStart={handleSimulationStart}
            selectedNodeId={selectedNodeId}
          />
        </div>
      </div>
      </div>
    </ConversationProvider>
  );
};

export default Index;
