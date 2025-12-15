'use client';

import { useState } from 'react';

interface Location {
  id: string;
  name: string;
}

interface EditItemCardProps {
  locationId: string;
  locationName: string;
  onCancel: () => void;
  onSuccess: () => void;
  // Optional: for editing existing items
  itemId?: number;
  initialName?: string;
  initialCategory?: string;
  initialQuantity?: number;
  initialNotes?: string;
  // Optional: list of all locations for dropdown in edit mode
  availableLocations?: Location[];
}

export default function EditItemCard({ 
  locationId, 
  locationName, 
  onCancel,
  onSuccess,
  itemId,
  initialName = '',
  initialCategory = 'Electronic',
  initialQuantity = 0,
  initialNotes = '',
  availableLocations = []
}: EditItemCardProps) {
  const isEditMode = itemId !== undefined;
  const [name, setName] = useState(initialName);
  const [category, setCategory] = useState(initialCategory);
  const [quantity, setQuantity] = useState<number>(initialQuantity);
  const [notes, setNotes] = useState(initialNotes);
  const [selectedLocationId, setSelectedLocationId] = useState(locationId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    // Validate fields
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    if (!category.trim()) {
      setError('Category is required');
      return;
    }
    if (quantity < 0) {
      setError('Quantity must be non-negative');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = isEditMode ? `/api/items/${itemId}` : '/api/items';
      const method = isEditMode ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location_id: selectedLocationId,
          name: name.trim(),
          category: category.trim(),
          quantity,
          notes: notes.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Failed to ${isEditMode ? 'update' : 'create'} item`);
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${isEditMode ? 'update' : 'create'} item`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg shadow-md p-4 border-2 border-blue-300 dark:border-blue-700">
      <h3 className="text-lg font-semibold text-black dark:text-white mb-3">
        {isEditMode ? 'Edit Item' : 'Add New Item'}
      </h3>

      {error && (
        <div className="mb-3 p-2 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-700 rounded text-sm text-red-700 dark:text-red-200">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Item name"
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Category *
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            <option value="Electronic">Electronic</option>
            <option value="Furniture">Furniture</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Quantity Input */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Quantity *
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            placeholder="0"
            min="0"
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
        </div>

        {/* Location Field - Dropdown in edit mode, read-only in add mode */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Location {isEditMode && '*'}
          </label>
          {isEditMode && availableLocations.length > 0 ? (
            <select
              value={selectedLocationId}
              onChange={(e) => setSelectedLocationId(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              {availableLocations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          ) : (
            <div className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400">
              {locationName}
            </div>
          )}
        </div>

        {/* Notes Input */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional notes..."
            rows={2}
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            disabled={loading}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (isEditMode ? 'Updating...' : 'Creating...') : 'Submit'}
          </button>
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 bg-zinc-500 hover:bg-zinc-600 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

