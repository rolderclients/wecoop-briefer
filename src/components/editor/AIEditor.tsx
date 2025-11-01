import { useDocument } from '@/hooks';
import type { AgentUIMessage } from '@/routes/api/chat';
import { Editor, type EditorProps } from '.';

export const AIEditor = ({
  content,
  ...props
}: EditorProps & { messages: AgentUIMessage[] }) => {
  const lastMessage = props.messages[props.messages.length - 1];
  const textParts = lastMessage?.parts?.filter((i) => i.type === 'text');
  const lastPart = textParts?.[textParts.length - 1];

  const document = useDocument(lastPart || { text: '' });

  return <Editor {...props} content={document || content} />;
};
