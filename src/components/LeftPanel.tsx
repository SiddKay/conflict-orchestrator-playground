
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConversationTree } from '@/components/ConversationTree';
import { ThreeDVisualization } from '@/components/ThreeDVisualization';
import { Network, Box } from 'lucide-react';

interface LeftPanelProps {
  simulationStarted: boolean;
  selectedNodeId?: string | null;
  onNodeSelect: (nodeId: string) => void;
}

export const LeftPanel = ({ simulationStarted, selectedNodeId, onNodeSelect }: LeftPanelProps) => {
  const [activeTab, setActiveTab] = useState('tree');

  return (
    <div className="h-screen bg-slate-900/50 backdrop-blur-sm flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <div className="border-b border-slate-700/50 p-4 flex-shrink-0">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
            <TabsTrigger 
              value="tree" 
              className="data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-300 text-slate-400"
            >
              <Network size={16} className="mr-2" />
              Tree View
            </TabsTrigger>
            <TabsTrigger 
              value="3d" 
              className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-300 text-slate-400"
            >
              <Box size={16} className="mr-2" />
              3D View
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="tree" className="h-full m-0">
            <ConversationTree 
              simulationStarted={simulationStarted} 
              selectedNodeId={selectedNodeId}
              onNodeSelect={onNodeSelect}
            />
          </TabsContent>

          <TabsContent value="3d" className="h-full m-0">
            <ThreeDVisualization simulationStarted={simulationStarted} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
