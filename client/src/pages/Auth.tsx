import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Wallet, Loader2 } from "lucide-react";
import { useLogin, useSignup, useUser } from "@/hooks/use-auth";

const authSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type AuthFormData = z.infer<typeof authSchema>;

export default function Auth() {
  const [, setLocation] = useLocation();
  const { data: user } = useUser();
  const [isLogin, setIsLogin] = useState(true);
  
  const login = useLogin();
  const signup = useSignup();

  const { register, handleSubmit, formState: { errors } } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema)
  });

  if (user) {
    setLocation("/dashboard");
    return null;
  }

  const onSubmit = async (data: AuthFormData) => {
    try {
      if (isLogin) {
        await login.mutateAsync(data);
      } else {
        await signup.mutateAsync(data);
      }
      setLocation("/dashboard");
    } catch (err) {
      // Error is handled by mutations but we can show local toast if needed
      console.error(err);
    }
  };

  const isPending = login.isPending || signup.isPending;
  const errorMsg = login.error?.message || signup.error?.message;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md glass-panel p-8 sm:p-10 rounded-3xl z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 mb-4">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-center">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-muted-foreground mt-2 text-center">
            {isLogin ? "Enter your credentials to access your insights." : "Start your journey to financial intelligence."}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2 text-foreground">Username</label>
            <input 
              {...register("username")}
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
              placeholder="e.g. alexfinance"
            />
            {errors.username && <p className="text-destructive text-xs mt-1 font-medium">{errors.username.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-foreground">Password</label>
            <input 
              type="password"
              {...register("password")}
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-destructive text-xs mt-1 font-medium">{errors.password.message}</p>}
          </div>

          <button 
            type="submit"
            disabled={isPending}
            className="w-full py-3.5 mt-2 rounded-xl font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? "Sign In" : "Create Account")}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="font-bold text-primary hover:text-accent transition-colors"
          >
            {isLogin ? "Sign up here" : "Sign in here"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
