import type { Fisherman, Settings, SyncData } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

async function fetchJson<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
}

export const api = {
    // 1. GET ALL DATA
    getData: () => fetchJson<SyncData>('/data'),

    // 2. UPDATE SETTINGS
    updateSettings: (settings: Partial<Settings>) => fetchJson<{ success: boolean; settings: Settings }>('/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
    }),

    // 3. REGISTER FISHERMAN
    registerFisherman: (fisherman: Omit<Fisherman, 'registeredAt' | 'status' | 'catches'>) => fetchJson<{ success: boolean; fishermen: Fisherman[] }>('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...fisherman, status: 'Active', catches: [] })
    }),

    // 4. UPDATE FISHERMAN (Generic update, e.g. for status or catches)
    updateFisherman: (id: string, updates: Partial<Fisherman>) => fetchJson<{ success: boolean }>(`/update/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
    }),

    // 5. CLEAR DATA
    clearData: () => fetchJson<{ success: boolean }>('/clear', {
        method: 'POST'
    })
};
