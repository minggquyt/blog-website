import getTagData from '../../services/getData.js';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './TagSideBar.css'

export default function TagSideBar() {
    const [tags, setTags] = useState([]);
    useEffect(() => {
        getTagData()
            .then(data => {
                setTags(data);
            })
    }, []);
    return (
        <aside className='tagsidebar'>
            <NavLink to="/" key="home" id="home" className='tagsidebar-item roboto-500' >
                <span>🤖</span>
                <p>Home</p>
            </NavLink>
            {tags.length > 0 && tags.map((tag) => {
                return (
                    <NavLink to={`/${tag['slug']}`} key={tag['id']} id={tag['id']} className='tagsidebar-item roboto-500' >
                        <span>{tag["icon"]}</span>
                        <p>{tag["name"]}</p>
                    </NavLink>
                )
            })}
        </aside>
    )

}