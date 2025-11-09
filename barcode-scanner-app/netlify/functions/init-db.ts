import { neon } from '@neondatabase/serverless';

export default async (req: Request) => {
  try {
    const sql = neon(process.env.DATABASE_URL!);

    // Create rooms table
    await sql`
      CREATE TABLE IF NOT EXISTS rooms (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        barcode TEXT UNIQUE NOT NULL,
        location TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create equipment table
    await sql`
      CREATE TABLE IF NOT EXISTS equipment (
        id TEXT PRIMARY KEY,
        room_id TEXT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        barcode TEXT UNIQUE NOT NULL,
        category TEXT NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('available', 'in-use', 'maintenance')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    return new Response(JSON.stringify({ success: true, message: 'Database initialized' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};