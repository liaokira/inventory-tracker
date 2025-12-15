import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

// Get database connection
function getDbConnection() {
  const databaseUrl = process.env.NODE_ENV === 'production' 
    ? process.env.PROD_DB 
    : process.env.DEV_DB;
  return neon(databaseUrl!);
}

// GET - Fetch all locations
export async function GET(request: NextRequest) {
  try {
    const sql = getDbConnection();
    const locations = await sql`SELECT * FROM locations`;

    return NextResponse.json(
      {
        success: true,
        count: locations.length,
        data: locations,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch locations',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST - Create a new location
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name } = body;

    // Validate required field
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { 
          success: false,
          error: 'Location name is required and must be a non-empty string'
        },
        { status: 400 }
      );
    }

    const sql = getDbConnection();
    
    // Insert new location and return the created record
    const result = await sql`
      INSERT INTO locations (name)
      VALUES (${name.trim()})
      RETURNING *
    `;

    return NextResponse.json(
      {
        success: true,
        data: result[0],
        message: 'Location created successfully'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create location',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

