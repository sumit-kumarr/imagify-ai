
import { Link } from "react-router-dom";
import AuthForm from "@/components/AuthForm";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useUser } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

const Register = () => {
  const { user, isLoading } = useUser();
  
  // If user is already logged in, redirect to dashboard
  if (user && !isLoading) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with logo */}
      <header className="py-6 px-4">
        <div className="container max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-2">
            <span className="bg-gradient-main text-transparent bg-clip-text font-bold text-2xl">
              Imagify
            </span>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center py-12 px-4 bg-muted/50">
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden md:block"
          >
            <div className="space-y-6">
              <h1 className="text-4xl font-bold bg-gradient-main text-transparent bg-clip-text">
                Join ArtificialCanvas
              </h1>
              <p className="text-lg text-muted-foreground">
                Create your account to start generating stunning AI artwork and save your creations.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-8">
                {[5, 6, 7, 8].map((i) => (
                  <div
                    key={i}
                    className={`aspect-square rounded-lg overflow-hidden bg-muted`}
                    style={{
                      backgroundImage: `url(https://picsum.photos/seed/${i + 20}/400)`,
                      backgroundSize: "cover",
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <AuthForm type="register" />
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-border">
        <div className="container max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Imagify Made By Sumitcodes . All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms
            </Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Register;
