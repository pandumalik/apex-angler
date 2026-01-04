
import DashboardLayout from '../layouts/DashboardLayout';
import Leaderboard from '../components/Leaderboard';

export default function FishermanDashboard() {
    return (
        <DashboardLayout role="fisherman">
            <Leaderboard />
        </DashboardLayout>
    );
}
