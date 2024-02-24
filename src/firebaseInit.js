import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAYTQaDFKMxF3hYtT9zJlhYQhoS_tsdfEM',
  authDomain: 'attendance-management-28cf4.firebaseapp.com',
  projectId: 'attendance-management-28cf4',
  storageBucket: 'attendance-management-28cf4.appspot.com',
  messagingSenderId: '381795078240',
  appId: '1:381795078240:web:d271b29e13ed2e4f573305'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

// ローカルエミュレーターの設定
if (location.hostname === 'localhost') {
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(firestore, 'localhost', 8080);
}

export { auth, firestore };
