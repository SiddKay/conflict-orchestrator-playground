// ABOUTME: API service layer for backend communication
// ABOUTME: Handles all HTTP requests to the ScienceHack backend

import { 
  AgentConfig, 
  ConversationTree, 
  Message, 
  ConversationAnalysis,
  ModelProvider 
} from '@/types/models';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Model name mappings from frontend to backend
const MODEL_MAPPINGS: Record<string, { provider: ModelProvider; modelName: string }> = {
  'OpenAI GPT 4o': { provider: 'openai', modelName: 'gpt-4o' },
  'OpenAI GPT 4o Mini': { provider: 'openai', modelName: 'gpt-4o-mini' },
  'Magistral Medium': { provider: 'mistral', modelName: 'magistral-medium-latest' },
  'Magistral Small': { provider: 'mistral', modelName: 'magistral-small-latest' },
  'Mistral Medium': { provider: 'mistral', modelName: 'mistral-medium-latest' },
  'Mistral Large': { provider: 'mistral', modelName: 'mistral-large-latest' },
  'Gemini 2.0 Flash': { provider: 'google', modelName: 'gemini-2.0-flash' },
  'Gemini 2.5 Flash': { provider: 'google', modelName: 'gemini-2.5-flash' },
  'Gemini 2.5 Flash Lite': { provider: 'google', modelName: 'gemini-2.5-flash-lite-preview-06-17' }
};

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Agent endpoints
  async createAgent(agent: Partial<AgentConfig>): Promise<AgentConfig> {
    // Backend expects params, not body
    const params = new URLSearchParams({
      name: agent.name || '',
      personality_traits: agent.personality_traits || '',
      ...(agent.behavioral_instructions && { behavioral_instructions: agent.behavioral_instructions }),
      ...(agent.model_provider && { model_provider: agent.model_provider }),
      ...(agent.model_name && { model_name: agent.model_name }),
      ...(agent.temperature !== undefined && { temperature: agent.temperature.toString() })
    });
    
    const response = await fetch(`${this.baseUrl}/api/agents?${params}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return this.handleResponse<AgentConfig>(response);
  }

  async getAgents(): Promise<AgentConfig[]> {
    const response = await fetch(`${this.baseUrl}/api/agents`);
    return this.handleResponse<AgentConfig[]>(response);
  }

  async getAgent(id: string): Promise<AgentConfig> {
    const response = await fetch(`${this.baseUrl}/api/agents/${id}`);
    return this.handleResponse<AgentConfig>(response);
  }

  // Conversation endpoints
  async createConversation(data: {
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
  }): Promise<ConversationTree> {
    const response = await fetch(`${this.baseUrl}/api/conversations/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return this.handleResponse<ConversationTree>(response);
  }

  async generateResponse(conversationId: string, nodeId?: string): Promise<{
    node_id: string;
    message: Message;
    current_path: Message[];
  }> {
    const response = await fetch(`${this.baseUrl}/api/conversations/generate-response`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversation_id: conversationId,
        node_id: nodeId,
      }),
    });
    return this.handleResponse(response);
  }

  async sendUserResponse(data: {
    conversation_id: string;
    node_id?: string;
    message: string;
    agent_id: string;
  }): Promise<{
    node_id: string;
    message: Message;
    current_path: Message[];
  }> {
    const response = await fetch(`${this.baseUrl}/api/conversations/user-response`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async applyIntervention(data: {
    conversation_id: string;
    node_id?: string;
    intervention_type: 'escalate' | 'de_escalate';
  }): Promise<{
    node_id: string;
    message: Message;
    current_path: Message[];
    intervention_applied: string;
  }> {
    const response = await fetch(`${this.baseUrl}/api/conversations/apply-intervention`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async getConversationTree(conversationId: string): Promise<{
    tree: ConversationTree;
    current_path: Message[];
  }> {
    const response = await fetch(`${this.baseUrl}/api/conversations/${conversationId}/tree`);
    return this.handleResponse(response);
  }

  async analyzeConversation(conversationId: string): Promise<ConversationAnalysis> {
    const response = await fetch(`${this.baseUrl}/api/conversations/${conversationId}/analyze`, {
      method: 'POST',
    });
    return this.handleResponse<ConversationAnalysis>(response);
  }

  async createConversationWithAgents(data: {
    general_setting: string;
    specific_scenario: string;
    agent_a_id: string;
    agent_b_id: string;
  }): Promise<ConversationTree> {
    const response = await fetch(`${this.baseUrl}/api/conversations/create-with-agents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return this.handleResponse<ConversationTree>(response);
  }

  async branchFromNode(conversationId: string, nodeId: string): Promise<{
    message: string;
    node_id: string;
    current_path: Message[];
  }> {
    const response = await fetch(`${this.baseUrl}/api/conversations/${conversationId}/branch/${nodeId}`, {
      method: 'POST',
    });
    return this.handleResponse(response);
  }

  async getTreeVisualizationData(conversationId: string): Promise<{
    conversationId: string;
    setup: {
      generalSetting: string;
      specificScenario: string;
      agentA: string;
      agentB: string;
    };
    treeData: any;
    totalNodes: number;
    maxDepth: number;
  }> {
    const response = await fetch(`${this.baseUrl}/api/visualization/${conversationId}/tree-data`);
    return this.handleResponse(response);
  }

  // Utility function to map frontend model names to backend format
  static mapModelSelection(frontendModel: string): { provider: ModelProvider; modelName: string } {
    return MODEL_MAPPINGS[frontendModel] || { provider: 'openai', modelName: 'gpt-4o' };
  }
}

export const api = new ApiService(API_BASE_URL);
export { ApiService, MODEL_MAPPINGS };