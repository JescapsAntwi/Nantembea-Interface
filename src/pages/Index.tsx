import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();

  // If user is logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/" replace />;
  }

  // Otherwise redirect to login
  return <Navigate to="/login" replace />;
};

export default Index;
