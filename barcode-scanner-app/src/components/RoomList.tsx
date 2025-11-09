import type { Room } from '../types';
import { MapPin, Package, Eye } from 'lucide-react';

interface RoomListProps {
  rooms: Room[];
  onViewRoom: (room: Room) => void;
}

export const RoomList = ({ rooms, onViewRoom }: RoomListProps) => {
  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">All Rooms</h2>
      
      {rooms.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <p className="text-gray-500 text-lg">No rooms created yet.</p>
          <p className="text-gray-400 mt-2">Click "Create Room" to add your first room.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6 border border-gray-200"
            >
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{room.name}</h3>
                <div className="flex items-center text-gray-600 text-sm mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{room.location}</span>
                </div>
                <div className="bg-gray-100 px-3 py-1 rounded inline-block">
                  <span className="text-xs text-gray-600 font-mono">{room.barcode}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center text-gray-600">
                  <Package className="w-5 h-5 mr-2" />
                  <span className="font-semibold">{room.equipment.length}</span>
                  <span className="ml-1 text-sm">items</span>
                </div>
                <button
                  onClick={() => onViewRoom(room)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
