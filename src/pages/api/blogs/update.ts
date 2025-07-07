import type { APIRoute } from 'astro';
import { blogService } from '@/services/blogService';
import { authService } from '@/services/authService';
import { supabase } from '@/services/supabase/client';
import type { Blog } from '@/services/blogService';

/**
 * Endpoint POST para actualizar un blog existente
 * @route POST /api/blogs/update
 * @param request Contiene el DTO con los datos actualizados del blog
 * @returns 200 si el blog fue actualizado exitosamente
 * @returns 400 si faltan datos requeridos (ID o contenido)
 * @returns 500 si hay un error interno
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    // Verificar autenticación primero
    const isAuthenticated = await authService.isAuthenticated();
    if (!isAuthenticated) {
      console.error('Usuario no autenticado intentando actualizar blog');
      return new Response(
        JSON.stringify({ error: 'No autorizado. Debe iniciar sesión para actualizar blogs.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const blogData: Blog = await request.json();
    console.log('Received update request with data:', blogData);

    if (!blogData.id) {
      console.error('Missing blog ID');
      return new Response(
        JSON.stringify({ error: 'Se requiere un ID de blog' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validar que el contenido esté presente
    if (!blogData.contenido) {
      console.error('Missing blog content');
      return new Response(
        JSON.stringify({ error: 'El contenido del blog es requerido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('Updating blog with data:', blogData);

    // Verificar si tenemos acceso directo a la base de datos
    console.log('Verificando permisos en Supabase...');
    const { data: testData, error: testError } = await supabase
      .from('blogs')
      .select('count')
      .limit(1);
      
    if (testError) {
      console.error('Error al verificar permisos en Supabase:', testError);
      return new Response(
        JSON.stringify({ error: 'Error al verificar permisos en la base de datos', details: testError.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('Permisos de lectura verificados correctamente. Intentando actualizar directamente...');
    
    // Intentar actualizar directamente con Supabase antes de usar el servicio
    const updateData = {
      title: blogData.title,
      contenido: blogData.contenido,
      author: blogData.author,
      'imagen destacada': blogData['imagen destacada'],
      publicado: blogData.publicado,
      updated_at: new Date().toISOString()
    };
    
    const { data: directUpdateData, error: directUpdateError } = await supabase
      .from('blogs')
      .update(updateData)
      .eq('id', blogData.id)
      .select();
      
    if (directUpdateError) {
      console.error('Error al actualizar directamente en Supabase:', directUpdateError);
      console.log('Intentando con el servicio de blogs...');
    } else {
      console.log('Actualización directa en Supabase exitosa:', directUpdateData);
    }
    
    // Usar el servicio unificado con manejo de errores mejorado
    console.log('Procediendo con la actualización a través del servicio de blogs...');
    const updatedBlog = await blogService.update(blogData);
    const success = !!updatedBlog;
    
    // Verificar explícitamente que la actualización se haya aplicado
    if (success) {
      // Verificar que los datos actualizados coincidan con lo que se envió
      const { data: verifyBlog } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', blogData.id)
        .single();
        
      if (verifyBlog) {
        console.log('Verificación de actualización exitosa:', JSON.stringify(verifyBlog, null, 2));
        
        // Verificar si los datos se actualizaron correctamente
        const updateSuccessful = 
          verifyBlog.title === blogData.title &&
          verifyBlog.contenido === blogData.contenido &&
          verifyBlog.author === blogData.author &&
          verifyBlog['imagen destacada'] === blogData['imagen destacada'] &&
          verifyBlog.publicado === blogData.publicado;
        
        if (!updateSuccessful) {
          console.error('La actualización no se aplicó correctamente. Datos esperados vs. obtenidos:');
          console.error('Esperado:', JSON.stringify(updateData, null, 2));
          console.error('Obtenido:', JSON.stringify(verifyBlog, null, 2));
        } else {
          console.log('Los datos se actualizaron correctamente.');
        }
      } else {
        console.warn('No se pudo verificar la actualización, pero no se detectaron errores');
      }
    }

    if (!success) {
      console.error('Error updating blog');
      return new Response(
        JSON.stringify({
          error: 'Error al actualizar el blog'
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Blog actualizado correctamente',
        blog: updatedBlog // Devolver el blog actualizado para confirmar los cambios
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in update endpoint:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Determinar el código de estado basado en el tipo de error
    let statusCode = 500;
    if (errorMessage.includes('No autorizado') || errorMessage.includes('no autenticado')) {
      statusCode = 401;
    } else if (errorMessage.includes('No se encontró')) {
      statusCode = 404;
    } else if (errorMessage.includes('Se requiere')) {
      statusCode = 400;
    }
    
    return new Response(
      JSON.stringify({
        error: 'Error al actualizar el blog',
        details: errorMessage
      }),
      { status: statusCode, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
