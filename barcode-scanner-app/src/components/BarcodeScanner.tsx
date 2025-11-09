import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, Upload, X } from 'lucide-react';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onClose: () => void;
}

export const BarcodeScanner = ({ onScan, onClose }: BarcodeScannerProps) => {
  const [scanMode, setScanMode] = useState<'camera' | 'upload' | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      // Cleanup scanner on unmount
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  const startCameraScanning = async () => {
    try {
      const scanner = new Html5Qrcode('reader');
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        (decodedText) => {
          onScan(decodedText);
          stopScanning();
        },
        (errorMessage) => {
          // Ignore errors during scanning
          console.log(errorMessage);
        }
      );

      setScanMode('camera');
    } catch (err) {
      console.error('Error starting camera:', err);
      alert('Failed to start camera. Please check permissions.');
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current?.isScanning) {
      await scannerRef.current.stop();
    }
    setScanMode(null);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const scanner = new Html5Qrcode('reader');
      scannerRef.current = scanner;

      const result = await scanner.scanFile(file, true);
      onScan(result);
      setScanMode(null);
    } catch (err) {
      console.error('Error scanning file:', err);
      alert('Failed to scan barcode from image. Please try another image.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Scan Barcode</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {!scanMode ? (
          <div className="space-y-4">
            <p className="text-gray-600 mb-6">Choose a scanning method:</p>
            <button
              onClick={startCameraScanning}
              className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Camera className="w-6 h-6" />
              <span className="text-lg font-medium">Scan with Camera</span>
            </button>
            <button
              onClick={() => {
                setScanMode('upload');
                fileInputRef.current?.click();
              }}
              className="w-full flex items-center justify-center gap-3 bg-green-600 text-white py-4 px-6 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Upload className="w-6 h-6" />
              <span className="text-lg font-medium">Upload Image</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        ) : scanMode === 'camera' ? (
          <div className="space-y-4">
            <div id="reader" className="w-full"></div>
            <button
              onClick={stopScanning}
              className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors"
            >
              Stop Scanning
            </button>
          </div>
        ) : (
          <div id="reader" className="hidden"></div>
        )}
      </div>
    </div>
  );
};
