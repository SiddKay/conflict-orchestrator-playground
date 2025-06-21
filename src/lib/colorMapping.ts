// ABOUTME: Centralized color mapping system for mood-based UI elements
// ABOUTME: Ensures consistent colors across chat bubbles, tree nodes, and backend visualization

import { MoodEnum } from '@/types/models';

export interface ColorMapping {
  tailwind: {
    background: string;
    border: string;
    text: string;
  };
  hex: string;
}

/**
 * Centralized mood-to-color mapping following CONTEXT.md specifications:
 * - Positive moods (happy, excited): Green shades
 * - Neutral moods (neutral, calm): Yellow shades
 * - Negative moods (sad, frustrated, angry): Red/orange gradient by intensity
 */
export const MOOD_COLORS: Record<MoodEnum, ColorMapping> = {
  // Positive moods - Green shades with 200-point difference
  'happy': {
    tailwind: {
      background: 'bg-green-200/20',
      border: 'border-green-100/30',
      text: 'text-green-700'
    },
    hex: '#bbf7d0'
  },
  'excited': {
    tailwind: {
      background: 'bg-green-400/20',
      border: 'border-green-300/30',
      text: 'text-green-800'
    },
    hex: '#86efac'
  },
  
  // Neutral moods - Yellow shades with 200-point difference
  'neutral': {
    tailwind: {
      background: 'bg-yellow-200/20',
      border: 'border-yellow-100/30',
      text: 'text-yellow-800'
    },
    hex: '#fef3c7'
  },
  'calm': {
    tailwind: {
      background: 'bg-yellow-400/20',
      border: 'border-yellow-300/30',
      text: 'text-yellow-900'
    },
    hex: '#fde68a'
  },
  
  // Negative moods - Red/orange gradient by intensity with 200-point difference
  'sad': {
    tailwind: {
      background: 'bg-orange-200/20',
      border: 'border-orange-100/30',
      text: 'text-orange-800'
    },
    hex: '#fed7aa'
  },
  'frustrated': {
    tailwind: {
      background: 'bg-red-400/20',
      border: 'border-red-300/30',
      text: 'text-red-800'
    },
    hex: '#fca5a5'
  },
  'angry': {
    tailwind: {
      background: 'bg-red-600/20',
      border: 'border-red-500/30',
      text: 'text-red-900'
    },
    hex: '#f87171'
  }
};

/**
 * Get accent color classes for mood indication
 */
export const getMoodAccentClasses = (mood: MoodEnum): {
  border: string;
  glow: string;
  gradient: string;
} => {
  // Handle undefined/null mood values
  if (!mood) {
    return {
      border: 'border-l-slate-400',
      glow: 'shadow-slate-400/30',
      gradient: 'from-slate-400 to-slate-600'
    };
  }
  
  // Return hardcoded color classes for each mood
  switch (mood) {
    case 'happy':
      return {
        border: 'border-l-green-400',
        glow: 'shadow-[0_0_15px_rgba(74,222,128,0.5)]',
        gradient: 'from-green-400 to-green-600'
      };
    case 'excited':
      return {
        border: 'border-l-green-500',
        glow: 'shadow-[0_0_15px_rgba(34,197,94,0.5)]',
        gradient: 'from-green-500 to-green-700'
      };
    case 'neutral':
      return {
        border: 'border-l-yellow-400',
        glow: 'shadow-[0_0_15px_rgba(250,204,21,0.5)]',
        gradient: 'from-yellow-400 to-yellow-600'
      };
    case 'calm':
      return {
        border: 'border-l-yellow-500',
        glow: 'shadow-[0_0_15px_rgba(234,179,8,0.5)]',
        gradient: 'from-yellow-500 to-yellow-700'
      };
    case 'sad':
      return {
        border: 'border-l-orange-400',
        glow: 'shadow-[0_0_15px_rgba(251,146,60,0.5)]',
        gradient: 'from-orange-400 to-orange-600'
      };
    case 'frustrated':
      return {
        border: 'border-l-red-500',
        glow: 'shadow-[0_0_15px_rgba(239,68,68,0.5)]',
        gradient: 'from-red-500 to-red-700'
      };
    case 'angry':
      return {
        border: 'border-l-red-600',
        glow: 'shadow-[0_0_15px_rgba(220,38,38,0.5)]',
        gradient: 'from-red-600 to-red-800'
      };
    default:
      return {
        border: 'border-l-slate-400',
        glow: 'shadow-slate-400/30',
        gradient: 'from-slate-400 to-slate-600'
      };
  }
};

/**
 * Get Tailwind color classes for chat message styling
 */
export const getChatMessageColors = (mood: MoodEnum): string => {
  const accents = getMoodAccentClasses(mood);
  // Use neutral background with thick colored left border
  return `bg-slate-800/90 border border-slate-700/50 ${accents.border} border-l-[6px] text-slate-100`;
};

/**
 * Get tree node ring color for mood indication
 */
export const getTreeNodeRingColor = (mood: MoodEnum): string => {
  // Handle undefined/null mood values
  if (!mood) {
    return 'ring-slate-400';
  }
  
  // Return hardcoded ring colors for each mood
  switch (mood) {
    case 'happy':
      return 'ring-green-400';
    case 'excited':
      return 'ring-green-500';
    case 'neutral':
      return 'ring-yellow-400';
    case 'calm':
      return 'ring-yellow-500';
    case 'sad':
      return 'ring-orange-400';
    case 'frustrated':
      return 'ring-red-500';
    case 'angry':
      return 'ring-red-600';
    default:
      return 'ring-slate-400';
  }
};

/**
 * Get solid Tailwind colors for tree node styling
 */
export const getTreeNodeColors = (mood: MoodEnum): string => {
  const accents = getMoodAccentClasses(mood);
  const ringColor = getTreeNodeRingColor(mood);
  // Use dark background with colored ring and glow
  return `bg-slate-800 border-slate-700 ring-4 ${ringColor} ${accents.glow}`;
};

/**
 * Get hex color for backend visualization
 */
export const getHexColor = (mood: MoodEnum): string => {
  return MOOD_COLORS[mood]?.hex || '#9ca3af';
};

/**
 * Get arrow color for tree visualization
 */
export const getArrowColor = (mood: MoodEnum): string => {
  if (!mood) {
    return 'text-slate-400';
  }
  
  // Return hardcoded text colors for each mood to ensure Tailwind includes them
  switch (mood) {
    case 'happy':
      return 'text-green-100';
    case 'excited':
      return 'text-green-300';
    case 'neutral':
      return 'text-yellow-100';
    case 'calm':
      return 'text-yellow-300';
    case 'sad':
      return 'text-orange-100';
    case 'frustrated':
      return 'text-red-300';
    case 'angry':
      return 'text-red-500';
    default:
      return 'text-slate-400';
  }
};