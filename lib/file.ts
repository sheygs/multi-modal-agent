import { UIMessage } from 'ai';

export function convertFileToDataURL(file: File): Promise<UIMessage['parts'][number]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({ type: 'file', mediaType: file.type, url: reader.result as string });
    };
    reader.onerror = () => {
      reject(new Error(`Failed to read file: ${file.name}`));
    };
    reader.readAsDataURL(file);
  });
}

export async function convertFilesToDataURLs(files: FileList): Promise<UIMessage['parts']> {
  return Promise.all(Array.from(files).map(convertFileToDataURL));
}
