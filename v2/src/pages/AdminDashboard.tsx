import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import Leaderboard from '../components/Leaderboard';
import AdminParticipants from './AdminParticipants';
import AdminWeighing from './AdminWeighing';
import AdminSettings from './AdminSettings';
import ErrorBoundary from '../components/ErrorBoundary';

// Placeholder for Overview if needed, or redirect to Leaderboard
const OverviewPlaceholder = ({ title }: { title: string }) => (
    <div className="p-8 text-center bg-white dark:bg-[#16242c] rounded-xl border border-slate-200 dark:border-[#325567]">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
        <p className="text-slate-500 dark:text-slate-400">Overview Stats Dashboard - Coming Soon</p>
    </div>
);

export default function AdminDashboard() {
    return (
        <ErrorBoundary>
            <Routes>
                <Route element={<DashboardLayout role="admin" />}>
                    <Route index element={<Navigate to="leaderboard" replace />} />
                    <Route path="leaderboard" element={<Leaderboard />} />
                    <Route path="overview" element={<OverviewPlaceholder title="Overview" />} />
                    <Route path="participants" element={<AdminParticipants />} />
                    <Route path="weighing" element={<AdminWeighing />} />
                    <Route path="settings" element={<AdminSettings />} />
                    <Route path="*" element={<Navigate to="leaderboard" replace />} />
                </Route>
            </Routes>
        </ErrorBoundary>
    );
}

