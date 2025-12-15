'use client';

import { useState, useEffect } from 'react';
import LocationColumn from '@/components/LocationColumn';
import ItemCard from '@/components/ItemCard';
import EditItemCard from '@/components/EditItemCard';
import EditLocationColumn from '@/components/EditLocationColumn';

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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editingLocationId, setEditingLocationId] = useState<string | null>(null);

  // Fetch inventory data
  const fetchInventory = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/inventory');
      const data = await response.json();
      setInventoryData(data);
      setError(null);
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
    fetchInventory();
  };

  const handleItemClick = (itemId: number) => {
    setEditingItemId(itemId);
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
  };

  const handleSuccessEdit = () => {
    setEditingItemId(null);
    fetchInventory();
  };

  const handleLocationClick = (locationId: string) => {
    setEditingLocationId(locationId);
  };

  const handleCancelLocationEdit = () => {
    setEditingLocationId(null);
  };

  const handleSuccessLocationEdit = () => {
    setEditingLocationId(null);
    fetchInventory();
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
      <main className="w-full">
        {/* Header with Add Location Button */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-black dark:text-white">
            Inventory Tracker
          </h1>
          <button
            onClick={handleAddLocation}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2"
          >
            <span className="text-xl">+</span> Location
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-xl text-zinc-600 dark:text-zinc-400">
              Loading inventory...
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Inventory Display */}
        {!loading && inventoryData && inventoryData.length > 0 && (
          <div className="flex gap-4 overflow-x-auto pb-4">
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
                  onItemAdded={fetchInventory}
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
            {showAddLocation && (
              <EditLocationColumn
                onCancel={handleCancelLocation}
                onSuccess={handleSuccessLocation}
              />
            )}
          </div>
        )}

        {/* Empty State with Add Location Option */}
        {!loading && inventoryData && inventoryData.length === 0 && (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {showAddLocation && (
              <EditLocationColumn
                onCancel={handleCancelLocation}
                onSuccess={handleSuccessLocation}
              />
            )}
          </div>
        )}

        {/* Empty State Message */}
        {!loading && inventoryData && inventoryData.length === 0 && !showAddLocation && (
          <div className="text-center py-20">
            <p className="text-xl text-zinc-600 dark:text-zinc-400">
              No locations found. Click "+ Location" to add your first location.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
