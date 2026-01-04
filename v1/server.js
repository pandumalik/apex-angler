import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

// Fix for __dirname which is not available in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001; // Server will run on port 3001
const DB_FILE = path.join(__dirname, 'db.json');

// Middleware
app.use(cors()); // Allow React app to talk to this server
app.use(express.json({ limit: '10mb' })); // Allow JSON data (up to 10MB for images)

// Initialize DB file if it doesn't exist
if (!fs.existsSync(DB_FILE)) {
    const initialData = {
        fishermen: [],
        settings: { eventName: "Lomba Mancing Mania 2025", bgImage: "" }
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
}

// --- Helper Functions ---
const readDB = () => {
    try {
        return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    } catch (err) {
        return { fishermen: [], settings: {} };
    }
};

const writeDB = (data) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// --- API Endpoints ---

// 1. GET ALL DATA (For Syncing)
app.get('/api/data', (req, res) => {
    const data = readDB();
    res.json(data);
});

// 2. UPDATE SETTINGS
app.post('/api/settings', (req, res) => {
    const db = readDB();
    db.settings = { ...db.settings, ...req.body };
    writeDB(db);
    res.json({ success: true, settings: db.settings });
});

// 3. REGISTER FISHERMAN (Updated with Date Logic)
app.post('/api/register', (req, res) => {
    const db = readDB();
    const newFisherman = req.body;

    // Add Server-Side Timestamp
    newFisherman.registeredAt = new Date().toISOString();

    db.fishermen.push(newFisherman);
    writeDB(db);
    res.json({ success: true, fishermen: db.fishermen });
});

// 4. UPDATE FISHERMAN (Add Catch / Eliminate)
app.post('/api/update/:id', (req, res) => {
    const db = readDB();
    const { id } = req.params;
    const updates = req.body;

    const index = db.fishermen.findIndex(f => f.id === id);
    if (index !== -1) {
        db.fishermen[index] = { ...db.fishermen[index], ...updates };
        writeDB(db);
        res.json({ success: true });
    } else {
        res.status(404).json({ error: "Fisherman not found" });
    }
});

// 5. CLEAR DATA
app.post('/api/clear', (req, res) => {
    const db = readDB();
    db.fishermen = [];
    writeDB(db);
    res.json({ success: true });
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n--- HOST SERVER RUNNING ---`);
    console.log(`Local:   http://localhost:${PORT}`);

    // Automatically detect Network IP and write to .env.local
    let lanIp = '';
    const interfaces = os.networkInterfaces();

    // Find the first external IPv4 address
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                lanIp = iface.address;
                break;
            }
        }
        if (lanIp) break;
    }

    if (lanIp) {
        const networkUrl = `http://${lanIp}:${PORT}`;
        console.log(`Network: ${networkUrl}`);

        // Generate .env.local for the React App
        try {
            const envContent = `VITE_API_BASE_URL=${networkUrl}/api`;
            fs.writeFileSync(path.join(__dirname, '.env.local'), envContent);
            console.log(`[Auto-Config] IP automatically saved to .env.local`);
            console.log(`[Auto-Config] Please restart your React app (npm run dev) to pick up the new IP.`);
        } catch (err) {
            console.error("[Auto-Config] Failed to write .env.local:", err);
        }
    } else {
        console.log(`[Auto-Config] No network IP found. App will fallback to localhost.`);
    }

    console.log(`---------------------------\n`);
});