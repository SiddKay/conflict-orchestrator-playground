
import React from 'react';
import { Box } from 'lucide-react';

interface ThreeDVisualizationProps {
  simulationStarted: boolean;
}

export const ThreeDVisualization = ({ simulationStarted }: ThreeDVisualizationProps) => {
  return (
    <div className="h-full p-8 flex items-center justify-center">
      {!simulationStarted ? (
        <div className="text-center">
          <Box size={48} className="mx-auto text-slate-600 mb-4" />
          <p className="text-slate-400 text-sm">
            Start a simulation to see the 3D visualization
          </p>
        </div>
      ) : (
        <div className="w-full h-full flex gap-4">
          {/* Agent A Placeholder */}
          <div className="flex-1 border-2 border-dashed border-slate-600/50 rounded-lg flex items-center justify-center bg-slate-800/20">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-full mx-auto mb-4 border border-blue-500/30"></div>
              <p className="text-slate-400 font-medium">Agent A</p>
              <p className="text-sm text-slate-500">3D Visualization</p>
            </div>
          </div>

          {/* Agent B Placeholder */}
          <div className="flex-1 border-2 border-dashed border-slate-600/50 rounded-lg flex items-center justify-center bg-slate-800/20">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-full mx-auto mb-4 border border-purple-500/30"></div>
              <p className="text-slate-400 font-medium">Agent B</p>
              <p className="text-sm text-slate-500">3D Visualization</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
