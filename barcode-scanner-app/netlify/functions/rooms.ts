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
  const method = req.method;

  try {
    // GET all rooms with equipment
    if (method === 'GET') {
      const rooms = await sql`
        SELECT * FROM rooms ORDER BY created_at DESC
      `;

      const roomsWithEquipment = await Promise.all(
        rooms.map(async (room) => {
          const equipment = await sql`
            SELECT * FROM equipment WHERE room_id = ${room.id}
          `;
          return { ...room, equipment };
        })
      );

      return new Response(JSON.stringify(roomsWithEquipment), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // POST create new room with equipment
    if (method === 'POST') {
      const body = await req.json();
      const { id, name, barcode, location, equipment } = body;

      // Insert room
      await sql`
        INSERT INTO rooms (id, name, barcode, location)
        VALUES (${id}, ${name}, ${barcode}, ${location})
      `;

      // Insert equipment
      if (equipment && equipment.length > 0) {
        for (const item of equipment) {
          await sql`
            INSERT INTO equipment (id, room_id, name, barcode, category, status)
            VALUES (${item.id}, ${id}, ${item.name}, ${item.barcode}, ${item.category}, ${item.status})
          `;
        }
      }

      return new Response(JSON.stringify({ success: true, id }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response('Method not allowed', { status: 405 });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};