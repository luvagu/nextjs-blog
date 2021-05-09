import { useCallback, useContext, useEffect, useState } from 'react'
import { UserContext } from '../lib/context'
import { auth, firestore, googleAuthProvider } from '../lib/firebase'
import debounce from 'lodash.debounce'
import Link from 'next/link'
import Metatags from '../components/Metatags'

// Sign in with Google button
function SignInButton() {
    const signInWithGoogle = async () => {
        try {
            await auth.signInWithPopup(googleAuthProvider)
        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <>
            <button className="btn-google" onClick={signInWithGoogle}>
                <img src={'/google.png'} width="30px" alt="google-logo" /> Sign In with Google
            </button>
            <button onClick={() => auth.signInAnonymously()}>
                Sign In Anonymously
            </button>
        </>
    )
}

// Sign out button
function SignOutButton() {
    return (
        <>
            <button onClick={() => auth.signOut()}>Sign Out</button>
            <Link href="/admin">
                <button className="btn-blue">My posts</button>
            </Link>
        </>
    )
}

// Username form
function UsernameForm() {
    const [formValue, setFormValue] = useState('')
    const [isValid, setIsValid] = useState(false)
    const [loading, setLoading] = useState(false)

    const { user, username } = useContext(UserContext)

    const handleChange = (e) => {
        // Force form value typed in to match correct format
        const value = e.target.value.toLowerCase()
        const regex = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/

        // Only set form value if length is < 3 OR it passes regex
        if (value.length < 3) {
            setFormValue(value)
            setIsValid(false)
            setLoading(false)
        }

        if (regex.test(value)) {
            setFormValue(value)
            setIsValid(false)
            setLoading(true)
        }
    }

    // Listen for the formValue changes
    useEffect(() => {
        checkUsername(formValue)
    }, [formValue])

    // Hit the database for username match after each debounce
    // useCallback is required for debounce to work
    const checkUsername = useCallback(debounce(async (username) => {
        try {
            if (username.length >= 3) {
                const ref = firestore.doc(`usernames/${username}`)
                const { exists } = await ref.get()
                // console.log('Firestore read executed')
                setIsValid(!exists)
                setLoading(false)
            }
        } catch (error) {
            console.log(error.message)
        }
    }, 500), [])

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            // Create refs for both documents
            const userDoc = firestore.doc(`users/${user.uid}`)
            const usernameDoc = firestore.doc(`usernames/${formValue}`)

            // Commit both docs together as a batch write
            const batch = firestore.batch()
            batch.set(userDoc, { username: formValue, photoURL: user.photoURL, displayName: user.displayName })
            batch.set(usernameDoc, { uid: user.uid })
            
            await batch.commit()
        } catch (error) {
            console.log(error.message)
        }
    }

    const UsernameMessage = ({ username, isValid, loading }) => {
        if (loading) {
            return (<p>Checking...</p>)
        } else if (isValid) {
            return (<p className="text-success">{username} is available!</p>)
        } else if (username && !isValid) {
            return (<p className="text-danger">{username} is already taken!</p>)
        } else {
            return (<p></p>)
        }
    }

    return (
        !username && (
            <section>
                <h3>Choose Username</h3>
                <form onSubmit={handleSubmit}>
                    <input name="username" placeholder="username" value={formValue} onChange={handleChange} />

                    <UsernameMessage username={formValue} isValid={isValid} loading={loading} />

                    <button type="submit" className="btn-green" disabled={!isValid}>
                        Choose
                    </button>

                    <h3>Debug State</h3>
        
                    <div>
                        Username: {formValue} <br/>
                        Loading: {loading.toString()} <br/>
                        Username Valid: {isValid.toString()}
                    </div>
                </form>
            </section>
        )
    )
}

const Enter = () => {
    const { user, username } = useContext(UserContext)

    // 1. User signed out <SignInButton />
    // 2. User signed in <UsernameForm />
    // 3. User signed in, has username <SignOutButton />
    return (
        <main>
            <Metatags title="Sign In or Sign Up" description="Sign In or Sign Up to start writing posts!" />
            {user ? !username ? <UsernameForm /> : <SignOutButton /> : <SignInButton />}        
        </main>
    )
}

export default Enter