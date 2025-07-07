import { useState, useEffect } from "react";
import { TextRich } from "./index";
import { Button } from "@/components/ui/button";
import { CustomInput } from "@/components/shared/custom_input";
import type { Blog } from "@/services/blogService";

interface TipTapEditorProps {
  initialContent?: string;
  blogId?: number;
  initialTitle?: string;
  initialAuthor?: string;
  initialFeaturedImage?: string;
}

const TipTapEditor = ({
  initialContent = "",
  blogId,
  initialTitle = "",
  initialAuthor = "",
  initialFeaturedImage = "",
}: TipTapEditorProps) => {
  const [title, setTitle] = useState(initialTitle);
  const [author, setAuthor] = useState(initialAuthor);
  const [featuredImage, setFeaturedImage] = useState(initialFeaturedImage);
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // Efecto para actualizar el contenido cuando cambia initialContent
  useEffect(() => {
    if (initialContent && initialContent !== content) {
      setContent(initialContent);
    }
  }, [initialContent]);

  const handleSave = async () => {
    if (!title) {
      setSaveMessage("Por favor, ingresa un título para el blog");
      return;
    }

    setIsSaving(true);
    setSaveMessage("");

    try {
      // Preparar los datos del blog según el formato esperado por el servicio
      const blogData: Partial<Blog> = {
        title,
        author: author || null,
        contenido: content,
        "imagen destacada": featuredImage || null,
        publicado: false, // Por defecto, los blogs se crean como no publicados
      };

      // Si es una actualización, incluir el ID
      if (blogId) {
        blogData.id = blogId;
        console.log(`Actualizando blog con ID: ${blogId}`, blogData);
      } else {
        console.log("Creando nuevo blog", blogData);
      }

      // Determinar si es actualización o creación
      const isUpdate = !!blogId;
      const endpoint = isUpdate ? "/api/blogs/update" : "/api/blogs";
      const method = "POST"; // Usamos POST para ambos casos para simplificar

      console.log(`Enviando solicitud ${method} a ${endpoint}`);

      // Llamar a la API para guardar el blog
      const response = await fetch(endpoint, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(blogData),
      });

      console.log(`Respuesta recibida con estado: ${response.status}`);
      const result = await response.json();
      console.log("Resultado:", result);

      if (response.ok && result.success) {
        setSaveMessage(
          isUpdate
            ? "Articulo actualizado correctamente"
            : "Articulo creado correctamente"
        );

        // Redirigir al panel de administración después de un breve retraso
        setTimeout(() => {
          window.location.href = "/admin";
        }, 1500);
      } else {
        const errorMsg = result.error || "Error desconocido";
        console.error("Error en la respuesta:", errorMsg);
        setSaveMessage(`Error al guardar el articulo: ${errorMsg}`);
      }
    } catch (error) {
      console.error("Error al guardar el blog:", error);
      setSaveMessage(
        "Error al guardar el articulo: " +
          (error instanceof Error ? error.message : "Error desconocido")
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium mb-1 font-stone-900"
            >
              Título del articulo
            </label>
            <CustomInput
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. ¿Porque es importante el coworking?"
              className="w-full"
            />
          </div>

          <div>
            <label
              htmlFor="author"
              className="block text-sm font-medium mb-1 font-stone-900"
            >
              Autor
            </label>
            <CustomInput
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Ej. Juan Perez"
              className="w-full"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="featuredImage"
            className="block text-sm font-medium mb-1 font-stone-900"
          >
            Imagen destacada
          </label>
          <CustomInput
            id="featuredImage"
            value={featuredImage}
            onChange={(e) => setFeaturedImage(e.target.value)}
            placeholder="Ej. https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg"
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 font-stone-900">
            Contenido
          </label>
          <TextRich
            value={initialContent}
            onChange={setContent}
            minHeight="400px"
            maxHeight="600px"
            showHeadingSelector={true}
            showFontSelector={false}
            showBasicFormat={true}
            showAlignmentMenu={true}
            showColorMenu={true}
            showHighlightMenu={true}
            showListMenu={true}
            showCodeBlockMenu={true}
            showImageMenu={true}
            showLinkMenu={true}
            showTableMenu={true}
            showYoutubeMenu={true}
            showHistoryMenu={true}
          />
        </div>
      </div>

      <div className="flex items-end justify-end flex-col">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-stone-900 px-8 rounded-full py-3 text-base text-white flex items-center gap-2 hover:bg-stone-800 transition-all"
        >
          {isSaving
            ? "Guardando..."
            : blogId
            ? "Actualizar artículo"
            : "Crear artículo"}
        </button>

        {saveMessage && (
          <div
            className={`text-sm mt-4 px-4 py-4 ${
              saveMessage.includes("Error")
                ? "text-red-600 bg-red-100"
                : "text-stone-700 bg-stone-100"
            }`}
          >
            {saveMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default TipTapEditor;
