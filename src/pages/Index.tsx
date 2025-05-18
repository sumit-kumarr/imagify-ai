import { useState, useRef, useEffect } from "react";
import { useScroll, useTransform, motion, AnimatePresence } from "framer-motion";
import { Link, Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useUser } from "@/hooks/useAuth";
import { useImages } from "@/hooks/useImages";
import { generateImage } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  Image as ImageIcon, 
  Download, 
  Share2, 
  BookMarked, 
  Zap, 
  Award, 
  Globe, 
  Users, 
  MessageSquare, 
  Star, 
  ArrowRight 
} from "lucide-react";

// Enhanced Hero Component
const Hero = ({ isGenerating, onGenerateStart, onGenerateComplete }) => {
  const [prompt, setPrompt] = useState("");
  const heroRef = useRef(null);
  const { user } = useUser();
  const [showAnimation, setShowAnimation] = useState(true);

  // Parallax effect backgrounds
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onGenerateStart();
    
    // Simulate image generation (replace with actual API call)
    setTimeout(() => {
      const demoUrls = [
        "https://images.unsplash.com/photo-1655720828018-7467e7fa7c92?q=80&w=1287&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1675254627304-5c9a37fe1838?q=80&w=1287&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1676918555354-c2be7c7b3917?q=80&w=1287&auto=format&fit=crop"
      ];
      const randomUrl = demoUrls[Math.floor(Math.random() * demoUrls.length)];
      onGenerateComplete(randomUrl, prompt);
      setPrompt("");
    }, 2000);
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowAnimation(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div 
      ref={heroRef}
      className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background min-h-[90vh] flex items-center"
      style={{ opacity }}
    >
      {/* Abstract background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-10 left-10 w-64 h-64 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-3xl"
          animate={{ 
            x: [0, 20, 0], 
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          style={{ y: y1 }}
        />
        <motion.div 
          className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-gradient-to-r from-pink-500/20 to-orange-500/20 blur-3xl"
          animate={{ 
            x: [0, -30, 0], 
            y: [0, 20, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          style={{ y: y2 }}
        />
      </div>
      
      {/* Hero content */}
      <div className="container max-w-7xl mx-auto px-4 py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary mb-6">
                <Sparkles size={16} className="mr-2" />
                <span className="text-sm font-medium">Transform Words Into Art</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-blue-600 via-primary to-purple-600 text-transparent bg-clip-text">
                Unleash Your Creative Vision With AI
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-xl">
                Create stunning, unique images in seconds with Gemini's advanced AI. Your imagination is the only limit.
              </p>
              
              {!user && (
                <div className="flex flex-wrap gap-4">
                  <Link to="/register">
                    <Button size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 px-8 gap-2">
                      Get Started <ArrowRight size={18} />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" size="lg" className="px-8">
                      Sign In
                    </Button>
                  </Link>
                </div>
              )}
              
              {user && (
                <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Describe the image you want to create..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="w-full px-5 py-4 rounded-lg border border-border bg-card shadow-sm focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                      disabled={isGenerating}
                    />
                    <Button 
                      type="submit" 
                      disabled={isGenerating || !prompt.trim()} 
                      className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-primary to-purple-600 hover:opacity-90"
                    >
                      {isGenerating ? "Generating..." : "Generate"}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Try: "A cyberpunk cityscape with neon signs and flying cars" or "A serene mountain landscape at sunset with a lake reflection"
                  </p>
                </form>
              )}
            </motion.div>
          </div>
            {/* Demo image showcase */}
          <motion.div 
            className="relative hidden lg:block"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Main image */}
              <motion.div
                className="rounded-lg w-full h-full overflow-hidden shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <img 
                  src="pexels-ulfet-nur-ucar-680828476-29309920.jpg" 
                  alt="AI generated futuristic artwork" 
                  className="w-full h-full object-cover transform transition-transform hover:scale-110 duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent"></div>
              </motion.div>
              
              {/* Floating smaller images with glass effect */}
              <motion.div 
                className="absolute -top-8 -left-8 w-44 h-44 rounded-lg overflow-hidden shadow-xl rotate-3 backdrop-blur-sm"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                whileHover={{ scale: 1.05, rotate: 0 }}
              >
                <img 
                  src="image.png" 
                  alt="AI generated abstract art" 
                  className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                />
                <div className="absolute inset-0 border border-white/20 rounded-lg"></div>
              </motion.div>
              
              <motion.div 
                className="absolute -bottom-4 -right-4 w-36 h-36 rounded-lg overflow-hidden shadow-xl -rotate-6 backdrop-blur-sm"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                whileHover={{ scale: 1.05, rotate: 0 }}
              >
                <img 
                  src="image.png" 
                  alt="AI generated digital art" 
                  className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                />
                <div className="absolute inset-0 border border-white/20 rounded-lg"></div>
              </motion.div>
              
              {/* Animated particle effects */}
              <AnimatePresence>
                {showAnimation && (
                  <>
                    {[...Array(20)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full bg-primary"
                        initial={{ 
                          opacity: 1,
                          x: Math.random() * 300 - 150,
                          y: Math.random() * 300 - 150,
                          scale: 0
                        }}
                        animate={{ 
                          opacity: 0,
                          scale: Math.random() * 2,
                          x: (Math.random() - 0.5) * 500,
                          y: (Math.random() - 0.5) * 500,
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 2 + Math.random() * 2 }}
                      />
                    ))}
                  </>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
  
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-muted flex justify-center pt-2">
          <motion.div 
            className="w-1 h-2 bg-muted rounded-full"
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

// Enhanced Image Display Component
const ImageDisplay = ({ images, isGenerating, onRegenerate, onDelete }) => {
  return (
    <div className="container max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-primary to-purple-600 text-transparent bg-clip-text">
          Gallery of Creations
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore our community's latest masterpieces or showcase your own AI-generated artwork
        </p>
      </div>
      
      {images.length === 0 ? (
        <div className="text-center py-12 bg-card/50 rounded-lg border border-border/50">
          <ImageIcon size={48} className="mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">No images yet. Start generating to build your collection!</p>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-card rounded-xl overflow-hidden shadow-lg border border-border/50 relative"
            >
              <div className="aspect-square overflow-hidden">
                <img 
                  src={image.url} 
                  alt={image.prompt} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
              </div>
              <div className="p-5">
                <p className="text-sm text-muted-foreground line-clamp-2">{image.prompt}</p>
                
                <div className="flex justify-between items-center mt-4">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                      <Download size={14} />
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                      <Share2 size={14} />
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                      <BookMarked size={14} />
                    </Button>
                  </div>
                  
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={() => onRegenerate(image.prompt)}
                    disabled={isGenerating}
                    className="text-xs"
                  >
                    <Zap size={14} className="mr-1" />
                    Regenerate
                  </Button>
                </div>
              </div>
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="p-5 w-full">
                  <Button variant="default" className="w-full bg-white/90 text-black hover:bg-white">
                    View Details
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

// Enhanced Features Section
const FeaturesSection = () => {
  const features = [
    {
      icon: <Zap size={24} className="text-yellow-500" />,
      title: "Lightning Fast Generation",
      description: "Create stunning images in seconds with our optimized AI models, powered by cutting-edge technology."
    },
    {
      icon: <Award size={24} className="text-blue-500" />,
      title: "Premium Quality",
      description: "Generate high-resolution images up to 4K resolution perfect for professional use or personal projects."
    },
    {
      icon: <Globe size={24} className="text-green-500" />,
      title: "Style Versatility",
      description: "Choose from dozens of artistic styles, from photorealistic to anime, abstract art to oil paintings."
    },
    {
      icon: <Users size={24} className="text-purple-500" />,
      title: "Community Gallery",
      description: "Share your creations and get inspired by what others are making in our community showcase."
    },
    {
      icon: <Download size={24} className="text-red-500" />,
      title: "Easy Export",
      description: "Download your images in multiple formats and resolutions for any use case or platform."
    },
    {
      icon: <MessageSquare size={24} className="text-orange-500" />,
      title: "AI Assistance",
      description: "Get help improving your prompts with our AI assistant for even better results."
    }
  ];

  return (
    <div className="bg-card/30 py-24">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-primary to-purple-600 text-transparent bg-clip-text">
            Why Choose Gemini
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our AI image generation platform offers cutting-edge features to bring your creative vision to life
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card rounded-xl border border-border/50 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-full bg-card flex items-center justify-center mb-4 border border-border/50">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Testimonials Section
const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Digital Artist",
      image: "ai.png",
      content: "Gemini has revolutionized my creative workflow. The quality of the generated images is stunning, and the speed is incredible.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Marketing Director",
      image: "ai.png",
      content: "We've cut our design time in half by using Gemini for our marketing materials. The platform is intuitive and the results are consistently impressive.",
      rating: 5
    },
    {
      name: "Emma Wilson",
      role: "Game Developer",
      image: "ai.png",
      content: "As an indie game developer, Gemini has been a game-changer for creating concept art and assets. Highly recommended!",
      rating: 4
    }
  ];

  return (
    <div className="container max-w-7xl mx-auto px-4 py-24">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-primary to-purple-600 text-transparent bg-clip-text">
          What Our Users Say
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Join thousands of satisfied creators who trust Gemini for their AI image generation needs
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-card rounded-xl border border-border/50 p-6 shadow-md"
          >
            <div className="flex items-center gap-4 mb-4">
              <img 
                src={testimonial.image} 
                alt={testimonial.name} 
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h4 className="font-semibold">{testimonial.name}</h4>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </div>
            
            <p className="text-muted-foreground mb-4">{testimonial.content}</p>
            
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={16} 
                  className={i < testimonial.rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"} 
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <Link to="/testimonials">
          <Button variant="outline" className="gap-2">
            View All Testimonials <ArrowRight size={16} />
          </Button>
        </Link>
      </div>
    </div>
  );
};

// Pricing Section
const PricingSection = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for beginners and casual users",
      features: [
        "5 image generations per day",
        "Standard quality images",
        "Basic editing tools",
        "Community support"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Pro",
      price: "$12",
      period: "per month",
      description: "Ideal for creative professionals",
      features: [
        "100 image generations per day",
        "High resolution images",
        "Advanced editing tools",
        "Priority support",
        "Commercial usage rights",
        "No watermarks"
      ],
      cta: "Go Pro",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For businesses with specific needs",
      features: [
        "Unlimited image generations",
        "Ultra-high resolution images",
        "API access",
        "Dedicated account manager",
        "Custom model training",
        "Analytics dashboard"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <div className="container max-w-7xl mx-auto px-4 py-24">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-primary to-purple-600 text-transparent bg-clip-text">
          Choose Your Plan
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Find the perfect plan for your creative needs, from casual use to professional projects
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`bg-card rounded-xl border ${plan.popular ? 'border-primary' : 'border-border/50'} p-6 shadow-md relative`}
          >
            {plan.popular && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
            )}
            
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
              <div className="mb-2">
                <span className="text-3xl font-bold">{plan.price}</span>
                {plan.period && <span className="text-muted-foreground text-sm ml-1">{plan.period}</span>}
              </div>
              <p className="text-sm text-muted-foreground">{plan.description}</p>
            </div>
            
            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center text-sm">
                  <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-2">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
            
            <Button 
              variant={plan.popular ? "default" : "outline"} 
              className={`w-full ${plan.popular ? 'bg-gradient-to-r from-primary to-purple-600 hover:opacity-90' : ''}`}
            >
              {plan.cta}
            </Button>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-12 p-6 bg-card/50 border border-border/50 rounded-lg text-center">
        <p className="text-muted-foreground mb-4">
          All plans include a 14-day money-back guarantee. No credit card required for the Free plan.
        </p>
        <Link to="/pricing">
          <Button variant="link" className="text-primary">
            View Full Pricing Details
          </Button>
        </Link>
      </div>
    </div>
  );
};

// FAQ Section
const FAQSection = () => {
  const faqs = [
    {
      question: "How does AI image generation work?",
      answer: "Our AI uses advanced machine learning models to transform text descriptions into visual images. The system has been trained on millions of images and can understand complex descriptions, styles, and concepts to create unique visuals based on your prompts."
    },
    {
      question: "Can I use the generated images commercially?",
      answer: "Yes, with Pro and Enterprise plans, you receive full commercial usage rights for all images you generate. Free plan users can use images for personal projects only."
    },
    {
      question: "How many images can I generate?",
      answer: "Free users can generate up to 5 images per day, Pro users get 100 images per day, and Enterprise users have unlimited generation capabilities."
    },
    {
      question: "What resolution are the generated images?",
      answer: "Free plan images are generated at standard resolution (512x512 pixels). Pro plan users can create high-resolution images up to 1024x1024 pixels, and Enterprise users can access ultra-high resolution up to 2048x2048 pixels."
    },
    {
      question: "Can I edit my images after generation?",
      answer: "Yes, all plans include basic editing tools. Pro and Enterprise plans offer advanced editing capabilities including inpainting, outpainting, and style adjustments."
    },
    {
      question: "Is there an API available?",
      answer: "Yes, API access is available with our Enterprise plan. This allows you to integrate our image generation capabilities directly into your applications and workflows."
    }
  ];

  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="container max-w-7xl mx-auto px-4 py-24">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-primary to-purple-600 text-transparent bg-clip-text">
          Frequently Asked Questions
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Find answers to commonly asked questions about Gemini's AI image generation platform
        </p>
      </div>
      
      <div className="max-w-3xl mx-auto divide-y divide-border">
        {faqs.map((faq, index) => (
          <div key={index} className="py-5">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="flex justify-between items-center w-full text-left focus:outline-none"
            >
              <h3 className="text-lg font-medium">{faq.question}</h3>
              <div className={`transform transition-transform ${openIndex === index ? 'rotate-180' : ''}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </button>
            
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="mt-3 text-muted-foreground">{faq.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
        {/* <div className="mt-12 text-center">
        <Link to="/pricing">
          <Button variant="link" className="text-primary">
            View Full Pricing Details
          </Button>
        </Link>
      </div> */}
    </div>
  );
};

// Main Index Component
const Index = () => {
  const { user } = useUser();
  const { images: savedImages, isLoading, isEmpty, error: imagesError, fetchImages, saveImage, deleteImage } = useImages();
  const [isGenerating, setIsGenerating] = useState(false);
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);

  const handleGenerateStart = () => {
    setIsGenerating(true);
    setError(null);
  };

  const handleGenerateComplete = (imageUrl, prompt) => {
    setIsGenerating(false);
    setImages((prevImages) => [{
      id: Date.now(),
      url: imageUrl,
      prompt,
      createdAt: new Date().toISOString()
    }, ...prevImages]);
  };

  const handleGenerateError = (error) => {
    setIsGenerating(false);
    setError(error.message || 'An error occurred while generating the image');
  };

  const handleRegenerate = async (prompt) => {
    try {
      handleGenerateStart();
      const imageUrl = await generateImage(prompt);
      handleGenerateComplete(imageUrl, prompt);
    } catch (error) {
      handleGenerateError(error);
    }
  };

  const handleDeleteImage = (id) => {
    setImages((prevImages) => prevImages.filter(img => img.id !== id));
  };

  // If user is logged in, redirect to dashboard with animation
  if (user) {
    return (
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onAnimationComplete={() => <Navigate to="/dashboard" replace />}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar />
      <main>
        <Hero 
          isGenerating={isGenerating}
          onGenerateStart={handleGenerateStart}
          onGenerateComplete={handleGenerateComplete}
        />
        <ImageDisplay 
          images={images}
          isGenerating={isGenerating}
          onRegenerate={handleRegenerate}
          onDelete={handleDeleteImage}
        />
        <FeaturesSection />
       
        <FAQSection />
      </main>
      <Footer />
    </motion.div>
  );
};

export default Index;

