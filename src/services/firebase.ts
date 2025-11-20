import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  GoogleAuthProvider,
  signInWithPopup,
  type User,
} from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getDatabase(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
});

export const SignIn = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const SignUp = async (email: string, password: string) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const SignOut = async () => {
  return await signOut(auth);
};

export const UpdatePassword = async (user: User, newPassword: string) => {
  return await updatePassword(user, newPassword);
};

export const SignInWithGoogle = async () => {
  try {
    // kalau popup error, ganti ke signInWithRedirect(auth, googleProvider)
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;
    return { user, token };
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    throw error;
  }
};
