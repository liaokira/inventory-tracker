import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

// Get database connection
function getDbConnection() {
  const databaseUrl = process.env.NODE_ENV === 'production' 
    ? process.env.PROD_DB 
    : process.env.DEV_DB;
  return neon(databaseUrl!);
}

// PUT - Update an existing item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { location_id, name, category, quantity, notes } = body;

    // Validate required fields
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
    
    // Update item and return the updated record
    const result = await sql`
      UPDATE items
      SET 
        location_id = ${location_id},
        name = ${name.trim()},
        category = ${category.trim()},
        quantity = ${quantity},
        notes = ${notes ? notes.trim() : null}
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Item not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: result[0],
        message: 'Item updated successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to update item',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete an item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sql = getDbConnection();
    
    const result = await sql`
      DELETE FROM items
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Item not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Item deleted successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to delete item',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

