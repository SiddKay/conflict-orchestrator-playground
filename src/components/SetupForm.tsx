
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Play, Bot, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SetupFormProps {
  onStart: () => void;
}

export const SetupForm = ({ onStart }: SetupFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    conversationSetting: '',
    scenario: '',
    agentAName: '',
    agentBName: '',
    agentATraits: '',
    agentBTraits: '',
    agentAModel: '',
    agentBModel: '',
    agentABehavioralInstructions: '',
    agentBBehavioralInstructions: '',
    agentATemperature: [0.7],
    agentBTemperature: [0.7]
  });

  const modelOptions = [
    'OpenAI GPT 4o',
    'Magistral Medium',
    'Gemini 2.5 Flash'
  ];

  const handleInputChange = (field: string, value: string | number[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleStart = () => {
    // TODO: Send setup data to API endpoint
    console.log('Starting simulation with data:', formData);
    onStart();
  };

  const handleSaveEnvironment = () => {
    // TODO: Connect to API endpoint to save environment settings
    console.log('Saving environment settings:', {
      conversationSetting: formData.conversationSetting,
      scenario: formData.scenario
    });
    
    toast({
      title: "Success",
      description: "Environment settings saved successfully!",
    });
  };

  const handleSaveAgentA = () => {
    // TODO: Connect to API endpoint to save Agent A configuration
    console.log('Saving Agent A configuration:', {
      name: formData.agentAName,
      traits: formData.agentATraits,
      model: formData.agentAModel,
      behavioralInstructions: formData.agentABehavioralInstructions,
      temperature: formData.agentATemperature[0]
    });
    
    toast({
      title: "Success",
      description: "Agent A configuration saved successfully!",
    });
  };

  const handleSaveAgentB = () => {
    // TODO: Connect to API endpoint to save Agent B configuration
    console.log('Saving Agent B configuration:', {
      name: formData.agentBName,
      traits: formData.agentBTraits,
      model: formData.agentBModel,
      behavioralInstructions: formData.agentBBehavioralInstructions,
      temperature: formData.agentBTemperature[0]
    });
    
    toast({
      title: "Success",
      description: "Agent B configuration saved successfully!",
    });
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
              <Label htmlFor="agentAModel" className="text-slate-300 text-xs">Model</Label>
              <Select value={formData.agentAModel} onValueChange={(value) => handleInputChange('agentAModel', value)}>
                <SelectTrigger className="mt-1 bg-slate-700/50 border-slate-600/50 text-slate-200">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {modelOptions.map((model) => (
                    <SelectItem key={model} value={model} className="text-slate-200 hover:bg-slate-600">
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

            <div>
              <Label htmlFor="agentABehavioral" className="text-slate-300 text-xs">Behavioral Instructions</Label>
              <Textarea
                id="agentABehavioral"
                placeholder="e.g., Always respond with empathy, avoid aggressive language..."
                value={formData.agentABehavioralInstructions}
                onChange={(e) => handleInputChange('agentABehavioralInstructions', e.target.value)}
                className="mt-1 bg-slate-700/50 border-slate-600/50 text-slate-200 placeholder:text-slate-500"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="agentATemp" className="text-slate-300 text-xs">
                Temperature: {formData.agentATemperature[0].toFixed(1)}
              </Label>
              <Slider
                id="agentATemp"
                min={0.1}
                max={1.0}
                step={0.1}
                value={formData.agentATemperature}
                onValueChange={(value) => handleInputChange('agentATemperature', value)}
                className="mt-2"
              />
            </div>

            <Button 
              onClick={handleSaveAgentA}
              size="sm"
              className="bg-blue-600/80 hover:bg-blue-600 text-blue-100"
            >
              <Save size={14} className="mr-2" />
              Save Agent A
            </Button>
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
              <Label htmlFor="agentBModel" className="text-slate-300 text-xs">Model</Label>
              <Select value={formData.agentBModel} onValueChange={(value) => handleInputChange('agentBModel', value)}>
                <SelectTrigger className="mt-1 bg-slate-700/50 border-slate-600/50 text-slate-200">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {modelOptions.map((model) => (
                    <SelectItem key={model} value={model} className="text-slate-200 hover:bg-slate-600">
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

            <div>
              <Label htmlFor="agentBBehavioral" className="text-slate-300 text-xs">Behavioral Instructions</Label>
              <Textarea
                id="agentBBehavioral"
                placeholder="e.g., Be direct and assertive, express frustrations openly..."
                value={formData.agentBBehavioralInstructions}
                onChange={(e) => handleInputChange('agentBBehavioralInstructions', e.target.value)}
                className="mt-1 bg-slate-700/50 border-slate-600/50 text-slate-200 placeholder:text-slate-500"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="agentBTemp" className="text-slate-300 text-xs">
                Temperature: {formData.agentBTemperature[0].toFixed(1)}
              </Label>
              <Slider
                id="agentBTemp"
                min={0.1}
                max={1.0}
                step={0.1}
                value={formData.agentBTemperature}
                onValueChange={(value) => handleInputChange('agentBTemperature', value)}
                className="mt-2"
              />
            </div>

            <Button 
              onClick={handleSaveAgentB}
              size="sm"
              className="bg-purple-600/80 hover:bg-purple-600 text-purple-100"
            >
              <Save size={14} className="mr-2" />
              Save Agent B
            </Button>
          </CardContent>
        </Card>

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

            <Button 
              onClick={handleSaveEnvironment}
              size="sm"
              className="bg-slate-600/80 hover:bg-slate-600 text-slate-200"
            >
              <Save size={14} className="mr-2" />
              Save Environment
            </Button>
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
