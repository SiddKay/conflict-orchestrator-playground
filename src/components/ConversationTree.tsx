import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Users, ArrowDown, GitBranch } from 'lucide-react';
import { useConversationContext } from '@/contexts/ConversationContext';
import { ConversationNode, MoodEnum } from '@/types/models';
import { getTreeNodeColors, getArrowColor, getTreeNodeRingColor } from '@/lib/colorMapping';

interface TreeNode {
  id: string;
  node: ConversationNode;
  children: TreeNode[];
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
  const { conversationTree, selectNode, branchFromNode, currentPath, currentNodeId } = useConversationContext();
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [isBranching, setIsBranching] = useState(false);

  // Build tree structure from conversation nodes
  useEffect(() => {
    if (conversationTree && conversationTree.nodes) {
      const buildTree = (nodeId: string): TreeNode | null => {
        const node = conversationTree.nodes[nodeId];
        if (!node) return null;

        const children = node.children
          .map(childId => buildTree(childId))
          .filter((child): child is TreeNode => child !== null);

        return {
          id: node.id,
          node,
          children
        };
      };

      const trees = conversationTree.root_nodes
        .map(rootId => buildTree(rootId))
        .filter((tree): tree is TreeNode => tree !== null);

      setTreeData(trees);
    }
  }, [conversationTree]);

  // Helper function to check if a node is in the active path
  const isNodeInActivePath = (nodeId: string): boolean => {
    return currentPath.some(message => message.id === nodeId) || nodeId === currentNodeId;
  };

  const handleBranch = async () => {
    if (!selectedNodeId) return;
    
    setIsBranching(true);
    try {
      await branchFromNode(selectedNodeId);
      // The chat interface will automatically update based on the new current path
    } catch (error) {
      console.error('Failed to branch:', error);
    } finally {
      setIsBranching(false);
    }
  };
  const renderNode = (treeNode: TreeNode, level: number = 0) => {
    const handleNodeClick = () => {
      onNodeSelect(treeNode.id);
      selectNode(treeNode.id);
      
      // Scroll the chat interface to this message
      const messageElement = document.querySelector(`[data-message-id="${treeNode.node.message.id}"]`);
      if (messageElement) {
        messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    // Get agent name from the conversation setup
    const agentName = conversationTree?.setup.agent_a.id === treeNode.node.message.agent_id 
      ? conversationTree.setup.agent_a.name 
      : conversationTree?.setup.agent_b.name || 'Unknown';

    // Check if this node is in the active path
    const isInActivePath = isNodeInActivePath(treeNode.node.message.id);

    return (
      <div key={treeNode.id} className="flex flex-col items-center">
        {/* Circular Node */}
        <div className="flex flex-col items-center">
          <div 
            onClick={handleNodeClick} 
            className={`
              w-12 h-12 rounded-full border-2 p-0 transition-all duration-200 text-slate-100 font-bold text-sm
              flex items-center justify-center cursor-pointer
              ${selectedNodeId === treeNode.id ? 'ring-2 ring-blue-400/50 scale-110' : ''}
              ${getTreeNodeColors(treeNode.node.message.mood)}
              ${!isInActivePath ? 'opacity-40' : 'opacity-100'}
              hover:scale-105
            `}>
            {level + 1}
          </div>
          
          {/* Agent Label */}
          <span className={`text-xs mt-1 ${!isInActivePath ? 'text-slate-500 opacity-40' : 'text-slate-400'}`}>
            {agentName}
          </span>
        </div>

        {/* Arrow and Children */}
        {treeNode.children.length > 0 && (
          <div className="flex flex-col items-center mt-2">
            <ArrowDown size={16} className={`${getArrowColor(treeNode.children[0]?.node.message.mood || 'neutral')} mb-2 ${!isInActivePath ? 'opacity-40' : 'opacity-100'}`} />
            
            {/* Multiple children - branch layout */}
            {treeNode.children.length > 1 ? (
              <div className="flex gap-8">
                {treeNode.children.map(child => (
                  <div key={child.id} className="flex flex-col items-center">
                    {renderNode(child, level + 1)}
                  </div>
                ))}
              </div>
            ) : (
              renderNode(treeNode.children[0], level + 1)
            )}
          </div>
        )}
      </div>
    );
  };
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
          <Button 
            onClick={handleBranch} 
            disabled={!selectedNodeId || isBranching}
            className="w-full bg-green-600/80 hover:bg-green-600 text-green-100 disabled:opacity-50 disabled:cursor-not-allowed" 
            size="sm"
          >
            <GitBranch size={16} className="mr-2" />
            {isBranching ? 'Switching Branch...' : 'Switch Branch'}
          </Button>
        </div>
      )}
    </div>
  );
};
