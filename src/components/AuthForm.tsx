
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

// Define form schemas
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const registerSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const resetSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type FormType = "login" | "register" | "reset";

const AuthForm = ({ type = "login" }: { type: FormType }) => {
  const [formType, setFormType] = useState<FormType>(type);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Select the appropriate schema based on form type
  const formSchema = 
    formType === "login" ? loginSchema : 
    formType === "register" ? registerSchema : 
    resetSchema;
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      ...(formType === "register" ? { confirmPassword: "" } : {}),
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      if (formType === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });
        
        if (error) throw error;
        
        toast({
          title: "Welcome back!",
          description: "Successfully logged in to your account",
        });
        
        // Redirect will be handled by the auth state change
      } 
      else if (formType === "register") {
        const { error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
        });
        
        if (error) throw error;
        
        toast({
          title: "Registration successful!",
          description: "Please check your email to confirm your account",
        });
      } 
      else if (formType === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        
        if (error) throw error;
        
        toast({
          title: "Password reset email sent",
          description: "Check your inbox for the password reset link",
        });
      }
    } catch (error: any) {
      toast({
        title: "Authentication error",
        description: error.message || "An error occurred during authentication",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
      }
    },
    exit: { 
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
      }
    }
  };

  const getFormTitle = () => {
    switch (formType) {
      case "login": return "Welcome Back";
      case "register": return "Create an Account";
      case "reset": return "Reset Your Password";
    }
  };

  return (
    <motion.div
      className="w-full max-w-md mx-auto p-6 sm:p-8 bg-card rounded-xl shadow-lg"
      variants={formVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      key={formType}
    >
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-2">{getFormTitle()}</h2>
        <p className="text-muted-foreground">
          {formType === "login" && "Sign in to access your dashboard and creations"}
          {formType === "register" && "Join to start generating amazing AI artwork"}
          {formType === "reset" && "Enter your email to receive a password reset link"}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="your.email@example.com" 
                    {...field} 
                    type="email"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {formType !== "reset" && (
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="••••••••" 
                      {...field} 
                      type="password"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {formType === "register" && (
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="••••••••" 
                      {...field} 
                      type="password"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button 
            type="submit" 
            className="w-full bg-gradient-main hover:opacity-90" 
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>
                  {formType === "login" ? "Signing In..." : 
                   formType === "register" ? "Creating Account..." : 
                   "Sending Reset Link..."}
                </span>
              </div>
            ) : (
              <span>
                {formType === "login" ? "Sign In" : 
                 formType === "register" ? "Create Account" : 
                 "Send Reset Link"}
              </span>
            )}
          </Button>

          <div className="space-y-4">
            {formType === "login" && (
              <>
                <div className="text-center text-sm">
                  <button
                    type="button"
                    onClick={() => setFormType("reset")}
                    className="text-primary hover:underline"
                    disabled={isLoading}
                  >
                    Forgot your password?
                  </button>
                </div>
                <div className="text-center text-sm">
                  <span className="text-muted-foreground">Don't have an account? </span>
                  <button
                    type="button"
                    onClick={() => setFormType("register")}
                    className="text-primary hover:underline"
                    disabled={isLoading}
                  >
                    Sign up
                  </button>
                </div>
              </>
            )}

            {formType === "register" && (
              <div className="text-center text-sm">
                <span className="text-muted-foreground">Already have an account? </span>
                <button
                  type="button"
                  onClick={() => setFormType("login")}
                  className="text-primary hover:underline"
                  disabled={isLoading}
                >
                  Sign in
                </button>
              </div>
            )}

            {formType === "reset" && (
              <div className="text-center text-sm">
                <button
                  type="button"
                  onClick={() => setFormType("login")}
                  className="text-primary hover:underline"
                  disabled={isLoading}
                >
                  Back to sign in
                </button>
              </div>
            )}
          </div>
        </form>
      </Form>
    </motion.div>
  );
};

export default AuthForm;
