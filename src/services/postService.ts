import { supabase } from '../lib/supabase';
import type { CreatePostSubmission } from '../types/create-post';

// Generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD') // Decompose Vietnamese characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

// Upload image to Supabase storage
export async function uploadImageToStorage(file: File, folder: string = 'posts'): Promise<{ url: string | null; error: any }> {
  try {
    const bucketName = 'images'; // Use the existing bucket from Supabase
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    console.log('Uploading to bucket:', bucketName, 'file:', fileName);

    // Upload to storage
    const { error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file);

    if (error) {
      console.error('Storage upload error:', error);
      return { url: null, error };
    }

    console.log('Upload successful, getting public URL...');

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    console.log('Public URL generated:', publicUrlData.publicUrl);

    return { url: publicUrlData.publicUrl, error: null };
  } catch (error) {
    console.error('Upload exception:', error);
    return { url: null, error };
  }
}

// Create new post
export async function createPost(postData: CreatePostSubmission): Promise<{ data: any; error: any }> {
  try {
    // Generate slug if not provided
    const slug = postData.slug || generateSlug(postData.title);
    
    // Prepare minimal data for database to debug malformed array issue
    const postToDb = {
      title: postData.title.trim(),
      content: postData.content, // Don't trim array content
      author_id: postData.author_id,
      slug: postData.slug || slug,
      cover_image: postData.cover_image || null
    };

    console.log('Inserting to posts table:', postToDb);

    // Insert post to database
    const { data, error } = await supabase
      .from('posts')
      .insert([postToDb])
      .select()
      .single();

    if (error) {
      console.error('Create post error:', error);
      return { data: null, error };
    }

    // Create posts_tags entries if tags were provided
    if (postData.tagIds && postData.tagIds.length > 0 && data) {
      console.log('Creating post tags entries:', data.id, postData.tagIds);
      const tagsResult = await createPostTags(data.id, postData.tagIds);
      if (tagsResult.error) {
        console.warn('Failed to create post tags:', tagsResult.error);
      }
    }

    console.log('Post created successfully:', data);
    return { data, error: null };
  } catch (error) {
    console.error('Create post exception:', error);
    return { data: null, error };
  }
}

// Get all available tags
export async function getTags(): Promise<{ data: any[]; error: any }> {
  try {
    const { data, error } = await supabase
      .from('tags')
      .select('id, name, tag_slug, description')
      .order('name');

    if (error) {
      console.warn('Get tags error:', error);
      return { data: [], error: null }; // Return empty array instead of error
    }

    return { data: data || [], error: null };
  } catch (error) {
    console.warn('Get tags exception:', error);
    return { data: [], error: null };
  }
}

// Create posts_tags entries
export async function createPostTags(postId: string, tagIds: number[]): Promise<{ error: any }> {
  try {
    const postTagsData = tagIds.map(tagId => ({
      post_id: postId,
      tag_id: tagId
    }));

    const { error } = await supabase
      .from('posts_tags')
      .insert(postTagsData);

    if (error) {
      console.error('Create post tags error:', error);
    }

    return { error };
  } catch (error) {
    console.error('Create post tags exception:', error);
    return { error };
  }
}

// Create new tag if it doesn't exist
export async function createTagIfNotExists(tagName: string): Promise<{ data: any; error: any }> {
  try {
    // Check if tag exists
    const { data: existingTag, error: checkError } = await supabase
      .from('tags')
      .select('*')
      .eq('name', tagName)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows found
      return { data: null, error: checkError };
    }

    if (existingTag) {
      return { data: existingTag, error: null };
    }

    // Create new tag
    const { data, error } = await supabase
      .from('tags')
      .insert([{
        name: tagName,
        tag_slug: generateSlug(tagName),
        description: null
      }])
      .select()
      .single();

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
}