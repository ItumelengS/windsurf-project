import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, Upload, X } from 'lucide-react';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onClose: () => void;
}

export const BarcodeScanner = ({ onScan, onClose }: BarcodeScannerProps) => {
  const [scanMode, setScanMode] = useState<'camera' | 'upload' | 'requesting' | null>(null);
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
      setScanMode('requesting');
      
      // First, explicitly request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      // Stop the test stream immediately
      stream.getTracks().forEach(track => track.stop());
      
      // Set camera mode BEFORE starting scanner so the div is visible
      setScanMode('camera');
      
      // Small delay to ensure DOM is updated
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Now start the scanner
      const scanner = new Html5Qrcode('reader');
      scannerRef.current = scanner;

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      };

      await scanner.start(
        { facingMode: 'environment' },
        config,
        (decodedText) => {
          onScan(decodedText);
          stopScanning();
        },
        (errorMessage) => {
          // Ignore errors during scanning
          console.log(errorMessage);
        }
      );
    } catch (err: any) {
      console.error('Error starting camera:', err);
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        alert('Camera access denied. Please allow camera permissions in your browser settings and try again.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        alert('No camera found on this device.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        alert('Camera is already in use by another application.');
      } else {
        alert('Failed to start camera. Please check your camera permissions and try again.');
      }
      
      setScanMode(null);
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
    if (!file) {
      setScanMode(null);
      return;
    }

    try {
      setScanMode('upload');
      
      // Create a new scanner instance for file scanning
      const scanner = new Html5Qrcode('file-reader');
      scannerRef.current = scanner;

      // Try scanning with show image enabled for better detection
      const result = await scanner.scanFile(file, false);
      
      if (result) {
        onScan(result);
        setScanMode(null);
      } else {
        throw new Error('No barcode detected');
      }
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      console.error('Error scanning file:', err);
      
      // More helpful error messages
      let errorMessage = 'Failed to scan barcode from image.\n\n';
      
      if (err.message?.includes('No barcode') || err.message?.includes('NotFoundException')) {
        errorMessage += 'Tips:\n' +
          '• Ensure the barcode/QR code is clearly visible\n' +
          '• Try taking a photo with better lighting\n' +
          '• Make sure the barcode is not blurry or damaged\n' +
          '• The barcode should fill most of the image\n' +
          '• Supported formats: QR Code, EAN, UPC, Code 128, Code 39';
      } else {
        errorMessage += 'Please try again with a different image.';
      }
      
      alert(errorMessage);
      setScanMode(null);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <style>{`
        #reader video {
          width: 100% !important;
          height: auto !important;
          border-radius: 8px;
        }
        #reader {
          border-radius: 8px;
          overflow: hidden;
        }
      `}</style>
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
            <p className="text-gray-600 mb-4">Choose a scanning method:</p>
            <button
              onClick={startCameraScanning}
              className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Camera className="w-6 h-6" />
              <span className="text-lg font-medium">Scan with Camera</span>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
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
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-800 font-semibold mb-1">📸 Tips for better scanning:</p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Ensure good lighting and clear focus</li>
                <li>• Barcode should fill most of the image</li>
                <li>• Supports: QR Code, EAN, UPC, Code 128, Code 39</li>
              </ul>
            </div>
          </div>
        ) : scanMode === 'camera' ? (
          <div className="space-y-4">
            <div id="reader" className="w-full min-h-[400px]"></div>
            <button
              onClick={stopScanning}
              className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors"
            >
              Stop Scanning
            </button>
          </div>
        ) : scanMode === 'requesting' ? (
          <div className="space-y-4">
            <div id="reader" className="hidden"></div>
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Requesting camera permission...</p>
              <p className="mt-2 text-sm text-gray-500">Please allow camera access when prompted</p>
            </div>
          </div>
        ) : scanMode === 'upload' ? (
          <div className="space-y-4">
            <div id="file-reader" className="hidden"></div>
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Scanning image...</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
    </>
  );
};
