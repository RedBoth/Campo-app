import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import LoadingSpinner from "../components/ui/LoadingSpinner";

export default function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" color="border-primary" />
      </div>
    );
  }

  if (!currentUser) return <Navigate to="/login" replace />;

  return children;
}