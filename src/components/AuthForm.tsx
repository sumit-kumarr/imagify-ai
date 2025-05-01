
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

type FormType = "login" | "register" | "reset";

const AuthForm = ({ type = "login" }: { type: FormType }) => {
  const [formType, setFormType] = useState<FormType>(type);
  
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

  return (
    <motion.div
      className="w-full max-w-md mx-auto p-6 sm:p-8 bg-card rounded-xl shadow-lg"
      variants={formVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      key={formType}
    >
      <AnimatePresence mode="wait">
        {formType === "login" && (
          <motion.div
            key="login"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={formVariants}
          >
            <LoginForm 
              onSwitchToRegister={() => setFormType("register")} 
              onSwitchToReset={() => setFormType("reset")} 
            />
          </motion.div>
        )}

        {formType === "register" && (
          <motion.div
            key="register"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={formVariants}
          >
            <RegisterForm 
              onSwitchToLogin={() => setFormType("login")} 
            />
          </motion.div>
        )}

        {formType === "reset" && (
          <motion.div
            key="reset"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={formVariants}
          >
            <ResetPasswordForm 
              onSwitchToLogin={() => setFormType("login")} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AuthForm;
