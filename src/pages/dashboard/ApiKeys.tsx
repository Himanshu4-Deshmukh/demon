import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Key, RefreshCw, Copy, Trash2, AlertTriangle } from 'lucide-react';
import { api } from '../../lib/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface ApiKeyData {
  apiKey: string;
  createdAt: string;
}

const ApiKeys = () => {
  const [apiKey, setApiKey] = useState<ApiKeyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const { data } = await api.get('/api/user/api-key');
        setApiKey(data);
      } catch (error: any) {
        if (error.response?.status !== 404) {
          console.error('Error fetching API key:', error);
          toast.error('Failed to fetch API key');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchApiKey();
  }, []);

  const handleGenerateKey = async () => {
    setIsGenerating(true);
    try {
      const { data } = await api.post('/api/user/generate-api-key');
      setApiKey({
        apiKey: data.apiKey,
        createdAt: new Date().toISOString(),
      });
      setShowKey(true);
      toast.success('API key generated successfully');
    } catch (error) {
      console.error('Error generating API key:', error);
      toast.error('Failed to generate API key');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteKey = async () => {
    setIsDeleting(true);
    try {
      await api.delete('/api/user/api-key');
      setApiKey(null);
      setShowDeleteConfirm(false);
      toast.success('API key deleted successfully');
    } catch (error) {
      console.error('Error deleting API key:', error);
      toast.error('Failed to delete API key');
    } finally {
      setIsDeleting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('API key copied to clipboard');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          API Keys
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage your API keys for programmatic access to PixelVault
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <div className="card p-6">
            <div className="flex items-start mb-6">
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-4 flex-shrink-0 dark:bg-indigo-900 dark:text-indigo-400">
                <Key className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  Your API Key
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Use this key to authenticate your API requests. Keep it secure and never share it publicly.
                </p>
              </div>
            </div>

            {apiKey ? (
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-6 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    API Key
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShowKey(!showKey)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      title={showKey ? 'Hide API key' : 'Show API key'}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {showKey ? (
                          <>
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                          </>
                        ) : (
                          <>
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </>
                        )}
                      </svg>
                    </button>
                    <button
                      onClick={() => copyToClipboard(apiKey.apiKey)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      title="Copy API key"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="font-mono bg-gray-100 p-2 rounded text-sm dark:bg-gray-700">
                    {showKey ? apiKey.apiKey : '•'.repeat(apiKey.apiKey.length / 2)}
                  </div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Created: {formatDate(apiKey.createdAt)}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-md p-6 mb-6 text-center dark:bg-gray-800 dark:border-gray-700">
                <Key className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No API key found
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Generate an API key to start integrating with PixelVault.
                </p>
              </div>
            )}

            <div className="flex space-x-4">
              {apiKey ? (
                <>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={isDeleting}
                    className="btn btn-outline text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
                  >
                    {isDeleting ? <LoadingSpinner size="sm" /> : (
                      <>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete Key
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleGenerateKey}
                    disabled={isGenerating}
                    className="btn btn-outline"
                  >
                    {isGenerating ? <LoadingSpinner size="sm" /> : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Regenerate Key
                      </>
                    )}
                  </button>
                </>
              ) : (
                <button
                  onClick={handleGenerateKey}
                  disabled={isGenerating}
                  className="btn btn-primary"
                >
                  {isGenerating ? <LoadingSpinner size="sm" /> : 'Generate API Key'}
                </button>
              )}
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Using Your API Key
            </h2>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Authentication
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-3">
                Include your API key in all requests using the <code className="bg-gray-100 px-1 py-0.5 rounded dark:bg-gray-800">X-API-Key</code> header:
              </p>
              <div className="bg-gray-50 p-3 rounded-md border border-gray-200 font-mono text-sm overflow-x-auto dark:bg-gray-800 dark:border-gray-700">
                <pre className="text-indigo-600 dark:text-indigo-400">X-API-Key: YOUR_API_KEY</pre>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Example Request
              </h3>
              <div className="bg-gray-50 p-3 rounded-md border border-gray-200 font-mono text-sm overflow-x-auto dark:bg-gray-800 dark:border-gray-700">
                <pre className="text-indigo-600 dark:text-indigo-400">{`curl -X GET "https://example.com/api/v1/images" \\
  -H "X-API-Key: YOUR_API_KEY"`}</pre>
              </div>
              <div className="mt-4">
                <a 
                  href="/api-docs" 
                  className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
                >
                  View full API documentation →
                </a>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 dark:bg-amber-900/20 dark:border-amber-800">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-amber-800 dark:text-amber-400">
                  Security Notice
                </h3>
                <div className="mt-2 text-sm text-amber-700 dark:text-amber-300">
                  <p>
                    Your API key grants full access to your PixelVault account. Keep it secure and never share it publicly.
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Don't store the API key in client-side code</li>
                    <li>Don't commit the API key to version control</li>
                    <li>Reset your key if you suspect it has been compromised</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Delete API Key
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete your API key? This action cannot be undone and will revoke access to any applications using this key.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn btn-outline"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteKey}
                className="btn btn-danger"
                disabled={isDeleting}
              >
                {isDeleting ? <LoadingSpinner size="sm" /> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiKeys;