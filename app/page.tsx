'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { MessagePart } from '@/components/MessagePart';
import { ChatForm } from '@/components/ChatForm';

/**
 * Modern chat interface with improved layout, aesthetics and responsiveness.
 */
export default function Chat() {
  const { messages, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-white/80 px-6 py-4 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
            M
          </div>
          <h1 className="text-lg font-semibold tracking-tight dark:text-gray-100">
            MultiModal
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full dark:bg-green-900/30 dark:text-green-400">
            <span className="h-1.5 w-1.5 rounded-full bg-green-600 animate-pulse"></span>
            Online
          </span>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto pb-40">
        <div className="mx-auto max-w-2xl px-4 py-8">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm dark:bg-gray-900 border dark:border-gray-800">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-600"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold dark:text-gray-100">Welcome!</h2>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Send a message or upload an image/PDF to start.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {messages.map((m, messageIndex) => (
                <div
                  key={`${m.id}-${messageIndex}`}
                  className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className={`flex max-w-[85%] flex-col gap-2`}>
                    <div
                      className={`text-[11px] font-bold uppercase tracking-wider text-gray-400 px-1 ${m.role === 'user' ? 'text-right' : 'text-left'}`}
                    >
                      {m.role === 'user' ? 'You' : 'Assistant'}
                    </div>

                    <div
                      className={`rounded-2xl px-4 py-3 shadow-sm ${
                        m.role === 'user'
                          ? 'bg-blue-600 text-white rounded-tr-none'
                          : 'bg-white border border-gray-100 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-100 rounded-tl-none'
                      }`}
                    >
                      <div className="space-y-1">
                        {m.parts.map((part, index) => (
                          <MessagePart
                            key={`${m.id}-part-${index}`}
                            part={part}
                            messageId={m.id}
                            index={index}
                          />
                        ))}
                      </div>
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
