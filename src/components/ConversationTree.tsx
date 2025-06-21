import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Users, ArrowDown, GitBranch } from 'lucide-react';

interface TreeNode {
  id: string;
  message: string;
  agent: string;
  mood: 'positive' | 'neutral' | 'negative';
  children: TreeNode[];
  parent?: string;
}
interface ConversationTreeProps {
  simulationStarted: boolean;
  selectedNodeId?: string | null;
  onNodeSelect: (nodeId: string) => void;
}
export const ConversationTree = ({
  simulationStarted,
  selectedNodeId,
  onNodeSelect
}: ConversationTreeProps) => {
  const [treeData, setTreeData] = useState<TreeNode[]>([]);

  // Mock conversation tree data
  useEffect(() => {
    if (simulationStarted) {
      // TODO: Replace with API call to fetch conversation tree
      const mockTree: TreeNode[] = [{
        id: '1',
        message: "I think we should try that new Italian place for our anniversary dinner.",
        agent: 'Alice',
        mood: 'positive',
        children: [{
          id: '2',
          message: "Italian again? We always go Italian. Can't we try something different for once?",
          agent: 'Bob',
          mood: 'negative',
          children: [{
            id: '3',
            message: "I suggested it because I know you love pasta. I was trying to be thoughtful.",
            agent: 'Alice',
            mood: 'neutral',
            children: [{
              id: '4',
              message: "You're right, I'm sorry. I appreciate the thought.",
              agent: 'Bob',
              mood: 'positive',
              children: []
            }]
          }]
        }]
      }];
      setTreeData(mockTree);
    }
  }, [simulationStarted]);
  const handleBranch = () => {
    console.log('Branch button clicked');
    // TODO: Implement branching logic
  };
  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'positive':
        return 'bg-green-500 border-green-400';
      case 'negative':
        return 'bg-red-500 border-red-400';
      case 'neutral':
        return 'bg-yellow-500 border-yellow-400';
      default:
        return 'bg-slate-500 border-slate-400';
    }
  };
  const getArrowColor = (mood: string) => {
    switch (mood) {
      case 'positive':
        return 'text-green-400';
      case 'negative':
        return 'text-red-400';
      case 'neutral':
        return 'text-yellow-400';
      default:
        return 'text-slate-400';
    }
  };
  const renderNode = (node: TreeNode, level: number = 0) => <div key={node.id} className="flex flex-col items-center">
      {/* Circular Node */}
      <div className="flex flex-col items-center">
        <Button variant="ghost" size="sm" onClick={() => onNodeSelect(node.id)} className={`
            w-12 h-12 rounded-full border-2 p-0 transition-all duration-200 text-white font-bold text-sm
            ${selectedNodeId === node.id ? 'ring-2 ring-blue-400/50 scale-110' : ''}
            ${getMoodColor(node.mood)}
            hover:scale-105 hover:shadow-lg
          `}>
          {node.id}
        </Button>
        
        {/* Agent Label */}
        <span className="text-xs text-slate-400 mt-1">{node.agent}</span>
      </div>

      {/* Arrow and Children */}
      {node.children.length > 0 && <div className="flex flex-col items-center mt-2">
          <ArrowDown size={16} className={`${getArrowColor(node.children[0]?.mood || 'neutral')} mb-2`} />
          
          {/* Multiple children - branch layout */}
          {node.children.length > 1 ? <div className="flex gap-8">
              {node.children.map(child => <div key={child.id} className="flex flex-col items-center">
                  {renderNode(child, level + 1)}
                </div>)}
            </div> : renderNode(node.children[0], level + 1)}
        </div>}
    </div>;
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 p-6 overflow-auto">
        {!simulationStarted ? (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto text-slate-600 mb-4" />
            <p className="text-slate-400 text-sm">
              Start a simulation to see the conversation tree
            </p>
          </div>
        ) : (
          <div className="flex justify-center">
            {treeData.length > 0 ? (
              <div className="space-y-4">
                {treeData.map(node => renderNode(node))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-400 text-sm">
                  Conversation tree will appear here...
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Branch Button at Bottom */}
      {simulationStarted && (
        <div className="p-4 border-t border-slate-700/50 flex-shrink-0">
          <Button onClick={handleBranch} className="w-full bg-green-600/80 hover:bg-green-600 text-green-100" size="sm">
            <GitBranch size={16} className="mr-2" />
            Branch
          </Button>
        </div>
      )}
    </div>
  );
};
