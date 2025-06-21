// ABOUTME: Global state management hook for conversation data
// ABOUTME: Manages conversation tree, messages, and current state

import { useState, useCallback } from 'react';
import { ConversationTree, Message, ModelProvider } from '@/types/models';
import { api } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface ConversationState {
  conversationId: string | null;
  conversationTree: ConversationTree | null;
  currentPath: Message[];
  currentNodeId: string | null;
  loading: boolean;
  error: string | null;
}

export const useConversation = () => {
  const { toast } = useToast();
  const [state, setState] = useState<ConversationState>({
    conversationId: null,
    conversationTree: null,
    currentPath: [],
    currentNodeId: null,
    loading: false,
    error: null,
  });

  const setLoading = (loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  };

  const setError = (error: string | null) => {
    setState(prev => ({ ...prev, error }));
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  };

  const initializeConversation = useCallback(async (
    conversationData: {
      general_setting: string;
      specific_scenario: string;
    } & (
      | {
          agent_a_id: string;
          agent_b_id: string;
        }
      | {
          agent_a_name: string;
          agent_a_traits: string;
          agent_b_name: string;
          agent_b_traits: string;
          agent_a_model_provider?: string;
          agent_a_model_name?: string;
          agent_a_temperature?: number;
          agent_a_behavioral_instructions?: string;
          agent_b_model_provider?: string;
          agent_b_model_name?: string;
          agent_b_temperature?: number;
          agent_b_behavioral_instructions?: string;
        }
    ),
    useExistingAgents: boolean = false
  ) => {
    setLoading(true);
    setError(null);

    try {
      let tree: ConversationTree;
      if (useExistingAgents) {
        tree = await api.createConversationWithAgents(conversationData as {
          general_setting: string;
          specific_scenario: string;
          agent_a_id: string;
          agent_b_id: string;
        });
      } else {
        tree = await api.createConversation(conversationData as {
          general_setting: string;
          specific_scenario: string;
          agent_a_name: string;
          agent_a_traits: string;
          agent_b_name: string;
          agent_b_traits: string;
          agent_a_model_provider?: ModelProvider;
          agent_a_model_name?: string;
          agent_a_temperature?: number;
          agent_a_behavioral_instructions?: string;
          agent_b_model_provider?: ModelProvider;
          agent_b_model_name?: string;
          agent_b_temperature?: number;
          agent_b_behavioral_instructions?: string;
        });
      }
      
      setState({
        conversationId: tree.id,
        conversationTree: tree,
        currentPath: [],
        currentNodeId: null,
        loading: false,
        error: null,
      });

      toast({
        title: "Success",
        description: "Conversation created successfully!",
      });

      return tree;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create conversation';
      setError(errorMessage);
      setLoading(false);
      throw error;
    }
  }, [toast]);

  const generateNextResponse = useCallback(async () => {
    if (!state.conversationId) {
      setError('No active conversation');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.generateResponse(state.conversationId, state.currentNodeId);
      
      setState(prev => ({
        ...prev,
        currentPath: response.current_path,
        currentNodeId: response.node_id,
        loading: false,
      }));

      // Refresh the tree
      await refreshTree();

      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate response';
      setError(errorMessage);
      setLoading(false);
      throw error;
    }
  }, [state.conversationId, state.currentNodeId]);

  const sendUserMessage = useCallback(async (message: string, agentId: string) => {
    if (!state.conversationId) {
      setError('No active conversation');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.sendUserResponse({
        conversation_id: state.conversationId,
        node_id: state.currentNodeId,
        message,
        agent_id: agentId,
      });

      setState(prev => ({
        ...prev,
        currentPath: response.current_path,
        currentNodeId: response.node_id,
        loading: false,
      }));

      // Refresh the tree
      await refreshTree();

      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      setError(errorMessage);
      setLoading(false);
      throw error;
    }
  }, [state.conversationId, state.currentNodeId]);

  const applyIntervention = useCallback(async (type: 'escalate' | 'de_escalate') => {
    if (!state.conversationId) {
      setError('No active conversation');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.applyIntervention({
        conversation_id: state.conversationId,
        node_id: state.currentNodeId,
        intervention_type: type,
      });

      setState(prev => ({
        ...prev,
        currentPath: response.current_path,
        currentNodeId: response.node_id,
        loading: false,
      }));

      // Refresh the tree
      await refreshTree();

      toast({
        title: "Intervention Applied",
        description: `${type === 'escalate' ? 'Escalation' : 'De-escalation'} applied successfully`,
      });

      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to apply intervention';
      setError(errorMessage);
      setLoading(false);
      throw error;
    }
  }, [state.conversationId, state.currentNodeId, toast]);

  const refreshTree = useCallback(async () => {
    if (!state.conversationId) return;

    try {
      const { tree, current_path } = await api.getConversationTree(state.conversationId);
      setState(prev => ({
        ...prev,
        conversationTree: tree,
        currentPath: current_path,
      }));
    } catch (error) {
      console.error('Failed to refresh tree:', error);
    }
  }, [state.conversationId]);

  const selectNode = useCallback((nodeId: string) => {
    setState(prev => ({ ...prev, currentNodeId: nodeId }));
  }, []);

  const branchFromNode = useCallback(async (nodeId: string) => {
    if (!state.conversationId) {
      setError('No active conversation');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.branchFromNode(state.conversationId, nodeId);
      
      setState(prev => ({
        ...prev,
        currentPath: response.current_path,
        currentNodeId: nodeId,
        loading: false,
      }));

      // Refresh the tree
      await refreshTree();

      toast({
        title: "Success",
        description: "Branched conversation from selected node",
      });

      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to branch conversation';
      setError(errorMessage);
      setLoading(false);
      throw error;
    }
  }, [state.conversationId, toast]);

  return {
    ...state,
    initializeConversation,
    generateNextResponse,
    sendUserMessage,
    applyIntervention,
    refreshTree,
    selectNode,
    branchFromNode,
  };
};