import {
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getAuthErrorMessage } from "./errors";

export async function registerUser({ name, email, password }) {
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(user, { displayName: name });
    return { user };
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }
}

export async function loginUser({ email, password, rememberMe = false }) {
  try {
    await setPersistence(
      auth,
      rememberMe ? browserLocalPersistence : browserSessionPersistence,
    );

    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return { user };
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }
}

export async function logoutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }
}

export async function resetPassword({ email }) {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }
}
