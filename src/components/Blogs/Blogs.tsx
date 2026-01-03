import TagSideBar from "../TagSideBar/TagSideBar"
import PostList from "../PostList/PostList";
import { useParams } from "react-router-dom"

export default function Blogs(){
    const {tagSlug} = useParams();
    return (
        <>
            <TagSideBar />
            <PostList
                type="tag"
                value={tagSlug != undefined ? tagSlug : "home"}
            />
        </>
    )
}