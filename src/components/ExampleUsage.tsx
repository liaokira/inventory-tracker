'use client';

import LocationColumn from './LocationColumn';
import ItemCard from './ItemCard';

export default function ExampleUsage() {
  return (
    <div className="flex gap-4 overflow-x-auto p-4">
      {/* Example Column 1 */}
      <LocationColumn title="Warehouse A">
        <ItemCard
          name="Laptop"
          category="Electronics"
          quantity={15}
          location="Warehouse A"
          notes="Dell XPS 15, needs inventory check"
        />
        <ItemCard
          name="Office Chair"
          category="Furniture"
          quantity={25}
          location="Warehouse A"
        />
        <ItemCard
          name="Monitor"
          category="Electronics"
          quantity={30}
          location="Warehouse A"
          notes="27-inch, 4K resolution"
        />
      </LocationColumn>

      {/* Example Column 2 */}
      <LocationColumn title="Warehouse B">
        <ItemCard
          name="Desk"
          category="Furniture"
          quantity={10}
          location="Warehouse B"
          notes="Standing desks, adjustable height"
        />
        <ItemCard
          name="Keyboard"
          category="Electronics"
          quantity={50}
          location="Warehouse B"
        />
      </LocationColumn>

      {/* Example Column 3 */}
      <LocationColumn title="Storage Room">
        <ItemCard
          name="Paper"
          category="Office Supplies"
          quantity={100}
          location="Storage Room"
        />
        <ItemCard
          name="Pens"
          category="Office Supplies"
          quantity={200}
          location="Storage Room"
          notes="Blue and black ink"
        />
      </LocationColumn>
    </div>
  );
}

