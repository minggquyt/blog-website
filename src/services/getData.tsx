import type { Tag, Posts, UserDetailList, PostList } from '../types/index';

export default function getTagData(): Promise<Tag[]>{
    return fetch('/data/tags/tags.json')
        .then((res) => res.json())
        .then(data => {
            return data;
        })
        .catch(error => console.log(error))
}

export function getPostsData(): Promise<Posts>{
  return fetch('/data/posts/posts.json')
    .then(res => res.json())
    .then(data => data)
    .catch(error => console.log(error));
}

export function getUsersData(): Promise<UserDetailList>{
    return fetch('/data/users/users.json')
        .then(res => res.json())
        .then(data => data)
        .catch(err => console.log(err));
}