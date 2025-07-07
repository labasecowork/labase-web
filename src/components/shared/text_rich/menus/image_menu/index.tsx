import { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { PhotoIcon } from "@heroicons/react/24/outline";

interface ImageMenuProps {
  editor: Editor | null;
}

interface ImageAttributes {
  src: string;
  alt?: string;
  title?: string;
  width?: number | null;
}

export const ImageMenu = ({ editor }: ImageMenuProps) => {
  if (!editor) return null;

  const validateImageUrl = async (url: string) => {
    try {
      const img = new Image();
      const imageLoadPromise = new Promise((resolve, reject) => {
        img.onload = () => resolve(true);
        img.onerror = () => reject(false);
        setTimeout(() => reject(false), 10000);
      });

      img.crossOrigin = "anonymous";
      img.src = url;

      const isValid = await imageLoadPromise;
      return isValid;
    } catch {
      try {
        const response = await fetch(url, {
          method: "HEAD",
          mode: "no-cors",
        });
        return true;
      } catch {
        try {
          const response = await fetch(url, {
            mode: "no-cors",
          });
          return true;
        } catch {
          return false;
        }
      }
    }
  };

  const handleImage = async () => {
    const url = prompt("Ingresa la URL de la imagen:");
    if (!url) return;

    try {
      const isValidImage = await validateImageUrl(url);
      if (isValidImage) {
        const alt = prompt(
          "Ingresa el texto alternativo (placeholder) para la imagen:"
        );

        const imageAttributes: ImageAttributes = {
          src: url,
          alt: alt || "Imagen",
          title: url,
        };

        editor.chain().focus().setImage(imageAttributes).run();
      } else {
        alert(
          "No se pudo cargar la imagen. Por favor verifica que:\n\n- La URL sea accesible\n- La URL corresponda a una imagen\n- La imagen no esté protegida o bloqueada"
        );
      }
    } catch {
      const imageAttributes: ImageAttributes = {
        src: url,
        alt: "Imagen",
        title: url,
      };

      editor.chain().focus().setImage(imageAttributes).run();
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={handleImage}
      className="size-10 flex items-center justify-center hover:bg-stone-100 transition-all rounded-none"
      title="Insertar imagen"
    >
      <PhotoIcon strokeWidth={2} className="h-5 w-5" />
    </Button>
  );
};
