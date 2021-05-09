import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
}

export const auth = firebase.auth()
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider()

export const firestore = firebase.firestore()
export const storage = firebase.storage()

export const fromMillis = firebase.firestore.Timestamp.fromMillis
export const serverTimeStamp = firebase.firestore.FieldValue.serverTimestamp
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED
export const increment = firebase.firestore.FieldValue.increment

// Helper functions

/**
 * Gets a users/{uid} document with username
 * @param {string} username
 */
 export const getUserWithUsername = async (username: string) => {
	 const userRef = firestore.collection('users')
	 const query = userRef.where('username', '==', username).limit(1)
	 const userDoc = (await query.get()).docs[0]
	 return userDoc
 }

 /**
  * Converts a firestore document to JSON
  * @param {DocumentSnapshot} doc
  */
export const postToJSON = (doc) => {
	const data = doc.data()
	return {
		...data,
		// Gotcha! firestore timestamps NOT serializable to JSON
		createdAt: data.createdAt.toMillis(),
		updatedAt: data.updatedAt.toMillis()
	}
}
