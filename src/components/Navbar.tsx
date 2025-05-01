
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Moon, Sun, User, Menu, X } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  
  // Track scrolling for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when location changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMenuOpen ? "bg-background/80 backdrop-blur-lg shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="bg-gradient-main text-transparent bg-clip-text font-bold text-2xl">
            ArtificialCanvas
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === "/" ? "text-primary" : "text-foreground/80"
            }`}
          >
            Home
          </Link>
          <Link
            to="/dashboard"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === "/dashboard" ? "text-primary" : "text-foreground/80"
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/settings"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === "/settings" ? "text-primary" : "text-foreground/80"
            }`}
          >
            Settings
          </Link>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
          
          <Link to="/login">
            <Button variant="outline" size="sm" className="ml-2 gap-1">
              <User size={16} />
              <span>Login</span>
            </Button>
          </Link>
        </nav>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute w-full bg-background/95 backdrop-blur-lg animate-in shadow-lg">
          <div className="container max-w-7xl mx-auto px-4 py-6 flex flex-col gap-6">
            <Link
              to="/"
              className={`text-lg font-medium transition-colors ${
                location.pathname === "/" ? "text-primary" : "text-foreground/80"
              }`}
            >
              Home
            </Link>
            <Link
              to="/dashboard"
              className={`text-lg font-medium transition-colors ${
                location.pathname === "/dashboard" ? "text-primary" : "text-foreground/80"
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/settings"
              className={`text-lg font-medium transition-colors ${
                location.pathname === "/settings" ? "text-primary" : "text-foreground/80"
              }`}
            >
              Settings
            </Link>
            
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <Button
                variant="ghost"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="gap-2"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
              </Button>
              
              <Link to="/login">
                <Button variant="default" size="default" className="gap-2">
                  <User size={16} />
                  <span>Login</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
