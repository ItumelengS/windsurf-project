# Database Setup with Neon PostgreSQL

## Overview
The application now uses Neon PostgreSQL database instead of localStorage for persistent data storage across all users.

## Database Schema

### Tables

#### `rooms`
```sql
CREATE TABLE rooms (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  barcode TEXT UNIQUE NOT NULL,
  location TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `equipment`
```sql
CREATE TABLE equipment (
  id TEXT PRIMARY KEY,
  room_id TEXT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  barcode TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('available', 'in-use', 'maintenance')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Setup Instructions

### 1. Neon Database Connection (Already Done)
✅ You've already connected Neon to Netlify, which automatically sets the `DATABASE_URL` environment variable.

### 2. Initialize Database Tables

After deploying, visit this URL **once** to create the tables:
```
https://istocktrack.netlify.app/.netlify/functions/init-db
```

You should see:
```json
{
  "success": true,
  "message": "Database initialized"
}
```

### 3. Verify Setup

After initialization, the app will:
- Load all rooms from the database on page load
- Save new rooms to the database
- Scan barcodes from the database

## API Endpoints

### Initialize Database
- **URL**: `/.netlify/functions/init-db`
- **Method**: GET
- **Description**: Creates tables (run once)

### Get All Rooms
- **URL**: `/.netlify/functions/rooms`
- **Method**: GET
- **Response**: Array of rooms with equipment

### Create Room
- **URL**: `/.netlify/functions/rooms`
- **Method**: POST
- **Body**:
```json
{
  "id": "room123",
  "name": "Conference Room A",
  "barcode": "ROOM001",
  "location": "Floor 1",
  "equipment": [
    {
      "id": "eq123",
      "name": "Projector",
      "barcode": "EQ001",
      "category": "Electronics",
      "status": "available"
    }
  ]
}
```

### Scan Barcode
- **URL**: `/.netlify/functions/scan?barcode=ROOM001`
- **Method**: GET
- **Response**:
```json
{
  "type": "room",
  "data": {
    "id": "room123",
    "name": "Conference Room A",
    "barcode": "ROOM001",
    "location": "Floor 1",
    "equipment": [...]
  }
}
```

## Migration from localStorage

The app now uses the database instead of localStorage:
- ✅ All data is stored in Neon PostgreSQL
- ✅ Data persists across all users and devices
- ✅ No more localStorage limitations
- ✅ Proper relational data structure

## Development

To test locally with Netlify Dev:
```bash
npm install -g netlify-cli
netlify dev
```

This will run the functions locally and connect to your Neon database.

## Environment Variables

Netlify automatically provides:
- `DATABASE_URL` - Neon PostgreSQL connection string

No manual configuration needed!