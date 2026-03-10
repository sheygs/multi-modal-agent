import { UIMessage } from 'ai';
import { convertFilesToDataURLs } from './file';

/**
 * Formats the role of a message for display.
 * @param role The role of the message (e.g., 'user', 'assistant').
 * @returns A string representation of the role.
 */
export function formatRoleLabel(role: string): string {
  return role === 'user' ? 'User: ' : 'AI: ';
}

/**
 * Prepares the parts of a user message, including text and optional files.
 * @param text The text input from the user.
 * @param files Optional FileList of attachments.
 * @returns An array of message parts.
 */
export async function prepareUserMessageParts(
  text: string,
  files?: FileList,
): Promise<UIMessage['parts']> {
  const fileParts =
    files && files.length > 0 ? await convertFilesToDataURLs(files) : [];

  return [{ type: 'text', text: text }, ...fileParts];
}

/**
 * Resets the chat input form state.
 * @param setInput Function to reset the text input state.
 * @param setFiles Function to reset the files input state.
 * @param fileInputRef Ref to the file input element.
 */
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
