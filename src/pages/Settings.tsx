
import { useState } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfileCard from "@/components/ProfileCard";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Moon, Sun, Trash } from "lucide-react";

const Settings = () => {
  const { user, isLoading: authLoading, signOut } = useUser();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  
  // If still loading authentication state, show loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Loading settings..." />
      </div>
    );
  }

  // If no user is logged in, redirect to login
  if (!user && !authLoading) {
    return <Navigate to="/login" replace />;
  }
  
  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      // In a real app, this would call an API to delete the user's account
      // For demo purposes, we'll just simulate a delay and then sign out the user
      setTimeout(async () => {
        await signOut();
        toast({
          title: "Account deleted",
          description: "Your account has been deleted successfully",
        });
      }, 2000);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete account",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1">
        {/* Header section */}
        <header className="bg-muted py-16 px-4">
          <div className="container max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Settings</h1>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Manage your account settings, preferences, and other options.
              </p>
            </motion.div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="container max-w-3xl mx-auto px-4 py-12">
          <Tabs defaultValue="profile" className="space-y-8">
            <TabsList className="justify-start border-b w-full rounded-none bg-transparent px-0">
              <TabsTrigger 
                value="profile"
                className="data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent rounded-none px-4 py-2"
              >
                Profile
              </TabsTrigger>
              <TabsTrigger 
                value="appearance"
                className="data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent rounded-none px-4 py-2"
              >
                Appearance
              </TabsTrigger>
              <TabsTrigger 
                value="account"
                className="data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent rounded-none px-4 py-2"
              >
                Account
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-6">
              <ProfileCard />
            </TabsContent>
            
            <TabsContent value="appearance" className="space-y-6">
              <Card>
                <CardHeader>
                  <h3 className="text-xl font-semibold">Appearance</h3>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Theme</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div 
                        className={`relative cursor-pointer rounded-lg p-4 flex flex-col items-center justify-center border ${
                          theme === "light" ? "border-primary bg-primary/5" : "border-border"
                        }`}
                        onClick={() => setTheme("light")}
                      >
                        <Sun size={24} className="mb-2" />
                        <span className="text-sm font-medium">Light</span>
                        {theme === "light" && (
                          <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
                        )}
                      </div>
                      
                      <div 
                        className={`relative cursor-pointer rounded-lg p-4 flex flex-col items-center justify-center border ${
                          theme === "dark" ? "border-primary bg-primary/5" : "border-border"
                        }`}
                        onClick={() => setTheme("dark")}
                      >
                        <Moon size={24} className="mb-2" />
                        <span className="text-sm font-medium">Dark</span>
                        {theme === "dark" && (
                          <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
                        )}
                      </div>
                      
                      <div 
                        className={`relative cursor-pointer rounded-lg p-4 flex flex-col items-center justify-center border ${
                          theme === "system" ? "border-primary bg-primary/5" : "border-border"
                        }`}
                        onClick={() => setTheme("system")}
                      >
                        <div className="flex gap-1 mb-2">
                          <Sun size={20} />
                          <Moon size={20} />
                        </div>
                        <span className="text-sm font-medium">System</span>
                        {theme === "system" && (
                          <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="account" className="space-y-6">
              <Card>
                <CardHeader>
                  <h3 className="text-xl font-semibold">Account</h3>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">API Key</h4>
                    <p className="text-sm text-muted-foreground">
                      Your API key can be used to access our services programmatically.
                    </p>
                    <div className="p-3 bg-muted rounded-md font-mono text-sm flex items-center justify-between">
                      <code>sk_••••••••••••••••••••••••••••••</code>
                      <Button variant="outline" size="sm">
                        Show
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t border-border">
                    <h4 className="font-medium text-red-500">Danger Zone</h4>
                    <p className="text-sm text-muted-foreground">
                      Once you delete your account, there is no going back. All data will be permanently deleted.
                    </p>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="gap-2">
                          <Trash size={16} />
                          <span>Delete Account</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove all your data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={handleDeleteAccount}
                            disabled={isDeleting}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            {isDeleting ? "Deleting..." : "Yes, delete my account"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default Settings;
