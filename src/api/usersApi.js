import { db, auth } from "../firebase-config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { updateProfile, sendPasswordResetEmail } from "firebase/auth";

/**
 * Obtiene los datos extendidos del usuario desde Firestore.
 * @param {string} uid - El ID del usuario.
 * @returns {Promise<Object|null>} Los datos del usuario o null si no existe doc.
 */
export const getUserProfile = async (uid) => {
    try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
        console.error("Error trayendo perfil:", error);
        throw error;
    }
};

/**
 * Actualiza tanto el perfil de Auth (displayName) como el documento en Firestore.
 * @param {object} user - El objeto currentUser de Auth.
 * @param {string} nombre 
 * @param {string} apellido 
 */
export const updateUserProfile = async (user, nombre, apellido) => {
    const fullName = `${nombre.trim()} ${apellido.trim()}`;

    // 1. Actualizar en Firebase Auth (Para que el Sidebar se actualice rápido)
    await updateProfile(user, {
        displayName: fullName,
    });

    // 2. Actualizar en Firestore (Para persistencia de datos estructurados)
    // Usamos setDoc con {merge: true} para crear si no existe o actualizar si existe
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        email: user.email,
        updatedAt: new Date()
    }, { merge: true });
};

/**
 * Envía el correo de recuperación de contraseña.
 * @param {string} email 
 */
export const resetUserPassword = async (email) => {
    await sendPasswordResetEmail(auth, email);
};