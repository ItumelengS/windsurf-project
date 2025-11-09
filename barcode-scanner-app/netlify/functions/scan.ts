import { neon } from '@neondatabase/serverless';

export default async (req: Request) => {
  if (!process.env.DATABASE_URL) {
    return new Response(JSON.stringify({ error: 'DATABASE_URL not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const sql = neon(process.env.DATABASE_URL);
  const url = new URL(req.url);
  const barcode = url.searchParams.get('barcode');

  if (!barcode) {
    return new Response(JSON.stringify({ error: 'Barcode parameter required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Check if it's a room barcode
    const room = await sql`
      SELECT * FROM rooms WHERE barcode = ${barcode}
    `;

    if (room.length > 0) {
      const equipment = await sql`
        SELECT * FROM equipment WHERE room_id = ${room[0].id}
      `;
      return new Response(JSON.stringify({
        type: 'room',
        data: { ...room[0], equipment }
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if it's equipment barcode
    const equipment = await sql`
      SELECT * FROM equipment WHERE barcode = ${barcode}
    `;

    if (equipment.length > 0) {
      return new Response(JSON.stringify({
        type: 'equipment',
        data: equipment[0]
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Barcode not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};