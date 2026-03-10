'use client';

import Image from 'next/image';
import { UIMessage } from 'ai';
import { useEffect, useState } from 'react';

interface MessagePartProps {
  part: UIMessage['parts'][number];
  messageId: string;
  index: number;
}

/**
 * Renders an individual part of a message (text, image, pdf, etc.) with improved styling and preview reliability.
 * Uses blob URLs for PDFs to ensure better browser compatibility.
 */
export function MessagePart({ part, messageId, index }: MessagePartProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let url: string | null = null;

    // Type guard for file parts
    if (part.type === 'file' && part.url.startsWith('data:')) {
      if (part.mediaType === 'application/pdf') {
        try {
          const parts = part.url.split(',');
          const byteString = atob(parts[1]);
          const mimeString = parts[0].split(':')[1].split(';')[0];

          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);

          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }

          const blob = new Blob([ab], { type: mimeString });

          url = URL.createObjectURL(blob);

          Promise.resolve().then(() => {
            if (!cancelled) {
              setBlobUrl(url);
            }
          });
        } catch (e) {
          console.error(`Failed to convert PDF data URL to blob: ${e}`);
        }
      }
    } else {
      Promise.resolve().then(() => {
        if (!cancelled) {
          setBlobUrl(null);
        }
      });
    }

    return () => {
      cancelled = true;
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [part]);

  if (part.type === 'text') {
    return (
      <span key={`${messageId}-text-${index}`} className="block leading-relaxed">
        {part.text}
      </span>
    );
  }

  if (part.type === 'file') {
    const { mediaType, url } = part;

    if (mediaType?.startsWith('image/')) {
      return (
        <div
          key={`${messageId}-image-${index}`}
          className="my-3 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md max-w-full sm:max-w-md"
        >
          <Image
            src={url}
            width={800}
            height={600}
            alt={`attachment-${index}`}
            className="h-auto w-full object-contain"
            unoptimized
          />
        </div>
      );
    }

    if (mediaType === 'application/pdf') {
      const displayUrl = blobUrl ? `${blobUrl}#toolbar=0&view=FitH` : url;

      return (
        <div
          key={`${messageId}-pdf-${index}`}
          className="my-3 flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 w-full max-w-2xl"
        >
          <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-4 py-2 dark:border-gray-800 dark:bg-gray-800/50">
            <div className="flex items-center gap-2">
              <div className="rounded bg-red-100 p-1 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-tight">
                PDF Document
              </span>
            </div>
            <a
              href={blobUrl || url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-white px-3 py-1 text-xs font-medium text-blue-600 shadow-sm border border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-blue-400 dark:border-gray-700 dark:hover:bg-gray-700 transition-all"
            >
              Open Full View
            </a>
          </div>

          <div className="h-125 w-full relative bg-white">
            <iframe
              key={displayUrl}
              src={displayUrl}
              className="h-full w-full border-0"
              title={`PDF Preview ${index}`}
            />
          </div>
        </div>
      );
    }
  }

  return null;
}
