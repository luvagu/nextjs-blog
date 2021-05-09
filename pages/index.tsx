import { useState } from 'react'
import { firestore, fromMillis, postToJSON } from '../lib/firebase'
import { GetServerSideProps } from 'next'
import Loader from '../components/Loader'
import PostsFeed from '../components/PostsFeed'
import Metatags from '../components/Metatags'

// Max posts to query per page
const LIMIT = 10

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const postsQuery = firestore
      .collectionGroup('posts')
      .where('published', '==', true)
      .orderBy('createdAt', 'desc')
      .limit(LIMIT)

    const posts = (await postsQuery.get()).docs.map(postToJSON)    

    // Will be passed to the page component as props
    return {
      props: { posts }
    }

  } catch (error) {
    console.log(error.message)
  }
}

const Home = (props) => {
  const [posts, setPosts] = useState(props.posts)
  const [loading, setLoading] = useState(false)
  const [postsEnd, setPostsEnd] = useState(false)

  const getMorePosts = async () => {
    try {
      setLoading(true)
      const last = posts[posts.length - 1]
      const cursor = typeof last.createdAt === 'number' ? fromMillis(last.createdAt) : last.createdAt

      const query = firestore
        .collectionGroup('posts')
        .where('published', '==', true)
        .orderBy('createdAt', 'desc')
        .startAfter(cursor)
        .limit(LIMIT)

      const newPosts = (await query.get()).docs.map((doc) => doc.data())

      setPosts(posts.concat(newPosts))
      setLoading(false)

      if (newPosts.length < LIMIT) {
        setPostsEnd(true)
      }

    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <main>
      <Metatags />

      <PostsFeed posts={posts} />

      {!loading && !postsEnd && (<button onClick={getMorePosts}>Load More</button>)}

      <Loader show={loading} />

      {postsEnd && 'You have reached the end!'}
    </main>
  )
}

export default Home
