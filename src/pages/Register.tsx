import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "@/lib/validations";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/Toast";
import Logo from "@/components/Logo";

export default function Register() {
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

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "EXPLORER",
    }
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Registration failed");
      
      setToast({
        message: "Account created! Redirecting to login...",
        type: "success",
        isVisible: true
      });
      
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      console.error(err);
      setToast({
        message: err.message || "Registration failed. Please try again.",
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
          <h1 className="text-3xl font-bold mb-2">Create an account</h1>
          <p className="text-gray-500">Join our community of authentic travelers.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-forest ml-1">First Name</label>
              <input 
                {...register("firstName")}
                className="w-full bg-offwhite border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-sage/20 focus:outline-none transition-all"
                placeholder="John"
              />
              {errors.firstName && <p className="text-red-500 text-xs ml-1">{errors.firstName.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-forest ml-1">Last Name</label>
              <input 
                {...register("lastName")}
                className="w-full bg-offwhite border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-sage/20 focus:outline-none transition-all"
                placeholder="Doe"
              />
              {errors.lastName && <p className="text-red-500 text-xs ml-1">{errors.lastName.message}</p>}
            </div>
          </div>

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

          <div className="grid grid-cols-2 gap-4">
            <label className="relative cursor-pointer">
              <input 
                type="radio" 
                {...register("role")}
                value="EXPLORER" 
                className="peer sr-only"
              />
              <div className="p-4 rounded-2xl border border-gray-100 bg-offwhite text-center peer-checked:border-sage peer-checked:bg-sage/10 peer-checked:text-forest transition-all">
                <span className="text-sm font-bold">Explorer</span>
              </div>
            </label>
            <label className="relative cursor-pointer">
              <input 
                type="radio" 
                {...register("role")}
                value="GUIDE" 
                className="peer sr-only"
              />
              <div className="p-4 rounded-2xl border border-gray-100 bg-offwhite text-center peer-checked:border-sage peer-checked:bg-sage/10 peer-checked:text-forest transition-all">
                <span className="text-sm font-bold">Guide</span>
              </div>
            </label>
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-14 bg-forest hover:bg-forest/90 text-white rounded-2xl font-bold text-lg shadow-xl shadow-forest/10 transition-all flex items-center justify-center"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "Sign up"}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500 font-medium">
            Already have an account?{" "}
            <Link to="/login" className="text-forest font-bold underline underline-offset-4">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
