import { useDocument } from "react-firebase-hooks/firestore"
import { auth, firestore, increment } from "../lib/firebase"

// Allows a user to like a post
const LikeButton = ({ postRef }) => {
    // Listen to likes document for currently logged in user
    const likeRef = postRef?.collection('likes').doc(auth.currentUser.uid)
    const [likeDoc] = useDocument(likeRef)

    const addLike = async () => {
        try {
            const uid = auth.currentUser.uid
            const batch = firestore.batch()

            batch.update(postRef, { likesCount: increment(1) })
            batch.set(likeRef, { uid })

            await batch.commit()
        } catch (error) {
            console.log(error.message)
        }
    }

    const removeLike = async () => {
        try {
            const batch = firestore.batch()

            batch.update(postRef, { likesCount: increment(-1) })
            batch.delete(likeRef)

            await batch.commit()
        } catch (error) {
            console.log(error.message)
        }
    }

    return likeDoc?.exists 
        ? (<button onClick={removeLike}>👎 Unlike</button>)
        : (<button onClick={addLike}>👍 Like</button>) 
}

export default LikeButton
