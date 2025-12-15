import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

// Example serverless API function
// This endpoint demonstrates a basic GET and POST request handler

export async function GET(request: NextRequest) {
  try {
    // Initialize Neon database connection
    // Use PROD_DB in production, DEV_DB in development
    const databaseUrl = process.env.NODE_ENV === 'production' 
      ? process.env.PROD_DB 
      : process.env.DEV_DB;
    
    const sql = neon(databaseUrl!);
    
    // Query all rows from the locations table
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    return NextResponse.json(
      {
        message: 'Data received successfully',
        receivedData: body,
        timestamp: new Date().toISOString(),
        method: 'POST',
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid JSON or Internal Server Error' },
      { status: 400 }
    );
  }
}

