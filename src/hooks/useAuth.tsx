
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client"; // Updated import
import type { AuthSession, User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export type { User };

interface AuthContextType {
  user: User | null;
  session: AuthSession | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      setIsLoading(true);
      
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      
      setIsLoading(false);
    };
    
    getInitialSession();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        console.log("Auth state changed:", _event);
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        // For login events, redirect to dashboard
        if (_event === "SIGNED_IN") {
          navigate("/dashboard");
          toast({
            title: "Welcome back!",
            description: "You are now logged in",
          });
        }
        // For logout events, redirect to home
        if (_event === "SIGNED_OUT") {
          navigate("/");
          toast({
            title: "Logged out",
            description: "You have been logged out successfully",
          });
        }
      }
    );
    
    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);
  
  const signOut = async () => {
    console.log("Signing out...");
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
    
    // Clear local user state (in case the auth state change event doesn't trigger)
    setUser(null);
    setSession(null);
    
    return;
  };
  
  return (
    <AuthContext.Provider value={{ user, session, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useUser must be used within an AuthProvider");
  }
  return context;
};

export const useSupabaseClient = () => supabase;
