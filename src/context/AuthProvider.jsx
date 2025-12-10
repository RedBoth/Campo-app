import { useState, useEffect, useContext } from "react";
import AuthContext from "./AuthContext";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase-config";
import LoadingSpinner from "../components/ui/LoadingSpinner";

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
          const userData = userSnap.exists() ? userSnap.data() : {};

          setCurrentUser({
            uid: user.uid,
            email: user.email,
            photoURL: user.photoURL,
            ...userData,
          });

        } catch (error) {
          console.error("Error cargando datos del usuario:", error);
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const signup = async (email, password, nombre, apellido) => {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCred.user;

    await setDoc(doc(db, "users", user.uid), {
      nombre,
      apellido,
      email,
      createdAt: new Date(),
    });

    return user;
  };

  const logout = () => signOut(auth);

  const value = { currentUser, login, signup, logout, loading };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <LoadingSpinner size="lg" color="border-primary" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}