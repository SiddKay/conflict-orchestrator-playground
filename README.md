# Conflicta Frontend

Interactive React-based frontend for Conflicta, an AI-powered conflict resolution training platform. This application provides a sophisticated interface for simulating realistic conflicts between AI agents, visualizing conversation trees, and learning conflict resolution through hands-on experimentation.

## Features

- 🌳 **Interactive Conversation Trees** - D3.js-powered visualization with branching conversation paths
- 🎭 **AI Agent Configuration** - Create customizable AI agents with distinct personalities and behaviors  
- 💬 **Real-time Chat Interface** - Message bubbles with mood indicators and intervention badges
- 🤖 **3D Avatar Integration** - Animated avatars with emotional expressions and text-to-speech
- 📊 **Mood Tracking** - Visual indicators for 7 emotional states with color-coded feedback
- 🎮 **User Intervention Tools** - Escalation/de-escalation controls and custom message insertion
- 📈 **Conversation Analysis** - AI-powered insights and conflict resolution recommendations

## Quick Start

### Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn** package manager  
- **Backend API** - Ensure the [ScienceHack backend](../ScienceHack/) is running on `http://localhost:8000`

### Installation

```bash
# Change to project directory
cd conflict-orchestrator-playground

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`

### Development Commands

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Build for development environment
npm run build:dev

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Environment Configuration

Create a `.env` file in the project root:

```bash
# Backend API URL (default: http://localhost:8000)
VITE_API_BASE_URL=http://localhost:8000
```

## Project Architecture

### Core Technologies

- **React 18** - Modern functional components with hooks
- **TypeScript** - Type-safe development with strict typing
- **Vite** - Lightning-fast build tool and development server
- **Tailwind CSS** - Utility-first styling framework
- **shadcn/ui** - High-quality, accessible component library

### Specialized Libraries

- **@met4citizen/talkinghead** - 3D avatar rendering and animation
- **Three.js** - 3D graphics and avatar integration
- **Lucide React** - Modern icon library
- **React Hook Form + Zod** - Form management with validation
- **React Router** - Client-side routing

### Project Structure

```
src/
├── components/           # React components
│   ├── avatar/          # 3D avatar management
│   │   ├── TalkingHeadAvatar.tsx
│   │   ├── DualAvatarManager.tsx
│   │   └── OptimizedDualAvatarManager.tsx
│   ├── ui/              # shadcn/ui components
│   ├── ChatInterface.tsx
│   ├── ConversationTree.tsx
│   └── SetupForm.tsx
├── contexts/            # React Context providers
│   └── ConversationContext.tsx
├── hooks/               # Custom React hooks
│   ├── useConversation.ts
│   └── use-toast.ts
├── services/            # API integration
│   └── api.ts
├── types/               # TypeScript definitions
│   ├── models.ts
│   └── talkinghead.d.ts
├── lib/                 # Utilities and helpers
│   ├── colorMapping.ts
│   └── utils.ts
└── pages/               # Route components
    ├── Index.tsx
    └── NotFound.tsx
```

### Key Architectural Patterns

#### 1. **Context-Based State Management**
- `ConversationContext` manages global conversation state
- Centralized state for conversation trees, current paths, and message tracking
- React Context API provides state to all child components

#### 2. **Service Layer Architecture**
- `api.ts` handles all backend communication
- Typed API responses with error handling
- Centralized HTTP client configuration

#### 3. **Component Composition**
- Modular components with single responsibility
- shadcn/ui provides consistent, accessible base components
- Custom components extend base functionality

#### 4. **Type-Safe Development**
- Comprehensive TypeScript definitions in `types/models.ts`
- Strict typing for API responses and component props
- Runtime validation with Zod schemas

#### 5. **Performance Optimization**
- Optimized avatar managers prevent system overload
- Efficient state updates minimize re-renders
- Lazy loading for heavy 3D components

### Data Flow

1. **Setup Phase**: Users configure agents and scenarios via `SetupForm`
2. **Conversation Management**: `ConversationContext` tracks conversation state
3. **Tree Visualization**: `ConversationTree` renders interactive D3.js visualization
4. **Chat Interface**: `ChatInterface` displays messages and handles user interactions
5. **Avatar Integration**: `DualAvatarManager` coordinates 3D avatars with conversation flow

### Styling System

- **Tailwind CSS** for utility-first styling
- **CSS Variables** for consistent theming
- **shadcn/ui** provides design system foundation
- **Responsive design** with mobile-first approach

## Integration Notes

### Backend Dependencies
This frontend requires the ScienceHack FastAPI backend to be running. Key integration points:

- **API Base URL**: Configurable via `VITE_API_BASE_URL`
- **WebSocket**: Real-time conversation updates (if implemented)
- **File Uploads**: Avatar models and configuration files

### 3D Avatar Requirements
- Modern browser with WebGL support
- Sufficient GPU memory for 3D rendering
- Audio permissions for text-to-speech functionality

## Contributing

1. Follow TypeScript strict mode guidelines
2. Use functional components with hooks
3. Implement proper error boundaries
4. Add comprehensive type definitions
5. Follow existing component patterns

## Troubleshooting

### Common Issues

**3D Avatar Performance**
- Reduce avatar quality settings
- Check GPU memory availability
- Disable avatars for low-end devices

**API Connection Errors**
- Verify backend is running on correct port
- Check CORS configuration
- Validate API endpoint URLs

**Build Errors**
- Clear node_modules and reinstall
- Update TypeScript version
- Check for conflicting dependencies