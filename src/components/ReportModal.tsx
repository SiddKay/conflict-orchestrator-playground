
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Download, TrendingUp, TrendingDown, MessageSquare, BarChart3 } from 'lucide-react';

interface EscalationPoint {
  from_index: string;
  to_index: string;
  from_mood: string;
  to_mood: string;
  message: string;
}

interface MoodProgression {
  message_index: string;
  agent_id: string;
  mood: string;
  snippet: string;
}

interface ReportData {
  conversation_id: string;
  total_messages: number;
  escalation_points: EscalationPoint[];
  de_escalation_points: EscalationPoint[];
  mood_progression: MoodProgression[];
  summary: string;
  suggestions: string[];
  analysis_markdown: string;
}

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportData: ReportData | null;
  isLoading: boolean;
}

export const ReportModal = ({ isOpen, onClose, reportData, isLoading }: ReportModalProps) => {
  const getMoodColor = (mood: string) => {
    switch (mood.toLowerCase()) {
      case 'positive':
      case 'happy':
        return 'bg-green-500/20 text-green-300 border-green-400/30';
      case 'negative':
      case 'angry':
        return 'bg-red-500/20 text-red-300 border-red-400/30';
      case 'sad':
        return 'bg-blue-500/20 text-blue-300 border-blue-400/30';
      case 'frustrated':
        return 'bg-orange-500/20 text-orange-300 border-orange-400/30';
      case 'neutral':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-400/30';
    }
  };

  const handleDownload = () => {
    if (!reportData) return;
    
    const blob = new Blob([reportData.analysis_markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversation-report-${reportData.conversation_id}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-slate-200 flex items-center gap-2">
            <BarChart3 size={20} className="text-blue-400" />
            Conversation Report
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-slate-400">Generating report...</p>
          </div>
        ) : reportData ? (
          <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-slate-400 flex items-center gap-2">
                    <MessageSquare size={16} />
                    Total Messages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-slate-200">{reportData.total_messages}</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-slate-400 flex items-center gap-2">
                    <TrendingUp size={16} />
                    Escalation Points
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-red-400">{reportData.escalation_points.length}</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-slate-400 flex items-center gap-2">
                    <TrendingDown size={16} />
                    De-escalation Points
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-400">{reportData.de_escalation_points.length}</p>
                </CardContent>
              </Card>
            </div>

            {/* Mood Progression */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-200">Mood Progression</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reportData.mood_progression.map((mood, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg">
                      <div className="text-sm text-slate-500 min-w-[2rem]">#{mood.message_index}</div>
                      <Badge variant="outline" className={`${getMoodColor(mood.mood)} border`}>
                        {mood.mood}
                      </Badge>
                      <p className="text-sm text-slate-300 flex-1">{mood.snippet}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Escalation Points */}
            {reportData.escalation_points.length > 0 && (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-200 flex items-center gap-2">
                    <TrendingUp size={18} className="text-red-400" />
                    Escalation Points
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reportData.escalation_points.map((point, index) => (
                      <div key={index} className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm text-slate-400">Messages {point.from_index} → {point.to_index}</span>
                          <Badge variant="outline" className={getMoodColor(point.from_mood)}>
                            {point.from_mood}
                          </Badge>
                          <span className="text-slate-500">→</span>
                          <Badge variant="outline" className={getMoodColor(point.to_mood)}>
                            {point.to_mood}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-300">{point.message}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Summary */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-200">Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-300 leading-relaxed">{reportData.summary}</p>
              </CardContent>
            </Card>

            {/* Suggestions */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-200">Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {reportData.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="text-blue-400 mt-1">•</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Separator className="bg-slate-700" />

            {/* Download Button */}
            <div className="flex justify-end">
              <Button onClick={handleDownload} className="bg-blue-600/80 hover:bg-blue-600">
                <Download size={16} className="mr-2" />
                Download Summary
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-400">No report data available</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
