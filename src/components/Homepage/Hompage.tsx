import { Routes, Route } from "react-router-dom"
import Blogs from '../Blogs/Blogs'
import UserProfile from '../UserProfile/UserProfile'
import './Hompage.css'

export default function Homepage(){
    return (
        <div  className='content'>
            <Routes>
                <Route path=':tagSlug?' element={<Blogs/>} />
                <Route path='/users/:user-id' element={<UserProfile/>} />
            </Routes>
        </div>
    )
}