'use client';

import { useRef, useState } from 'react';
import { prepareUserMessageParts, resetChatForm } from '@/lib/chats';
import { UIMessage } from 'ai';

interface ChatFormProps {
  sendMessage: (message: { role: 'user'; parts: UIMessage['parts'] }) => void;
}

/**
 * Clean, borderless chat input form.
 */
export function ChatForm({ sendMessage }: ChatFormProps) {
  const [input, setInput] = useState('');
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting || (!input.trim() && (!files || files.length === 0))) return;

    setIsSubmitting(true);
    try {
      const parts = await prepareUserMessageParts(input, files);
      sendMessage({ role: 'user', parts });
      resetChatForm(setInput, setFiles, fileInputRef);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fileCount = files?.length ?? 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm pb-8 pt-4 z-20">
      <form className="mx-auto max-w-2xl px-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm dark:border-gray-800 dark:bg-gray-900 transition-colors">
          {fileCount > 0 && (
            <div className="flex flex-wrap gap-2 p-2">
              {Array.from(files!).map((file, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 rounded-lg bg-blue-50/50 px-2 py-1 text-xs font-medium text-blue-700 border border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800"
                >
                  <span className="max-w-37.5 truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => setFiles(undefined)}
                    className="hover:text-blue-900 dark:hover:text-blue-100"
                    aria-label="Remove files"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-end gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300 transition-colors outline-none focus:outline-none"
              title="Attach files"
              aria-label="Attach files"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.51a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
            </button>

            <input
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={(e) => setFiles(e.target.files ?? undefined)}
              multiple
              ref={fileInputRef}
              title="Upload files"
              aria-label="Upload files"
            />

            <textarea
              rows={1}
              className="w-full resize-none border-none bg-transparent py-2.5 text-sm focus:ring-0 ring-0 outline-none focus:outline-none placeholder:text-gray-400 dark:text-gray-100 dark:placeholder:text-gray-500"
              placeholder="Type a message..."
              title="Message input"
              aria-label="Message input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />

            <button
              type="submit"
              disabled={isSubmitting || (!input.trim() && fileCount === 0)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm transition-all hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed outline-none focus:outline-none"
              title="Send message"
              aria-label="Send message"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
            </button>
          </div>
        </div>
        <p className="mt-2 text-center text-[10px] text-gray-400 dark:text-gray-500">
          Supports images and PDFs. Press Enter to send.
        </p>
      </form>
    </div>
  );
}
