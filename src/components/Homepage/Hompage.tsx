import { Routes, Route } from "react-router-dom"
import Blogs from '../Blogs/Blogs'
import UserProfile from '../UserProfile/UserProfile'
import PostDetail from "../PostDetail/PostDetail"
import './Hompage.css'

export default function Homepage(){
    return (
        <div className='content'>
            <Routes>
                <Route path=':tagSlug?' element={<Blogs/>} />
                <Route path='/users/:userId' element={<UserProfile/>} />
                <Route path='/:userId/:postId' element={<PostDetail/>}  />
            </Routes>
        </div>
    )
}