import './Header.css'

export default function Header() {
    return (
        <div className="header">
            <div className="header__leftcontent">
                <h1 className='roboto-500' >Logo</h1>
                <form action="">
                    <span className="material-symbols-outlined">
                        search
                    </span>
                    <input className='inter-300'  placeholder="Search..." type="text" />
                </form>
            </div>
            <div className="header__rightcontent">
                <a href="" className='roboto-300'>Login</a>
                <button className='roboto-400'>Create account</button>
            </div>
        </div>
    )
}