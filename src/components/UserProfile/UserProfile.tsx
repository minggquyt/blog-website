import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getUsersInfoWithIdFromDatabase} from '../../services/getData';
import type { UserDetail } from '../../types/index.ts';
import { mapToUserDetail } from '../../mapper/mapToUserDetail.tsx';
import PostList from '../PostList/PostList.tsx';
import './UserProfile.css'

export default function UserProfile() {
    const { userId } = useParams();
    const [userInfo, setUserInfo] = useState<UserDetail | undefined>(undefined);

    useEffect(() => {

        if(userId != undefined){
            getUsersInfoWithIdFromDatabase(userId)
            .then((data) => {
                if (data != undefined) {
                    const filteredData: UserDetail | undefined  = mapToUserDetail(data);
                    setUserInfo(filteredData);
                }
                else{
                    console.warn("user profile data is undefined !");
                }
            })
        }

    }, [userId]);


    return (
        <div className='userprofile'>
            {
                userInfo && userId ?
                    <>
                        <div className="userprofile--header">
                            <img src={userInfo.background} alt="" />
                        </div>
                        <div className="userprofile--body">
                            <div className="userprofile--bodycontent">
                                <div className="userprofile--bodycontent--header">
                                    <div className="userprofile--bodycontent--header--user">
                                        <img src={userInfo.basicInfo.avatar.url} width="200px" height="200px" alt="" />
                                        <div className="userprofile--bodycontent--header--userinfo">
                                            <h1 className='userprofile--bodycontent--header--username roboto-500'>{userInfo.basicInfo.username}</h1>
                                            <p className='userprofile--bodycontent--header--userfollower roboto-300'><span>{userInfo.basicInfo.followers.count} </span><span>{userInfo.basicInfo.followers.label}</span></p>
                                        </div>
                                    </div>
                                    <button className='roboto-500'>Follow</button>
                                </div>
                                <div className="userprofile--bodycontent--body">
                                    <div className="userprofile--bodycontent--body-leftcontainer">
                                        <div className="userprofile--bodycontent--body-leftcontainer--description roboto-300">
                                            <h1 className='roboto-500' >Introduction</h1>
                                            {
                                                userInfo.introduction.items.map((item) => {
                                                    return (
                                                        <p key={item.id} className={`userprofile--bodycontent--body-leftcontainer--description--userdefined-${item.id}`}>
                                                            <span className="material-symbols-outlined">
                                                                {item.icon}
                                                            </span>{item.value}
                                                        </p>
                                                    )
                                                })
                                            }
                                        </div>
                                        <div className="userprofile--bodycontent--body-leftcontainer--info roboto-300">
                                            {
                                                userInfo.statistics.items.map(item => {
                                                    return (
                                                        <p key={item.id} ><span className="material-symbols-outlined">
                                                            {item.icon}
                                                        </span><span>{item.value}</span>{item.label}</p>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                    <div className="userprofile--bodycontent--body--rightcontainer">
                                        <PostList
                                            type='author'
                                            value={userId}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                    : <div>Chưa có data</div>
            }
        </div>
    )
}