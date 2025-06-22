// ABOUTME: Type declarations for @met4citizen/talkinghead library
// ABOUTME: Provides TypeScript support for the TalkingHead 3D avatar class

declare module '@met4citizen/talkinghead' {
  export interface TalkingHeadOptions {
    ttsEndpoint?: string;
    ttsApikey?: string;
    jwtGet?: () => Promise<string>;
    lipsyncModules?: string[];
    lipsyncLang?: string;
    ttsLang?: string;
    ttsVoice?: string;
    ttsRate?: number;
    ttsPitch?: number;
    ttsVolume?: number;
    ttsTrimStart?: number;
    ttsTrimEnd?: number;
    mixerGainSpeech?: number;
    mixerGainBackground?: number;
    pcmSampleRate?: number;
    modelRoot?: string;
    modelPixelRatio?: number;
    modelFPS?: number;
    modelMovementFactor?: number;
    dracoEnabled?: boolean;
    dracoDecoderPath?: string;
    cameraView?: 'full' | 'mid' | 'upper' | 'head';
    cameraDistance?: number;
    cameraX?: number;
    cameraY?: number;
    cameraRotateX?: number;
    cameraRotateY?: number;
    cameraRotateEnable?: boolean;
    cameraPanEnable?: boolean;
    cameraZoomEnable?: boolean;
    lightAmbientColor?: number | string;
    lightAmbientIntensity?: number;
    lightDirectColor?: number | string;
    lightDirectIntensity?: number;
    lightDirectPhi?: number;
    lightDirectTheta?: number;
    lightSpotColor?: number | string;
    lightSpotIntensity?: number;
    lightSpotPhi?: number;
    lightSpotTheta?: number;
    lightSpotDispersion?: number;
    avatarMood?: string;
    avatarMute?: boolean;
    avatarIdleEyeContact?: number;
    avatarIdleHeadMove?: number;
    avatarSpeakingEyeContact?: number;
    avatarSpeakingHeadMove?: number;
    avatarIgnoreCamera?: boolean;
    listeningSilenceThresholdLevel?: number;
    listeningSilenceThresholdMs?: number;
    listeningSilenceDurationMax?: number;
    listeningActiveThresholdLevel?: number;
    listeningActiveThresholdMs?: number;
    listeningActiveDurationMax?: number;
    statsNode?: HTMLElement | null;
    statsStyle?: string | null;
  }

  export interface AvatarOptions {
    url: string;
    body?: 'M' | 'F';
    avatarMood?: string;
    ttsLang?: string;
    ttsVoice?: string;
    ttsRate?: number;
    ttsPitch?: number;
    ttsVolume?: number;
    lipsyncLang?: string;
    baseline?: Record<string, number>;
    modelDynamicBones?: any[];
    avatarMute?: boolean;
    avatarIdleEyeContact?: number;
    avatarSpeakingEyeContact?: number;
    avatarListeningEyeContact?: number;
    avatarIgnoreCamera?: boolean;
  }

  export interface SpeakOptions {
    lipsyncLang?: string;
    ttsLang?: string;
    ttsVoice?: string;
    ttsRate?: number;
    ttsPitch?: number;
    ttsVolume?: number;
    avatarMood?: string;
    avatarMute?: boolean;
  }

  export interface StreamOptions {
    sampleRate?: number;
    gain?: number;
    lipsyncLang?: string;
    lipsyncType?: 'visemes' | 'blendshapes' | 'words';
    mood?: string;
  }

  export interface AudioData {
    audio: ArrayBuffer | ArrayBuffer[] | Uint8Array | Int16Array;
    visemes?: string[];
    vtimes?: number[];
    vdurations?: number[];
    words?: string[];
    wtimes?: number[];
    wdurations?: number[];
    anims?: any[];
  }

  export class TalkingHead {
    constructor(element: HTMLElement, options?: TalkingHeadOptions);
    
    showAvatar(avatar: AvatarOptions, onprogress?: (progress: ProgressEvent) => void): Promise<void>;
    speakText(text: string, opt?: SpeakOptions, onsubtitles?: (subtitle: string) => void, excludes?: Array<[number, number]>): Promise<void>;
    speakAudio(audio: any, opt?: any, onsubtitles?: (subtitle: string) => void): Promise<void>;
    speakEmoji(emoji: string): void;
    speakBreak(duration: number): void;
    speakMarker(onmarker: () => void): void;
    
    streamStart(opt?: StreamOptions, onAudioStart?: () => void, onAudioEnd?: () => void, onSubtitles?: (subtitle: string) => void): void;
    streamAudio(data: AudioData): void;
    streamNotifyEnd(): void;
    streamStop(): void;
    
    setView(view: 'full' | 'mid' | 'upper' | 'head', opt?: any): void;
    setLighting(opt: any): void;
    setMood(mood: string): void;
    
    lookAt(x: number, y: number, duration: number): void;
    lookAhead(duration: number): void;
    lookAtCamera(duration: number): void;
    makeEyeContact(duration: number): void;
    
    playBackgroundAudio(url: string): void;
    stopBackgroundAudio(): void;
    setMixerGain(speech: number | null, background?: number | null, fadeSecs?: number): void;
    
    playAnimation(url: string, onprogress?: (progress: ProgressEvent) => void, duration?: number, index?: number, scale?: number): void;
    stopAnimation(): void;
    playPose(url: string, onprogress?: (progress: ProgressEvent) => void, duration?: number, index?: number, scale?: number): void;
    stopPose(): void;
    playGesture(name: string, duration?: number, mirror?: boolean, transitionMs?: number): void;
    stopGesture(transitionMs?: number): void;
    
    startListening(analyzer: AnalyserNode, opt?: any, onchange?: (state: string) => void): void;
    stopListening(): void;
    
    start(): void;
    stop(): void;
    
    clearThree(obj: any): void;
    scene?: any;
    
    poseTemplates?: Record<string, any>;
    animMoods?: Record<string, any>;
    gestureTemplates?: Record<string, any>;
    animEmojis?: Record<string, any>;
  }
}