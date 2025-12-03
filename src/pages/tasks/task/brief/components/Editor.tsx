import { useEffect } from "react";
import { useChat } from "@/front";
import { Editor, useEditor } from "~/ui";
import { useDocument } from "./useDocument";
import { RichTextEditor } from "@mantine/tiptap";
import { ActionIcon, Group, Loader, Tooltip } from "@mantine/core";
import { IconFileTypePdf } from "@tabler/icons-react";
import { useState } from "react";
import { downloadPDF } from "@/back/functions";

export const BriefEditor = ({
  height = "100%",
  saving,
}: {
  height?: string;
  saving?: boolean;
}) => {
  const { editor } = useEditor();
  const { messages, chatStatus } = useChat();

  const [downloading, setDownloading] = useState<boolean>(false);

  const document = useDocument(messages);

  useEffect(() => {
    if (document) editor?.commands.setContent(document);
  }, [editor, document]);

  useEffect(() => {
    editor?.setEditable(chatStatus === "ready");
  }, [editor, chatStatus]);

  return (
    <Editor.Root>
      <Editor.Toolbar saving={saving}>
        <RichTextEditor.Control
          style={{ cursor: "pointer" }}
          onClick={() => {
            setDownloading(true);
            // console.log("htmlData", editor?.getHTML());
            downloadPDF(editor?.getHTML() || "", "brief.pdf")
              .then(() => setDownloading(false))
              .catch((error) => {
                console.error("Error downloading PDF:", error);
                setDownloading(false);
              });
          }}
        >
          <Tooltip
            label="Скачать PDF"
            color="dark"
            position="bottom"
            offset={10}
            openDelay={100}
            closeDelay={200}
          >
            {downloading ? (
              <Loader size={14} />
            ) : (
              <IconFileTypePdf stroke={1.5} size={16} color="green" />
            )}
          </Tooltip>
        </RichTextEditor.Control>
      </Editor.Toolbar>
      <Editor.Content height={height} />
    </Editor.Root>
  );
};
