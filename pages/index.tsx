import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import Loader from '../components/Loader'
import toast from 'react-hot-toast'

const Home = () => {
  return (
    <main>
      <Loader show />
      <button onClick={() => toast.success('Im a toast!')}>Toast me</button>
    </main>
  )
}

export default Home
