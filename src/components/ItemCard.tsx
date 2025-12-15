interface ItemCardProps {
  name: string;
  category: string;
  quantity: number;
  location: string;
  notes?: string;
  onClick?: () => void;
}

export default function ItemCard({ 
  name, 
  category, 
  quantity, 
  location, 
  notes,
  onClick 
}: ItemCardProps) {
  return (
    <div 
      onClick={onClick}
      className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-4 border border-zinc-200 dark:border-zinc-700 hover:shadow-lg transition-shadow cursor-pointer hover:border-blue-400 dark:hover:border-blue-600"
    >
      {/* Item Name */}
      <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
        {name}
      </h3>
      
      {/* Item Details */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Category:
          </span>
          <span className="text-sm text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-700 px-2 py-1 rounded">
            {category}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Quantity:
          </span>
          <span className="text-sm text-zinc-700 dark:text-zinc-300 font-semibold">
            {quantity}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Location:
          </span>
          <span className="text-sm text-zinc-700 dark:text-zinc-300">
            {location}
          </span>
        </div>
        
        {/* Optional Notes */}
        {notes && (
          <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-700">
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400 block mb-1">
              Notes:
            </span>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 italic">
              {notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

