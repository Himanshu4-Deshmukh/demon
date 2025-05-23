import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Upload,
  Lock,
  Database,
  ArrowRight,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  FileImage,
  Clock,
  CreditCard,
  Code,
  Zap,
  Shield,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [openItems, setOpenItems] = useState(new Set([0])); // First item open by default

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const faqData = [
    {
      icon: FileImage,
      question: "What file formats are supported?",
      answer:
        "We support all popular image formats including JPEG, PNG, GIF, WebP, and SVG. Each file can be up to 5MB in size with Premium accounts supporting up to 25MB files.",
    },
    {
      icon: Clock,
      question: "How long are images stored?",
      answer:
        "Your images remain on our platform indefinitely as long as your account stays active. We provide 99.9% uptime guarantee and automatic backups to ensure your content is always accessible.",
    },
    {
      icon: Zap,
      question: "Can I upgrade or downgrade my plan?",
      answer:
        "Absolutely! Upgrade to Premium instantly to unlock advanced features. If you downgrade, you'll keep Premium benefits until your current billing period ends - no immediate loss of functionality.",
    },
    {
      icon: Code,
      question: "How does the API work?",
      answer:
        "Our RESTful API gives Premium users programmatic access to upload, manage, and retrieve images with lightning-fast response times. Complete documentation, SDKs, and 24/7 developer support included.",
    },
    {
      icon: CreditCard,
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit/debit cards, UPI, net banking, and digital wallets through our secure payment partner Razorpay. All transactions are encrypted and PCI DSS compliant.",
    },
    {
      icon: Shield,
      question: "Is my data secure and private?",
      answer:
        "Your privacy is our priority. We use end-to-end encryption, never share your data with third parties, and comply with GDPR and SOC 2 standards. You maintain full ownership of your content.",
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Header */}
      <header
        className={`fixed w-full z-20 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md dark:bg-gray-800" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="flex items-center text-indigo-600">
                <img
                  src="https://raw.githubusercontent.com/Himanshu4-Deshmukh/imghosting/refs/heads/main/users/Himanshu/1748021532252-793895237.png"
                  alt="Logo"
                  className="h-8 mr-2"
                />
              </Link>
            </div>

            {/* Desktop navigation */}
            <nav className="hidden md:flex space-x-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
              >
                Pricing
              </a>
              <a
                href="#faq"
                className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
              >
                FAQ
              </a>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn btn-primary">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
                  >
                    Log in
                  </Link>
                  <Link to="/register" className="btn btn-primary">
                    Sign up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-indigo-400 dark:hover:bg-gray-800"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-800 shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a
                href="#features"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-indigo-400 dark:hover:bg-gray-700"
              >
                Features
              </a>
              <a
                href="#pricing"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-indigo-400 dark:hover:bg-gray-700"
              >
                Pricing
              </a>
              <a
                href="#faq"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-indigo-400 dark:hover:bg-gray-700"
              >
                FAQ
              </a>
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center px-5">
                <div className="space-y-1">
                  {isAuthenticated ? (
                    <Link
                      to="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full text-center px-4 py-2 text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-indigo-400 dark:hover:bg-gray-700"
                      >
                        Log in
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block w-full text-center px-4 py-2 text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                      >
                        Sign up
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero section */}
      <section className="relative overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800" />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
                <span className="text-indigo-600 dark:text-indigo-400">
                  Secure
                </span>{" "}
                Image Hosting for Everyone
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
                Upload, manage and share your images with ease. Our platform
                provides reliable hosting with powerful features for both
                personal and professional use.
              </p>
              <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                {isAuthenticated ? (
                  <Link
                    to="/dashboard"
                    className="btn btn-primary px-8 py-3 text-base"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="btn btn-primary px-8 py-3 text-base"
                    >
                      Get Started — It's Free
                    </Link>
                    <Link
                      to="/login"
                      className="btn btn-outline px-8 py-3 text-base"
                    >
                      Login
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="hidden md:block relative">
              <div className="relative rounded-lg shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="ml-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                    Image Gallery
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-md animate-pulse" />
                    <div
                      className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-md animate-pulse"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-md animate-pulse"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <div
                      className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-md animate-pulse"
                      style={{ animationDelay: "0.3s" }}
                    />
                    <div
                      className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-md animate-pulse"
                      style={{ animationDelay: "0.4s" }}
                    />
                    <div
                      className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-md animate-pulse"
                      style={{ animationDelay: "0.5s" }}
                    />
                  </div>
                  <div className="mt-4 p-3 border border-dashed border-gray-300 dark:border-gray-600 rounded-md text-center">
                    <Upload className="h-6 w-6 mx-auto text-gray-400 dark:text-gray-500 mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Drop your images here or click to browse
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-36 h-36 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full opacity-20 blur-2xl" />
              <div className="absolute -top-6 -left-6 w-36 h-36 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full opacity-20 blur-2xl" />
            </div>
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl sm:text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                2M+
              </p>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Images Hosted
              </p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                15TB
              </p>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Storage Used
              </p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                50K+
              </p>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Happy Users
              </p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                99.9%
              </p>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Uptime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section
        id="features"
        className="py-16 md:py-24 bg-white dark:bg-gray-900"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Built for Speed and Simplicity
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              PixelVault is packed with features to make your image hosting
              experience seamless and efficient.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-6 text-center md:text-left">
              <div className="w-12 h-12 rounded-md bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto md:mx-0 mb-4">
                <Upload className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Easy Uploads
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Drag and drop your images or use our intuitive upload interface
                to quickly host your content.
              </p>
            </div>

            <div className="card p-6 text-center md:text-left">
              <div className="w-12 h-12 rounded-md bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto md:mx-0 mb-4">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Secure Storage
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Your images are stored securely with encryption and backed up
                regularly for peace of mind.
              </p>
            </div>

            <div className="card p-6 text-center md:text-left">
              <div className="w-12 h-12 rounded-md bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto md:mx-0 mb-4">
                <Database className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Developer API
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Integrate with our robust API to automate uploads, manage
                images, and more with your applications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing section */}
      <section
        id="pricing"
        className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Choose the plan that's right for you, whether you're an individual
              creator or developer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="card p-8 border-2 border-gray-200 dark:border-gray-700">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Free Plan
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Perfect for beginners
                </p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white">
                  ₹0
                  <span className="text-lg text-gray-500 dark:text-gray-400 font-normal">
                    /forever
                  </span>
                </p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mt-0.5">
                    <svg
                      width="10"
                      height="8"
                      viewBox="0 0 10 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 1L3.5 6.5L1 4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600 dark:text-gray-300">
                    Upload up to 20 images
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mt-0.5">
                    <svg
                      width="10"
                      height="8"
                      viewBox="0 0 10 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 1L3.5 6.5L1 4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600 dark:text-gray-300">
                    Basic image hosting
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mt-0.5">
                    <svg
                      width="10"
                      height="8"
                      viewBox="0 0 10 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 1L3.5 6.5L1 4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600 dark:text-gray-300">
                    Public image URLs
                  </p>
                </li>
              </ul>
              <div className="text-center">
                <Link to="/register" className="btn btn-outline w-full py-3">
                  Get Started
                </Link>
              </div>
            </div>

            <div className="card p-8 border-2 border-indigo-600 relative dark:border-indigo-500">
              <div className="absolute top-0 right-0 bg-indigo-600 text-white px-3 py-1 text-sm font-medium rounded-bl-lg rounded-tr-lg dark:bg-indigo-500">
                Popular
              </div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Premium Plan
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  For professionals and developers
                </p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white">
                  ₹50
                  <span className="text-lg text-gray-500 dark:text-gray-400 font-normal">
                    /month
                  </span>
                </p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mt-0.5">
                    <svg
                      width="10"
                      height="8"
                      viewBox="0 0 10 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 1L3.5 6.5L1 4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600 dark:text-gray-300">
                    <strong>Unlimited</strong> image uploads
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mt-0.5">
                    <svg
                      width="10"
                      height="8"
                      viewBox="0 0 10 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 1L3.5 6.5L1 4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600 dark:text-gray-300">
                    API access with key generation
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mt-0.5">
                    <svg
                      width="10"
                      height="8"
                      viewBox="0 0 10 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 1L3.5 6.5L1 4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600 dark:text-gray-300">
                    Priority support
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mt-0.5">
                    <svg
                      width="10"
                      height="8"
                      viewBox="0 0 10 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 1L3.5 6.5L1 4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600 dark:text-gray-300">
                    Higher image size limits
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mt-0.5">
                    <svg
                      width="10"
                      height="8"
                      viewBox="0 0 10 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 1L3.5 6.5L1 4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600 dark:text-gray-300">
                    Advanced statistics
                  </p>
                </li>
              </ul>
              <div className="text-center">
                {isAuthenticated ? (
                  <Link to="/upgrade" className="btn btn-primary w-full py-3">
                    Upgrade Now
                  </Link>
                ) : (
                  <Link to="/register" className="btn btn-primary w-full py-3">
                    Get Started
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ section */}

      <section
        id="faq"
        className="py-20 md:py-32 bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden"
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              Everything you need to know about our platform, features, and
              policies
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {faqData.map((item, index) => {
                const Icon = item.icon;
                const isOpen = openItems.has(index);

                return (
                  <div
                    key={index}
                    className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/90 dark:hover:bg-gray-800/90"
                  >
                    <button
                      onClick={() => toggleItem(index)}
                      className="w-full p-6 md:p-8 text-left flex items-start gap-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded-2xl transition-all duration-200"
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                        <Icon className="w-6 h-6 text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                          {item.question}
                        </h3>
                      </div>

                      <div className="flex-shrink-0 ml-4">
                        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-all duration-200">
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                          )}
                        </div>
                      </div>
                    </button>

                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="px-6 md:px-8 pb-6 md:pb-8 ml-16">
                        <div className="h-px bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-700 mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base md:text-lg">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA Section */}
            {/* <div className="mt-16 text-center">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 md:p-12 shadow-2xl">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Still have questions?
                </h3>
                <p className="text-blue-100 text-lg mb-6">
                  Our support team is here to help you 24/7
                </p>
                <button className="inline-flex items-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105">
                  Contact Support
                  <svg
                    className="ml-2 w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </button>
              </div>
            </div> */}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="relative py-16 md:py-24 bg-indigo-600 dark:bg-indigo-800 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg
            className="w-full h-full"
            viewBox="0 0 800 800"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="grid"
                width="100"
                height="100"
                patternUnits="userSpaceOnUse"
              >
                <rect
                  width="100"
                  height="100"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to start hosting your images?
            </h2>
            <p className="text-lg text-indigo-100 mb-8">
              Join thousands of users who trust PixelVault for their image
              hosting needs.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="btn bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-3 text-base"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="btn bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-3 text-base"
                  >
                    Get Started For Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center mb-4 md:mb-0">
              <Link to="/" className="flex items-center text-indigo-600">
                <img
                  src="https://raw.githubusercontent.com/Himanshu4-Deshmukh/imghosting/refs/heads/main/users/Himanshu/1748021532252-793895237.png"
                  alt="Logo"
                  className="h-8  mr-2"
                />
              </Link>
            </div>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
              >
                Help
              </a>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
            <p>
              &copy; {new Date().getFullYear()} PixelVault. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
