import { supabase } from '../lib/supabase';
import { mapToPostType } from '../mapper/mapToPostType';
import type { CommentToDb } from '../types/comments';

export function getAllDataFromDatabase(tableName: string) {
  return supabase.from(tableName).select("*")
    .then(({ data, error }) => {
      if (error) {
        console.warn(`Error in fetching data from Supabase: ${error}`);
        return;
      }
      else {
        return data;
      }
    })
}

export function getUsersInfoWithIdFromDatabase(userId: string) {
  return supabase
    .from("user_profiles")
    .select(`
    id,
    background,
    username:display_name,
    avatar_url,
    avatar_width,
    avatar_height,
    created_at,
    updated_at,

    followers_list:followers!user_id(
      user_follow_id,
      follower_label
    ),

    followers_count:followers!user_id(count),

    introductions:user_introductions(
      id,
      title,
      introduction_items:user_introduction_items(
        id,
        type,
        icon,
        label,
        value,
        editable,
        visibility
      )
    ),
    statistics:user_statistics(
      id,
      icon,
      label,
      value
    )
  `)
    .eq("id", userId)
    .then(({ data, error }) => {
      if (error) {
        console.log(error);
        return;
      }
      else {
        return data[0];
      }
    })
}

export function getPostsDataWithIdFromDatabase(postId: string) {
  return supabase.from("posts").select(`
        id,
      title,
      slug,
      created_at,
      content,
      cover_image,

      user_profile:author_id (
        id,
        display_name,
        avatar_url,
        email
      ),

      comments(count),

      users_posts_like(count),

      posts_tags(
        tags(
          tag_slug
        )
      )
        `)
    .eq("id", postId)
    .then(({ data, error }) => {
      if (error) {
        console.warn(error);
        return;
      }
      else {
        return data[0];
      }
    })
}

export function getPostsDataWithSlugFromDatabase(slug: string) {
  return supabase.from("posts").select(`
        id,
      title,
      slug,
      created_at,
      content,
      cover_image,

      user_profile:author_id (
        id,
        display_name,
        avatar_url,
        email
      ),

      comments(count),

      users_posts_like(count),

      posts_tags(
        tags(
          tag_slug
        )
      )
        `)
    .eq("slug", slug)
    .then(({ data, error }) => {
      if (error) {
        console.warn(error);
        return;
      }
      else {
        return data[0];
      }
    })
}

export function getPostsDataFromDatabase() {
  return supabase.from("posts").select(`
        id,
      title,
      slug,
      created_at,
      content,
      cover_image,

      user_profile:author_id (
        id,
        display_name,
        avatar_url,
        email
      ),

      comments(count),

      users_posts_like(count),

      posts_tags(
        tags(
          tag_slug
        )
      )
        `)
    .then(({ data, error }) => {
      if (error) {
        console.warn(error);
        return;
      }
      else {
        return data.map(r => mapToPostType(r));
      }
    })
}

export function getCommentsCardByPostId(postId: string) {
  return supabase.from("comments").select(`*,

    reacts:users_comments_like(count),
    parent_id,

    user_profiles!comments_author_id_fkey1(
       id,
       display_name,
       avatar_url
    )
    `).eq("post_id", postId)
    .then(({ data, error }) => {
      if (error) {
        console.log(error);
        return;
      }
      else {
        const dataSorted = (data ?? []).sort((a: any, b: any) => {
          return new Date(b.createAt ?? 0).getTime() - new Date(a.createAt ?? 0).getTime() ;
        }).reverse();
        return dataSorted;
      }
    })
}

export function getCurrentUserLogin() {
  return supabase.auth.getUser()
    .then(({ data, error }) => {
      if (error) {
        console.log(error);
        return;
      }
      else
        return data;
    })
}

export function getCurrentLoginUserInfoById(userId: string){
  return supabase.from("user_profiles").select("*").eq("id",userId)
    .then(({data, error}) => {
      if(error){
        console.log(error);
        return;
      }
      else
        return data;
    })
}

export function insertCommnets(comment: CommentToDb) {
  return supabase
    .from('comments')
    .insert(comment)
    .then((error) => {
      console.log(error);
      return;
    })
}

export function deleteCommnets(id: string){
    return supabase.from("comments").delete().eq('id',id)
      .then((res) => {
        console.log(res);
        return res; 
      })  
}

export function updateComments(id: string, content: any){
  return supabase.from("comments").update(content).eq("id",id)
    .then((error) => {
      console.log(error);
      return error;
    })
}