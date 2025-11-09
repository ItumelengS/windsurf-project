export interface Equipment {
  id: string;
  name: string;
  barcode: string;
  category: string;
  status: 'available' | 'in-use' | 'maintenance';
}

export interface Room {
  id: string;
  name: string;
  barcode: string;
  location: string;
  equipment: Equipment[];
}

export interface ScanResult {
  type: 'room' | 'equipment';
  data: Room | Equipment;
}
