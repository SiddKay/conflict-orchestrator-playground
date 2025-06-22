// ABOUTME: Optimized dual avatar manager with performance monitoring and adaptive quality
// ABOUTME: Implements lazy loading, FPS limiting, and single-avatar fallback

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import TalkingHeadAvatar, { TalkingHeadRef, AvatarConfig } from './TalkingHeadAvatar';
import { useConversationContext } from '@/contexts/ConversationContext';
import { Message, MoodEnum } from '@/types/models';
import { useAvatarPerformance, PerformanceConfig } from './AvatarPerformanceManager';
import { Button } from '@/components/ui/button';
import { AlertCircle, Zap } from 'lucide-react';

interface OptimizedDualAvatarManagerProps {
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

export const OptimizedDualAvatarManager: React.FC<OptimizedDualAvatarManagerProps> = ({
  elevenLabsApiKey,
  elevenLabsVoiceIdA,
  elevenLabsVoiceIdB,
  className = ''
}) => {
  const avatarARef = useRef<TalkingHeadRef>(null);
  const avatarBRef = useRef<TalkingHeadRef>(null);
  const [avatarsLoaded, setAvatarsLoaded] = useState(false);
  const [avatarsReady, setAvatarsReady] = useState(false);
  const [currentMode, setCurrentMode] = useState<'dual' | 'single'>('dual');
  const [activeAvatar, setActiveAvatar] = useState<'A' | 'B'>('A');
  const [processedMessageIds, setProcessedMessageIds] = useState<Set<string>>(new Set());
  const messageQueueRef = useRef<Message[]>([]);
  const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isProcessingRef = useRef(false);
  
  const { conversationTree, currentPath } = useConversationContext();
  
  // Performance configuration
  const performanceConfig = useMemo<PerformanceConfig>(() => ({
    targetFPS: 24, // Reduced from default 30
    enableDualAvatars: true,
    reduceQualityOnLowPerf: true,
    maxCPUUsage: 80
  }), []);
  
  const { metrics, recommendations } = useAvatarPerformance(performanceConfig);
  
  // Extract agent data once to avoid dependencies
  const agentAName = conversationTree?.setup.agent_a.name || 'Agent A';
  const agentAId = conversationTree?.setup.agent_a.id || 'agent_a';
  const agentBName = conversationTree?.setup.agent_b.name || 'Agent B';
  const agentBId = conversationTree?.setup.agent_b.id || 'agent_b';
  
  // Avatar configurations
  const avatarConfigs = useMemo(() => ({
    agentA: {
      url: '/avatars/brunette.glb',
      name: agentAName,
      agentId: agentAId,
      body: 'F' as const,
      lipsyncLang: 'en',
      ttsLang: 'en-US',
      ttsVoice: 'en-US-Standard-C',
      avatarMood: 'neutral' as const
    },
    agentB: {
      url: '/avatars/david.glb',
      name: agentBName,
      agentId: agentBId,
      body: 'M' as const,
      lipsyncLang: 'en',
      ttsLang: 'en-US',
      ttsVoice: 'en-US-Standard-D',
      avatarMood: 'neutral' as const
    }
  }), [agentAName, agentAId, agentBName, agentBId]);
  
  // Lazy load avatars
  const loadAvatars = useCallback(() => {
    if (!avatarsLoaded) {
      setAvatarsLoaded(true);
    }
  }, [avatarsLoaded]);
  
  // Monitor avatar ready state
  useEffect(() => {
    const checkInterval = setInterval(() => {
      if (avatarARef.current?.isReady && avatarBRef.current?.isReady && !avatarsReady) {
        console.log('Both avatars are now ready');
        setAvatarsReady(true);
        clearInterval(checkInterval);
      }
    }, 100);
    
    return () => clearInterval(checkInterval);
  }, [avatarsReady]);
  
  // Switch to single avatar mode if performance is low
  useEffect(() => {
    if (recommendations.shouldUseSingleAvatar && currentMode === 'dual') {
      console.warn('Switching to single avatar mode due to low performance');
      setCurrentMode('single');
    }
  }, [recommendations.shouldUseSingleAvatar, currentMode]);
  
  // Speak a message with the appropriate avatar
  const speakMessage = useCallback(async (message: Message) => {
    const isAgentA = message.agent_id === agentAId;
    
    if (currentMode === 'single') {
      // In single mode, switch avatar if needed
      if ((isAgentA && activeAvatar === 'B') || (!isAgentA && activeAvatar === 'A')) {
        setActiveAvatar(isAgentA ? 'A' : 'B');
        // Wait for avatar switch animation
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
    
    const avatarRef = isAgentA ? avatarARef : avatarBRef;
    const otherAvatarRef = isAgentA ? avatarBRef : avatarARef;
    
    if (!avatarRef.current?.isReady) {
      console.warn(`Avatar ${isAgentA ? 'A' : 'B'} not ready, skipping message`);
      return;
    }
    
    try {
      // Ensure the other avatar is not speaking
      if (otherAvatarRef.current?.isSpeaking) {
        console.warn('Other avatar is still speaking, waiting...');
        // Wait a bit longer for the other avatar to finish
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      const avatarMood = moodToAvatarMood[message.mood] || 'neutral';
      console.log(`Avatar ${isAgentA ? 'A' : 'B'} speaking: "${message.msg.substring(0, 50)}..."`);
      await avatarRef.current.speak(message.msg, avatarMood);
      console.log(`Avatar ${isAgentA ? 'A' : 'B'} finished speaking`);
    } catch (error) {
      console.error('Error speaking message:', error);
      throw error; // Re-throw to handle in processMessageQueue
    }
  }, [agentAId, currentMode, activeAvatar]);
  
  // Optimized message processing with queue
  const processMessageQueue = useCallback(async () => {
    if (isProcessingRef.current || messageQueueRef.current.length === 0) return;
    
    isProcessingRef.current = true;
    const message = messageQueueRef.current.shift();
    
    if (message) {
      try {
        // Wait for the avatar to completely finish speaking
        await speakMessage(message);
        setProcessedMessageIds(prev => new Set([...prev, message.id]));
        
        // Add a small pause between messages to ensure clean transitions
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        console.error('Error processing message:', error);
      }
    }
    
    isProcessingRef.current = false;
    
    // Process next message immediately if queue is not empty
    if (messageQueueRef.current.length > 0) {
      // Use a minimal delay to yield to browser for UI updates
      processingTimeoutRef.current = setTimeout(() => {
        processMessageQueue();
      }, 10);
    }
  }, [speakMessage]);
  
  // Add new messages to queue
  useEffect(() => {
    if (!avatarsLoaded || !avatarsReady || !currentPath.length) return;
    
    const newMessages = currentPath.filter(msg => !processedMessageIds.has(msg.id));
    
    if (newMessages.length > 0) {
      console.log(`Adding ${newMessages.length} new messages to queue`);
      
      // Add to queue
      messageQueueRef.current.push(...newMessages);
      
      // Start processing if not already processing
      if (!isProcessingRef.current && messageQueueRef.current.length > 0) {
        // Add a small delay to ensure avatars are fully initialized
        setTimeout(() => {
          processMessageQueue();
        }, 500);
      }
    }
  }, [currentPath, avatarsLoaded, avatarsReady, processedMessageIds, processMessageQueue]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Stop any ongoing speech
      if (avatarARef.current?.isSpeaking) {
        avatarARef.current.stop();
      }
      if (avatarBRef.current?.isSpeaking) {
        avatarBRef.current.stop();
      }
      
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }
      messageQueueRef.current = [];
      isProcessingRef.current = false;
    };
  }, []);
  
  // Reset when conversation changes
  useEffect(() => {
    if (conversationTree?.id) {
      // Stop any ongoing speech
      if (avatarARef.current?.isSpeaking) {
        avatarARef.current.stop();
      }
      if (avatarBRef.current?.isSpeaking) {
        avatarBRef.current.stop();
      }
      
      setProcessedMessageIds(new Set());
      messageQueueRef.current = [];
      isProcessingRef.current = false;
      
      // Clear any pending timeouts
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
        processingTimeoutRef.current = null;
      }
      
      // Reset avatars ready state to re-check after conversation change
      setAvatarsReady(false);
    }
  }, [conversationTree?.id]);
  
  if (!avatarsLoaded) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <div className="text-center">
          <h3 className="text-lg font-medium mb-4">3D Avatars Available</h3>
          <p className="text-sm text-gray-500 mb-6">
            Click to load interactive 3D avatars for the conversation
          </p>
          <Button onClick={loadAvatars} size="lg">
            <Zap className="mr-2" />
            Load 3D Avatars
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Performance warning */}
      {metrics.isLowPerformance && (
        <div className="bg-yellow-500/20 border border-yellow-500/50 rounded p-2 mb-2 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-yellow-500" />
          <span className="text-sm">
            Performance mode active - FPS: {metrics.fps}
          </span>
        </div>
      )}
      
      {/* Avatar display */}
      <div className="flex-1 flex gap-4">
        {currentMode === 'dual' ? (
          <>
            {/* Dual avatar mode */}
            <div className="flex-1 relative">
              <div className="absolute top-4 left-4 z-10 bg-black/70 text-white px-3 py-1 rounded-lg">
                <p className="text-sm font-medium">{agentAName}</p>
              </div>
              <TalkingHeadAvatar
                ref={avatarARef}
                config={avatarConfigs.agentA}
                elevenLabsApiKey={elevenLabsApiKey}
                elevenLabsVoiceId={elevenLabsVoiceIdA}
                performanceMode={metrics.isLowPerformance}
                className="w-full h-full"
              />
            </div>
            
            <div className="flex-1 relative">
              <div className="absolute top-4 left-4 z-10 bg-black/70 text-white px-3 py-1 rounded-lg">
                <p className="text-sm font-medium">{agentBName}</p>
              </div>
              <TalkingHeadAvatar
                ref={avatarBRef}
                config={avatarConfigs.agentB}
                elevenLabsApiKey={elevenLabsApiKey}
                elevenLabsVoiceId={elevenLabsVoiceIdB}
                performanceMode={metrics.isLowPerformance}
                className="w-full h-full"
              />
            </div>
          </>
        ) : (
          /* Single avatar mode - show only active avatar */
          <div className="flex-1 relative">
            <div className="absolute top-4 left-4 z-10 bg-black/70 text-white px-3 py-1 rounded-lg">
              <p className="text-sm font-medium">
                {activeAvatar === 'A' ? agentAName : agentBName}
              </p>
            </div>
            {activeAvatar === 'A' ? (
              <TalkingHeadAvatar
                ref={avatarARef}
                config={avatarConfigs.agentA}
                elevenLabsApiKey={elevenLabsApiKey}
                elevenLabsVoiceId={elevenLabsVoiceIdA}
                performanceMode={metrics.isLowPerformance}
                className="w-full h-full"
              />
            ) : (
              <TalkingHeadAvatar
                ref={avatarBRef}
                config={avatarConfigs.agentB}
                elevenLabsApiKey={elevenLabsApiKey}
                elevenLabsVoiceId={elevenLabsVoiceIdB}
                performanceMode={metrics.isLowPerformance}
                className="w-full h-full"
              />
            )}
          </div>
        )}
      </div>
      
      {/* Mode switcher */}
      <div className="flex justify-center gap-2 p-2">
        <Button
          size="sm"
          variant={currentMode === 'dual' ? 'default' : 'outline'}
          onClick={() => setCurrentMode('dual')}
          disabled={metrics.isLowPerformance}
        >
          Dual Avatars
        </Button>
        <Button
          size="sm"
          variant={currentMode === 'single' ? 'default' : 'outline'}
          onClick={() => setCurrentMode('single')}
        >
          Single Avatar
        </Button>
      </div>
    </div>
  );
};