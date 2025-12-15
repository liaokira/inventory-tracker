import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

// Get database connection
function getDbConnection() {
  const databaseUrl = process.env.NODE_ENV === 'production' 
    ? process.env.PROD_DB 
    : process.env.DEV_DB;
  return neon(databaseUrl!);
}

// PUT - Update an existing location
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
    
    // Update location and return the updated record
    const result = await sql`
      UPDATE locations
      SET name = ${name.trim()}
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Location not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: result[0],
        message: 'Location updated successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to update location',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete a location
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sql = getDbConnection();
    
    const result = await sql`
      DELETE FROM locations
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Location not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Location deleted successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to delete location',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

