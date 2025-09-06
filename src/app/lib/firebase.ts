import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp, onSnapshot, query,
    orderBy,
    Timestamp,
} from 'firebase/firestore';


const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

console.log('Firebase Config:', firebaseConfig);

// Initialize Firebasess
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);
// export const analytics = getAnalytics(app);

interface user {
    name: string | null;
    email: string | null;
    image: string | null;
}

export async function sendMessage(roomId: string, user: user, text: string) {
    try {
        await addDoc(collection(db, 'chat-rooms', roomId, 'messages'), {
            uid: user.email,
            displayName: user.name,
            text: text.trim(),
            timestamp: serverTimestamp(),
        });
    } catch (error) {
        console.error(error);
    }
}

interface FirebaseMessage {
    id: string;
    uid: string; // user email as uid
    displayName: string;
    text: string;
    timestamp: string; // FirebaseFirestore.Timestamp
}

export function getMessages(roomId: string, callback: (messages: FirebaseMessage[]) => void) {
    return onSnapshot(
        query(
            collection(db, 'chat-rooms', roomId, 'messages'),
            orderBy('timestamp', 'asc')
        ),
        (querySnapshot) => {
            const messages = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as FirebaseMessage[];
            callback(messages);
        }
    );
}