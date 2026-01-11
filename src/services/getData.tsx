import type { Tag, Posts, UserDetailList } from '../types/index';
import { supabase } from '../lib/supabase';
import { mapToPostType } from '../mapper/mapToPostType';

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
        .then(({data,error}) =>{
            if(error){
                console.log(error);
                return;
            }
            else{
                return data[0];
            }
        })
}

export function getPostsDataWithIdFromDatabase(postId: string){
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
      .eq("id",postId)
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


export default function getTagData(): Promise<Tag[]> {
    return fetch('/data/tags/tags.json')
        .then((res) => res.json())
        .then(data => {
            return data;
        })
        .catch(error => console.log(error))
}

export function getPostsData(): Promise<Posts> {
    return fetch('/data/posts/posts.json')
        .then(res => res.json())
        .then(data => data)
        .catch(error => console.log(error));
}

export function getUsersData(): Promise<UserDetailList> {
    return fetch('/data/users/users.json')
        .then(res => res.json())
        .then(data => data)
        .catch(err => console.log(err));
}