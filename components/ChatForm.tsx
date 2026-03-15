'use client';

import { useRef, useState } from 'react';
import { prepareUserMessageParts, resetChatForm } from '@/lib/chats';
import { UIMessage } from 'ai';

interface ChatFormProps {
  sendMessage: (message: { role: 'user'; parts: UIMessage['parts'] }) => void;
}

export function ChatForm({ sendMessage }: ChatFormProps) {
  const [input, setInput] = useState('');
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileCount = files?.length ?? 0;
  const canSend = !isSubmitting && (input.trim().length > 0 || fileCount > 0);

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (!canSend) return;

    setIsSubmitting(true);
    try {
      const parts = await prepareUserMessageParts(input, files);
      sendMessage({ role: 'user', parts });
      resetChatForm(setInput, setFiles, fileInputRef);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAttachClick = () => fileInputRef.current?.click();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFiles(e.target.files ?? undefined);
  const handleEnterKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="chat-form-root">
      <form className="chat-form-inner" onSubmit={handleSubmit}>
        <div className="chat-form-box">
          {fileCount > 0 && (
            <div className="chat-form-files">
              {Array.from(files!).map((file, i) => (
                <div key={i} className="chat-form-file-pill">
                  <span className="chat-form-file-name">{file.name}</span>
                  <button
                    type="button"
                    className="chat-form-file-remove"
                    onClick={() => setFiles(undefined)}
                    aria-label="Remove files"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="chat-form-controls">
            <button
              type="button"
              className={`chat-form-attach-btn${fileCount > 0 ? ' chat-form-attach-btn--active' : ''}`}
              onClick={handleAttachClick}
              title="Attach files"
              aria-label="Attach files"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.51a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
              </svg>
            </button>

            <input
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={handleFileChange}
              multiple
              ref={fileInputRef}
              title="Upload files"
              aria-label="Upload files"
            />

            <textarea
              rows={1}
              className="chat-form-textarea"
              placeholder="Type a message..."
              title="Message input"
              aria-label="Message input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleEnterKey}
            />

            <button
              type="submit"
              disabled={!canSend}
              className="chat-form-send-btn"
              title="Send message"
              aria-label="Send message"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>
              </svg>
            </button>
          </div>
        </div>

        <p className="chat-form-hint">IMAGES &amp; PDFs SUPPORTED · ENTER TO SEND</p>
      </form>
    </div>
  );
}
