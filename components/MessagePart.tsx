'use client';

import Image from 'next/image';
import { UIMessage } from 'ai';
import { useEffect, useState } from 'react';

interface MessagePartProps {
  part: UIMessage['parts'][number];
  index: number;
}

function convertPdfDataUrlToBlobUrl(dataUrl: string): string {
  const [header, encoded] = dataUrl.split(',');
  const mimeType = header.split(':')[1].split(';')[0];
  const byteString = atob(encoded);
  const buffer = new ArrayBuffer(byteString.length);
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < byteString.length; i++) {
    bytes[i] = byteString.charCodeAt(i);
  }
  return URL.createObjectURL(new Blob([buffer], { type: mimeType }));
}

export function MessagePart({ part, index }: MessagePartProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    const isPdfDataUrl =
      part.type === 'file' &&
      part.url.startsWith('data:') &&
      part.mediaType === 'application/pdf';

    if (!isPdfDataUrl || part.type !== 'file') return;

    let cancelled = false;
    let objectUrl: string | null = null;

    try {
      objectUrl = convertPdfDataUrlToBlobUrl(part.url);
      Promise.resolve().then(() => {
        if (!cancelled) setBlobUrl(objectUrl);
      });
    } catch (e) {
      console.error(`Failed to convert PDF data URL to blob: ${e}`);
    }

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [part]);

  if (part.type === 'text') {
    return (
      <span className="msg-text">
        {part.text}
      </span>
    );
  }

  if (part.type === 'file') {
    const { mediaType, url } = part;

    if (mediaType?.startsWith('image/')) {
      return (
        <div className="msg-image-wrap">
          <Image
            src={url}
            width={800}
            height={600}
            alt={`attachment-${index}`}
            className="msg-image"
            unoptimized
          />
        </div>
      );
    }

    if (mediaType === 'application/pdf') {
      const displayUrl = blobUrl ? `${blobUrl}#toolbar=0&view=FitH` : url;

      return (
        <div className="msg-pdf-wrap">
          <div className="msg-pdf-header">
            <div className="msg-pdf-meta">
              <span className="msg-pdf-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
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
              </span>
              <span className="msg-pdf-label">PDF Document</span>
            </div>
            <a
              href={blobUrl || url}
              target="_blank"
              rel="noopener noreferrer"
              className="msg-pdf-open"
            >
              OPEN ↗
            </a>
          </div>
          <div className="msg-pdf-viewer">
            <iframe
              key={displayUrl}
              src={displayUrl}
              title={`PDF Preview ${index}`}
            />
          </div>
        </div>
      );
    }
  }

  return null;
}
