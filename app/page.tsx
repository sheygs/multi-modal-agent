'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { MessagePart } from '@/components/MessagePart';
import { ChatForm } from '@/components/ChatForm';

export default function Chat() {
  const { messages, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  });

  return (
    <div className="chat-root">
      <header className="chat-header">
        <div className="chat-header-brand">
          <h1 className="chat-header-title">MultiModal</h1>
          <div className="chat-header-line" />
        </div>
        <div className="chat-header-status">
          <span className="chat-status-dot animate-pulse-amber" />
          <span className="chat-status-label">LIVE</span>
        </div>
      </header>

      <main className="chat-main">
        <div className="chat-container">
          {messages.length === 0 ? (
            <div className="chat-empty animate-fade-slide-up">
              <div className="chat-empty-diamonds">◆ ◇ ◆</div>
              <p className="chat-empty-title">Begin your inquiry</p>
              <p className="chat-empty-subtitle">Text · Image · PDF</p>
            </div>
          ) : (
            <div className="chat-messages">
              {messages.map((m, messageIndex) => (
                <div
                  key={`${m.id}-${messageIndex}`}
                  className={`chat-message animate-fade-slide-up ${
                    m.role === 'user'
                      ? 'chat-message--user'
                      : 'chat-message--assistant'
                  }`}
                  style={{
                    animationDelay: `${Math.min(messageIndex * 0.03, 0.2)}s`,
                  }}
                >
                  <div
                    className={`chat-message-label ${
                      m.role === 'user'
                        ? 'chat-message-label--user'
                        : 'chat-message-label--assistant'
                    }`}
                  >
                    {m.role === 'user' ? 'YOU' : '◆ AGENT'}
                  </div>

                  <div
                    className={`chat-message-body ${
                      m.role === 'user'
                        ? 'chat-message-body--user'
                        : 'chat-message-body--assistant'
                    }`}
                  >
                    <div className="chat-message-parts">
                      {m.parts.map((part, index) => (
                        <MessagePart
                          key={`${m.id}-part-${index}`}
                          part={part}
                          index={index}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <ChatForm sendMessage={sendMessage} />
    </div>
  );
}
