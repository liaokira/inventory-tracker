'use client';

import { useState } from 'react';

interface Location {
  id: string;
  name: string;
}

interface SearchBarProps {
  locations: Location[];
  onSearch: (filters: SearchFilters) => void;
  onClear: () => void;
}

export interface SearchFilters {
  category?: string;
  location_id?: string;
  name?: string;
}

export default function SearchBar({ locations, onSearch, onClear }: SearchBarProps) {
  const [category, setCategory] = useState<string>('');
  const [locationId, setLocationId] = useState<string>('');
  const [name, setName] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const filters: SearchFilters = {};
    if (category) filters.category = category;
    if (locationId) filters.location_id = locationId;
    if (name.trim()) filters.name = name.trim();

    onSearch(filters);
  };

  const handleClear = () => {
    setCategory('');
    setLocationId('');
    setName('');
    onClear();
  };

  const hasFilters = category || locationId || name.trim();

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3 bg-white dark:bg-zinc-900 p-4 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-700">
      {/* Category Dropdown */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[130px]"
        >
          <option value="">All Categories</option>
          <option value="Electronic">Electronic</option>
          <option value="Furniture">Furniture</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Location Dropdown */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
          Location
        </label>
        <select
          value={locationId}
          onChange={(e) => setLocationId(e.target.value)}
          className="px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px]"
        >
          <option value="">All Locations</option>
          {locations.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.name}
            </option>
          ))}
        </select>
      </div>

      {/* Name Text Field */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
          Item Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Search items..."
          className="px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[180px]"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-auto">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Search
        </button>
        {hasFilters && (
          <button
            type="button"
            onClick={handleClear}
            className="bg-zinc-500 hover:bg-zinc-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Clear
          </button>
        )}
      </div>
    </form>
  );
}

