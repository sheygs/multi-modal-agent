import { UIMessage } from 'ai';
import { convertFilesToDataURLs } from './file';

export async function prepareUserMessageParts(
  text: string,
  files?: FileList,
): Promise<UIMessage['parts']> {
  const fileParts = files && files.length > 0 ? await convertFilesToDataURLs(files) : [];
  return [{ type: 'text', text }, ...fileParts];
}

export function resetChatForm(
  setInput: (value: string) => void,
  setFiles: (value: FileList | undefined) => void,
  fileInputRef: React.RefObject<HTMLInputElement | null>,
) {
  setInput('');
  setFiles(undefined);
  if (fileInputRef.current) {
    fileInputRef.current.value = '';
  }
}
