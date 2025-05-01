
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User as UserType, useUser, useSupabaseClient } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

const ProfileCard = () => {
  const { user } = useUser();
  const supabase = useSupabaseClient();
  const { toast } = useToast();
  
  const [username, setUsername] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize username from user data
  useEffect(() => {
    if (user?.user_metadata?.username) {
      setUsername(user.user_metadata.username);
    } else if (user?.email) {
      // Extract username from email if no username is set
      const emailUsername = user.email.split("@")[0];
      setUsername(emailUsername);
    }
  }, [user]);
  
  const getInitials = () => {
    if (username) {
      return username.substring(0, 2).toUpperCase();
    }
    return "AC";
  };
  
  const updateUsername = async () => {
    if (!username.trim()) {
      toast({
        title: "Username required",
        description: "Please enter a valid username",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        data: { username }
      });
      
      if (error) throw error;
      
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your username has been updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update username",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <h3 className="text-xl font-semibold">Profile</h3>
        {!isEditing && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Avatar className="w-16 h-16">
            <AvatarImage src={user?.user_metadata?.avatar_url || ""} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-2">
            {isEditing ? (
              <>
                <label htmlFor="username" className="text-sm font-medium">
                  Username
                </label>
                <div className="flex gap-2">
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                  />
                  <Button
                    onClick={updateUsername}
                    disabled={isLoading}
                    className="whitespace-nowrap"
                  >
                    {isLoading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
                        Saving
                      </>
                    ) : (
                      "Save"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="font-medium text-lg">{username}</div>
                <div className="text-muted-foreground">{user?.email}</div>
              </>
            )}
          </div>
        </div>
        
        <div className="border-t border-border pt-4">
          <div className="grid gap-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Account created</span>
              <span>{user?.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last sign in</span>
              <span>{user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : "N/A"}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
