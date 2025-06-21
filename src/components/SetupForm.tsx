import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Play, Bot, Save, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/services/api';
import { ApiService } from '@/services/api';
import { AgentConfig } from '@/types/models';
import { useConversationContext } from '@/contexts/ConversationContext';

interface SetupFormProps {
  onStart: () => void;
}

export const SetupForm = ({ onStart }: SetupFormProps) => {
  const { toast } = useToast();
  const { initializeConversation } = useConversationContext();
  const [useExistingAgents, setUseExistingAgents] = useState(false);
  const [existingAgents, setExistingAgents] = useState<AgentConfig[]>([]);
  const [selectedAgentA, setSelectedAgentA] = useState<string>('');
  const [selectedAgentB, setSelectedAgentB] = useState<string>('');
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

  // Load existing agents on mount
  useEffect(() => {
    const loadAgents = async () => {
      try {
        const agents = await api.getAgents();
        setExistingAgents(agents);
      } catch (error) {
        console.error('Failed to load agents:', error);
      }
    };
    loadAgents();
  }, []);

  const modelOptions = [
    'OpenAI GPT 4o',
    'OpenAI GPT 4o Mini',
    'Magistral Medium',
    'Magistral Small',
    'Mistral Medium',
    'Mistral Large',
    'Gemini 2.0 Flash',
    'Gemini 2.5 Flash',
    'Gemini 2.5 Flash Lite'
  ];

  const handleInputChange = (field: string, value: string | number[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleStart = async () => {
    try {
      if (useExistingAgents) {
        // Use existing agents
        if (!selectedAgentA || !selectedAgentB) {
          toast({
            title: "Error",
            description: "Please select both agents",
            variant: "destructive",
          });
          return;
        }

        const conversationData = {
          general_setting: formData.conversationSetting,
          specific_scenario: formData.scenario,
          agent_a_id: selectedAgentA,
          agent_b_id: selectedAgentB
        };

        await initializeConversation(conversationData, true);
      } else {
        // Create new agents inline
        const agentAMapping = ApiService.mapModelSelection(formData.agentAModel);
        const agentBMapping = ApiService.mapModelSelection(formData.agentBModel);

        const conversationData = {
          general_setting: formData.conversationSetting,
          specific_scenario: formData.scenario,
          agent_a_name: formData.agentAName,
          agent_a_traits: formData.agentATraits,
          agent_a_behavioral_instructions: formData.agentABehavioralInstructions,
          agent_a_model_provider: agentAMapping.provider,
          agent_a_model_name: agentAMapping.modelName,
          agent_a_temperature: formData.agentATemperature[0],
          agent_b_name: formData.agentBName,
          agent_b_traits: formData.agentBTraits,
          agent_b_behavioral_instructions: formData.agentBBehavioralInstructions,
          agent_b_model_provider: agentBMapping.provider,
          agent_b_model_name: agentBMapping.modelName,
          agent_b_temperature: formData.agentBTemperature[0]
        };

        await initializeConversation(conversationData, false);
      }
      onStart();
    } catch (error) {
      // Error is already handled by initializeConversation
    }
  };

  const handleSaveEnvironment = () => {
    // Store environment settings in localStorage for now
    // Backend doesn't have a separate environment endpoint
    const environmentSettings = {
      conversationSetting: formData.conversationSetting,
      scenario: formData.scenario
    };
    
    localStorage.setItem('environmentSettings', JSON.stringify(environmentSettings));
    
    toast({
      title: "Success",
      description: "Environment settings saved successfully!",
    });
  };

  const handleSaveAgentA = async () => {
    try {
      const modelMapping = ApiService.mapModelSelection(formData.agentAModel);
      
      const agent: Partial<AgentConfig> = {
        name: formData.agentAName,
        personality_traits: formData.agentATraits,
        behavioral_instructions: formData.agentABehavioralInstructions,
        model_provider: modelMapping.provider,
        model_name: modelMapping.modelName,
        temperature: formData.agentATemperature[0]
      };
      
      await api.createAgent(agent);
      
      toast({
        title: "Success",
        description: "Agent A configuration saved successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save Agent A",
        variant: "destructive",
      });
    }
  };

  const handleSaveAgentB = async () => {
    try {
      const modelMapping = ApiService.mapModelSelection(formData.agentBModel);
      
      const agent: Partial<AgentConfig> = {
        name: formData.agentBName,
        personality_traits: formData.agentBTraits,
        behavioral_instructions: formData.agentBBehavioralInstructions,
        model_provider: modelMapping.provider,
        model_name: modelMapping.modelName,
        temperature: formData.agentBTemperature[0]
      };
      
      await api.createAgent(agent);
      
      toast({
        title: "Success",
        description: "Agent B configuration saved successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save Agent B",
        variant: "destructive",
      });
    }
  };

  // Validation logic for save buttons
  const isAgentAValid = formData.agentAName.trim() && 
                       formData.agentATraits.trim() && 
                       formData.agentAModel.trim() && 
                       formData.agentABehavioralInstructions.trim();

  const isAgentBValid = formData.agentBName.trim() && 
                       formData.agentBTraits.trim() && 
                       formData.agentBModel.trim() && 
                       formData.agentBBehavioralInstructions.trim();

  const isEnvironmentValid = formData.conversationSetting.trim() && 
                            formData.scenario.trim();

  const isFormValid = formData.conversationSetting && formData.scenario && 
                     (useExistingAgents 
                       ? (selectedAgentA && selectedAgentB) 
                       : (formData.agentAName && formData.agentBName));

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-200 mb-2">Simulation Setup</h3>
          <p className="text-sm text-slate-400">Configure your AI agents and conflict scenario</p>
        </div>

        {/* Toggle for using existing agents */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="useExisting" className="text-slate-300">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-slate-400" />
                  Use Existing Agents
                </div>
              </Label>
              <Switch 
                id="useExisting"
                checked={useExistingAgents}
                onCheckedChange={setUseExistingAgents}
              />
            </div>
          </CardContent>
        </Card>

        {useExistingAgents ? (
          // Existing agent selection
          <>
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-slate-300">Select Agent A</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedAgentA} onValueChange={setSelectedAgentA}>
                  <SelectTrigger className="bg-slate-700/50 border-slate-600/50 text-slate-200">
                    <SelectValue placeholder="Select an agent" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {existingAgents.map((agent) => (
                      <SelectItem 
                        key={agent.id} 
                        value={agent.id} 
                        className="text-slate-200 hover:bg-slate-600"
                        disabled={agent.id === selectedAgentB}
                      >
                        {agent.name} ({agent.model_provider}/{agent.model_name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-slate-300">Select Agent B</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedAgentB} onValueChange={setSelectedAgentB}>
                  <SelectTrigger className="bg-slate-700/50 border-slate-600/50 text-slate-200">
                    <SelectValue placeholder="Select an agent" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {existingAgents.map((agent) => (
                      <SelectItem 
                        key={agent.id} 
                        value={agent.id} 
                        className="text-slate-200 hover:bg-slate-600"
                        disabled={agent.id === selectedAgentA}
                      >
                        {agent.name} ({agent.model_provider}/{agent.model_name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </>
        ) : (
          // New agent creation
          <>
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
                  disabled={!isAgentAValid}
                  size="sm"
                  className="bg-blue-600/80 hover:bg-blue-600 text-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  disabled={!isAgentBValid}
                  size="sm"
                  className="bg-purple-600/80 hover:bg-purple-600 text-purple-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={14} className="mr-2" />
                  Save Agent B
                </Button>
              </CardContent>
            </Card>
          </>
        )}

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
              disabled={!isEnvironmentValid}
              size="sm"
              className="bg-slate-600/80 hover:bg-slate-600 text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={14} className="mr-2" />
              Save Environment
            </Button>
          </CardContent>
        </Card>

        </div>
      </div>
      
      {/* Fixed button at bottom */}
      <div className="flex-shrink-0 p-4 border-t border-slate-700/50">
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