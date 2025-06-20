
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Users } from 'lucide-react';

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
}

export const ConversationTree = ({ simulationStarted }: ConversationTreeProps) => {
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Mock conversation tree data
  useEffect(() => {
    if (simulationStarted) {
      // TODO: Replace with API call to fetch conversation tree
      const mockTree: TreeNode[] = [
        {
          id: '1',
          message: "I think we should try that new Italian place for our anniversary dinner.",
          agent: 'Alice',
          mood: 'positive',
          children: [
            {
              id: '2',
              message: "Italian again? We always go Italian. Can't we try something different for once?",
              agent: 'Bob',
              mood: 'negative',
              children: [
                {
                  id: '3',
                  message: "I suggested it because I know you love pasta. I was trying to be thoughtful.",
                  agent: 'Alice',
                  mood: 'neutral',
                  children: []
                }
              ]
            }
          ]
        }
      ];
      setTreeData(mockTree);
    }
  }, [simulationStarted]);

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'positive': return 'bg-green-500/20 border-green-400/50 text-green-300';
      case 'negative': return 'bg-red-500/20 border-red-400/50 text-red-300';
      case 'neutral': return 'bg-yellow-500/20 border-yellow-400/50 text-yellow-300';
      default: return 'bg-slate-500/20 border-slate-400/50 text-slate-300';
    }
  };

  const renderNode = (node: TreeNode, level: number = 0) => (
    <div key={node.id} className="relative">
      <div className={`ml-${level * 4} mb-2`}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedNode(node.id)}
          className={`
            w-full text-left justify-start p-3 h-auto border rounded-lg transition-all duration-200
            ${selectedNode === node.id ? 'ring-2 ring-blue-400/50' : ''}
            ${getMoodColor(node.mood)}
            hover:scale-[1.02] hover:shadow-lg
          `}
        >
          <div className="flex items-start gap-2 w-full">
            <MessageCircle size={14} className="mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-xs mb-1">{node.agent}</p>
              <p className="text-xs opacity-90 line-clamp-2">{node.message}</p>
            </div>
          </div>
        </Button>
      </div>
      {node.children.map(child => renderNode(child, level + 1))}
    </div>
  );

  return (
    <div className="h-full bg-slate-900/50 backdrop-blur-sm">
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex items-center gap-2 mb-2">
          <Users size={18} className="text-blue-400" />
          <h2 className="font-semibold text-slate-200">Conversation Tree</h2>
        </div>
        <p className="text-xs text-slate-400">
          Click nodes to navigate through the conversation
        </p>
      </div>

      <div className="p-4 overflow-y-auto h-full">
        {!simulationStarted ? (
          <div className="text-center py-12">
            <MessageCircle size={48} className="mx-auto text-slate-600 mb-4" />
            <p className="text-slate-400 text-sm">
              Start a simulation to see the conversation tree
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {treeData.map(node => renderNode(node))}
            {treeData.length === 0 && (
              <div className="text-center py-8">
                <p className="text-slate-400 text-sm">
                  Conversation tree will appear here...
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
