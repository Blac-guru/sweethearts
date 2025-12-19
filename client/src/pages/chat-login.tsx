import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Card } from "@/components/ui/card.jsx";
import { Label } from "@/components/ui/label.jsx";
import { useToast } from "@/hooks/use-toast";
import { Loader2, MessageSquare, Mail, Lock } from "lucide-react";
import { validateChatUser } from "@/lib/chat-api.js";

interface LoginResponse {
  id: string;
  email?: string;
  phoneNumber?: string;
  message: string;
}

export default function ChatLoginPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in and valid
    const checkAuth = async () => {
      const isValid = await validateChatUser();
      if (isValid) {
        setLocation("/chats");
      }
    };
    checkAuth();
  }, [setLocation]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailOrPhone.trim() || !password.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter your email/phone and password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const apiBase = import.meta.env.VITE_API_BASE || "http://localhost:5000";
      const response = await fetch(`${apiBase}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailOrPhone: emailOrPhone.trim(),
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
      }

      const data: LoginResponse = await response.json();

      // Store chat user ID in localStorage
      localStorage.setItem("chatUserId", data.id);

      toast({
        title: "Success",
        description: "Logged in successfully!",
      });

      // Redirect to chats page
      setLocation("/chats");
    } catch (err: any) {
      console.error("[ChatLogin] Error:", err);
      toast({
        title: "Login Failed",
        description: err.message || "Failed to login. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="p-8 shadow-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <MessageSquare className="h-8 w-8 text-pink-500" />
              <h1 className="text-3xl font-bold text-foreground">Sweetheart</h1>
            </div>
            <p className="text-muted-foreground">
              Sign in to your chat account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email/Phone Input */}
            <div className="space-y-2">
              <Label htmlFor="emailOrPhone">Email or Phone Number</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="emailOrPhone"
                  type="text"
                  placeholder="you@example.com or +254123456789"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-2 h-11"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-muted"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-muted-foreground">
                  New to Sweetheart?
                </span>
              </div>
            </div>

            {/* Sign Up Link */}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setLocation("/chat-register")}
              disabled={isLoading}
            >
              Create an Account
            </Button>
          </form>

          {/* Demo Note */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
            <p className="font-semibold mb-1">Demo Mode</p>
            <p>
              This is a simple authentication system. OTP verification will be
              added later.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
