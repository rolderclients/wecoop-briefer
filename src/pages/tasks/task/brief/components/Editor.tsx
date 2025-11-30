import { useEffect, useState } from "react";
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
  const [htmlData, setHtmlData] = useState<string>("");

  const document = useDocument(messages);

  useEffect(() => {
    if (document) editor?.commands.setContent(document);
  }, [editor, document]);

  useEffect(() => {
    editor?.setEditable(chatStatus === "ready");
  }, [editor, chatStatus]);

  useEffect(() => {
    if (editor) {
      // Получаем HTML при изменении контента
      setHtmlData(editor.getHTML());

      // Подписываемся на обновления
      const updateHandler = () => {
        setHtmlData(editor.getHTML());
      };

      editor.on("update", updateHandler);

      return () => {
        editor.off("update", updateHandler);
      };
    }
  }, [editor]);

  return (
    <Editor.Root>
      <Editor.Toolbar saving={saving} htmlData={htmlData} />
      <Editor.Content height={height} />
    </Editor.Root>
  );
};
