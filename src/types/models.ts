// ABOUTME: TypeScript type definitions matching backend data models
// ABOUTME: Ensures type safety for API communication

export type MoodEnum = 'happy' | 'excited' | 'neutral' | 'calm' | 'sad' | 'frustrated' | 'angry';

export type ModelProvider = 'openai' | 'mistral' | 'google';

export interface AgentConfig {
  id: string;
  name: string;
  personality_traits: string;
  behavioral_instructions?: string;
  model_provider: ModelProvider;
  model_name: string;
  temperature: number;
  created_at: string;
}

export interface ConversationSetup {
  general_setting: string;
  specific_scenario: string;
  agent_a: AgentConfig;
  agent_b: AgentConfig;
}

export interface Message {
  id: string;
  agent_id: string;
  msg: string;
  mood: MoodEnum;
  timestamp: string;
  is_user_override: boolean;
}

export interface ConversationNode {
  id: string;
  message: Message;
  parent_id?: string;
  children: string[];
  path: string;
}

export interface ConversationTree {
  id: string;
  setup: ConversationSetup;
  nodes: Record<string, ConversationNode>;
  root_nodes: string[];
  current_branch?: string;
  created_at: string;
}

export interface ConversationAnalysis {
  conversation_id: string;
  total_messages: number;
  escalation_points: Array<{
    from_index: string;
    to_index: string;
    from_mood: string;
    to_mood: string;
    message: string;
  }>;
  de_escalation_points: Array<{
    from_index: string;
    to_index: string;
    from_mood: string;
    to_mood: string;
    message: string;
  }>;
  mood_progression: Array<{
    message_index: string;
    agent_id: string;
    mood: string;
    snippet: string;
  }>;
  summary: string;
  suggestions: string[];
  analysis_markdown: string;
}