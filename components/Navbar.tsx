import { useContext } from 'react'
import { UserContext } from '../lib/context'
import Link from 'next/link'
import { auth } from '../lib/firebase'
import { useRouter } from 'next/router'

const Navbar = () => {
    const { user, username } = useContext(UserContext)
    const router = useRouter()

    const redirectOnSignOut = () => {
        router.push(`/enter`)
        auth.signOut()
    }
    
    return (
        <nav className="navbar">
            <ul>
                <li>
                    <Link href="/">
                        <button className="btn-logo">NEXT BLOG</button>
                    </Link>
                </li>
                {username 
                    ? (
                        <>
                            <li className="push-left">
                                <button onClick={() => redirectOnSignOut()}>Sign Out</button>
                            </li>
                            <li>
                                <Link href="/admin">
                                    <button className="btn-blue">My Posts</button>
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
                                    <button className="btn-blue">Sign In</button>
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
