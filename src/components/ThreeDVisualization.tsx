
import { useState, useEffect } from 'react';
import { Box, Settings } from 'lucide-react';
import { OptimizedDualAvatarManager } from './avatar/OptimizedDualAvatarManager';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface ThreeDVisualizationProps {
  simulationStarted: boolean;
}

interface TTSConfig {
  provider: 'elevenlabs' | 'google';
  elevenLabsApiKey?: string;
  elevenLabsVoiceIdA?: string;
  elevenLabsVoiceIdB?: string;
  googleTtsApiKey?: string;
}

export const ThreeDVisualization = ({ simulationStarted }: ThreeDVisualizationProps) => {
  const [ttsConfig, setTtsConfig] = useState<TTSConfig>(() => {
    // Load config from localStorage
    const saved = localStorage.getItem('ttsConfig');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Ignore parse errors
      }
    }
    return { 
      provider: 'elevenlabs',
      elevenLabsVoiceIdA: '21m00Tcm4TlvDq8ikWAM', // Rachel voice
      elevenLabsVoiceIdB: 'TxGEqnHWrfWFTfGW9XjX', // Josh voice
    };
  });

  const [tempConfig, setTempConfig] = useState<TTSConfig>(ttsConfig);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  // Save config to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('ttsConfig', JSON.stringify(ttsConfig));
  }, [ttsConfig]);

  const handleSaveConfig = () => {
    setTtsConfig(tempConfig);
    setIsConfigOpen(false);
  };

  const handleCancelConfig = () => {
    setTempConfig(ttsConfig);
    setIsConfigOpen(false);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header with settings */}
      <div className="flex justify-between items-center p-4 border-b border-slate-700">
        <h3 className="text-sm font-medium text-slate-300">3D Avatar View</h3>
        <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-300">
              <Settings className="w-4 h-4 mr-2" />
              TTS Settings
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Text-to-Speech Configuration</DialogTitle>
              <DialogDescription>
                Configure your TTS provider and API keys for avatar speech synthesis.
              </DialogDescription>
            </DialogHeader>
            <Tabs value={tempConfig.provider} onValueChange={(value) => setTempConfig({ ...tempConfig, provider: value as 'elevenlabs' | 'google' })}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="elevenlabs">ElevenLabs</TabsTrigger>
                <TabsTrigger value="google">Google TTS (Optional)</TabsTrigger>
              </TabsList>
              <TabsContent value="google" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="google-api-key">Google TTS API Key</Label>
                  <Input
                    id="google-api-key"
                    type="password"
                    placeholder="Enter your Google Cloud TTS API key"
                    value={tempConfig.googleTtsApiKey || ''}
                    onChange={(e) => setTempConfig({ ...tempConfig, googleTtsApiKey: e.target.value })}
                  />
                  <p className="text-xs text-slate-500">
                    Get your API key from Google Cloud Console
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="elevenlabs" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="elevenlabs-api-key">ElevenLabs API Key</Label>
                  <Input
                    id="elevenlabs-api-key"
                    type="password"
                    placeholder="Enter your ElevenLabs API key"
                    value={tempConfig.elevenLabsApiKey || ''}
                    onChange={(e) => setTempConfig({ ...tempConfig, elevenLabsApiKey: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="voice-id-a">Voice ID for Agent A</Label>
                  <Input
                    id="voice-id-a"
                    placeholder="e.g., EXAVITQu4vr4xnSDxMaL"
                    value={tempConfig.elevenLabsVoiceIdA || ''}
                    onChange={(e) => setTempConfig({ ...tempConfig, elevenLabsVoiceIdA: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="voice-id-b">Voice ID for Agent B</Label>
                  <Input
                    id="voice-id-b"
                    placeholder="e.g., VR6AewLTigWG4xSOukaG"
                    value={tempConfig.elevenLabsVoiceIdB || ''}
                    onChange={(e) => setTempConfig({ ...tempConfig, elevenLabsVoiceIdB: e.target.value })}
                  />
                </div>
                <p className="text-xs text-slate-500">
                  Get voice IDs from your ElevenLabs dashboard
                </p>
              </TabsContent>
            </Tabs>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={handleCancelConfig}>
                Cancel
              </Button>
              <Button onClick={handleSaveConfig}>
                Save Configuration
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8">
        {!simulationStarted ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Box size={48} className="mx-auto text-slate-600 mb-4" />
              <p className="text-slate-400 text-sm">
                Start a simulation to see the 3D avatars
              </p>
            </div>
          </div>
        ) : (
          <>
            {ttsConfig.provider === 'elevenlabs' && !ttsConfig.elevenLabsApiKey && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-yellow-500/90 text-black px-4 py-2 rounded-lg flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <p className="text-sm">Please configure your ElevenLabs API key to enable voice synthesis</p>
              </div>
            )}
            <OptimizedDualAvatarManager
              elevenLabsApiKey={ttsConfig.provider === 'elevenlabs' ? ttsConfig.elevenLabsApiKey : undefined}
              elevenLabsVoiceIdA={ttsConfig.provider === 'elevenlabs' ? ttsConfig.elevenLabsVoiceIdA : undefined}
              elevenLabsVoiceIdB={ttsConfig.provider === 'elevenlabs' ? ttsConfig.elevenLabsVoiceIdB : undefined}
              className="h-full"
            />
          </>
        )}
      </div>
    </div>
  );
};
