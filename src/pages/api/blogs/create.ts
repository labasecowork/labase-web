import type { APIRoute } from 'astro';
import { blogService } from '@/services/blogService';
import type { Blog } from '@/services/blogService';

/**
 * Endpoint POST para crear un nuevo blog
 * @route POST /api/blogs/create
 * @param request Contiene el DTO del blog a crear
 * @returns 201 si el blog fue creado exitosamente
 * @returns 400 si faltan datos requeridos
 * @returns 500 si hay un error interno
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    const blogData: Omit<Blog, 'id' | 'created_at'> = await request.json();

    // Validar datos requeridos
    if (!blogData.title || !blogData.contenido) {
      return new Response(
        JSON.stringify({ 
          error: 'El título y el contenido son requeridos' 
        }),
        { status: 400 }
      );
    }

    // Crear el blog usando el servicio unificado
    const newBlog = await blogService.create(blogData);
    
    if (!newBlog || !newBlog.id) {
      return new Response(
        JSON.stringify({ 
          error: 'Error al crear el blog' 
        }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        id: newBlog.id 
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error en el endpoint de creación:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Error interno del servidor' 
      }),
      { status: 500 }
    );
  }
}
