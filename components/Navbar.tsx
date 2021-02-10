import { useContext } from 'react'
import { UserContext } from '../lib/context'
import Link from 'next/link'

const Navbar = () => {
    const { user, username } = useContext(UserContext)
    
    return (
        <nav className="navbar">
            <ul>
                <li>
                    <Link href="/">
                        <button className="btn-logo">FEED</button>
                    </Link>
                </li>
                {username 
                    ? (
                        <>
                            <li className="push-left">
                                <button onClick={null}>Sign Out</button>
                            </li>
                            <li>
                                <Link href="/admin">
                                    <button className="btn-blue">Write Posts</button>
                                </Link>
                            </li>
                            <li>
                                <Link href={`/${username}`}>
                                    <img src={user?.photoURL || '/hacker.png'} alt="profile-icon" />
                                </Link>
                            </li>
                        </>
                    ) 
                    : (
                        <>
                            <li>
                                <Link href={`/enter`}>
                                    <button className="btn-blue">Log In</button>
                                </Link>
                            </li>
                        </>
                    )
                }
            </ul>
        </nav>
    )
}


export default Navbar