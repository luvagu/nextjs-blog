import styles from '../../styles/Post.module.css'
import PostContent from '../../components/PostContent'
import { firestore, getUserWithUsername, postToJSON } from '../../lib/firebase'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import Metatags from '../../components/Metatags'
import AuthCheck from '../../components/AuthCheck'
import LikeButton from '../../components/LikeButton'
import Link from 'next/link'

export const getStaticProps = async ({ params }) => {
    try {
        const { username, slug } = params
        const userDoc = await getUserWithUsername(username)

        let post
        let path

        if (userDoc) {
            const postRef = userDoc.ref.collection('posts').doc(slug)
            
            post = postToJSON(await postRef.get())
            path = postRef.path         
        }

        return {
            props: { post, path },
            revalidate: 5000
        }
    } catch (error) {
        console.log(error.message)        
    }
}

export const getStaticPaths = async () => {
    try {
        // @ToDo: Improve by using Admin SDK to select empty docs
        const snapshot = await firestore.collectionGroup('posts').get()

        const paths = snapshot.docs.map((doc) => {
            const { username, slug } = doc.data()

            return {
                params: { username, slug }
            }
        })

        return {
            // must be in this form
            // paths: [
            //     { params: { username, slug } }
            // ]
            paths,
            fallback: 'blocking'
        }
    } catch (error) {
        console.log(error.message)  
    }
}

const Post = (props) => {
    const postRef = firestore.doc(props.path)
    const [realtimePost] = useDocumentData(postRef)
    const post = realtimePost || props.post

    return (
        <main className={styles.container}>
            <Metatags title={`${post.title} by @${post.username}`} />
            <section>
                <PostContent post={post} />
            </section>

            <aside className="card">
                <p>
                    <strong>{post.likesCount || 0} 👍</strong>
                </p>

                <AuthCheck 
                    fallback={(
                        <Link href="/enter">
                            <button className="btn-blue">👍 Sign In</button>
                        </Link>
                    )}
                >
                    <LikeButton postRef={postRef} />
                </AuthCheck>
            </aside>
        </main>
    )
}

export default Post