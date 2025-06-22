// ABOUTME: React wrapper component for integrating TalkingHead 3D avatar functionality
// ABOUTME: Manages single avatar instance with TTS and lip-sync capabilities

import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { TalkingHead } from '@met4citizen/talkinghead';

export interface AvatarConfig {
  url: string;
  name: string;
  agentId: string;
  body: 'M' | 'F';
  lipsyncLang?: string;
  ttsLang?: string;
  ttsVoice?: string;
  avatarMood?: 'neutral' | 'happy' | 'angry' | 'sad' | 'fear' | 'disgust' | 'love' | 'sleep';
}

export interface TalkingHeadRef {
  speak: (text: string, mood?: string) => Promise<void>;
  stop: () => void;
  setMood: (mood: string) => void;
  playGesture: (gesture: string, duration?: number) => void;
  lookAt: (x: number, y: number, duration?: number) => void;
  isReady: boolean;
  isSpeaking: boolean;
}

interface TalkingHeadAvatarProps {
  config: AvatarConfig;
  elevenLabsApiKey?: string;
  elevenLabsVoiceId?: string;
  className?: string;
  performanceMode?: boolean;
  onReady?: () => void;
  onSpeechStart?: () => void;
  onSpeechEnd?: () => void;
  onError?: (error: Error) => void;
}

const TalkingHeadAvatar = forwardRef<TalkingHeadRef, TalkingHeadAvatarProps>((
  {
    config,
    elevenLabsApiKey,
    elevenLabsVoiceId,
    className = '',
    performanceMode = false,
    onReady,
    onSpeechStart,
    onSpeechEnd,
    onError
  },
  ref
) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<TalkingHead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const activeWebSocketRef = useRef<WebSocket | null>(null);
  const speechPromiseResolveRef = useRef<(() => void) | null>(null);

  // Initialize TalkingHead instance
  useEffect(() => {
    const initializeTalkingHead = async () => {
      if (!containerRef.current) return;

      try {
        setIsLoading(true);
        setError(null);

        // Configure TalkingHead options
        const options: any = {
          lipsyncModules: ['en'],
          cameraView: 'upper',
          avatarMood: config.avatarMood || 'neutral',
          cameraZoomEnable: false,
          cameraPanEnable: false,
          cameraRotateEnable: false,
          modelFPS: performanceMode ? 15 : 24, // Lower FPS in performance mode
          modelPixelRatio: performanceMode ? 1 : Math.min(window.devicePixelRatio, 2),
          lightAmbientIntensity: performanceMode ? 1 : 2,
          lightDirectIntensity: performanceMode ? 15 : 30,
          lightSpotIntensity: 0,
          avatarIdleEyeContact: performanceMode ? 0.1 : 0.3,
          avatarSpeakingEyeContact: performanceMode ? 0.5 : 0.8,
          // Reduce idle animations in performance mode
          avatarIdleHeadMove: performanceMode ? 0.1 : 0.5,
          avatarSpeakingHeadMove: performanceMode ? 0.1 : 0.5,
          // Disable built-in TTS since we'll use ElevenLabs streaming
          avatarMute: true,
          // Provide a dummy endpoint to bypass the library's Google TTS requirement
          ttsEndpoint: 'https://dummy-endpoint-for-elevenlabs-usage.com',
          // These won't be used but are required by the library
          ttsLang: 'en-US',
          ttsVoice: 'en-US-Standard-A',
        };

        // Create TalkingHead instance
        const head = new TalkingHead(containerRef.current, options);
        headRef.current = head;

        // Load and show avatar
        await head.showAvatar({
          url: config.url,
          body: config.body,
          lipsyncLang: config.lipsyncLang || 'en',
          avatarMood: config.avatarMood || 'neutral',
        }, (progress: any) => {
          if (progress.lengthComputable) {
            const percent = Math.round((progress.loaded / progress.total) * 100);
            console.log(`Loading ${config.name}: ${percent}%`);
          }
        });

        setIsLoading(false);
        setIsReady(true);
        onReady?.();

      } catch (err) {
        console.error('TalkingHead initialization error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize avatar';
        setError(errorMessage);
        setIsLoading(false);
        onError?.(err instanceof Error ? err : new Error(errorMessage));
      }
    };

    initializeTalkingHead();

    // Cleanup
    return () => {
      if (headRef.current) {
        try {
          // Stop animation loop
          headRef.current.stop();
          
          // Clean up Three.js resources
          if (headRef.current.scene) {
            headRef.current.clearThree(headRef.current.scene);
          }
          
          // Remove from DOM
          if (containerRef.current && containerRef.current.firstChild) {
            containerRef.current.removeChild(containerRef.current.firstChild);
          }
        } catch (err) {
          console.error('Cleanup error:', err);
        } finally {
          headRef.current = null;
        }
      }
    };
  }, [config, elevenLabsApiKey, elevenLabsVoiceId, performanceMode, onReady, onError]);

  // Handle visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (headRef.current) {
        if (document.visibilityState === 'visible') {
          headRef.current.start();
        } else {
          headRef.current.stop();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    speak: async (text: string, mood?: string) => {
      if (!headRef.current || !isReady) {
        console.warn('Avatar not ready for speech');
        return;
      }

      // Stop any ongoing speech first
      if (isSpeaking) {
        console.warn('Stopping previous speech before starting new one');
        if (activeWebSocketRef.current) {
          activeWebSocketRef.current.close();
          activeWebSocketRef.current = null;
        }
        if (speechPromiseResolveRef.current) {
          speechPromiseResolveRef.current();
          speechPromiseResolveRef.current = null;
        }
      }

      setIsSpeaking(true);
      onSpeechStart?.();

      try {
        if (mood) {
          headRef.current.setMood(mood);
        }

        if (elevenLabsApiKey && elevenLabsVoiceId) {
          // ElevenLabs streaming TTS implementation
          await speakWithElevenLabs(text);
        } else {
          // No TTS configured - just animate without sound
          console.warn('No TTS configured. Please configure ElevenLabs in settings.');
          // Simulate speech duration based on text length
          const duration = text.length * 60; // ~60ms per character
          await new Promise(resolve => setTimeout(resolve, duration));
        }
      } catch (err) {
        console.error('Speech error:', err);
        onError?.(err instanceof Error ? err : new Error('Speech failed'));
      } finally {
        setIsSpeaking(false);
        onSpeechEnd?.();
      }
    },
    stop: () => {
      if (activeWebSocketRef.current) {
        activeWebSocketRef.current.close();
        activeWebSocketRef.current = null;
      }
      if (speechPromiseResolveRef.current) {
        speechPromiseResolveRef.current();
        speechPromiseResolveRef.current = null;
      }
      if (headRef.current) {
        try {
          // Stop any ongoing animations
          headRef.current.stopGesture();
        } catch (e) {
          // Ignore errors
        }
      }
      setIsSpeaking(false);
    },
    setMood: (mood: string) => {
      if (headRef.current && isReady) {
        headRef.current.setMood(mood);
      }
    },
    playGesture: (gesture: string, duration = 2) => {
      if (headRef.current && isReady) {
        headRef.current.playGesture(gesture, duration);
      }
    },
    lookAt: (x: number, y: number, duration = 500) => {
      if (headRef.current && isReady) {
        headRef.current.lookAt(x, y, duration);
      }
    },
    isReady,
    isSpeaking
  }), [isReady, isSpeaking, elevenLabsApiKey, elevenLabsVoiceId, onSpeechStart, onSpeechEnd, onError]);

  // ElevenLabs WebSocket TTS implementation (fixed for complete audio)
  const speakWithElevenLabs = async (text: string) => {
    if (!elevenLabsApiKey || !elevenLabsVoiceId || !headRef.current) return;

    return new Promise<void>((resolve, reject) => {
      // Store the resolve function so we can call it if speech is stopped
      speechPromiseResolveRef.current = resolve;
      
      const wsUrl = `wss://api.elevenlabs.io/v1/text-to-speech/${elevenLabsVoiceId}/stream-input?model_id=eleven_multilingual_v2&output_format=pcm_22050`;
      const ws = new WebSocket(wsUrl);
      activeWebSocketRef.current = ws;
      
      const audioChunks: ArrayBuffer[] = [];
      let hasReceivedFinal = false;
      let hasReceivedAudio = false;
      
      // Add timeout to prevent hanging
      let timeoutId: NodeJS.Timeout;
      timeoutId = setTimeout(() => {
        if (!hasReceivedFinal) {
          console.warn('TTS timeout reached, closing connection');
          if (ws.readyState === WebSocket.OPEN) {
            ws.close();
          }
          activeWebSocketRef.current = null;
          speechPromiseResolveRef.current = null;
          resolve(); // Resolve instead of hanging forever
        }
      }, 30000); // 30 second timeout

      ws.onopen = () => {
        console.log('WebSocket connected, sending text:', text.substring(0, 50) + '...');
        
        // Send BOS (Beginning of Stream) message
        ws.send(JSON.stringify({
          text: " ",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true
          },
          generation_config: {
            chunk_length_schedule: [120, 160, 250, 290]
          },
          xi_api_key: elevenLabsApiKey,
        }));
        
        // Send the actual text
        ws.send(JSON.stringify({
          text: text,
          try_trigger_generation: true,
        }));
        
        // Send EOS (End of Stream) message
        ws.send(JSON.stringify({
          text: "",
        }));
      };
      
      ws.onmessage = async (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('WebSocket message received:', { hasAudio: !!message.audio, isFinal: message.isFinal });
          
          if (message.audio) {
            // Convert base64 to ArrayBuffer and store
            const audioData = Uint8Array.from(atob(message.audio), c => c.charCodeAt(0));
            audioChunks.push(audioData.buffer);
            hasReceivedAudio = true;
            console.log(`Received audio chunk ${audioChunks.length}, size: ${audioData.length} bytes`);
          }
          
          if (message.isFinal) {
            hasReceivedFinal = true;
            console.log(`Final signal received. Total chunks: ${audioChunks.length}`);
            
            // Don't close yet, wait a bit for any remaining chunks
            setTimeout(() => {
              if (audioChunks.length > 0 && headRef.current) {
                try {
                  // Combine all audio chunks
                  const totalLength = audioChunks.reduce((sum, chunk) => sum + chunk.byteLength, 0);
                  const combinedAudio = new Uint8Array(totalLength);
                  let offset = 0;
                  
                  for (const chunk of audioChunks) {
                    combinedAudio.set(new Uint8Array(chunk), offset);
                    offset += chunk.byteLength;
                  }
                  
                  console.log(`Playing combined audio: ${combinedAudio.length} bytes for text: "${text.substring(0, 50)}..."`);
                  
                  try {
                    // Create AudioContext to convert PCM to AudioBuffer
                    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                    
                    // Convert PCM data to Int16Array (22050 Hz, 16-bit mono PCM)
                    const pcmData = new Int16Array(combinedAudio.buffer);
                    const sampleRate = 22050;
                    const numberOfChannels = 1;
                    const length = pcmData.length;
                    
                    // Create AudioBuffer
                    const audioBuffer = audioContext.createBuffer(numberOfChannels, length, sampleRate);
                    const channelData = audioBuffer.getChannelData(0);
                    
                    // Convert Int16 PCM to Float32 (-1 to 1 range)
                    for (let i = 0; i < length; i++) {
                      channelData[i] = pcmData[i] / 32768.0; // Convert from Int16 to Float32
                    }
                    
                    console.log(`Created AudioBuffer: ${audioBuffer.duration.toFixed(2)}s, ${audioBuffer.sampleRate}Hz`);
                    
                    // Use speakAudio with proper AudioBuffer
                    const audioData = {
                      audio: audioBuffer,
                      words: text.split(' '),
                      wtimes: generateWordTimings(text),
                      wdurations: generateWordDurations(text),
                    };
                    
                    const speakOptions = {
                      lipsyncLang: config.lipsyncLang || 'en'
                    };
                    
                    const result = headRef.current.speakAudio(audioData, speakOptions);
                    
                    // Handle both Promise and non-Promise returns
                    if (result && typeof result.then === 'function') {
                      result.then(() => {
                        console.log('Speech completed successfully');
                        clearTimeout(timeoutId);
                        ws.close();
                        activeWebSocketRef.current = null;
                        speechPromiseResolveRef.current = null;
                        audioContext.close(); // Clean up AudioContext
                        resolve();
                      }).catch((err) => {
                        console.error('Error in speakAudio:', err);
                        clearTimeout(timeoutId);
                        ws.close();
                        activeWebSocketRef.current = null;
                        speechPromiseResolveRef.current = null;
                        audioContext.close();
                        reject(err);
                      });
                    } else {
                      // If speakAudio doesn't return a promise, wait for estimated duration
                      const estimatedDuration = Math.max(audioBuffer.duration * 1000, text.split(' ').length * 250);
                      setTimeout(() => {
                        console.log('Speech completed (estimated duration)');
                        clearTimeout(timeoutId);
                        ws.close();
                        activeWebSocketRef.current = null;
                        speechPromiseResolveRef.current = null;
                        audioContext.close();
                        resolve();
                      }, estimatedDuration);
                    }
                  } catch (err) {
                    console.error('Error creating AudioBuffer or calling speakAudio:', err);
                    clearTimeout(timeoutId);
                    ws.close();
                    activeWebSocketRef.current = null;
                    speechPromiseResolveRef.current = null;
                    reject(err);
                  }
                  
                } catch (err) {
                  console.error('Error combining audio:', err);
                  clearTimeout(timeoutId);
                  ws.close();
                  activeWebSocketRef.current = null;
                  speechPromiseResolveRef.current = null;
                  reject(err);
                }
              } else {
                console.warn('No audio received or headRef not available');
                clearTimeout(timeoutId);
                ws.close();
                activeWebSocketRef.current = null;
                speechPromiseResolveRef.current = null;
                resolve();
              }
            }, 200); // Wait 200ms for any straggler chunks
          }
        } catch (err) {
          console.error('Error processing WebSocket message:', err);
          clearTimeout(timeoutId);
          reject(err);
        }
      };
      
      ws.onerror = (error) => {
        console.error('ElevenLabs WebSocket error:', error);
        clearTimeout(timeoutId);
        activeWebSocketRef.current = null;
        speechPromiseResolveRef.current = null;
        reject(new Error('ElevenLabs WebSocket connection failed'));
      };
      
      ws.onclose = () => {
        activeWebSocketRef.current = null;
        console.log(`WebSocket closed. Final: ${hasReceivedFinal}, Audio chunks: ${audioChunks.length}`);
        
        if (!hasReceivedFinal && hasReceivedAudio && audioChunks.length > 0) {
          // We got audio but no final signal - try to play what we have
          console.warn('WebSocket closed without final signal, playing available audio');
          
          try {
            const totalLength = audioChunks.reduce((sum, chunk) => sum + chunk.byteLength, 0);
            const combinedAudio = new Uint8Array(totalLength);
            let offset = 0;
            
            for (const chunk of audioChunks) {
              combinedAudio.set(new Uint8Array(chunk), offset);
              offset += chunk.byteLength;
            }
            
            if (headRef.current) {
              try {
                // Create AudioContext for partial audio
                const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                
                // Convert partial audio to AudioBuffer
                const pcmData = new Int16Array(combinedAudio.buffer);
                const sampleRate = 22050;
                const numberOfChannels = 1;
                const length = pcmData.length;
                
                const audioBuffer = audioContext.createBuffer(numberOfChannels, length, sampleRate);
                const channelData = audioBuffer.getChannelData(0);
                
                // Convert Int16 PCM to Float32
                for (let i = 0; i < length; i++) {
                  channelData[i] = pcmData[i] / 32768.0;
                }
                
                console.log(`Created partial AudioBuffer: ${audioBuffer.duration.toFixed(2)}s`);
                
                const result = headRef.current.speakAudio({
                  audio: audioBuffer,
                  words: text.split(' '),
                  wtimes: generateWordTimings(text),
                  wdurations: generateWordDurations(text),
                }, {
                  lipsyncLang: config.lipsyncLang || 'en'
                });
                
                if (result && typeof result.then === 'function') {
                  result.then(() => {
                    clearTimeout(timeoutId);
                    speechPromiseResolveRef.current = null;
                    audioContext.close();
                    resolve();
                  }).catch((err) => {
                    console.error('Error playing partial audio:', err);
                    clearTimeout(timeoutId);
                    speechPromiseResolveRef.current = null;
                    audioContext.close();
                    reject(err);
                  });
                } else {
                  // Fallback for non-promise return
                  const estimatedDuration = Math.max(audioBuffer.duration * 1000, text.split(' ').length * 250);
                  setTimeout(() => {
                    clearTimeout(timeoutId);
                    speechPromiseResolveRef.current = null;
                    audioContext.close();
                    resolve();
                  }, estimatedDuration);
                }
              } catch (err) {
                console.error('Error in partial audio playback:', err);
                clearTimeout(timeoutId);
                speechPromiseResolveRef.current = null;
                reject(err);
              }
            } else {
              clearTimeout(timeoutId);
              speechPromiseResolveRef.current = null;
              resolve();
            }
          } catch (err) {
            console.error('Error processing partial audio:', err);
            clearTimeout(timeoutId);
            speechPromiseResolveRef.current = null;
            reject(err);
          }
        } else if (!hasReceivedFinal && !hasReceivedAudio) {
          // No audio received at all
          console.warn('WebSocket closed without receiving any audio');
          clearTimeout(timeoutId);
          speechPromiseResolveRef.current = null;
          resolve();
        }
        // If hasReceivedFinal is true, the audio should have been handled in onmessage
      };
    });
  };

  // Helper functions for word timing estimation
  const generateWordTimings = (text: string): number[] => {
    const words = text.split(' ');
    const avgWordDuration = 250; // ms per word (reduced for more natural pacing)
    let currentTime = 0;
    return words.map(() => {
      const timing = currentTime;
      currentTime += avgWordDuration;
      return timing;
    });
  };

  const generateWordDurations = (text: string): number[] => {
    const words = text.split(' ');
    return words.map(word => {
      // More accurate duration based on word length and complexity
      const baseTime = 150; // Base time for short words
      const timePerChar = 30; // Additional time per character
      return baseTime + (word.length * timePerChar);
    });
  };

  return (
    <div className={`relative w-full h-full ${className}`}>
      <div ref={containerRef} className="w-full h-full" />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-white text-sm">Loading {config.name}...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute top-4 left-4 right-4 bg-red-500/90 text-white p-3 rounded-lg">
          <p className="text-sm font-medium">Error loading avatar:</p>
          <p className="text-xs mt-1">{error}</p>
        </div>
      )}
      
      {isSpeaking && (
        <div className="absolute bottom-4 left-4 bg-blue-500/90 text-white px-3 py-1 rounded-full">
          <p className="text-xs font-medium">Speaking...</p>
        </div>
      )}
    </div>
  );
});

TalkingHeadAvatar.displayName = 'TalkingHeadAvatar';

export default TalkingHeadAvatar;