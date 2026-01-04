# Fishing Contest Manager 🎣

A hybrid web application designed to manage fishing tournaments. It features a real-time leaderboard, QR code registration/scanning, and a dual-interface for both Admins (Panitia) and Fishermen (Peserta).

The app supports a **Hybrid Sync** mode:

1. **Host Mode (Online):** Syncs data across devices (laptop & phones) via a local Node.js server.

2. **Offline Mode:** Falls back to local storage if the server is unreachable.

## ✨ Features

* **Dual Roles:**

  * **Admin:** Register users, weigh catches (with QR scanner), eliminate participants, and configure settings.

  * **Fisherman:** Read-only view of the live leaderboard with their own rank highlighted.

* **QR Code System:** Auto-generates QR codes for fishermen and includes a built-in camera scanner for the weighing station.

* **Real-time Sync:** Changes made on the admin laptop reflect instantly on fishermen's phones connected to the same Wi-Fi.

* **Offline Capable:** Works fully offline using the device's local storage if the host server is down.

* **Data Export:** Export the final leaderboard to CSV (Excel).

* **Customization:** Change event name and background image.

## 🛠️ Prerequisites

* **Node.js** (v16 or higher) installed on your machine.

* A Wi-Fi network to connect your laptop (Host) and mobile phones (Clients).

## 🚀 Installation

1. **Open your project folder** in the terminal.

2. **Install dependencies** (for both React and the Server):

   ```
   npm install
   
   ```

3. **Install the QR Scanner library** (if not already added):

   ```
   npm install @yudiel/react-qr-scanner
   
   ```

## 🖥️ How to Run (Host Mode)

To enable syncing between devices, you must run the backend server first.

### 1. Start the Host Server

This server acts as the central database (`db.json`) for the event.

Open a terminal and run:

```
node server.js
# OR
npm run server

```

* **What happens:**

  * The server starts on port `3001`.

  * It detects your computer's Local IP address (e.g., `192.168.1.5`).

  * It automatically creates/updates a `.env.local` file so the React app knows where to connect.

### 2. Start the Application

Open a **second terminal** window and run:

```
npm run dev -- --host

```

* **Why `--host`?** This flag exposes the app to your local network so phones can access it.

* Look for the **Network URL** in the output (e.g., `http://192.168.1.5:5173`).

## 📱 Connecting Mobile Devices

1. Ensure your phone is connected to the **same Wi-Fi** as the laptop.

2. Open Chrome or Safari on your phone.

3. Type the **Network URL** from the previous step (e.g., `http://192.168.1.5:5173`).

4. If the **Sync Status** icon (top left) is **Green**, you are connected!

**Troubleshooting Camera on Phone:**
Browsers often block camera access on "Insecure" (HTTP) connections unless it's `localhost`.

* **Android (Chrome):** Go to `chrome://flags`, search for "Insecure origins treated as secure", enable it, and add your laptop's IP address (e.g., `http://192.168.1.5:5173`). Relaunch Chrome.

* **iOS:** Use a tunneling service like `ngrok` or `localtunnel` to get an HTTPS link, or simply type the ID manually if the camera doesn't open.

## 🔑 Default Credentials

To access the **Admin Panel**:

* **Username:** `admin`

* **Password:** `admin123`

*(You can change these in the `App.jsx` file under `ADMIN_CREDENTIALS`)*

## 📂 Project Structure

* `server.js` - The Node.js backend that saves data to `db.json`.

* `src/App.jsx` - The main React application logic and UI.

* `db.json` - The database file (generated automatically when server runs).

* `.env.local` - Stores the Host IP address (generated automatically).

## ⚠️ Notes

* **Images:** Uploaded background images are converted to Base64. Very large images (>10MB) might fail to sync or slow down the local network.

* **Reset:** You can wipe all data using the "Hapus Semua Data" button in Settings. This clears `db.json` on the server.