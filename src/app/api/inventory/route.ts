import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET(request: NextRequest) {
  try {
    // Initialize Neon database connection
    const databaseUrl = process.env.NODE_ENV === 'production' 
      ? process.env.PROD_DB 
      : process.env.DEV_DB;
    
    const sql = neon(databaseUrl!);
    
    // Get search query parameters
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const location_id = searchParams.get('location_id');
    const name = searchParams.get('name');

    let result;

    if (category || name || location_id) {
      // Filtered query - build conditions dynamically
      const categoryCondition = category ? sql`AND i.category = ${category}` : sql``;
      const nameCondition = name ? sql`AND i.name ILIKE ${'%' + name + '%'}` : sql``;
      const locationCondition = location_id ? sql`WHERE l.id = ${location_id}` : sql``;

      result = await sql`
        SELECT 
          l.id,
          l.name,
          COALESCE(
            json_agg(
              json_build_object(
                'id', i.id,
                'name', i.name,
                'category', i.category,
                'quantity', i.quantity,
                'notes', i.notes
              ) ORDER BY i.name
            ) FILTER (WHERE i.id IS NOT NULL 
              ${categoryCondition}
              ${nameCondition}
            ),
            '[]'
          ) as items
        FROM locations l
        LEFT JOIN items i ON l.id = i.location_id
        ${locationCondition}
        GROUP BY l.id, l.name
        HAVING COUNT(i.id) FILTER (WHERE i.id IS NOT NULL
          ${categoryCondition}
          ${nameCondition}
        ) > 0
        ORDER BY l.name
      `;
    } else {
      // No filters - return all locations with all items
      result = await sql`
        SELECT 
          l.id,
          l.name,
          COALESCE(
            json_agg(
              json_build_object(
                'id', i.id,
                'name', i.name,
                'category', i.category,
                'quantity', i.quantity,
                'notes', i.notes
              ) ORDER BY i.name
            ) FILTER (WHERE i.id IS NOT NULL),
            '[]'
          ) as items
        FROM locations l
        LEFT JOIN items i ON l.id = i.location_id
        GROUP BY l.id, l.name
        ORDER BY l.name
      `;
    }

    return NextResponse.json(
      result,
      { status: 200 }
    );
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch inventory',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

