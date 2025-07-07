import type { APIRoute } from 'astro';
import { blogService } from '@/services/blogService';

/**
 * Endpoint POST para eliminar un blog
 * @route POST /api/blogs/delete
 * @param request Contiene el ID del blog a eliminar
 * @returns 200 si el blog fue eliminado exitosamente
 * @returns 400 si falta el ID del blog
 * @returns 500 si hay un error interno
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    const { id } = await request.json();
    
    if (!id) {
      console.error('Missing blog ID');
      return new Response(
        JSON.stringify({ error: 'Se requiere un ID de blog' }),
        { status: 400 }
      );
    }

    console.log('Deleting blog with ID:', id);
    const success = await blogService.delete(id);

    if (!success) {
      console.error('Error deleting blog');
      return new Response(
        JSON.stringify({
          error: 'Error al eliminar el blog'
        }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Blog eliminado correctamente'
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in delete endpoint:', error);
    return new Response(
      JSON.stringify({
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500 }
    );
  }
}
