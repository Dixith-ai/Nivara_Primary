import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Scan, ArrowLeft } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import logo from "@/logo/Nivara_logo.png";
import ForgotPasswordModal from "@/components/ForgotPasswordModal";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function Auth() {
  const { user, signIn, signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("signin");
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Sign In Form
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });

  // Sign Up Form
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      signInSchema.parse(signInData);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
        return;
      }
    }

    setLoading(true);
    const { error } = await signIn(signInData.email, signInData.password);
    
    if (error) {
      setError(error.message);
      toast({
        title: "Sign In Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    }
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      signUpSchema.parse(signUpData);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
        return;
      }
    }

    setLoading(true);
    const { error } = await signUp(signUpData.email, signUpData.password, signUpData.name);
    
    if (error) {
      setError(error.message);
      toast({
        title: "Sign Up Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Account Created!",
        description: "Please check your email to verify your account.",
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen animated-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl float"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-accent/20 to-primary/20 rounded-full blur-3xl float" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-white/70 hover:text-white mb-4 sm:mb-6 transition-colors duration-200">
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-base sm:text-lg">Back to Home</span>
          </Link>
          <Link to="/" className="flex items-center justify-center space-x-2 sm:space-x-3 mb-6 sm:mb-8 hover:opacity-80 transition-all duration-300 group">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden shadow-lg group-hover:neon-glow transition-all duration-300">
              <img src={logo} alt="NIVARA Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-3xl sm:text-4xl font-black text-gradient">NIVARA</span>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3 sm:mb-4">
            Welcome to NIVARA
          </h1>
          <p className="text-white/70 text-base sm:text-lg">
            Sign in to access your skin health dashboard
          </p>
        </div>

        <Card className="glass border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <CardHeader className="pb-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 glass border-white/10">
                <TabsTrigger value="signin" className="data-[state=active]:gradient-primary data-[state=active]:text-white transition-all duration-200 font-semibold">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:gradient-primary data-[state=active]:text-white transition-all duration-200 font-semibold">
                  Sign Up
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="mt-6 sm:mt-8">
                <CardTitle className="text-2xl sm:text-3xl font-black mb-2 sm:mb-3 text-white">Welcome Back</CardTitle>
                <CardDescription className="text-base sm:text-lg text-white/70">
                  Enter your credentials to access your account
                </CardDescription>
              </TabsContent>
              
              <TabsContent value="signup" className="mt-6 sm:mt-8">
                <CardTitle className="text-2xl sm:text-3xl font-black mb-2 sm:mb-3 text-white">Create Account</CardTitle>
                <CardDescription className="text-base sm:text-lg text-white/70">
                  Create a new account to get started with NIVARA
                </CardDescription>
              </TabsContent>
            </Tabs>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert className="mb-4" variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4 sm:space-y-6">
                  <div className="space-y-2 sm:space-y-3">
                    <Label htmlFor="signin-email" className="text-base sm:text-lg font-semibold text-white">Email Address</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signInData.email}
                      onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                      disabled={loading}
                      required
                      className="h-12 sm:h-14 text-base sm:text-lg border-2 border-white/20 focus:border-primary bg-white/5 text-white placeholder:text-white/50 transition-all duration-200 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <Label htmlFor="signin-password" className="text-base sm:text-lg font-semibold text-white">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="Enter your password"
                      value={signInData.password}
                      onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                      disabled={loading}
                      required
                      className="h-12 sm:h-14 text-base sm:text-lg border-2 border-white/20 focus:border-primary bg-white/5 text-white placeholder:text-white/50 transition-all duration-200 rounded-xl"
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm text-white/70 hover:text-white hover:underline transition-colors duration-200"
                    >
                      Forgot your password?
                    </button>
                  </div>
                  
                  <Button type="submit" className="w-full h-12 sm:h-14 text-base sm:text-lg font-bold gradient-primary hover:neon-glow shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-[1.02] btn-glow rounded-xl" disabled={loading}>
                    {loading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4 sm:space-y-6">
                  <div className="space-y-2 sm:space-y-3">
                    <Label htmlFor="signup-name" className="text-base sm:text-lg font-semibold text-white">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={signUpData.name}
                      onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                      disabled={loading}
                      required
                      className="h-12 sm:h-14 text-base sm:text-lg border-2 border-white/20 focus:border-primary bg-white/5 text-white placeholder:text-white/50 transition-all duration-200 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <Label htmlFor="signup-email" className="text-base sm:text-lg font-semibold text-white">Email Address</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                      disabled={loading}
                      required
                      className="h-12 sm:h-14 text-base sm:text-lg border-2 border-white/20 focus:border-primary bg-white/5 text-white placeholder:text-white/50 transition-all duration-200 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <Label htmlFor="signup-password" className="text-base sm:text-lg font-semibold text-white">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password"
                      value={signUpData.password}
                      onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                      disabled={loading}
                      required
                      className="h-12 sm:h-14 text-base sm:text-lg border-2 border-white/20 focus:border-primary bg-white/5 text-white placeholder:text-white/50 transition-all duration-200 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <Label htmlFor="signup-confirm-password" className="text-base sm:text-lg font-semibold text-white">Confirm Password</Label>
                    <Input
                      id="signup-confirm-password"
                      type="password"
                      placeholder="Confirm your password"
                      value={signUpData.confirmPassword}
                      onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                      disabled={loading}
                      required
                      className="h-12 sm:h-14 text-base sm:text-lg border-2 border-white/20 focus:border-primary bg-white/5 text-white placeholder:text-white/50 transition-all duration-200 rounded-xl"
                    />
                  </div>
                  <Button type="submit" className="w-full h-12 sm:h-14 text-base sm:text-lg font-bold gradient-primary hover:neon-glow shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-[1.02] btn-glow rounded-xl" disabled={loading}>
                    {loading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      <ForgotPasswordModal 
        isOpen={showForgotPassword} 
        onClose={() => setShowForgotPassword(false)} 
      />
    </div>
  );
}