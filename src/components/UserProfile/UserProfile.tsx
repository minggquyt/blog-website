
import './UserProfile.css'

export default function UserProfile(){
    return (
        <div className='userprofile'>
            <div className="userprofile--header">

            </div>
            <div className="userprofile--body">
                <div className="userprofile--bodycontent">
                    <div className="userprofile--bodycontent--header">
                        <div className="userprofile--bodycontent--header--user">
                            <img src="/images/users/user-1.png" width="200px" height="200px" alt="" />
                            <div className="userprofile--bodycontent--header--userinfo">
                                <h1 className='userprofile--bodycontent--header--username roboto-500'>Hữu Khang</h1>
                                <p className='userprofile--bodycontent--header--userdescription roboto-300'>Software enginneer</p>
                                <p className='userprofile--bodycontent--header--userfollower roboto-300'>14k Followers</p>
                            </div>
                        </div>
                        <button className='roboto-500'>Follow</button>
                    </div>
                    <div className="userprofile--bodycontent--body">
                        <div className="userprofile--bodycontent--body-leftcontainer">
                        </div>
                        <div className="userprofile--bodycontent--body--rightcontainer">

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}