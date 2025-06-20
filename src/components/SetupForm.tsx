
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Bot } from 'lucide-react';

interface SetupFormProps {
  onStart: () => void;
}

export const SetupForm = ({ onStart }: SetupFormProps) => {
  const [formData, setFormData] = useState({
    conversationSetting: '',
    scenario: '',
    agentAName: '',
    agentBName: '',
    agentATraits: '',
    agentBTraits: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleStart = () => {
    // TODO: Send setup data to API endpoint
    console.log('Starting simulation with data:', formData);
    onStart();
  };

  const isFormValid = formData.conversationSetting && formData.scenario && 
                     formData.agentAName && formData.agentBName;

  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-200 mb-2">Simulation Setup</h3>
          <p className="text-sm text-slate-400">Configure your AI agents and conflict scenario</p>
        </div>

        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-slate-300">Environment Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="setting" className="text-slate-300 text-xs">General Conversation Setting</Label>
              <Textarea
                id="setting"
                placeholder="e.g., Personal disagreement between two partners..."
                value={formData.conversationSetting}
                onChange={(e) => handleInputChange('conversationSetting', e.target.value)}
                className="mt-1 bg-slate-700/50 border-slate-600/50 text-slate-200 placeholder:text-slate-500"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="scenario" className="text-slate-300 text-xs">Exact Conversation Scenario</Label>
              <Textarea
                id="scenario"
                placeholder="e.g., A and B are currently fighting about going out to eat for their anniversary..."
                value={formData.scenario}
                onChange={(e) => handleInputChange('scenario', e.target.value)}
                className="mt-1 bg-slate-700/50 border-slate-600/50 text-slate-200 placeholder:text-slate-500"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-slate-300 flex items-center gap-2">
              <Bot size={16} className="text-blue-400" />
              Agent A Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="agentAName" className="text-slate-300 text-xs">Agent Name/Title</Label>
              <Input
                id="agentAName"
                placeholder="e.g., Alice, Partner A, etc."
                value={formData.agentAName}
                onChange={(e) => handleInputChange('agentAName', e.target.value)}
                className="mt-1 bg-slate-700/50 border-slate-600/50 text-slate-200 placeholder:text-slate-500"
              />
            </div>

            <div>
              <Label htmlFor="agentATraits" className="text-slate-300 text-xs">Character Traits</Label>
              <Textarea
                id="agentATraits"
                placeholder="e.g., Thoughtful, romantic, tends to plan ahead..."
                value={formData.agentATraits}
                onChange={(e) => handleInputChange('agentATraits', e.target.value)}
                className="mt-1 bg-slate-700/50 border-slate-600/50 text-slate-200 placeholder:text-slate-500"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-slate-300 flex items-center gap-2">
              <Bot size={16} className="text-purple-400" />
              Agent B Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="agentBName" className="text-slate-300 text-xs">Agent Name/Title</Label>
              <Input
                id="agentBName"
                placeholder="e.g., Bob, Partner B, etc."
                value={formData.agentBName}
                onChange={(e) => handleInputChange('agentBName', e.target.value)}
                className="mt-1 bg-slate-700/50 border-slate-600/50 text-slate-200 placeholder:text-slate-500"
              />
            </div>

            <div>
              <Label htmlFor="agentBTraits" className="text-slate-300 text-xs">Character Traits</Label>
              <Textarea
                id="agentBTraits"
                placeholder="e.g., Spontaneous, adventurous, likes variety..."
                value={formData.agentBTraits}
                onChange={(e) => handleInputChange('agentBTraits', e.target.value)}
                className="mt-1 bg-slate-700/50 border-slate-600/50 text-slate-200 placeholder:text-slate-500"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Button 
          onClick={handleStart}
          disabled={!isFormValid}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <Play size={16} className="mr-2" />
          Start Simulation
        </Button>
      </div>
    </div>
  );
};
