import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2, Home, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link. No token found.");
      return;
    }

    const verify = async () => {
      try {
        const res = await apiFetch("/api/auth/verify-email", {
          method: "POST",
          body: JSON.stringify({ token })
        });
        const data = await res.json();

        if (res.ok) {
          setStatus("success");
          // Update local storage user if needed
          const userStr = localStorage.getItem("user");
          if (userStr) {
            const user = JSON.parse(userStr);
            localStorage.setItem("user", JSON.stringify({ ...user, emailVerified: true }));
          }
        } else {
          setStatus("error");
          setMessage(data.error || "Verification failed");
        }
      } catch (err) {
        setStatus("error");
        setMessage("A server error occurred. Please try again later.");
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-offwhite px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl border border-sage/10 text-center"
      >
        {status === "loading" && (
          <div className="space-y-6">
            <div className="w-24 h-24 bg-sage/10 rounded-[2rem] flex items-center justify-center mx-auto">
              <Loader2 className="w-12 h-12 text-forest animate-spin" />
            </div>
            <h1 className="text-3xl font-black text-forest italic tracking-tighter">VERIFYING...</h1>
            <p className="text-gray-400 font-medium">Please wait while we confirm your identity.</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-8">
            <div className="w-24 h-24 bg-sage/10 rounded-[2rem] flex items-center justify-center mx-auto text-sage">
              <CheckCircle2 size={48} />
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-black text-forest italic tracking-tighter uppercase">Verified!</h1>
              <p className="text-gray-500 font-medium leading-relaxed">
                Your email has been successfully confirmed. You&apos;re now ready to explore and book amazing trips globally.
              </p>
            </div>
            <div className="grid gap-4">
              <Link to="/explore">
                <Button className="w-full h-16 bg-forest text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-forest/20 group">
                  Explore Trips <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" className="w-full h-16 rounded-2xl border-2 border-forest/10 hover:bg-offwhite text-forest font-black uppercase tracking-widest text-xs">
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-8">
            <div className="w-24 h-24 bg-red-50 rounded-[2rem] flex items-center justify-center mx-auto text-red-500">
              <XCircle size={48} />
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-black text-red-500 italic tracking-tighter uppercase">Oops!</h1>
              <p className="text-gray-500 font-medium leading-relaxed">
                {message || "We couldn't verify your email link. It might be expired or already used."}
              </p>
            </div>
            <div className="grid gap-4">
              <Link to="/">
                <Button className="w-full h-16 bg-forest text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-forest/20">
                   Back to Home
                </Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
                className="w-full h-16 rounded-2xl border-2 border-forest/10 hover:bg-offwhite text-forest font-black uppercase tracking-widest text-xs"
              >
                Retry Verification
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
