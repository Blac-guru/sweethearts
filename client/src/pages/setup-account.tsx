// src/pages/setup-account.tsx
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card.jsx";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form.jsx";
import { useToast } from "@/hooks/use-toast.js";
import { auth } from "@/lib/firebase.js";
import { apiRequest } from "@/lib/queryClient.js";
import { useAuthStore } from "@/store/useAuthStore.js";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export let globalToken = "";

// ✅ Schema with confirmPassword
const schema = z
  .object({
    username: z.string().email("Must be a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

const SLIDES = [
  {
    image:
      "https://i0.wp.com/exotickenya.date/wp-content/uploads/2017/01/11185929753_3303300733_b.jpg?resize=1200%2C800&ssl=1",
    title: "Your Favorite Courtesan On-Site",
    subtitle:
      "Connect with a charming companionship for a short or extended span",
  },
  {
    image:
      "https://afroculture.net/wp-content/uploads/2016/12/0lbstdR9J1t9yyrpo1_500.jpg",
    title: "Beyond Companionship",
    subtitle: "Discover massage therapists, tour guides, and lifestyle partners.",
  },
  {
    image:
      "https://cdn.shopify.com/s/files/1/0293/9277/files/03-25-25_Swim-Set-1_48_B25127_Yellow_ZSR_TK_JR_13-39-35_19481_SG.jpg?v=1743101159&width=1200&height=627",
    title: "Tailored For You",
    subtitle: "Find connections that match your needs — casual or professional.",
  },
];


export default function SetupAccountPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { username: "", password: "", confirmPassword: "" },
    mode: "onChange",
  });

  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  // Slideshow state
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => {
      setCurrentSlide((s) => (s + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(iv);
  }, []);

  // Watch fields for validation
  const password = form.watch("password");
  const confirmPassword = form.watch("confirmPassword");
  const passwordsMatch = isLogin || password === confirmPassword;

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      let userCred;

      if (isLogin) {
        // Login flow
        userCred = await signInWithEmailAndPassword(
          auth,
          data.username,
          data.password
        );
        toast({
          title: "Welcome back!",
          description: "You are now logged in.",
        });

        const token = await userCred.user.getIdToken();
        const rsp = await apiRequest("GET", `/api/hairdressers/me`, {}, token);
        const userData = await rsp.json();

        if (userData?.id) {
          setLocation(`/profile/${userData.id}`);
        } else {
          setLocation("/register/details");
        }
      } else {
        // Signup flow
        userCred = await createUserWithEmailAndPassword(
          auth,
          data.username,
          data.password
        );

        useAuthStore.getState().setUserEmail(userCred.user.email || null);
        toast({
          title: "Account created",
          description: "Continue to set up your details.",
        });

        globalToken = await userCred.user.getIdToken();

        setLocation("/register/details");
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      toast({
        title: isLogin ? "Login Failed" : "Account Setup Failed",
        description: err.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background slideshow */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${SLIDES[currentSlide].image})` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          />
        </AnimatePresence>
        {/* overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 grid md:grid-cols-2 gap-8 items-center">
        {/* Left: form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="w-full bg-white/15 backdrop-blur-md border border-white/10 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl text-white">
                {isLogin ? "Log In to Your Account" : "Create Your Account"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Email</FormLabel>
                        <FormControl>
                          <Input
                            className="bg-white/80"
                            placeholder="you@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Password */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            className="bg-white/80"
                            placeholder="Enter password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Confirm Password (only in signup) */}
                  {!isLogin && (
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">
                            Confirm Password
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              className="bg-white/80"
                              placeholder="Re-enter password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Submit */}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={
                      loading || !form.formState.isValid || !passwordsMatch
                    }
                  >
                    {loading ? (
                      <span className="inline-flex items-center">
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {isLogin ? "Logging in..." : "Creating..."}
                      </span>
                    ) : isLogin ? (
                      "Log In"
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </Form>

              {/* Switch mode */}
              <div className="mt-3 text-sm text-white">
                {isLogin ? (
                  <>
                    Don’t have an account?{" "}
                    <button
                      onClick={() => setIsLogin(false)}
                      className="text-primary hover:underline"
                    >
                      Create one
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      onClick={() => setIsLogin(true)}
                      className="text-primary hover:underline"
                    >
                      Log in
                    </button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right: slide text */}
<div className="text-right text-white drop-shadow-lg">
  <AnimatePresence mode="wait">
    <motion.div
      key={currentSlide}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8 }}
    >
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
        {SLIDES[currentSlide].title}
      </h1>
      <p className="text-lg sm:text-xl md:text-2xl opacity-90">
        {SLIDES[currentSlide].subtitle}
      </p>
    </motion.div>
  </AnimatePresence>
</div>

      </div>
    </div>
  );
}
