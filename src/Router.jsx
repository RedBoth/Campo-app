import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthProvider";

import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";

export default function Router() {
  const { currentUser } = useAuth();

  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={ currentUser ? <Navigate to="/campos" /> : <Navigate to="/login" /> }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        <Route
          path="/campos"
          element={
            <ProtectedRoute user={currentUser}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}