import { useEffect } from "react";
import { useChat } from "@/front";
import { Editor, useEditor } from "~/ui";
import { useDocument } from "./useDocument";

export const BriefEditor = ({
  height = "100%",
  saving,
}: {
  height?: string;
  saving?: boolean;
}) => {
  const { editor } = useEditor();
  const { messages, chatStatus } = useChat();

  const document = useDocument(messages);

  useEffect(() => {
    if (document) editor?.commands.setContent(document);
  }, [editor, document]);

  useEffect(() => {
    editor?.setEditable(chatStatus === "ready");
  }, [editor, chatStatus]);

  return (
    <Editor.Root>
      <Editor.Toolbar saving={saving}></Editor.Toolbar>
      <Editor.Content height={height} />
    </Editor.Root>
  );
};
