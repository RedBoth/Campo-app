import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB6i9Pr3ttkDQErJd8ZVvsvGveXPHi_3DI",
  authDomain: "lotepro.firebaseapp.com",
  projectId: "lotepro",
  storageBucket: "lotepro.firebasestorage.app",
  messagingSenderId: "72955952727",
  appId: "1:72955952727:web:fcad0499417ca2ebb06d12"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
//Exportar los servicios
//Base de datos
export const db =  getFirestore(app);
//Sistema de autenticación
export const auth = getAuth(app);