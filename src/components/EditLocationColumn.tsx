'use client';

import { useState } from 'react';

interface EditLocationColumnProps {
  onCancel: () => void;
  onSuccess: () => void;
  // Optional: for editing existing locations
  locationId?: string;
  initialName?: string;
}

export default function EditLocationColumn({ 
  onCancel,
  onSuccess,
  locationId,
  initialName = ''
}: EditLocationColumnProps) {
  const isEditMode = locationId !== undefined;
  const [name, setName] = useState(initialName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    // Validate field
    if (!name.trim()) {
      setError('Location name is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = isEditMode ? `/api/locations/${locationId}` : '/api/locations';
      const method = isEditMode ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Failed to ${isEditMode ? 'update' : 'create'} location`);
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${isEditMode ? 'update' : 'create'} location`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-w-[300px] max-w-[350px] h-full bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 shadow-lg border-2 border-blue-300 dark:border-blue-700">
      <div className="mb-4 pb-3 border-b-2 border-blue-300 dark:border-blue-700">
        <h2 className="text-xl font-bold text-black dark:text-white">
          {isEditMode ? 'Edit Location' : 'Add New Location'}
        </h2>
      </div>

      {error && (
        <div className="mb-3 p-2 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-700 rounded text-sm text-red-700 dark:text-red-200">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Location Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter location name"
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={loading}
            autoFocus
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-2">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (isEditMode ? 'Updating...' : 'Creating...') : 'Submit'}
          </button>
          <button
            onClick={onCancel}
            disabled={loading}
            className="w-full bg-zinc-500 hover:bg-zinc-600 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

