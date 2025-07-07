import type { APIRoute } from 'astro';
import { blogService } from '@/services/blogService';
import { authService } from '@/services/authService';

/**
 * Endpoint para crear nuevos blogs
 * Método POST: Crear un nuevo blog
 * 
 * Nota: Para actualizar blogs, usar el endpoint /api/blogs/update
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    // Verificar autenticación
    const isAuthenticated = await authService.isAuthenticated();
    if (!isAuthenticated) {
      return new Response(
        JSON.stringify({ error: 'No autorizado' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Obtener datos del blog del cuerpo de la solicitud
    const blogData = await request.json();
    
    try {
      // Usar el servicio de blogs para crear un nuevo blog
      const newBlog = await blogService.create({
        title: blogData.title,
        contenido: blogData.contenido,
        author: blogData.author,
        'imagen destacada': blogData['imagen destacada'],
        publicado: false, // Por defecto, los blogs se crean como no publicados
      });
      
      if (!newBlog) {
        return new Response(
          JSON.stringify({ error: 'Error al crear el blog' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
    
    return new Response(
      JSON.stringify({ success: true, blog: newBlog }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
    } catch (innerError) {
      console.error('Error al crear blog:', innerError);
      const errorMessage = innerError instanceof Error ? innerError.message : 'Error al crear el blog';
      return new Response(
        JSON.stringify({ error: errorMessage }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error en el endpoint de creación de blog:', error);
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// Nota: La función PUT ha sido eliminada para evitar conflictos con el endpoint /api/blogs/update
// Para actualizar blogs, usar el endpoint POST /api/blogs/update
