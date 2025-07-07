/**
 * Servicio unificado para gestión de blogs
 * Centraliza todas las operaciones CRUD y lógica de negocio relacionada con blogs
 */

import { supabase } from './supabase/client';

/**
 * Tipo unificado para Blog
 */
export type Blog = {
  id?: number;
  title: string;
  contenido: string;
  publicado: boolean;
  author?: string | null;
  "imagen destacada"?: string | null;
  created_at?: string;
  updated_at?: string | null;
  description?: string | null;
  image_url?: string | null;
  "ID de usuario"?: string | null;
  deleted_at?: string | null;
}

/**
 * Servicio centralizado para operaciones de blog
 */
export const blogService = {
  /**
   * Obtener todos los blogs activos ordenados por fecha de creación
   */
  async getAll() {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error al obtener blogs:', error);
      throw error;
    }
    
    return data || [];
  },

  /**
   * Obtener un blog específico por su ID
   */
  async getById(id: number) {
    if (!id) throw new Error('Se requiere un ID de blog válido');
    
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();
      
    if (error) {
      console.error(`Error al obtener blog con ID ${id}:`, error);
      throw error;
    }
    
    return data;
  },

  /**
   * Crear un nuevo blog
   */
  async create(blog: Omit<Blog, 'id' | 'created_at'>) {
    if (!blog.title) throw new Error('El título del blog es requerido');
    if (!blog.contenido) throw new Error('El contenido del blog es requerido');
    
    const { data, error } = await supabase
      .from('blogs')
      .insert([{
        ...blog,
        publicado: blog.publicado ?? true,
        created_at: new Date().toISOString()
      }])
      .select();
      
    if (error) {
      console.error('Error al crear el blog:', error);
      throw error;
    }
    
    return data?.[0];
  },

  /**
   * Actualizar un blog existente
   */
  async update(blog: Blog) {
    if (!blog.id) throw new Error('Se requiere un ID de blog para actualizar');
    
    console.log(`Iniciando actualización de blog con ID ${blog.id}`);
    
    // Extraer el ID y crear una copia de los datos sin el ID para evitar el error
    const { id, ...blogDataWithoutId } = blog;
    
    try {
      // Verificar primero si el blog existe
      const { data: existingBlog, error: fetchError } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', id)
        .single();
        
      if (fetchError) {
        console.error(`Error al verificar existencia del blog con ID ${id}:`, fetchError);
        if (fetchError.code === 'PGRST116') {
          throw new Error(`No se encontró el blog con ID ${id}`);
        }
        throw fetchError;
      }
      
      if (!existingBlog) {
        throw new Error(`No se encontró el blog con ID ${id}`);
      }
      
      console.log('Blog encontrado, procediendo con la actualización');
      
      // Preparar los datos para actualizar
      const updateData = {
        ...blogDataWithoutId,
        updated_at: new Date().toISOString()
      };
      
      console.log('Datos a actualizar:', JSON.stringify(updateData, null, 2));
      
      // Realizar la actualización y solicitar datos de retorno
      const { data: updatedData, error } = await supabase
        .from('blogs')
        .update(updateData)
        .eq('id', id)
        .select();
        
      if (error) {
        console.error(`Error al actualizar blog con ID ${id}:`, error);
        throw error;
      }
      
      // Verificar si se obtuvieron datos de la actualización
      if (!updatedData || updatedData.length === 0) {
        console.error('No se recibieron datos de la actualización, obteniendo blog actualizado...');
        
        // Obtener el blog actualizado en una consulta separada
        const { data: updatedBlog, error: getError } = await supabase
          .from('blogs')
          .select('*')
          .eq('id', id)
          .single();
          
        if (getError) {
          console.error(`Error al obtener el blog actualizado con ID ${id}:`, getError);
          throw getError;
        }
        
        if (!updatedBlog) {
          console.error('No se pudo obtener el blog actualizado');
          throw new Error('No se pudo obtener el blog después de la actualización');
        }
        
        console.log('Blog obtenido después de la actualización:', JSON.stringify(updatedBlog, null, 2));
        return updatedBlog;
      }
      
      // Usar los datos devueltos por la actualización
      const updatedBlog = updatedData[0];
      
      console.log('Blog actualizado correctamente:', JSON.stringify(updatedBlog, null, 2));
      return updatedBlog;
    } catch (error) {
      console.error(`Error en el proceso de actualización:`, error);
      throw error;
    }
  },

  /**
   * Eliminar un blog (borrado lógico)
   */
  async delete(id: number) {
    if (!id) throw new Error('Se requiere un ID de blog para eliminar');
    
    const { error } = await supabase
      .from('blogs')
      .update({
        deleted_at: new Date().toISOString()
      })
      .eq('id', id);
      
    if (error) {
      console.error(`Error al eliminar blog con ID ${id}:`, error);
      throw error;
    }
    
    return true;
  },

  /**
   * Subir imagen destacada para un blog
   */
  async uploadImage(file: File) {
    if (!file) throw new Error('Se requiere un archivo para subir');
    
    // Validar que sea una imagen
    if (!file.type.startsWith("image/")) {
      throw new Error("El archivo seleccionado no es una imagen.");
    }

    // Validar tamaño (máximo 5MB)
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      throw new Error("La imagen es demasiado grande. El tamaño máximo es 5MB.");
    }
    
    // Generar un nombre único para la imagen
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Subir la imagen a Supabase Storage
    const { data, error } = await supabase.storage
      .from("blog-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error('Error al subir imagen:', error);
      throw error;
    }

    // Obtener la URL pública de la imagen
    const { data: { publicUrl } } = supabase.storage
      .from("blog-images")
      .getPublicUrl(filePath);

    return publicUrl;
  }
};
