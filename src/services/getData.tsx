import type { Tag, Posts, UserDetailList } from '../types/index';
import { supabase } from '../lib/supabase';

export function getAllDataFromDatabase(tableName: string) {
    return  supabase.from(tableName).select("*")
        .then(({ data, error }) => {
            if (error) {
                return error
            }
            else {
                return data;
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