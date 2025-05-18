import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="text-center max-w-md">
        <h1 className="text-7xl font-extrabold text-red-600 drop-shadow mb-4 animate-bounce">404</h1>
        <p className="text-2xl font-semibold text-white mb-2">Page Not Found</p>
        <p className="text-md text-red-300  mb-6">
          Sorry, we couldn’t find the page you were looking for.
        </p>
        <Link
          to="/"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
