import type { Equipment } from '../types';
import { Package, Tag } from 'lucide-react';

interface EquipmentDetailsProps {
  equipment: Equipment;
}

export const EquipmentDetails = ({ equipment }: EquipmentDetailsProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'in-use':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex items-center mb-4">
        <Package className="w-8 h-8 mr-3 text-blue-600" />
        <h2 className="text-3xl font-bold text-gray-800">{equipment.name}</h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <Tag className="w-5 h-5 mr-2 text-gray-600" />
          <span className="text-gray-700">
            <span className="font-semibold">Category:</span> {equipment.category}
          </span>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Barcode</p>
          <p className="text-2xl font-mono font-bold text-gray-800">{equipment.barcode}</p>
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-2">Status</p>
          <span
            className={`inline-block px-4 py-2 rounded-lg text-lg font-semibold border-2 ${getStatusColor(
              equipment.status
            )}`}
          >
            {equipment.status.toUpperCase()}
          </span>
        </div>

        <div className="mt-6 pt-6 border-t">
          <p className="text-xs text-gray-500">Equipment ID: {equipment.id}</p>
        </div>
      </div>
    </div>
  );
};
