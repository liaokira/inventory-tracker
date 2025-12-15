import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET(request: NextRequest) {
  try {
    // Initialize Neon database connection
    const databaseUrl = process.env.NODE_ENV === 'production' 
      ? process.env.PROD_DB 
      : process.env.DEV_DB;
    
    const sql = neon(databaseUrl!);
    
    // Query locations with their items using JOIN and JSON aggregation
    const result = await sql`
      SELECT 
        l.id,
        l.name,
        COALESCE(
          json_agg(
            json_build_object(
              'name', i.name,
              'category', i.category
            )
          ) FILTER (WHERE i.id IS NOT NULL),
          '[]'
        ) as items
      FROM locations l
      LEFT JOIN items i ON l.id = i.location_id
      GROUP BY l.id, l.name
      ORDER BY l.name
    `;

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

