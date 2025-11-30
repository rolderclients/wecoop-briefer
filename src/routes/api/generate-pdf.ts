import { createFileRoute } from "@tanstack/react-router";
import { generatePDF } from "@/back/functions/generatePDF";

export const Route = createFileRoute("/api/generate-pdf")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { html } = await request.json();

          if (!html) {
            return new Response(
              JSON.stringify({ error: "HTML content is required" }),
              {
                status: 400,
                headers: { "Content-Type": "application/json" },
              },
            );
          }

          // Генерируем PDF из HTML
          const pdfBuffer = await generatePDF(html);

          // Возвращаем PDF файл
          return new Response(pdfBuffer, {
            status: 200,
            headers: {
              "Content-Type": "application/pdf",
              "Content-Disposition": 'attachment; filename="document.pdf"',
              "Content-Length": pdfBuffer.length.toString(),
            },
          });
        } catch (error) {
          console.error("Ошибка генерации PDF:", error);

          return new Response(
            JSON.stringify({
              error: "Ошибка при генерации PDF",
              details: error instanceof Error ? error.message : "Unknown error",
            }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            },
          );
        }
      },
    },
  },
});
