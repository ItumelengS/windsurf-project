import { useState } from 'react';
import { Plus, X, Trash2, Save } from 'lucide-react';
import type { Room, Equipment } from '../types';

interface EditRoomProps {
  room: Room;
  onSave: (room: Room) => void;
  onClose: () => void;
}

export const EditRoom = ({ room, onSave, onClose }: EditRoomProps) => {
  const [roomName, setRoomName] = useState(room.name);
  const [roomBarcode, setRoomBarcode] = useState(room.barcode);
  const [roomLocation, setRoomLocation] = useState(room.location);
  const [equipment, setEquipment] = useState<Equipment[]>(room.equipment);
  const [showEquipmentForm, setShowEquipmentForm] = useState(false);

  // Equipment form state
  const [eqName, setEqName] = useState('');
  const [eqBarcode, setEqBarcode] = useState('');
  const [eqCategory, setEqCategory] = useState('');
  const [eqStatus, setEqStatus] = useState<'available' | 'in-use' | 'maintenance'>('available');
  const [editingEquipmentId, setEditingEquipmentId] = useState<string | null>(null);

  const handleAddEquipment = () => {
    if (!eqName || !eqBarcode || !eqCategory) {
      alert('Please fill in all equipment fields');
      return;
    }

    if (editingEquipmentId) {
      // Update existing equipment
      setEquipment(equipment.map(eq => 
        eq.id === editingEquipmentId
          ? { ...eq, name: eqName, barcode: eqBarcode, category: eqCategory, status: eqStatus }
          : eq
      ));
      setEditingEquipmentId(null);
    } else {
      // Add new equipment
      const newEquipment: Equipment = {
        id: `eq${Date.now()}`,
        name: eqName,
        barcode: eqBarcode,
        category: eqCategory,
        status: eqStatus,
      };
      setEquipment([...equipment, newEquipment]);
    }
    
    // Reset form
    setEqName('');
    setEqBarcode('');
    setEqCategory('');
    setEqStatus('available');
    setShowEquipmentForm(false);
  };

  const handleEditEquipment = (item: Equipment) => {
    setEqName(item.name);
    setEqBarcode(item.barcode);
    setEqCategory(item.category);
    setEqStatus(item.status);
    setEditingEquipmentId(item.id);
    setShowEquipmentForm(true);
  };

  const handleRemoveEquipment = (id: string) => {
    setEquipment(equipment.filter(eq => eq.id !== id));
  };

  const handleSaveRoom = () => {
    if (!roomName || !roomBarcode || !roomLocation) {
      alert('Please fill in all room fields');
      return;
    }

    const updatedRoom: Room = {
      ...room,
      name: roomName,
      barcode: roomBarcode,
      location: roomLocation,
      equipment: equipment,
    };

    onSave(updatedRoom);
  };

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-6 my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Edit Room</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Room Details Form */}
        <div className="mb-8 bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Room Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Name *
              </label>
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="e.g., Conference Room A"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Barcode *
              </label>
              <input
                type="text"
                value={roomBarcode}
                onChange={(e) => setRoomBarcode(e.target.value)}
                placeholder="e.g., ROOM004"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                value={roomLocation}
                onChange={(e) => setRoomLocation(e.target.value)}
                placeholder="e.g., Floor 2, Building C"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Equipment Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Equipment ({equipment.length})
            </h3>
            <button
              onClick={() => {
                setShowEquipmentForm(!showEquipmentForm);
                setEditingEquipmentId(null);
                setEqName('');
                setEqBarcode('');
                setEqCategory('');
                setEqStatus('available');
              }}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Equipment
            </button>
          </div>

          {/* Equipment Form */}
          {showEquipmentForm && (
            <div className="bg-blue-50 p-4 rounded-lg mb-4 border-2 border-blue-200">
              <h4 className="font-semibold text-gray-800 mb-3">
                {editingEquipmentId ? 'Edit Equipment' : 'New Equipment'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Equipment Name *
                  </label>
                  <input
                    type="text"
                    value={eqName}
                    onChange={(e) => setEqName(e.target.value)}
                    placeholder="e.g., Projector"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Barcode *
                  </label>
                  <input
                    type="text"
                    value={eqBarcode}
                    onChange={(e) => setEqBarcode(e.target.value)}
                    placeholder="e.g., EQ009"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <input
                    type="text"
                    value={eqCategory}
                    onChange={(e) => setEqCategory(e.target.value)}
                    placeholder="e.g., Electronics"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status *
                  </label>
                  <select
                    value={eqStatus}
                    onChange={(e) => setEqStatus(e.target.value as 'available' | 'in-use' | 'maintenance')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="available">Available</option>
                    <option value="in-use">In Use</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleAddEquipment}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {editingEquipmentId ? 'Update' : 'Add to Room'}
                </button>
                <button
                  onClick={() => {
                    setShowEquipmentForm(false);
                    setEditingEquipmentId(null);
                    setEqName('');
                    setEqBarcode('');
                    setEqCategory('');
                    setEqStatus('available');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Equipment List */}
          {equipment.length > 0 ? (
            <div className="space-y-2">
              {equipment.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{item.name}</h4>
                    <p className="text-sm text-gray-600">
                      {item.category} • Barcode: {item.barcode}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                    <button
                      onClick={() => handleEditEquipment(item)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit equipment"
                    >
                      <Save className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleRemoveEquipment(item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove equipment"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8 italic">
              No equipment added yet. Click "Add Equipment" to start.
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveRoom}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Save className="w-5 h-5" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};