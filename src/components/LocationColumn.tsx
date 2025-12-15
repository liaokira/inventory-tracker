'use client';

import { ReactNode, useState } from 'react';
import EditItemCard from './EditItemCard';

interface LocationColumnProps {
  title: string;
  locationId: string;
  children: ReactNode;
  onItemAdded?: () => void;
  onTitleClick?: () => void;
}

export default function LocationColumn({ 
  title, 
  locationId, 
  children,
  onItemAdded,
  onTitleClick 
}: LocationColumnProps) {
  const [showAddItem, setShowAddItem] = useState(false);

  const handleAddItem = () => {
    setShowAddItem(true);
  };

  const handleCancel = () => {
    setShowAddItem(false);
  };

  const handleSuccess = () => {
    setShowAddItem(false);
    // Notify parent component to refresh data
    if (onItemAdded) {
      onItemAdded();
    }
  };

  return (
    <div className="flex flex-col min-w-[300px] max-w-[350px] h-full bg-zinc-100 dark:bg-zinc-900 rounded-lg p-4 shadow-lg">
      {/* Column Title */}
      <div className="mb-4 pb-3 border-b-2 border-zinc-300 dark:border-zinc-700 flex justify-between items-center flex-shrink-0">
        <h2 
          className="text-xl font-bold text-black dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          onClick={onTitleClick}
        >
          {title}
        </h2>
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors" 
          onClick={handleAddItem}
        >
          +
        </button>
      </div>
      
      {/* Cards Container */}
      <div className="flex flex-col gap-3 overflow-y-auto flex-1 min-h-0">
        {/* Show EditItemCard at the top when adding */}
        {showAddItem && (
          <EditItemCard
            locationId={locationId}
            locationName={title}
            onCancel={handleCancel}
            onSuccess={handleSuccess}
          />
        )}
        
        {children}
      </div>
    </div>
  );
}

