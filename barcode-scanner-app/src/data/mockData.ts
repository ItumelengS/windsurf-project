import type { Room, Equipment } from '../types';

// Mock equipment data
export const mockEquipment: Equipment[] = [
  {
    id: 'eq1',
    name: 'Projector',
    barcode: 'EQ001',
    category: 'Electronics',
    status: 'available'
  },
  {
    id: 'eq2',
    name: 'Whiteboard',
    barcode: 'EQ002',
    category: 'Furniture',
    status: 'available'
  },
  {
    id: 'eq3',
    name: 'Conference Phone',
    barcode: 'EQ003',
    category: 'Electronics',
    status: 'available'
  },
  {
    id: 'eq4',
    name: 'Laptop',
    barcode: 'EQ004',
    category: 'Electronics',
    status: 'in-use'
  },
  {
    id: 'eq5',
    name: 'Desk',
    barcode: 'EQ005',
    category: 'Furniture',
    status: 'available'
  },
  {
    id: 'eq6',
    name: 'Office Chair',
    barcode: 'EQ006',
    category: 'Furniture',
    status: 'available'
  },
  {
    id: 'eq7',
    name: 'Monitor',
    barcode: 'EQ007',
    category: 'Electronics',
    status: 'available'
  },
  {
    id: 'eq8',
    name: 'Printer',
    barcode: 'EQ008',
    category: 'Electronics',
    status: 'maintenance'
  }
];

// Mock room data
export const mockRooms: Room[] = [
  {
    id: 'room1',
    name: 'Conference Room A',
    barcode: 'ROOM001',
    location: 'Floor 1, Building A',
    equipment: [mockEquipment[0], mockEquipment[1], mockEquipment[2]]
  },
  {
    id: 'room2',
    name: 'Office 101',
    barcode: 'ROOM002',
    location: 'Floor 1, Building A',
    equipment: [mockEquipment[3], mockEquipment[4], mockEquipment[5], mockEquipment[6]]
  },
  {
    id: 'room3',
    name: 'IT Lab',
    barcode: 'ROOM003',
    location: 'Floor 2, Building B',
    equipment: [mockEquipment[7]]
  }
];

// Function to find room or equipment by barcode
export const findByBarcode = (barcode: string): { type: 'room' | 'equipment'; data: Room | Equipment } | null => {
  // Check rooms first
  const room = mockRooms.find(r => r.barcode === barcode);
  if (room) {
    return { type: 'room', data: room };
  }

  // Check equipment
  const equipment = mockEquipment.find(e => e.barcode === barcode);
  if (equipment) {
    return { type: 'equipment', data: equipment };
  }

  return null;
};
