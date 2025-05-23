import { Outlet, Link } from "react-router-dom";
import { Image } from "lucide-react";

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Left side - Auth form */}
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:w-1/2 xl:px-12">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-8">
            {/* <Link to="/" className="flex items-center text-indigo-600">
              <Image className="h-8 w-8 mr-2" />
              <span className="text-xl font-bold">PixelVault</span>
            </Link> */}
            <Link to="/" className="flex items-center text-indigo-600">
              <img
                src="https://raw.githubusercontent.com/Himanshu4-Deshmukh/imghosting/refs/heads/main/users/Himanshu/1748021532252-793895237.png"
                alt="Logo"
                className="h-8 mr-2"
              />
            </Link>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Welcome back
            </h2>
          </div>

          <Outlet />

          <div className="mt-8">
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-gray-50 px-2 text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                    PixelVault, Inc.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Image background */}
      <div className="hidden lg:block relative lg:w-1/2">
        <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-indigo-600 to-purple-700 opacity-90" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white">
          <div className="max-w-md text-center">
            <Image className="inline-block h-16 w-16 mb-6" />
            <h2 className="text-3xl font-bold mb-4">
              Host your images securely
            </h2>
            <p className="text-lg mb-6">
              PixelVault provides reliable image hosting with powerful features
              for both personal and professional use.
            </p>
            <ul className="space-y-2 text-left list-disc list-inside mb-8">
              <li>Fast, secure image uploads</li>
              <li>Easy sharing and management</li>
              <li>Developer-friendly API</li>
              <li>Free and premium plans available</li>
            </ul>
          </div>
        </div>
        <img
          src="https://images.pexels.com/photos/2682877/pexels-photo-2682877.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Background"
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
      </div>
    </div>
  );
};

export default AuthLayout;
