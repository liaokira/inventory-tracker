'use client';

import { useState } from 'react';

export default function Home() {
  const [getResponse, setGetResponse] = useState<string>('');
  const [inventoryResponse, setInventoryResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const testGetRequest = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/locations');
      const data = await response.json();
      setGetResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setGetResponse(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testInventoryRequest = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/inventory');
      const data = await response.json();
      setInventoryResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setInventoryResponse(`Error: ${error}`);
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
          {/* GET Locations Request Section */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">
              Get All Locations
            </h2>
            <button
              onClick={testGetRequest}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Test GET /api/locations
            </button>
            {getResponse && (
              <pre className="mt-4 bg-zinc-100 dark:bg-zinc-800 p-4 rounded overflow-auto text-sm text-black dark:text-white">
                {getResponse}
              </pre>
            )}
          </div>

          {/* GET Inventory Request Section */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">
              Get Inventory (Locations with Items)
            </h2>
            <button
              onClick={testInventoryRequest}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Test GET /api/inventory
            </button>
            {inventoryResponse && (
              <pre className="mt-4 bg-zinc-100 dark:bg-zinc-800 p-4 rounded overflow-auto text-sm text-black dark:text-white">
                {inventoryResponse}
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
