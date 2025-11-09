import { useState, useEffect } from 'react';
import { BarcodeScanner } from './components/BarcodeScanner';
import { RoomDetails } from './components/RoomDetails';
import { EquipmentDetails } from './components/EquipmentDetails';
import { CreateRoom } from './components/CreateRoom';
import { RoomList } from './components/RoomList';
import { api } from './services/api';
import { Scan, AlertCircle, Plus, List } from 'lucide-react';
import type { Room, Equipment } from './types';

function App() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [showScanner, setShowScanner] = useState(false);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showRoomList, setShowRoomList] = useState(false);
  const [scannedRoom, setScannedRoom] = useState<Room | null>(null);
  const [scannedEquipment, setScannedEquipment] = useState<Equipment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load rooms from database on mount
  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const data = await api.getRooms();
      setRooms(data);
    } catch (error) {
      console.error('Failed to load rooms:', error);
      setError('Failed to load rooms from database');
    } finally {
      setLoading(false);
    }
  };


  const handleScan = async (barcode: string) => {
    try {
      const result = await api.scanBarcode(barcode);
      
      if (result) {
        setError(null);
        if (result.type === 'room') {
          setScannedRoom(result.data as Room);
          setScannedEquipment(null);
          setShowRoomList(false);
        } else {
          setScannedEquipment(result.data as Equipment);
          setScannedRoom(null);
          setShowRoomList(false);
        }
        setShowScanner(false);
      } else {
        setError(`No room or equipment found with barcode: ${barcode}`);
        setScannedRoom(null);
        setScannedEquipment(null);
        setShowScanner(false);
      }
    } catch (error) {
      setError('Failed to scan barcode. Please try again.');
      setShowScanner(false);
    }
  };

  const handleSaveRoom = async (newRoom: Room) => {
    try {
      await api.createRoom(newRoom);
      await loadRooms(); // Reload rooms from database
      setShowCreateRoom(false);
      setError(null);
      alert(`Room "${newRoom.name}" created successfully!`);
    } catch (error) {
      setError('Failed to create room. Please try again.');
      console.error('Failed to create room:', error);
    }
  };

  const handleViewRoom = (room: Room) => {
    setScannedRoom(room);
    setScannedEquipment(null);
    setShowRoomList(false);
    setError(null);
  };

  const handleReset = () => {
    setScannedRoom(null);
    setScannedEquipment(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Room & Equipment Scanner
          </h1>
          <p className="text-gray-600">
            Scan barcodes to view room contents and equipment details
          </p>
        </header>

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading rooms from database...</p>
          </div>
        )}

        {!loading && (
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button
              onClick={() => setShowScanner(true)}
              className="flex items-center gap-3 bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl text-lg font-semibold"
            >
              <Scan className="w-6 h-6" />
              Scan Barcode
            </button>
          <button
            onClick={() => {
              setShowCreateRoom(true);
              setShowRoomList(false);
              handleReset();
            }}
            className="flex items-center gap-3 bg-green-600 text-white py-3 px-8 rounded-lg hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl text-lg font-semibold"
          >
            <Plus className="w-6 h-6" />
            Create Room
          </button>
          <button
            onClick={() => {
              setShowRoomList(true);
              handleReset();
            }}
            className="flex items-center gap-3 bg-purple-600 text-white py-3 px-8 rounded-lg hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl text-lg font-semibold"
          >
            <List className="w-6 h-6" />
            View All Rooms
          </button>
        </div>
        )}

        {error && (
          <div className="max-w-2xl mx-auto mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-6 h-6 text-red-500 mr-3" />
              <div>
                <p className="font-semibold text-red-800">Barcode Not Found</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {scannedRoom && (
          <div className="mb-6">
            <RoomDetails room={scannedRoom} />
            <div className="flex justify-center mt-4">
              <button
                onClick={handleReset}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Scan Another Barcode
              </button>
            </div>
          </div>
        )}

        {scannedEquipment && (
          <div className="mb-6">
            <EquipmentDetails equipment={scannedEquipment} />
            <div className="flex justify-center mt-4">
              <button
                onClick={handleReset}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Scan Another Barcode
              </button>
            </div>
          </div>
        )}

        {showRoomList && !scannedRoom && !scannedEquipment && (
          <RoomList rooms={rooms} onViewRoom={handleViewRoom} />
        )}

        {!scannedRoom && !scannedEquipment && !error && !showRoomList && (
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Start Guide</h2>
            <div className="space-y-4 text-gray-700">
              <div className="flex items-start">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">
                  1
                </span>
                <p>Click "Create Room" to add a new room with equipment</p>
              </div>
              <div className="flex items-start">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">
                  2
                </span>
                <p>Click "Scan Barcode" to scan room or equipment barcodes</p>
              </div>
              <div className="flex items-start">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">
                  3
                </span>
                <p>Click "View All Rooms" to see your complete inventory</p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t">
              <h3 className="font-semibold text-gray-800 mb-3">Sample Barcodes to Try:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Room Barcodes:</p>
                  <p className="font-mono font-semibold">ROOM001, ROOM002, ROOM003</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Equipment Barcodes:</p>
                  <p className="font-mono font-semibold">EQ001, EQ002, EQ003, EQ004</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {showScanner && (
          <BarcodeScanner
            onScan={handleScan}
            onClose={() => setShowScanner(false)}
          />
        )}

        {showCreateRoom && (
          <CreateRoom
            onSave={handleSaveRoom}
            onClose={() => setShowCreateRoom(false)}
          />
        )}
      </div>
    </div>
  );
}

export default App;
