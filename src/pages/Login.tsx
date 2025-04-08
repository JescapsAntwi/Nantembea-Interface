
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LoginForm from "@/components/LoginForm";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-health-700">Group5 - Natembea Health System</h1>
          <p className="text-muted-foreground mt-2">Hospital Record Management System</p>
        </div>
        
        <Card className="border-health-100">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
        
        <p className="mt-4 text-center text-sm text-muted-foreground">
          &copy; 2025 Group5 - Natembea Health Centre. All rights reserved.
        </p>
      </div>
    </div>
  );
}
