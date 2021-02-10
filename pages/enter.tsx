import { useContext, useState } from 'react'
import { UserContext } from '../lib/context'
import { auth, firestore, googleAuthProvider } from '../lib/firebase'
import debounce from 'lodash.debounce'

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
        <button className="btn-google" onClick={signInWithGoogle}>
            <img src={'/google.png'} alt="google-logo" /> Sign In with Google
        </button>
    )
}

// Sign out button
function SignOutButton() {
    return (<button onClick={() => auth.signOut()}>Sign Out</button>)
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
        const regex = /^(?=[a-za-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/

        // Listen for the formValue changes
        useEffect(() => {
            checkUsername(formValue)
        }, [formValue])

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

    const checkUsername = debounce(async (username) => {
        if (username.length >= 3) {
            const ref = firestore.doc(`usernames/${username}`)
            const { exists } = await ref.get()
            console.log('Firestore read executed')
            setIsValid(!exists)
            setLoading(false)
        }
    }, 500)

    return (
        !username && (
            <section>
                <h3>Choose Username</h3>
                <form onSubmit={handleSubmit}>
                    <input name="username" placeholder="username" value={formValue} onChange={handleChange} />

                    <button type="submit" className="btn-green" disabled={!isValid}>
                        Choose
                    </button>

                    <h3>Debug State</h3>
                    <div>
                        <pre>
                            Username: {formValue}
                            Loading: {loading.toString()}
                            Username Valid: {isValid.toString()}
                        </pre>
                    </div>

                </form>
            </section>
        )
    )
}

const Enter = ({ }) => {
    const { user, username } = useContext(UserContext)

    // 1. User signed out <SignInButton />
    // 2. User signed in <UsernameForm />
    // 3. User signed in, has username <SignOutButton />
    return (
        <main>
            {user ? !username ? <UsernameForm /> : <SignOutButton /> : <SignInButton />}        
        </main>
    )
}

export default Enter