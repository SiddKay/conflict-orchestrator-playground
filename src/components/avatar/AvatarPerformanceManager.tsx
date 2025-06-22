// ABOUTME: Performance optimization layer for TalkingHead avatars
// ABOUTME: Manages resource usage, FPS limiting, and performance monitoring

import { useEffect, useRef, useState, useMemo } from 'react';

export interface PerformanceConfig {
  targetFPS: number;
  enableDualAvatars: boolean;
  reduceQualityOnLowPerf: boolean;
  maxCPUUsage: number;
}

export interface PerformanceMetrics {
  fps: number;
  cpuUsage: number;
  memoryUsage: number;
  isLowPerformance: boolean;
}

export class AvatarPerformanceManager {
  private fpsHistory: number[] = [];
  private lastFrameTime: number = 0;
  private performanceCheckInterval: number | null = null;
  
  constructor(private config: PerformanceConfig) {}
  
  // Monitor FPS
  measureFPS(): number {
    const now = performance.now();
    if (this.lastFrameTime > 0) {
      const fps = 1000 / (now - this.lastFrameTime);
      this.fpsHistory.push(fps);
      if (this.fpsHistory.length > 30) {
        this.fpsHistory.shift();
      }
    }
    this.lastFrameTime = now;
    
    const avgFPS = this.fpsHistory.length > 0 
      ? this.fpsHistory.reduce((a, b) => a + b) / this.fpsHistory.length
      : 60;
    
    return Math.round(avgFPS);
  }
  
  // Check if performance is low
  isLowPerformance(): boolean {
    const avgFPS = this.measureFPS();
    return avgFPS < this.config.targetFPS * 0.7; // 70% of target FPS
  }
  
  // Get performance recommendations
  getRecommendations(): {
    shouldUseSingleAvatar: boolean;
    shouldReduceQuality: boolean;
    recommendedFPS: number;
  } {
    const isLow = this.isLowPerformance();
    
    return {
      shouldUseSingleAvatar: isLow && this.config.enableDualAvatars,
      shouldReduceQuality: isLow && this.config.reduceQualityOnLowPerf,
      recommendedFPS: isLow ? Math.max(15, this.config.targetFPS - 10) : this.config.targetFPS
    };
  }
  
  // Clean up
  destroy() {
    if (this.performanceCheckInterval) {
      clearInterval(this.performanceCheckInterval);
    }
  }
}

// React hook for performance monitoring
export function useAvatarPerformance(config: PerformanceConfig) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    cpuUsage: 0,
    memoryUsage: 0,
    isLowPerformance: false
  });
  
  const managerRef = useRef<AvatarPerformanceManager | null>(null);
  const rafRef = useRef<number | null>(null);
  const frameCountRef = useRef(0);
  const lastUpdateTimeRef = useRef(0);
  
  useEffect(() => {
    managerRef.current = new AvatarPerformanceManager(config);
    
    // Performance monitoring loop - throttled to update state only every 500ms
    const updateMetrics = () => {
      if (managerRef.current) {
        const fps = managerRef.current.measureFPS();
        frameCountRef.current++;
        
        const now = Date.now();
        // Only update state every 500ms to prevent excessive re-renders
        if (now - lastUpdateTimeRef.current > 500) {
          const isLow = managerRef.current.isLowPerformance();
          
          setMetrics(prev => {
            // Only update if values actually changed
            if (prev.fps !== fps || prev.isLowPerformance !== isLow) {
              return {
                ...prev,
                fps,
                isLowPerformance: isLow
              };
            }
            return prev;
          });
          
          lastUpdateTimeRef.current = now;
        }
      }
      
      rafRef.current = requestAnimationFrame(updateMetrics);
    };
    
    updateMetrics();
    
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (managerRef.current) {
        managerRef.current.destroy();
      }
    };
  }, [config.targetFPS, config.enableDualAvatars, config.reduceQualityOnLowPerf, config.maxCPUUsage]);
  
  const recommendations = useMemo(() => {
    return managerRef.current?.getRecommendations() || {
      shouldUseSingleAvatar: false,
      shouldReduceQuality: false,
      recommendedFPS: config.targetFPS
    };
  }, [metrics.isLowPerformance, config.targetFPS]);
  
  return {
    metrics,
    recommendations
  };
}