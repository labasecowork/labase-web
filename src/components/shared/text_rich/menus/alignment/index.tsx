import { Editor } from "@tiptap/react";
import {
  Bars3BottomRightIcon,
  Bars3CenterLeftIcon,
  Bars3BottomLeftIcon,
} from "@heroicons/react/24/outline";
import {
  CustomDropdown,
  type MenuSection,
} from "@/components/shared/custom_dropdown";

interface AlignmentMenuProps {
  editor: Editor | null;
}

// Menú para alinear texto en el editor
export const AlignmentMenu = ({ editor }: AlignmentMenuProps) => {
  if (!editor) return null; // No renderiza si no hay editor

  const handleAlignment = (alignment: "left" | "center" | "right") => {
    editor.chain().focus().setTextAlign(alignment).run(); // Aplica alineación
  };

  // Determina la alineación activa
  const activeAlignment = editor.isActive({ textAlign: "left" })
    ? "left"
    : editor.isActive({ textAlign: "center" })
      ? "center"
      : editor.isActive({ textAlign: "right" })
        ? "right"
        : "left";

  // Devuelve el ícono según la alineación activa
  const getButtonIcon = () => {
    switch (activeAlignment) {
      case "left":
        return <Bars3BottomLeftIcon className="h-5 w-5" />;
      case "center":
        return <Bars3CenterLeftIcon className="h-5 w-5" />;
      case "right":
        return <Bars3BottomRightIcon className="h-5 w-5" />;
      default:
        return <Bars3BottomLeftIcon className="h-5 w-5" />;
    }
  };

  // Opciones del menú de alineación
  const alignmentItems: MenuSection[] = [
    {
      items: [
        {
          id: "align-left",
          label: "Alinear a la izquierda",
          icon: <Bars3BottomLeftIcon className="h-5 w-5" />,
          onClick: () => handleAlignment("left"),
        },
        {
          id: "align-center",
          label: "Alinear al centro",
          icon: <Bars3CenterLeftIcon className="h-5 w-5" />,
          onClick: () => handleAlignment("center"),
        },
        {
          id: "align-right",
          label: "Alinear a la derecha",
          icon: <Bars3BottomRightIcon className="h-5 w-5" />,
          onClick: () => handleAlignment("right"),
        },
      ],
    },
  ];

  // Clases para el botón y el menú
  const buttonClassName = `

    size-10 inline-flex items-center justify-center
    bg-transparent text-sm font-medium
    hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-stone-400
    transition-colors
    ${editor.isActive({ textAlign: activeAlignment }) ? "bg-stone-200" : ""}
  `;

  const menuItemClassName = `
    group flex items-center px-3 py-2 text-sm text-stone-700
    data-[focus]:bg-stone-100 data-[focus]:text-stone-900 data-[focus]:outline-none
    transition-colors
  `;

  return (
    <CustomDropdown
      sections={alignmentItems}
      buttonIcon={getButtonIcon()}
      buttonClassName={buttonClassName}
      menuClassName="absolute z-40 mt-1 w-48 origin-top-right  bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
      menuItemClassName={menuItemClassName}
      position="left"
      width="w-48"
    />
  );
};
