'use client';

import { useState, useEffect } from 'react';
import LocationColumn from '@/components/LocationColumn';
import ItemCard from '@/components/ItemCard';
import EditItemCard from '@/components/EditItemCard';
import EditLocationColumn from '@/components/EditLocationColumn';
import SearchBar, { SearchFilters } from '@/components/SearchBar';

interface Item {
  id: number;
  name: string;
  category: string;
  quantity: number;
  notes?: string;
}

interface Location {
  id: string;
  name: string;
  items: Item[];
}

export default function Home() {
  const [inventoryData, setInventoryData] = useState<Location[] | null>(null);
  const [allLocations, setAllLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editingLocationId, setEditingLocationId] = useState<string | null>(null);
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>({});

  // Fetch inventory data
  const fetchInventory = async (filters?: SearchFilters) => {
    setLoading(true);
    try {
      // Build query string from filters
      const params = new URLSearchParams();
      if (filters?.category) params.append('category', filters.category);
      if (filters?.location_id) params.append('location_id', filters.location_id);
      if (filters?.name) params.append('name', filters.name);
      
      const queryString = params.toString();
      const url = queryString ? `/api/inventory?${queryString}` : '/api/inventory';
      
      const response = await fetch(url);
      const data = await response.json();
      setInventoryData(data);
      setError(null);
      
      // If no filters, also update the full locations list for dropdown
      if (!filters || Object.keys(filters).length === 0) {
        setAllLocations(data);
      }
    } catch (err) {
      setError(`Error loading inventory: ${err}`);
      console.error('Error fetching inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch inventory data on page load
  useEffect(() => {
    fetchInventory();
  }, []);

  const handleAddLocation = () => {
    setShowAddLocation(true);
  };

  const handleCancelLocation = () => {
    setShowAddLocation(false);
  };

  const handleSuccessLocation = () => {
    setShowAddLocation(false);
    fetchInventory(currentFilters);
  };

  const handleItemClick = (itemId: number) => {
    setEditingItemId(itemId);
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
  };

  const handleSuccessEdit = () => {
    setEditingItemId(null);
    fetchInventory(currentFilters);
  };

  const handleLocationClick = (locationId: string) => {
    setEditingLocationId(locationId);
  };

  const handleCancelLocationEdit = () => {
    setEditingLocationId(null);
  };

  const handleSuccessLocationEdit = () => {
    setEditingLocationId(null);
    fetchInventory(currentFilters);
  };

  const handleSearch = (filters: SearchFilters) => {
    setCurrentFilters(filters);
    fetchInventory(filters);
  };

  const handleClearSearch = () => {
    setCurrentFilters({});
    fetchInventory();
  };

  return (
    <div className="h-screen bg-zinc-50 dark:bg-black p-8 flex flex-col">
      <main className="w-full flex flex-col flex-1 min-h-0">
        {/* Header with Search */}
        <div className="flex justify-between items-center mb-6 flex-shrink-0">
          <h1 className="text-4xl font-bold text-black dark:text-white">
            Inventory Tracker
          </h1>
          <SearchBar
            locations={allLocations.map(loc => ({ id: loc.id, name: loc.name }))}
            onSearch={handleSearch}
            onClear={handleClearSearch}
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center flex-1">
            <div className="text-xl text-zinc-600 dark:text-zinc-400">
              Loading inventory...
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded flex-shrink-0">
            {error}
          </div>
        )}

        {/* Inventory Display */}
        {!loading && inventoryData && inventoryData.length > 0 && (
          <div className="flex gap-4 overflow-x-auto overflow-y-hidden flex-1 pb-4">
            {inventoryData.map((location) => (
              editingLocationId === location.id ? (
                <EditLocationColumn
                  key={location.id}
                  locationId={location.id}
                  initialName={location.name}
                  onCancel={handleCancelLocationEdit}
                  onSuccess={handleSuccessLocationEdit}
                />
              ) : (
                <LocationColumn 
                  key={location.id} 
                  title={location.name}
                  locationId={location.id}
                  onItemAdded={() => fetchInventory(currentFilters)}
                  onTitleClick={() => handleLocationClick(location.id)}
                >
                  {location.items.length > 0 ? (
                    location.items.map((item) => (
                      editingItemId === item.id ? (
                        <EditItemCard
                          key={item.id}
                          locationId={location.id}
                          locationName={location.name}
                          itemId={item.id}
                          initialName={item.name}
                          initialCategory={item.category}
                          initialQuantity={item.quantity}
                          initialNotes={item.notes || ''}
                          availableLocations={inventoryData.map(loc => ({ id: loc.id, name: loc.name }))}
                          onCancel={handleCancelEdit}
                          onSuccess={handleSuccessEdit}
                        />
                      ) : (
                        <ItemCard
                          key={item.id}
                          name={item.name}
                          category={item.category}
                          quantity={item.quantity}
                          location={location.name}
                          notes={item.notes}
                          onClick={() => handleItemClick(item.id)}
                        />
                      )
                    ))
                  ) : (
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 italic">
                      No items in this location
                    </p>
                  )}
                </LocationColumn>
              )
            ))}

 
            
              {/* Add Location Column */}
              {showAddLocation ? (
                <EditLocationColumn
                  onCancel={handleCancelLocation}
                  onSuccess={handleSuccessLocation}
                />
              ) : (
                <button
                  onClick={handleAddLocation}
                  className="min-w-[60px] h-[60px] bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 rounded-lg font-bold text-3xl transition-colors"
                  title="Add Location"
                >
                  +
                </button>
              )}
            </div>
          )}

        {/* Empty State with Add Location Option */}
        {!loading && inventoryData && inventoryData.length === 0 && (
          <div className="flex gap-4 overflow-x-auto flex-1 pb-4">
            {showAddLocation ? (
              <EditLocationColumn
                onCancel={handleCancelLocation}
                onSuccess={handleSuccessLocation}
              />
            ) : (
              <div className="flex flex-col items-center justify-center w-full gap-4">
                <p className="text-xl text-zinc-600 dark:text-zinc-400">
                  No locations found. Click "+" to add your first location.
                </p>
                <button
                  onClick={handleAddLocation}
                  className="w-16 h-16 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 rounded-lg font-bold text-3xl transition-colors"
                  title="Add Location"
                >
                  +
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
