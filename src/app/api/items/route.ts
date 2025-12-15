import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

// Get database connection
function getDbConnection() {
  const databaseUrl = process.env.NODE_ENV === 'production' 
    ? process.env.PROD_DB 
    : process.env.DEV_DB;
  return neon(databaseUrl!);
}

// POST - Create a new item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { location_id, name, category, quantity, notes } = body;

    // Validate required fields
    if (!location_id || typeof location_id !== 'string') {
      return NextResponse.json(
        { 
          success: false,
          error: 'location_id is required and must be a string'
        },
        { status: 400 }
      );
    }

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { 
          success: false,
          error: 'name is required and must be a non-empty string'
        },
        { status: 400 }
      );
    }

    if (!category || typeof category !== 'string' || category.trim() === '') {
      return NextResponse.json(
        { 
          success: false,
          error: 'category is required and must be a non-empty string'
        },
        { status: 400 }
      );
    }

    if (quantity === undefined || typeof quantity !== 'number' || quantity < 0) {
      return NextResponse.json(
        { 
          success: false,
          error: 'quantity is required and must be a non-negative number'
        },
        { status: 400 }
      );
    }

    const sql = getDbConnection();
    
    // Insert new item and return the created record
    const result = await sql`
      INSERT INTO items (location_id, name, category, quantity, notes)
      VALUES (
        ${location_id},
        ${name.trim()},
        ${category.trim()},
        ${quantity},
        ${notes ? notes.trim() : null}
      )
      RETURNING *
    `;

    return NextResponse.json(
      {
        success: true,
        data: result[0],
        message: 'Item created successfully'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Database error:', error);
    
    // Check for foreign key constraint violation
    if (error instanceof Error && error.message.includes('foreign key')) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid location_id. Location does not exist.'
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create item',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

