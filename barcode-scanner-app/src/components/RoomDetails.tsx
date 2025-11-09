import type { Room } from '../types';
import { MapPin, Package } from 'lucide-react';

interface RoomDetailsProps {
  room: Room;
}

export const RoomDetails = ({ room }: RoomDetailsProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'in-use':
        return 'bg-blue-100 text-blue-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="border-b pb-4 mb-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">{room.name}</h2>
        <div className="flex items-center text-gray-600">
          <MapPin className="w-5 h-5 mr-2" />
          <span>{room.location}</span>
        </div>
        <div className="mt-2 text-sm text-gray-500">
          Barcode: <span className="font-mono font-semibold">{room.barcode}</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center mb-3">
          <Package className="w-6 h-6 mr-2 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-800">
            Equipment ({room.equipment.length})
          </h3>
        </div>

        {room.equipment.length === 0 ? (
          <p className="text-gray-500 italic">No equipment in this room</p>
        ) : (
          <div className="grid gap-3">
            {room.equipment.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg text-gray-800">{item.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Category: {item.category}
                    </p>
                    <p className="text-xs text-gray-500 font-mono mt-1">
                      Barcode: {item.barcode}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
