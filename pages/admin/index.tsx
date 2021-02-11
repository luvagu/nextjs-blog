import styles from '../../styles/Admin.module.css'

import { useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { useCollection } from 'react-firebase-hooks/firestore'
import { auth, firestore, serverTimeStamp } from '../../lib/firebase'
import { UserContext } from '../../lib/context'
import kebabCase from 'lodash.kebabcase'

import AuthCheck from '../../components/AuthCheck'
import PostsFeed from '../../components/PostsFeed'
import toast from 'react-hot-toast'
import Metatags from '../../components/Metatags'

function CreateNewPost() {
    const router = useRouter()
    const { username } = useContext(UserContext)
    const [title, setTitle] = useState('')

    // Ensure slug is URL safe
    const slug = encodeURI(kebabCase(title))

    // Validate length
    const isValid = title.length > 3 && title.length < 100

    // Create a new post in firestore
    const createPost = async (e) => {
        e.preventDefault()

        try {
            const uid = auth.currentUser.uid
            const ref = firestore.collection('users').doc(uid).collection('posts').doc(slug)

            // Tip: give all fields a default value
            const data = {
                title,
                slug,
                uid,
                username,
                published: false,
                content: '# hello world!',
                createdAt: serverTimeStamp(),
                updatedAt: serverTimeStamp(),
                likesCount: 0
            }

            await ref.set(data)

            toast.success('Post Created')

            // Imperative navigation after doc is set
            router.push(`/admin/${slug}`)

        } catch (error) {
            toast.error('Ooops.. Error creating post')

            console.log(error.message)
        }
    }

    return (
        <form onSubmit={createPost}>
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My Awesome Article!"
                className={styles.input} 
            />
            <p>
                <strong>Slug:</strong> {slug}
            </p>
            <button type="submit" disabled={!isValid} className="btn-green">
                Create New Post
            </button>
        </form>
    )

}

function PostList() {
    const ref = firestore.collection('users').doc(auth.currentUser.uid).collection('posts')
    const query = ref.orderBy('createdAt')
    const [querySnapshot] = useCollection(query)
    const posts = querySnapshot?.docs.map((doc) => doc.data())

    return (
        <>
            <h1>Manage your Posts</h1>
            <PostsFeed posts={posts} admin />
        </>
    )
}

const AdminPostPage = (props) => {
    return (
        <main>
            <Metatags title='Create or Manage Posts' />
            <AuthCheck>
                <CreateNewPost /> 
                <PostList /> 
            </AuthCheck>
        </main>
    )
}

export default AdminPostPage
