import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Trophy, Users, Settings, Timer, StopCircle, LogOut } from 'lucide-react';

interface SidebarItem {
    label: string;
    icon: React.ReactNode;
    to: string;
}

interface DashboardLayoutProps {
    role: 'admin' | 'fisherman';
    children?: React.ReactNode;
}

export default function DashboardLayout({ role, children }: DashboardLayoutProps) {
    const navigate = useNavigate();

    const sidebarItems: SidebarItem[] = role === 'admin' ? [
        { label: 'Overview', icon: <LayoutDashboard size={20} />, to: '/admin/overview' },
        { label: 'Live Leaderboard', icon: <Trophy size={20} />, to: '/admin/leaderboard' },
        { label: 'Weighing', icon: <img src="https://img.icons8.com/ios/50/scales.png" className="w-5 h-5 dark:invert" alt="scale" />, to: '/admin/weighing' },
        { label: 'Participants', icon: <Users size={20} />, to: '/admin/participants' },
        { label: 'Settings', icon: <Settings size={20} />, to: '/admin/settings' },
    ] : [
        { label: 'Live Leaderboard', icon: <Trophy size={20} />, to: '/dashboard' },
    ];

    const handleLogout = () => {
        // Clear session
        // Clear session
        localStorage.removeItem('isAdminAuthenticated');
        localStorage.removeItem('isFishermanAuthenticated');
        localStorage.removeItem('fishermanId');
        localStorage.removeItem('fishermanName');
        // Navigate home
        navigate('/');
    };

    return (
        <div className="flex h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-surface-light dark:bg-[#111c22] border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 transition-all duration-300">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="bg-center bg-no-repeat bg-cover rounded-full h-10 w-10 border-2 border-primary/30" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDFtr8beCgPcDhfxg4sbz0Ggnn0xW-EbY_aKDtiU9TgJu1wMsgg9FTWylh8FzNehVp6-xhzYcwern0McLYV4r82iY9LCif8gTq88zeZKhzszAH3hEwhN6C8-8NaZwd9_e6mv6Lh_5YoGIidVFlltoMke6KgdHmShu4NnB1qLrPVaTrEIH7qZvT1_vofC7PvR_2x87y167ARApOSB5qXzpdi_7PufroSjtpIOht37cBo8weCDJJzE2XjE_oJvO3FcfESfzpGYfDohPE")' }}></div>
                        <div className="flex flex-col">
                            <h1 className="text-base font-bold leading-tight">FishTracker</h1>
                            <p className="text-slate-500 dark:text-[#92b7c9] text-xs font-normal">{role === 'admin' ? 'Admin Panel' : 'Fisherman Portal'}</p>
                        </div>
                    </div>
                    <nav className="flex flex-col gap-2">
                        {sidebarItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-primary/10 text-primary border border-primary/20' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                            >
                                {item.icon}
                                <span className="text-sm font-medium">{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>
                </div>
                <div className="mt-auto p-6 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="bg-center bg-no-repeat bg-cover rounded-full h-10 w-10 ring-2 ring-slate-200 dark:ring-slate-700" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDT1NOHPEXZQO_D7d7y35ZyCtRjJdrLkU3Vf0VPtOewTBinl_IbK70Kv7gAqp8f8Y1YXV_O7p5CSzTkQ2l1BgGztDw-G_NWpipxlNxA6XwfJpoXZEyw_ENG5_lRbEuxSb5JCUgLy90lYRZO9PRbTV89vJu1_RbPj4Yah2ZuNiQ1LaRVp6apWhm1tYVEGaUlrkM-f982E5f41Z4ulMvCqnphZn2K8hPMUfCF_LvO7NaGFNzXWn9F4NLQr4fdywS-eLYt6BCasgganFE")' }}></div>
                        <div className="flex flex-col">
                            <p className="text-sm font-medium">{role === 'admin' ? 'Administrator' : 'Angler'}</p>
                            <button onClick={handleLogout} className="text-xs text-slate-500 text-left hover:text-red-400 flex items-center gap-1">Log Out <LogOut size={10} /></button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Header */}
                <header className="bg-surface-light dark:bg-[#111c22] border-b border-slate-200 dark:border-slate-800 p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 max-w-[1400px] mx-auto w-full">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl md:text-3xl font-black tracking-tight">{role === 'admin' ? 'Tournament Control' : 'Live Dashboard'}</h1>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-500/10 text-green-500 border border-green-500/20">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                    LIVE
                                </span>
                            </div>
                            <p className="text-slate-500 dark:text-[#92b7c9] text-sm font-medium">Big Bass Classic 2024 • Lake Fork, TX</p>
                        </div>

                        {/* Timer & Actions */}
                        <div className="flex items-center gap-4">
                            <div className="flex gap-2 items-center bg-slate-100 dark:bg-[#233c48] px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700">
                                <Timer className="text-slate-400" size={20} />
                                <div className="flex gap-1 text-sm font-bold font-mono">
                                    <span className="w-6 text-center">04</span>
                                    <span className="text-slate-400">:</span>
                                    <span className="w-6 text-center">30</span>
                                    <span className="text-slate-400">:</span>
                                    <span className="w-6 text-center text-primary">12</span>
                                </div>
                                <span className="text-xs text-slate-500 ml-1">Remaining</span>
                            </div>
                            {role === 'admin' && (
                                <button className="hidden md:flex items-center justify-center gap-2 h-10 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg text-sm font-bold transition-colors border border-red-500/20">
                                    <StopCircle size={18} />
                                    End Tournament
                                </button>
                            )}
                        </div>
                    </div>
                </header>

                {/* Scrollable Body via Outlet or Children */}
                <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-background-dark p-6">
                    {children || <Outlet />}
                </div>

                {/* Sticky Footer Ticker */}
                <div className="bg-primary/10 border-t border-primary/20 p-2 overflow-hidden whitespace-nowrap relative shrink-0">
                    <div className="inline-flex gap-8 animate-marquee items-center" style={{ animation: 'marquee 30s linear infinite' }}>
                        <span className="text-sm font-medium text-primary flex items-center gap-2">NEW BIG BASS: Sarah Jenkins just weighed in a 12.5 lbs Bass!</span>
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">•</span>
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2">Upcoming: Weather alert for 2:00 PM. Check radar.</span>
                    </div>
                </div>
            </main>

            <style>{`
        @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
        }
      `}</style>
        </div>
    );
}
