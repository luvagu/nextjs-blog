import AuthCheck from "../../components/AuthCheck"

const AdminPostPage = (props) => {
    return (
        <main>
            <AuthCheck>
                Hello
            </AuthCheck>
        </main>
    )
}

export default AdminPostPage
