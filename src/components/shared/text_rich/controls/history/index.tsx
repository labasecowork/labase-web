import { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";

interface HistoryMenuProps {
  editor: Editor | null;
}

export const HistoryMenu = ({ editor }: HistoryMenuProps) => {
  if (!editor) return null; // No renderiza si no hay editor

  return (
    <>
      {/* Botón para deshacer */}
      <Button
        variant="ghost"
        onClick={() => editor.chain().focus().undo().run()} // Ejecuta deshacer
        title="Deshacer (Ctrl+Z)"
        className="flex items-center justify-center size-10 hover:bg-stone-200 rounded-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-undo-icon lucide-undo"
        >
          <path d="M3 7v6h6" />
          <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
        </svg>
      </Button>
      {/* Botón para rehacer */}
      <Button
        variant="ghost"
        onClick={() => editor.chain().focus().redo().run()} // Ejecuta rehacer
        title="Rehacer (Ctrl+Y)"
        className="flex items-center justify-center size-10 hover:bg-stone-200 rounded-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-redo-icon lucide-redo"
        >
          <path d="M21 7v6h-6" />
          <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" />
        </svg>
      </Button>
    </>
  );
};
