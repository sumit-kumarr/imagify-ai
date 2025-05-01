
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

const FeaturesSection = () => {
  const featuresRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      icon: "✨",
      title: "AI-Powered Generation",
      description: "State-of-the-art AI algorithms that transform text into stunning visual art in seconds."
    },
    {
      icon: "🔄",
      title: "Unlimited Generations",
      description: "Create as many images as you like. Tweak your prompt until you get the perfect result."
    },
    {
      icon: "💾",
      title: "Save & Share",
      description: "Save your creations to your account and easily share them with friends and on social media."
    }
  ];

  return (
    <section className="bg-muted py-20" ref={featuresRef}>
      <div className="container max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={feature.title}
              className="feature-card bg-card p-6 rounded-lg shadow-md"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 300, delay: index * 0.1 }}
            >
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <span className="text-2xl">{feature.icon}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/register">
            <Button className="bg-gradient-main hover:opacity-90">Create Your Account</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
