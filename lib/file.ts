import { UIMessage } from 'ai';

/**
 * Converts a single File object to a data URL and returns it in the format expected by UIMessage.
 * @param file The File object to convert.
 * @returns A promise that resolves to a file part of a UIMessage.
 */
export function convertFileToDataURL(
  file: File,
): Promise<UIMessage['parts'][number]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve({
        type: 'file',
        mediaType: file.type,
        url: reader.result as string,
      });
    };

    reader.onerror = () => {
      reject(new Error(`Failed to read file: ${file.name}`));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Converts a FileList to an array of data URL objects.
 * @param files The FileList to convert.
 * @returns A promise that resolves to an array of message parts.
 */
export async function convertFilesToDataURLs(
  files: FileList,
): Promise<UIMessage['parts']> {
  return Promise.all(Array.from(files).map(convertFileToDataURL));
}
