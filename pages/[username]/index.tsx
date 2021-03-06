import { GetServerSideProps } from 'next'
import UserProfile from '../../components/UserProfile'
import PostsFeed from '../../components/PostsFeed'
import { getUserWithUsername, postToJSON } from '../../lib/firebase'
import Metatags from '../../components/Metatags'

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
    try {
        const { username } = query

        const userDoc = await getUserWithUsername(username as string)

        // If no user, short circuit to 404 page
        if (!userDoc) {
            return {
                notFound: true
            }
        }

        // JSON serialized data
        let user = null
        let posts = null

        if (userDoc) {
            user = userDoc.data()
            const postsQuery = userDoc.ref
                .collection('posts')
                .where('published', '==', true)
                .orderBy('createdAt', 'desc')
                .limit(5)

            posts = (await postsQuery.get()).docs.map(postToJSON)
        }

        // Will be passed to the page component as props
        return {
            props: { user, posts }
        }
    } catch (error) {
        console.log(error.message)
    }
}

const UserProfilePage = ({ user, posts }) => {
    return (
        <main>
            <Metatags title={`@${user.username}'s Posts`} />
            <UserProfile user={user} />
            <PostsFeed posts={posts} />
        </main>
    )
}

export default UserProfilePage