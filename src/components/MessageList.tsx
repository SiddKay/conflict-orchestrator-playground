
import React, { useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';

interface Message {
  id: string;
  msg: string;
  mood: 'positive' | 'neutral' | 'negative';
  agent: string;
  timestamp: Date;
}

interface MessageListProps {
  messages: Message[];
  selectedNodeId?: string | null;
}

export const MessageList = ({ messages, selectedNodeId }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<{
    [key: string]: HTMLDivElement | null;
  }>({});

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  const scrollToMessage = (messageId: string) => {
    const messageElement = messageRefs.current[messageId];
    if (messageElement) {
      messageElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (selectedNodeId && messageRefs.current[selectedNodeId]) {
      scrollToMessage(selectedNodeId);
    }
  }, [selectedNodeId]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map(message => {
        const isHighlighted = selectedNodeId === message.id;
        return (
          <ChatMessage
            key={message.id}
            message={message}
            isHighlighted={isHighlighted}
            messageRef={(el) => messageRefs.current[message.id] = el}
          />
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};
