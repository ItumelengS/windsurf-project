import type { Room, Equipment } from '../types';

const API_BASE = '/.netlify/functions';

export const api = {
  // Initialize database (call once on first deployment)
  async initDatabase() {
    const response = await fetch(`${API_BASE}/init-db`);
    return response.json();
  },

  // Get all rooms with equipment
  async getRooms(): Promise<Room[]> {
    const response = await fetch(`${API_BASE}/rooms`);
    if (!response.ok) throw new Error('Failed to fetch rooms');
    return response.json();
  },

  // Create a new room with equipment
  async createRoom(room: Room): Promise<{ success: boolean; id: string }> {
    const response = await fetch(`${API_BASE}/rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(room)
    });
    if (!response.ok) throw new Error('Failed to create room');
    return response.json();
  },

  // Scan barcode (room or equipment)
  async scanBarcode(barcode: string): Promise<{ type: 'room' | 'equipment'; data: Room | Equipment } | null> {
    const response = await fetch(`${API_BASE}/scan?barcode=${encodeURIComponent(barcode)}`);
    if (response.status === 404) return null;
    if (!response.ok) throw new Error('Failed to scan barcode');
    return response.json();
  }
};