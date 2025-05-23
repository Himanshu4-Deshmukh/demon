import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { api } from '../../lib/api';
import { Code, Copy, Terminal, Book, ExternalLink } from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface ApiEndpoint {
  path: string;
  method: string;
  description: string;
  contentType?: string;
  parameters?: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
  }>;
  response: {
    type: string;
    example: any;
  };
}

interface ApiDocumentation {
  title: string;
  version: string;
  baseUrl: string;
  authentication: {
    type: string;
    headerName: string;
    description: string;
  };
  endpoints: ApiEndpoint[];
  examples: {
    curl: Array<{
      title: string;
      command: string;
    }>;
  };
}

const ApiDocs = () => {
  const [apiDocs, setApiDocs] = useState<ApiDocumentation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'endpoints' | 'examples'>('overview');

  useEffect(() => {
    const fetchApiDocs = async () => {
      try {
        const { data } = await api.get('/api/docs');
        setApiDocs(data);
      } catch (error) {
        console.error('Error fetching API docs:', error);
        toast.error('Failed to load API documentation');
      } finally {
        setIsLoading(false);
      }
    };

    fetchApiDocs();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          API Documentation
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Integrate PixelVault with your applications using our REST API
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : apiDocs ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-4 sticky top-4">
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'overview'
                      ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  <Book className="inline-block h-4 w-4 mr-2" />
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('endpoints')}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'endpoints'
                      ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  <Code className="inline-block h-4 w-4 mr-2" />
                  Endpoints
                </button>
                <button
                  onClick={() => setActiveTab('examples')}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'examples'
                      ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  <Terminal className="inline-block h-4 w-4 mr-2" />
                  Examples
                </button>
              </nav>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Resources</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a
                      href="#"
                      className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center"
                    >
                      <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                      OpenAPI Specification
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center"
                    >
                      <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                      Client Libraries
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center"
                    >
                      <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                      Rate Limits
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && (
              <div className="card p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {apiDocs.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Version: {apiDocs.version}
                </p>

                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Base URL
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md flex items-center justify-between">
                    <code className="text-indigo-600 dark:text-indigo-400 text-sm">
                      {apiDocs.baseUrl}
                    </code>
                    <button
                      onClick={() => copyToClipboard(apiDocs.baseUrl)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Authentication
                  </h3>
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 p-4 rounded-md mb-4">
                    <h4 className="font-medium text-amber-800 dark:text-amber-400 mb-1">
                      {apiDocs.authentication.type}
                    </h4>
                    <p className="text-amber-700 dark:text-amber-300 text-sm">
                      {apiDocs.authentication.description}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                    <code className="text-indigo-600 dark:text-indigo-400 text-sm">
                      {apiDocs.authentication.headerName}: YOUR_API_KEY
                    </code>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Getting Started
                  </h3>
                  <ol className="list-decimal list-inside space-y-3 text-gray-600 dark:text-gray-300">
                    <li>
                      Generate your API key in the{' '}
                      <a href="/api-keys" className="text-indigo-600 hover:underline dark:text-indigo-400">
                        API Keys
                      </a>{' '}
                      section.
                    </li>
                    <li>
                      Use the base URL and your API key to authenticate your requests.
                    </li>
                    <li>
                      Explore the available endpoints in the documentation.
                    </li>
                    <li>
                      Use the provided examples to integrate with your application.
                    </li>
                  </ol>
                </div>
              </div>
            )}

            {activeTab === 'endpoints' && (
              <div className="space-y-6">
                {apiDocs.endpoints.map((endpoint, index) => (
                  <div key={index} className="card p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center mb-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-md mr-2 ${
                            endpoint.method === 'GET'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : endpoint.method === 'POST'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                              : endpoint.method === 'DELETE'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {endpoint.method}
                          </span>
                          <code className="text-gray-700 dark:text-gray-300 font-medium">
                            {endpoint.path}
                          </code>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          {endpoint.description}
                        </p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(`${apiDocs.baseUrl}${endpoint.path}`)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>

                    {endpoint.parameters && endpoint.parameters.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Parameters
                        </h4>
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-md overflow-hidden">
                          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-100 dark:bg-gray-700">
                              <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                  Name
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                  Type
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                  Required
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                  Description
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                              {endpoint.parameters.map((param, paramIndex) => (
                                <tr key={paramIndex}>
                                  <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                                    {param.name}
                                  </td>
                                  <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                                    {param.type}
                                  </td>
                                  <td className="px-4 py-2 text-sm">
                                    {param.required ? (
                                      <span className="text-green-600 dark:text-green-400">Yes</span>
                                    ) : (
                                      <span className="text-gray-500 dark:text-gray-400">No</span>
                                    )}
                                  </td>
                                  <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                                    {param.description}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {endpoint.contentType && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Content Type
                        </h4>
                        <code className="text-sm text-indigo-600 dark:text-indigo-400">
                          {endpoint.contentType}
                        </code>
                      </div>
                    )}

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Response
                      </h4>
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                        <pre className="text-sm text-indigo-600 dark:text-indigo-400 overflow-x-auto">
                          {JSON.stringify(endpoint.response.example, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'examples' && (
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  API Usage Examples
                </h2>
                
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    CURL Examples
                  </h3>
                  
                  {apiDocs.examples.curl.map((example, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-md overflow-hidden">
                      <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 flex justify-between items-center">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {example.title}
                        </h4>
                        <button
                          onClick={() => copyToClipboard(example.command)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="p-4 overflow-x-auto">
                        <pre className="text-sm text-indigo-600 dark:text-indigo-400">
                          {example.command}
                        </pre>
                      </div>
                    </div>
                  ))}
                  
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    JavaScript Example
                  </h3>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-md overflow-hidden">
                    <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 flex justify-between items-center">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Upload an image using Fetch API
                      </h4>
                      <button
                        onClick={() => copyToClipboard(`// Replace YOUR_API_KEY with your actual API key
const apiUrl = '${apiDocs.baseUrl}/images/upload';
const formData = new FormData();
formData.append('image', document.querySelector('#imageInput').files[0]);

fetch(apiUrl, {
  method: 'POST',
  headers: {
    'X-API-Key': 'YOUR_API_KEY'
  },
  body: formData
})
.then(response => response.json())
.then(data => console.log('Success:', data))
.catch(error => console.error('Error:', error));`)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="p-4 overflow-x-auto">
                      <pre className="text-sm text-indigo-600 dark:text-indigo-400">
{`// Replace YOUR_API_KEY with your actual API key
const apiUrl = '${apiDocs.baseUrl}/images/upload';
const formData = new FormData();
formData.append('image', document.querySelector('#imageInput').files[0]);

fetch(apiUrl, {
  method: 'POST',
  headers: {
    'X-API-Key': 'YOUR_API_KEY'
  },
  body: formData
})
.then(response => response.json())
.then(data => console.log('Success:', data))
.catch(error => console.error('Error:', error));`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            API documentation unavailable
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Unable to load API documentation at this time. Please try again later.
          </p>
        </div>
      )}
    </div>
  );
};

export default ApiDocs;