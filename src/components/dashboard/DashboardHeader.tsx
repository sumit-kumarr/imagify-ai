
import { motion } from "framer-motion";
import { useUser } from "@/hooks/useAuth";

const DashboardHeader = () => {
  const { user } = useUser();
  
  return (
    <header className="bg-muted/50 py-16 px-4">
      <div className="container max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-main text-transparent bg-clip-text">
            Welcome to your Dashboard, {user?.user_metadata?.username || user?.email?.split("@")[0]}
          </h1>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Here you can create new AI-generated images, view your past creations,
            and manage your image collection.
          </p>
        </motion.div>
      </div>
    </header>
  );
};

export default DashboardHeader;
