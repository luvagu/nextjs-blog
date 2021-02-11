import styles from '../../styles/Admin.module.css'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { auth, firestore, serverTimeStamp } from '../../lib/firebase'
import AuthCheck from '../../components/AuthCheck'
import Metatags from '../../components/Metatags'
import { useForm } from 'react-hook-form'
import ReactMarkdown from 'react-markdown'
import toast from 'react-hot-toast'
import Link from 'next/link'
import ImageUploader from '../../components/ImageUploader'

function PostManager() {
    const [preview, setPreview] = useState(false)

    const router = useRouter()
    const { slug } = router.query

    const postRef = firestore.collection('users').doc(auth.currentUser.uid).collection('posts').doc(slug)
    const [post] = useDocumentData(postRef)

    return (
        <main className={styles.container}>
            {post && (
                <>
                    <section>
                        <h1>{post.title}</h1>
                        <p>ID: {post.slug}</p>

                        <PostForm defaultValues={post} postRef={postRef} preview={preview} />
                    </section>

                    <aside>
                        <h3>Tools</h3>
                        <button onClick={() => setPreview(!preview)}>
                            {preview ? 'Edit' : 'Preview'}
                        </button>
                        <Link href={`/${post.username}/${post.slug}`}>
                            <button className="btn-blue">Live view</button>
                        </Link>
                    </aside>
                </>
            )}
        </main>
    )
}

function PostForm({ defaultValues, postRef, preview }) {
    const { register, handleSubmit, reset, watch, formState, errors } = useForm({ defaultValues, mode: 'onChange' })

    const { isDirty, isValid } = formState


    const updateForm = async ({ content, published }) => {
        try {
            await postRef.update({
                content,
                published,
                updatedAt: serverTimeStamp()
            })

            reset({ content, published })

            toast.success('Post updated successfully!')
        } catch (error) {
            toast.error('Ooops. Error updating the post!')
            console.log(error.message)
        }
    }

    return (
        <form onSubmit={handleSubmit(updateForm)}>
            {preview && (
                <div className="card">
                    <ReactMarkdown>{watch('content')}</ReactMarkdown>
                </div>
            )}

            <div className={preview ? styles.hidden : styles.controls}>
                <ImageUploader />

                <textarea name="content" ref={register({
                    maxLength: { value: 20000, message: 'Content is too long!' },
                    minLength: { value: 10, message: 'Content is too short!' },
                    required: { value: true, message: 'Content is required!' }
                })}></textarea>

                {errors.content && (<p className="text-danger">{errors.content.message}</p>)}

                <fieldset>
                    <input 
                        className={styles.checkbox} 
                        type="checkbox" 
                        name="published" 
                        id="published" 
                        ref={register} 
                    />
                    <label htmlFor="published">Published</label>
                </fieldset>

                <button type="submit" className="btn-green" disabled={!isDirty || !isValid}>
                    Save Changes
                </button>
            </div>
        </form>
    )
}

const AdminPostEdit = () => {
    return (
        <AuthCheck>
            <Metatags title='Edit Post' />
            <PostManager />
        </AuthCheck>
    )
}

export default AdminPostEdit