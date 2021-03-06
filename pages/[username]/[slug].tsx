import Link from 'next/link'
import { GetStaticProps, GetStaticPaths } from 'next'
import styles from '../../styles/Post.module.css'
import PostContent from '../../components/PostContent'
import { firestore, getUserWithUsername, postToJSON } from '../../lib/firebase'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import Metatags from '../../components/Metatags'
import AuthCheck from '../../components/AuthCheck'
import LikeButton from '../../components/LikeButton'

export const getStaticPaths: GetStaticPaths = async () => {
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

export const getStaticProps: GetStaticProps = async ({ params }) => {
    try {
        const { username, slug } = params
        const userDoc = await getUserWithUsername(username as string)

        let postData
        let path

        if (userDoc) {
            const postRef = userDoc.ref.collection('posts').doc(slug as string)
            
            postData = postToJSON(await postRef.get())
            path = postRef.path         
        }

        return {
            props: { postData, path },
            revalidate: 5000
        }
    } catch (error) {
        console.log(error.message)        
    }
}

const Post = ({ postData, path }) => {
    const postRef = firestore.doc(path as string)
    const [realtimePost] = useDocumentData(postRef)
    const post = realtimePost || postData

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