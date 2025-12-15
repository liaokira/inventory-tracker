'use client';

import { useState } from 'react';

export default function Home() {
  const [getResponse, setGetResponse] = useState<string>('');
  const [postResponse, setPostResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const testGetRequest = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/example?name=Developer');
      const data = await response.json();
      setGetResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setGetResponse(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testPostRequest = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/example', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
        }),
      });
      const data = await response.json();
      setPostResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setPostResponse(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-black dark:text-white mb-8">
          Serverless API Test
        </h1>

        <div className="space-y-6">
          {/* GET Request Section */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">
              GET Request
            </h2>
            <button
              onClick={testGetRequest}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Test GET /api/example?name=Developer
            </button>
            {getResponse && (
              <pre className="mt-4 bg-zinc-100 dark:bg-zinc-800 p-4 rounded overflow-auto text-sm text-black dark:text-white">
                {getResponse}
              </pre>
            )}
          </div>

          {/* POST Request Section */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">
              POST Request
            </h2>
            <button
              onClick={testPostRequest}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Test POST /api/example
            </button>
            {postResponse && (
              <pre className="mt-4 bg-zinc-100 dark:bg-zinc-800 p-4 rounded overflow-auto text-sm text-black dark:text-white">
                {postResponse}
              </pre>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">
              API Structure
            </h2>
            <p className="text-zinc-700 dark:text-zinc-300">
              API endpoints are located in <code className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">src/app/api/</code> directory.
            </p>
            <p className="text-zinc-700 dark:text-zinc-300 mt-2">
              Example endpoint: <code className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">src/app/api/example/route.ts</code>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
