export interface Settings {
    eventName: string;
    bgImage: string;
}

export interface Catch {
    id: string;
    weight: number;
    timestamp: string;
}

export interface Fisherman {
    id: string;
    name: string;
    email: string; // Optional in some contexts, but seems required for reg
    team?: string;
    status: 'Active' | 'Disqualified';
    registeredAt: string;
    avatar?: string;
    catches?: Catch[]; // Inferred from "Add Catch" endpoint logic
}

// Response Wrappers
export interface ApiResponse<T> {
    success: boolean;
    error?: string;
    [key: string]: any; // fallback for loose props like "fishermen" or "settings"
}

export interface SyncData {
    fishermen: Fisherman[];
    settings: Settings;
}
