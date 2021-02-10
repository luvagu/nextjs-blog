import styles from '../../styles/Post.module.css'
import PostContent from '../../components/PostContent'
import { firestore, getUserWithUsername, postToJSON } from '../../lib/firebase'
import { useDocumentData } from 'react-firebase-hooks/firestore'

export const getStaticProps = async ({ params }) => {
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
}

export const getStaticPaths = async () => {
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
}

const Post = (props) => {
    return (
        <main>
            
        </main>
    )
}

export default Post