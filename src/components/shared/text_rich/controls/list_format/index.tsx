import { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import {
  ListBulletIcon,
  Bars3Icon,
  NumberedListIcon,
} from "@heroicons/react/24/outline";

interface ListMenuProps {
  editor: Editor | null;
}

export const ListMenu = ({ editor }: ListMenuProps) => {
  if (!editor) return null; // No renderiza si no hay editor

  // Alterna lista con viñetas
  const toggleBulletList = () => {
    editor.chain().focus().toggleBulletList().run();
  };

  // Alterna lista numerada
  const toggleOrderedList = () => {
    editor.chain().focus().toggleOrderedList().run();
  };

  return (
    <>
      {/* Botón para lista con viñetas */}
      <Button
        variant="ghost"
        onClick={toggleBulletList}
        className={`size-10 flex items-center justify-center hover:bg-stone-100 transition-all rounded-none ${
          editor.isActive("bulletList") ? "bg-stone-100" : ""
        }`}
        title="Lista con viñetas"
      >
        <ListBulletIcon strokeWidth={2} className="h-5 w-5" />
      </Button>
      {/* Botón para lista numerada */}
      <Button
        variant="ghost"
        onClick={toggleOrderedList}
        className={`size-10 flex items-center justify-center hover:bg-stone-100 transition-all rounded-none ${
          editor.isActive("orderedList") ? "bg-stone-100" : ""
        }`}
        title="Lista numerada"
      >
        <NumberedListIcon strokeWidth={1.5} className="h-5 w-5" />
      </Button>
    </>
  );
};
