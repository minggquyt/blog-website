import type { Tag, Posts } from '../types/index';

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

