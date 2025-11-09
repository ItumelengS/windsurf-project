# Room & Equipment Barcode Scanner

A modern web application for scanning barcodes on room doors and equipment to view inventory and details.

## Features

- **Create Rooms**: Add new rooms with custom details and equipment inventory
- **Add Equipment**: Create equipment items with barcodes, categories, and status tracking
- **Room Barcode Scanning**: Scan a room's barcode to instantly view all equipment that should be in that room
- **Equipment Barcode Scanning**: Scan individual equipment barcodes to view their details and status
- **Dual Scanning Methods**: 
  - Live camera scanning using device camera
  - Image upload for scanning barcodes from photos
- **Room Management**: View all rooms in a grid layout with quick access to details
- **Data Persistence**: All rooms and equipment are saved to browser localStorage
- **Modern UI**: Beautiful, responsive interface built with React and TailwindCSS
- **Real-time Results**: Instant display of room contents and equipment information

## Technologies Used

- **React 19** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for styling
- **html5-qrcode** for barcode scanning
- **Lucide React** for icons

## Getting Started

### Installation

```bash
npm install
```

### Running the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## How to Use

### Creating a Room

1. Click the **"Create Room"** button
2. Fill in the room details:
   - Room Name (e.g., "Conference Room A")
   - Room Barcode (e.g., "ROOM004")
   - Location (e.g., "Floor 2, Building C")
3. Add equipment to the room:
   - Click **"Add Equipment"**
   - Enter equipment name, barcode, category, and status
   - Click **"Add to Room"** to add it to the list
   - Repeat for all equipment in the room
4. Click **"Save Room"** to create the room

### Scanning Barcodes

1. Click the **"Scan Barcode"** button
2. Choose your scanning method:
   - **Scan with Camera**: Use your device's camera to scan barcodes in real-time
   - **Upload Image**: Upload a photo containing a barcode
3. View the results:
   - **Room scan**: See all equipment assigned to that room with their status
   - **Equipment scan**: View detailed information about the specific equipment

### Viewing All Rooms

1. Click the **"View All Rooms"** button
2. Browse all created rooms in a grid layout
3. Click **"View"** on any room to see its details

## Sample Barcodes

For testing purposes, you can use these sample barcodes:

**Room Barcodes:**
- ROOM001 - Conference Room A
- ROOM002 - Office 101
- ROOM003 - IT Lab

**Equipment Barcodes:**
- EQ001 - Projector
- EQ002 - Whiteboard
- EQ003 - Conference Phone
- EQ004 - Laptop
- EQ005 - Desk
- EQ006 - Office Chair
- EQ007 - Monitor
- EQ008 - Printer

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
