import '../styles/globals.css'

import { useUserData } from '../lib/hooks'
import { UserContext } from '../lib/context'

import Navbar from '../components/Navbar'
import { Toaster } from 'react-hot-toast'


const MyApp = ({ Component, pageProps }) => {
  const userData = useUserData()
  
  return (
    <UserContext.Provider value={userData}>
      <Toaster />
      <Navbar />
      <Component {...pageProps} />
    </UserContext.Provider>
  )
}

export default MyApp
