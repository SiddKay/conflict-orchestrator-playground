// ABOUTME: Manages dual avatar instances for Agent A and Agent B with synchronized speech
// ABOUTME: Integrates with conversation context to handle chat messages and TTS

import React, { useRef, useEffect, useState, useCallback } from 'react';
import TalkingHeadAvatar, { TalkingHeadRef, AvatarConfig } from './TalkingHeadAvatar';
import { useConversationContext } from '@/contexts/ConversationContext';
import { Message, MoodEnum } from '@/types/models';

interface DualAvatarManagerProps {
  elevenLabsApiKey?: string;
  elevenLabsVoiceIdA?: string;
  elevenLabsVoiceIdB?: string;
  className?: string;
}

// Map mood enum to avatar mood
const moodToAvatarMood: Record<MoodEnum, string> = {
  happy: 'happy',
  excited: 'happy',
  neutral: 'neutral',
  calm: 'neutral',
  sad: 'sad',
  frustrated: 'angry',
  angry: 'angry',
};

export const DualAvatarManager: React.FC<DualAvatarManagerProps> = ({
  elevenLabsApiKey,
  elevenLabsVoiceIdA,
  elevenLabsVoiceIdB,
  className = ''
}) => {
  const avatarARef = useRef<TalkingHeadRef>(null);
  const avatarBRef = useRef<TalkingHeadRef>(null);
  const [avatarAReady, setAvatarAReady] = useState(false);
  const [avatarBReady, setAvatarBReady] = useState(false);
  const [processedMessageIds, setProcessedMessageIds] = useState<Set<string>>(new Set());
  const lastProcessedIndexRef = useRef(-1);

  const { conversationTree, currentPath } = useConversationContext();

  // Avatar configurations
  const avatarConfigs: Record<string, AvatarConfig> = {
    agentA: {
      url: '/avatars/brunette.glb',
      name: conversationTree?.setup.agent_a.name || 'Agent A',
      agentId: conversationTree?.setup.agent_a.id || 'agent_a',
      body: 'F',
      lipsyncLang: 'en',
      ttsLang: 'en-US',
      ttsVoice: 'en-US-Standard-C', // Female voice
      avatarMood: 'neutral'
    },
    agentB: {
      url: '/avatars/david.glb',
      name: conversationTree?.setup.agent_b.name || 'Agent B',
      agentId: conversationTree?.setup.agent_b.id || 'agent_b',
      body: 'M',
      lipsyncLang: 'en',
      ttsLang: 'en-US',
      ttsVoice: 'en-US-Standard-D', // Male voice
      avatarMood: 'neutral'
    }
  };

  // Process new messages
  useEffect(() => {
    if (!avatarAReady || !avatarBReady || !currentPath.length) return;

    // Find new messages to process
    const newMessages = currentPath.filter(msg => !processedMessageIds.has(msg.id));
    
    if (newMessages.length === 0) return;

    // Process messages sequentially
    const processMessages = async () => {
      for (const message of newMessages) {
        await speakMessage(message);
        setProcessedMessageIds(prev => new Set([...prev, message.id]));
      }
    };

    processMessages();
  }, [currentPath, avatarAReady, avatarBReady, processedMessageIds]);

  // Speak a message with the appropriate avatar
  const speakMessage = async (message: Message) => {
    const isAgentA = message.agent_id === avatarConfigs.agentA.agentId;
    const avatarRef = isAgentA ? avatarARef : avatarBRef;
    const otherAvatarRef = isAgentA ? avatarBRef : avatarARef;
    
    if (!avatarRef.current?.isReady) return;

    try {
      // Make the speaking avatar look at camera
      avatarRef.current.lookAt(0, 0, 500);
      
      // Make the other avatar look at the speaker
      if (otherAvatarRef.current?.isReady) {
        const lookX = isAgentA ? -0.3 : 0.3;
        otherAvatarRef.current.lookAt(lookX, 0, 500);
      }

      // Get avatar mood from message mood
      const avatarMood = moodToAvatarMood[message.mood] || 'neutral';

      // Speak the message
      await avatarRef.current.speak(message.msg, avatarMood);

      // Return avatars to neutral position
      avatarRef.current.lookAt(0, 0, 300);
      if (otherAvatarRef.current?.isReady) {
        otherAvatarRef.current.lookAt(0, 0, 300);
      }
    } catch (error) {
      console.error('Error speaking message:', error);
    }
  };

  // Handle avatar ready states
  const handleAvatarAReady = useCallback(() => {
    setAvatarAReady(true);
    console.log('Avatar A ready');
  }, []);

  const handleAvatarBReady = useCallback(() => {
    setAvatarBReady(true);
    console.log('Avatar B ready');
  }, []);

  // Handle errors
  const handleError = useCallback((error: Error) => {
    console.error('Avatar error:', error);
  }, []);

  // Reset processed messages when conversation changes
  useEffect(() => {
    if (conversationTree?.id) {
      setProcessedMessageIds(new Set());
      lastProcessedIndexRef.current = -1;
    }
  }, [conversationTree?.id]);

  return (
    <div className={`flex gap-4 h-full ${className}`}>
      {/* Agent A Avatar */}
      <div className="flex-1 relative">
        <div className="absolute top-4 left-4 z-10 bg-black/70 text-white px-3 py-1 rounded-lg">
          <p className="text-sm font-medium">{avatarConfigs.agentA.name}</p>
        </div>
        <TalkingHeadAvatar
          ref={avatarARef}
          config={avatarConfigs.agentA}
          elevenLabsApiKey={elevenLabsApiKey}
          elevenLabsVoiceId={elevenLabsVoiceIdA}
          className="w-full h-full"
          onReady={handleAvatarAReady}
          onError={handleError}
        />
      </div>

      {/* Agent B Avatar */}
      <div className="flex-1 relative">
        <div className="absolute top-4 left-4 z-10 bg-black/70 text-white px-3 py-1 rounded-lg">
          <p className="text-sm font-medium">{avatarConfigs.agentB.name}</p>
        </div>
        <TalkingHeadAvatar
          ref={avatarBRef}
          config={avatarConfigs.agentB}
          elevenLabsApiKey={elevenLabsApiKey}
          elevenLabsVoiceId={elevenLabsVoiceIdB}
          className="w-full h-full"
          onReady={handleAvatarBReady}
          onError={handleError}
        />
      </div>
    </div>
  );
};