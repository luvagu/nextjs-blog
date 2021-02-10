import Head from 'next/head'
import styles from '../styles/Home.module.css'

import Loader from '../components/Loader'

const Home = () => {
  return (
    <main>
      <Loader show />
    </main>
  )
}

export default Home
