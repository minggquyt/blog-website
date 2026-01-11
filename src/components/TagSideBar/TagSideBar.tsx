import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import type {Tag, TagSupababase} from '../../types/tag.ts';
import { getAllDataFromDatabase } from '../../services/getData.js';
import './TagSideBar.css'

export default function TagSideBar() {
    const [tags, setTags] = useState<TagSupababase[] | undefined>(undefined);

    useEffect(() => {
        getAllDataFromDatabase("tags")
            .then((data) => {
                setTags(data);
            }) 
    },[])

    
    return (
        <aside className='tagsidebar'>
            <NavLink to="/" key="home" id="home" className='tagsidebar-item roboto-500' >
                <span>🤖</span>
                <p>Home</p>
            </NavLink>
            {tags && tags.map((tag) => {
                return (
                    <NavLink to={`/${tag.tag_slug}`} key={tag.id} className='tagsidebar-item roboto-500' >
                        <span>🤖</span>
                        <p>{tag.name}</p>
                    </NavLink>
                )
            })}
        </aside>
    )

}