import React, { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth } from "../../firebase.init";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const createUser = async (email, password) => {
    setLoading(true);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    setUser(userCredential.user);
    setLoading(false);
    return userCredential.user;
  };

  const signInUser = async (email, password) => {
    setLoading(true);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    setUser(userCredential.user);
    setLoading(false);
    return userCredential.user;
  };

  const signOutUser = async () => {
    setLoading(true);
    await signOut(auth);
    setUser(null);
    sessionStorage.clear(); // clear sessionStorage on logout
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, createUser, signInUser, signOutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
