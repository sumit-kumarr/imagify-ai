
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
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

const resetSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type ResetFormValues = z.infer<typeof resetSchema>;

interface ResetPasswordFormProps {
  onSwitchToLogin: () => void;
}

const ResetPasswordForm = ({ onSwitchToLogin }: ResetPasswordFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ResetFormValues) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast({
        title: "Password reset email sent",
        description: "Check your inbox for the password reset link",
      });
    } catch (error: any) {
      toast({
        title: "Reset error",
        description: error.message || "An error occurred during password reset",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-2">Reset Your Password</h2>
        <p className="text-muted-foreground">
          Enter your email to receive a password reset link
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

          <Button 
            type="submit" 
            className="w-full bg-gradient-main hover:opacity-90" 
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Sending Reset Link...</span>
              </div>
            ) : (
              <span>Send Reset Link</span>
            )}
          </Button>

          <div className="text-center text-sm">
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-primary hover:underline"
              disabled={isLoading}
            >
              Back to sign in
            </button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default ResetPasswordForm;
