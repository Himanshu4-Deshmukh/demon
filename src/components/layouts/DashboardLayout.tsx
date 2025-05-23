// import { useState, useEffect } from "react";
// import { Outlet, NavLink, Link, useLocation } from "react-router-dom";
// import {
//   ImagePlus,
//   Grid,
//   Key,
//   BookOpen,
//   Crown,
//   Menu,
//   X,
//   LogOut,
//   ChevronDown,
// } from "lucide-react";
// import { useAuth } from "../../context/AuthContext";

// const DashboardLayout = () => {
//   const { user, isPremium, logout } = useAuth();
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
//   const location = useLocation();

//   // Close mobile menu when route changes
//   useEffect(() => {
//     setIsMobileMenuOpen(false);
//   }, [location.pathname]);

//   const navigation = [
//     { name: "Dashboard", href: "/dashboard", icon: Grid },
//     { name: "Gallery", href: "/gallery", icon: ImagePlus },
//     {
//       name: "API Keys",
//       href: "/api-keys",
//       icon: Key,
//       premium: true,
//     },
//     {
//       name: "API Documentation",
//       href: "/api-docs",
//       icon: BookOpen,
//       premium: true,
//     },
//     {
//       name: "Upgrade",
//       href: "/upgrade",
//       icon: Crown,
//       hideOnPremium: true,
//     },
//     {
//       name: "Current Plan",
//       href: "/upgrade",
//       icon: Crown,
//       // hideOnPremium: true,
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
//       {/* Mobile menu */}
//       <div className="lg:hidden">
//         <div className="fixed inset-0 flex z-40">
//           {/* Overlay */}
//           {isMobileMenuOpen && (
//             <div
//               className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"
//               onClick={() => setIsMobileMenuOpen(false)}
//             />
//           )}

//           {/* Menu */}
//           <div
//             className={`fixed inset-y-0 left-0 flex w-64 flex-col bg-white dark:bg-gray-800 transition-transform duration-300 ease-in-out ${
//               isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
//             }`}
//           >
//             <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
//               <Link to="/" className="flex items-center text-indigo-600">
//                 <img
//                   src="https://raw.githubusercontent.com/Himanshu4-Deshmukh/imghosting/refs/heads/main/users/Himanshu/1748021532252-793895237.png"
//                   alt="Logo"
//                   className="h-8  mr-2"
//                 />
//               </Link>
//               <button
//                 type="button"
//                 onClick={() => setIsMobileMenuOpen(false)}
//                 className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
//               >
//                 <X className="h-6 w-6" />
//               </button>
//             </div>
//             <div className="flex-1 overflow-y-auto py-4 px-3">
//               <nav className="space-y-1">
//                 {navigation
//                   .filter((item) => !(item.hideOnPremium && isPremium))
//                   .filter((item) => !(item.premium && !isPremium))
//                   .map((item) => (
//                     <NavLink
//                       key={item.name}
//                       to={item.href}
//                       className={({ isActive }) =>
//                         `group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
//                           isActive
//                             ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300"
//                             : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
//                         }`
//                       }
//                     >
//                       <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
//                       {item.name}
//                     </NavLink>
//                   ))}
//               </nav>
//             </div>
//             <div className="border-t border-gray-200 dark:border-gray-700 p-4">
//               <div className="flex items-center">
//                 <div className="flex-shrink-0">
//                   <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
//                     {user?.username?.[0].toUpperCase()}
//                   </div>
//                 </div>
//                 <div className="ml-3">
//                   <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                     {user?.username}
//                   </p>
//                   <p className="text-xs text-gray-500 dark:text-gray-400">
//                     {user?.plan === "premium" ? "Premium Plan" : "Free Plan"}
//                   </p>
//                 </div>
//               </div>
//               <div className="mt-4">
//                 <button
//                   onClick={logout}
//                   className="group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
//                 >
//                   <LogOut className="mr-3 h-5 w-5 text-gray-500 group-hover:text-gray-600 dark:text-gray-400 dark:group-hover:text-gray-300" />
//                   Sign out
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Static sidebar for desktop */}
//       <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
//         <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
//           <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-gray-200 dark:border-gray-700">
//             <Link to="/" className="flex items-center text-indigo-600">
//               <img
//                 src="https://raw.githubusercontent.com/Himanshu4-Deshmukh/imghosting/refs/heads/main/users/Himanshu/1748021532252-793895237.png"
//                 alt="Logo"
//                 className="h-8  mr-2"
//               />
//             </Link>
//           </div>

//           <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
//             <nav className="mt-5 flex-1 space-y-1 px-4">
//               {navigation
//                 .filter((item) => !(item.hideOnPremium && isPremium))
//                 .filter((item) => !(item.premium && !isPremium))
//                 .map((item) => (
//                   <NavLink
//                     key={item.name}
//                     to={item.href}
//                     className={({ isActive }) =>
//                       `group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
//                         isActive
//                           ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300"
//                           : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
//                       }`
//                     }
//                   >
//                     <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
//                     {item.name}
//                   </NavLink>
//                 ))}
//             </nav>
//           </div>
//           <div className="flex flex-shrink-0 border-t border-gray-200 dark:border-gray-700 p-4">
//             <div className="flex items-center w-full">
//               <Link to="/profile" className="w-full">
//                 <div className="flex items-center">
//                   <div className="flex-shrink-0">
//                     <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
//                       {user?.username?.[0].toUpperCase()}
//                     </div>
//                   </div>
//                   <div className="ml-3">
//                     <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                       {user?.username}
//                     </p>
//                     <p className="text-xs text-gray-500 dark:text-gray-400">
//                       {user?.plan === "premium" ? "Premium Plan" : "Free Plan"}
//                     </p>
//                   </div>
//                 </div>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Header for mobile */}
//       <div className="flex flex-col flex-1 lg:pl-64">
//         <div className="sticky top-0 z-10 bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 lg:hidden">
//           <div className="flex h-16 items-center justify-between px-4">
//             <Link to="/" className="flex items-center text-indigo-600">
//               <img
//                 src="https://raw.githubusercontent.com/Himanshu4-Deshmukh/imghosting/refs/heads/main/users/Himanshu/1748021532252-793895237.png"
//                 alt="Logo"
//                 className="h-8 mr-2"
//               />
//             </Link>
//             <div className="flex items-center space-x-3">
//               {/* User menu */}
//               <div className="relative">
//                 <button
//                   onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
//                   className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
//                 >
//                   <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
//                     {user?.username?.[0].toUpperCase()}
//                   </div>
//                   <ChevronDown className="ml-1 h-4 w-4 text-gray-500" />
//                 </button>

//                 {isUserMenuOpen && (
//                   <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-700">
//                     <NavLink
//                       to="/profile"
//                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
//                       onClick={() => setIsUserMenuOpen(false)}
//                     >
//                       Your Profile
//                     </NavLink>
//                     <button
//                       onClick={() => {
//                         setIsUserMenuOpen(false);
//                         logout();
//                       }}
//                       className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
//                     >
//                       Sign out
//                     </button>
//                   </div>
//                 )}
//               </div>

//               {/* Mobile menu button */}
//               <button
//                 type="button"
//                 onClick={() => setIsMobileMenuOpen(true)}
//                 className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
//               >
//                 <Menu className="h-6 w-6" />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Main content */}
//         <main className="flex-1 py-6">
//           <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//             <Outlet />
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;

import { useState, useEffect } from "react";
import { Outlet, NavLink, Link, useLocation } from "react-router-dom";
import {
  ImagePlus,
  Grid,
  Key,
  BookOpen,
  Crown,
  Menu,
  X,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const DashboardLayout = () => {
  const { user, isPremium, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Grid },
    { name: "Gallery", href: "/gallery", icon: ImagePlus },
    {
      name: "API Keys",
      href: "/api-keys",
      icon: Key,
      premium: true,
    },
    {
      name: "API Documentation",
      href: "/api-docs",
      icon: BookOpen,
      premium: true,
    },
    {
      name: "Upgrade",
      href: "/upgrade",
      icon: Crown,
      hideOnPremium: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile menu */}
      <div className="lg:hidden">
        {/* Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Menu */}
        <div
          className={`fixed inset-y-0 left-0 flex w-64 flex-col bg-white dark:bg-gray-800 z-30 transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
            <Link to="/" className="flex items-center text-indigo-600">
              <img
                src="https://raw.githubusercontent.com/Himanshu4-Deshmukh/imghosting/refs/heads/main/users/Himanshu/1748021532252-793895237.png"
                alt="Logo"
                className="h-8  mr-2"
              />
            </Link>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto py-4 px-3">
            <nav className="space-y-1">
              {navigation
                .filter((item) => !(item.hideOnPremium && isPremium))
                .filter((item) => !(item.premium && !isPremium))
                .map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300"
                          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      }`
                    }
                  >
                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.name}
                  </NavLink>
                ))}
            </nav>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                  {user?.username?.[0].toUpperCase()}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user?.username}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.plan === "premium" ? "Premium Plan" : "Free Plan"}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={logout}
                className="group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <LogOut className="mr-3 h-5 w-5 text-gray-500 group-hover:text-gray-600 dark:text-gray-400 dark:group-hover:text-gray-300" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-gray-200 dark:border-gray-700">
            <Link to="/" className="flex items-center text-indigo-600">
              <img
                src="https://raw.githubusercontent.com/Himanshu4-Deshmukh/imghosting/refs/heads/main/users/Himanshu/1748021532252-793895237.png"
                alt="Logo"
                className="h-8  mr-2"
              />
            </Link>
          </div>
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <nav className="mt-5 flex-1 space-y-1 px-4">
              {navigation
                .filter((item) => !(item.hideOnPremium && isPremium))
                .filter((item) => !(item.premium && !isPremium))
                .map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300"
                          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      }`
                    }
                  >
                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.name}
                  </NavLink>
                ))}
            </nav>
          </div>
          <div className="flex flex-shrink-0 border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center w-full">
              <Link to="/profile" className="w-full">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                      {user?.username?.[0].toUpperCase()}
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {user?.username}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user?.plan === "premium" ? "Premium Plan" : "Free Plan"}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Header for mobile */}
      <div className="flex flex-col flex-1 lg:pl-64">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 lg:hidden">
          <div className="flex h-16 items-center justify-between px-4">
            <Link to="/" className="flex items-center text-indigo-600">
              <img
                src="https://raw.githubusercontent.com/Himanshu4-Deshmukh/imghosting/refs/heads/main/users/Himanshu/1748021532252-793895237.png"
                alt="Logo"
                className="h-8  mr-2"
              />
            </Link>
            <div className="flex items-center space-x-3">
              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                    {user?.username?.[0].toUpperCase()}
                  </div>
                  <ChevronDown className="ml-1 h-4 w-4 text-gray-500" />
                </button>

                {isUserMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-20"
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-30 dark:bg-gray-700">
                      <NavLink
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Your Profile
                      </NavLink>
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
                      >
                        Sign out
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Mobile menu button */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
