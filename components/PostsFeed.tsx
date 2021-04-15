import Link from "next/link"

function PostItem({ post, admin = false }) {
    // Native method to calc word count and read time
    const wordCount = post?.content.trim().split(/\s+/g).length
    const minutesToRead = (wordCount / 100 + 1).toFixed(0)  

    return (
        <div className="card">
            <Link href={`/${post.username}`}>
                <a>
                    <strong>By @{post.username}</strong>
                </a>
            </Link>
            <Link href={`/${post.username}/${post.slug}`}>
                <h2>
                    <a>{post.title}</a>
                </h2>
            </Link>

            <footer>
                <span>
                    {wordCount} words. {minutesToRead} min read 
                </span>
                <span className="push-left">👍 {post.likesCount || 0} Likes</span>
            </footer>

            {/* If admin view, show extra controls for user */}
            {admin && (
                <>
                    <Link href={`/admin/${post.slug}`}>
                        <h3>
                            <button className="btn-blue">Edit</button>
                        </h3>
                    </Link>

                    {post.published ? <p className="text-success">Live</p> : <p className="text-danger">Unpublished</p>}
                </>
            )}
        </div>
    )
}

const PostsFeed = ({ posts, admin=false }) => {
    return posts ? posts.map((post) => (<PostItem key={post.slug} post={post} admin={admin} />)) : null
}

export default PostsFeed