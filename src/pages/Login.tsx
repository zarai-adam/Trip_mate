import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/lib/validations";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/Toast";
import Logo from "@/components/Logo";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error"; isVisible: boolean }>({
    message: "",
    type: "success",
    isVisible: false
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (toast.isVisible) {
      const timer = setTimeout(() => {
        setToast(prev => ({ ...prev, isVisible: false }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast.isVisible]);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Invalid credentials");
      }
      
      setToast({
        message: "Welcome back! Exploration awaits.",
        type: "success",
        isVisible: true
      });
      
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
      
      const { role, status } = result.user;
      
      setTimeout(() => {
        if (role === "ADMIN") {
          navigate("/admin/dashboard", { replace: true });
        } else if (role === "GUIDE") {
          if (status === "ACTIVE") {
            navigate("/guide/dashboard", { replace: true });
          } else {
            navigate("/guide/application", { replace: true });
          }
        } else if (role === "EXPLORER") {
          navigate("/explore", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      }, 800);
    } catch (err: any) {
      console.error(err);
      setToast({
        message: err.message || "Login failed. Please check your credentials.",
        type: "error",
        isVisible: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-offwhite flex items-center justify-center p-4">
      <Toast 
        message={toast.message} 
        type={toast.type} 
        isVisible={toast.isVisible} 
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))} 
      />
      
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-sleek border border-sage/10 p-8 md:p-12">
        <div className="flex flex-col items-center text-center mb-8">
          <Logo className="mb-6" />
          <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
          <p className="text-gray-500">Pick up where you left off.</p>
          
          <div className="mt-4 p-4 bg-sage/5 rounded-2xl text-[10px] text-gray-400 font-medium uppercase tracking-widest text-left">
            <span className="font-bold text-forest">Demo Accounts:</span><br/>
            Admin: admin@tripmate.app / Admin123!<br/>
            Explorer: alex@tripmate.app / Explorer123!
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-forest ml-1">Email</label>
            <input 
              {...register("email")}
              className="w-full bg-offwhite border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-sage/20 focus:outline-none transition-all"
              placeholder="hello@example.com"
            />
            {errors.email && <p className="text-red-500 text-xs ml-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-forest ml-1">Password</label>
            <input 
              {...register("password")}
              type="password"
              className="w-full bg-offwhite border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-sage/20 focus:outline-none transition-all"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-500 text-xs ml-1">{errors.password.message}</p>}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-100 text-forest focus:ring-forest" />
              <span>Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-sm font-bold text-forest">Forgot password?</Link>
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-14 bg-forest hover:bg-forest/90 text-white rounded-2xl font-bold text-lg shadow-xl shadow-forest/10 transition-all flex items-center justify-center"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "Log in"}
          </Button>
        </form>

        <div className="mt-8 text-center pt-8 border-t border-gray-100">
          <p className="text-gray-500 font-medium">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-forest font-bold underline underline-offset-4">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
