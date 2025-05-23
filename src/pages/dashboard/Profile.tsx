import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { User, Mail, Shield, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const Profile = () => {
  const { user, logout, isPremium } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out?')) {
      setIsLoggingOut(true);
      try {
        logout();
        toast.success('Logged out successfully');
      } catch (error) {
        console.error('Logout error:', error);
        toast.error('Failed to log out');
        setIsLoggingOut(false);
      }
    }
  };

  return (
    <div className="fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Your Profile
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage your account information and settings
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="card p-6">
          <div className="flex items-center mb-6">
            <div className="h-16 w-16 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold mr-4">
              {user?.username?.[0].toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {user?.username}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {user?.email}
              </p>
              <div className="mt-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  isPremium 
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' 
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {isPremium ? 'Premium Plan' : 'Free Plan'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start">
              <User className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Username
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {user?.username}
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {user?.email}
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Shield className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Account Type
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {isPremium ? 'Premium Plan (Active)' : 'Free Plan'}
                </p>
                {!isPremium && (
                  <a 
                    href="/upgrade" 
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    Upgrade to Premium
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="btn btn-outline text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              {isLoggingOut ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </>
              )}
            </button>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Account Security
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                Keep your account secure with a strong password.
              </p>
              <button className="btn btn-outline">
                Change Password
              </button>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Account Deletion
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                Permanently delete your account and all associated data.
              </p>
              <button className="btn btn-outline text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20">
                Delete Account
              </button>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Help & Support
          </h2>
          
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300">
              Need help with your account or have questions about our service?
            </p>
            
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-indigo-600 hover:text-indigo-700 font-medium dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                View FAQ
              </a>
              <a 
                href="mailto:support@pixelvault.com" 
                className="text-indigo-600 hover:text-indigo-700 font-medium dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;