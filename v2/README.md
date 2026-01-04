# 🎣 Apex Angler V2

The **Apex Angler V2** is a modern, real-time fishing tournament management portal. It connects tournament organizers (Admins) and participants (Fishermen) through a live, interactive dashboard.

## 📸 Screenshots


![Landing Page](./screenshot/Screenshot%202026-01-04%20at%204.01.50%E2%80%AFPM.png)
![Admin Dashboard](./screenshot/Screenshot%202026-01-04%20at%204.03.20%E2%80%AFPM.png)
![Leaderboard](./screenshot/Screenshot%202026-01-04%20at%204.03.38%E2%80%AFPM.png)
![Weigh-In](./screenshot/Screenshot%202026-01-04%20at%204.04.30%E2%80%AFPM.png)

---

## ✨ Features

### 🏢 For Admins
*   **Overview Dashboard**: Real-time stats on participants, total weight, and catches.
*   **Participant Management**:
    *   Register new fishermen with auto-generated **6-digit IDs**.
    *   Monitor active vs. disqualified participants.
    *   Copy participant IDs to clipboard.
*   **Weigh-In Station**:
    *   record catches with **ID scanning** logic (type or scan ID).
    *   Live validation of participant IDs.
    *   Instant visual feedback and history log.
    *   Support for **Kilograms (kg)** units.
*   **Live Leaderboard**: Real-time ranking with automatic sorting by total weight.

### 🎣 For Fishermen
*   **Personal Portal**: Secure login with Participant ID.
*   **Session Persistence**: Stay logged in across browser sessions.
*   **Live Updates**: View personal stats and current rank on the leaderboard.
*   **Auto-Redirect**: Verified fishermen are automatically redirected to their dashboard upon visiting the site.

## 🛠️ Technology Stack
*   **Frontend**: React, TypeScript, Vite
*   **Styling**: Tailwind CSS v4, Lucide React Icons
*   **Backend**: Node.js (Custom server), local JSON database (`db.json`)
*   **Persistence**: `localStorage` (Session), `fs` (Data persistence)

## 🚀 Getting Started

### 1. Prerequisites
*   Node.js installed on your machine.
*   Network access (for local Wi-Fi access on mobile devices).

### 2. Installation
```bash
# Clone the repository
git clone [repo-url]

# Navigate to v2 directory
cd apex-angler/v2

# Install dependencies
npm install
```

### 3. Running the App
You need two terminals to run the application (one for the Backend, one for the Frontend).

**Terminal 1: Backend Server**
```bash
node server.js
```
*   Running on `http://localhost:3001`
*   *Note: This server handles data persistence and local network IP discovery.*

**Terminal 2: Frontend Client**
```bash
npm run dev
```
*   Accessible at `http://localhost:5173` (or your local IP for mobile access).

## 📝 Usage Guide

1.  **Admin Login**: Access via `/login/admin`. (Default credentials in code if applicable, or currently bypassed for demo).
2.  **Add Participants**: Go to **Participants** tab -> **Add Participant**. Note the generated ID.
3.  **Fisherman Login**: Use the generated ID to login at `/login/fisherman`.
4.  **Weighing**: Go to **Weighing** tab in Admin panel -> Enter ID -> Enter Weight (kg) -> Save.
