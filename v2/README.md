# Apex Angler V2

The Fishing Contest Manager application for tracking catches, managing tournaments, and viewing leaderboards.

## Prerequisites

- Node.js (v18 or later)
- npm or yarn

## Getting Started

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Start the Development Server**
    ```bash
    npm run dev
    ```
    This will start the local server, usually at `http://localhost:5173`.

3.  **Build for Production**
    ```bash
    npm run build
    ```

## Project Structure

- `src/pages`: Application pages (Admin/Fisherman dashboards, login, landing)
- `src/components`: Reusable UI components
- `src/layouts`: Layout components
- `src/types`: TypeScript definitions

## Navigation

- **Landing Page**: `/`
- **Admin Portal**: `/login/admin` -> `/admin/dashboard`
- **Fisherman Portal**: `/login/fisherman` -> `/dashboard`
