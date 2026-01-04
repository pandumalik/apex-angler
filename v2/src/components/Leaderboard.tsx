
import { ArrowUp, ArrowDown, Minus, ChevronRight, Users, Scale, Trophy, Search, Download } from 'lucide-react';

export default function Leaderboard() {
    // Mock Data (TODO: Fetch from API)
    const rankings = [
        { rank: 1, name: 'Sarah Jenkins', team: 'The Reel Deal', fish: '5 / 5', big: '12.5 lbs', total: '24.8 lbs', movement: 'up', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCA2rba0ewXfO7F8LiRDVJuUuDGUvuI0nYfqMA0eyOeCGFMFDM54u_UNUjaO2ETEMYbDN_Si6hGSjJcOQscZ8FJ_4Bg7258fGjLeZ2b8N8ooHso97YFqpzTKDrFPcDD1RWDNUcyPecHTn4c4jciO_Piv6DG91wyYd-_xQy0Y3uniiBl9X4SCdhxFOnAKzOzrtLYNYv26cLyAfaP0NsZtsbO4C_unCeM2SVqLek0UVPKChNjEgcagGuimrzvXATFbx7dfLKFjPhsIN0' },
        { rank: 2, name: 'Mike Ross', team: 'Bass Buster', fish: '5 / 5', big: '8.2 lbs', total: '22.1 lbs', movement: 'down', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJ3k40JXNwNNRG10kHDADCXYIuUguf5yEGBqgUklqYpXPGkc25eag-9zMXf0312H6s0UoJzkDz3wk7PIU1rTIDB570Jqnz-yCo2g1pCp8jeu-U1p6a2XuID5uJ4FzY2i4R9VvWLx6OkdKzxVyU03wLRSRnFDjETnLd2mGzTh-2i5bt5PVFywiTX_-nQfd4MDs_q9LAGZfrtbQuSMkdcAS4lJ198yQTo4t_AjOygk6NA6lJzyQLz6NXKaIc9AAu_leMo2FtrsWXNJk' },
        { rank: 3, name: 'James T.', team: 'Weekend Warrior', fish: '4 / 5', big: '6.5 lbs', total: '19.5 lbs', movement: 'same', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0QDt9K1fNaX2kxYmfUD-X-zz7lDN4Hatl7jkBVxsVOPcHmuT8yw2k0CvpJ_9liscO1d621TG-dIG1k-1dnJYU6vJEnsPuAnAEKgTyjKZl_AnTn8SAuCOkUpZpxdgYEMXASx6Zr7kkQBsVJ2xhFVws8pqvNzP6ftgH7jglxglCy3MYxhG3G20Jha-H79LeD6puOgGr1qOwbDisgUb4lviZRKIYEl797nXB_jE9mIsNBfNXa8COT4UYLMI4Hey0Te0w1LDr8lQh7V8' },
    ];

    return (
        <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
            {/* Stats Row - Only show on large screens or specific contexts? The design has it on Top. */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-[#16242c] p-5 rounded-xl border border-slate-200 dark:border-[#325567] shadow-sm flex flex-col gap-1">
                    <div className="flex items-center justify-between"><p className="text-slate-500 dark:text-[#92b7c9] text-sm font-medium">Total Participants</p><Users className="text-primary/50" size={24} /></div>
                    <p className="text-2xl font-bold tracking-tight">84 <span className="text-sm font-normal text-slate-400">Anglers</span></p>
                </div>
                <div className="bg-white dark:bg-[#16242c] p-5 rounded-xl border border-slate-200 dark:border-[#325567] shadow-sm flex flex-col gap-1 relative overflow-hidden">
                    <div className="absolute right-0 top-0 h-full w-1 bg-primary"></div>
                    <div className="flex items-center justify-between"><p className="text-slate-500 dark:text-[#92b7c9] text-sm font-medium">Total Catch Weight</p><Scale className="text-primary/50" size={24} /></div>
                    <p className="text-2xl font-bold tracking-tight">1,240 <span className="text-sm font-normal text-slate-400">lbs</span></p>
                </div>
                <div className="bg-white dark:bg-[#16242c] p-5 rounded-xl border border-slate-200 dark:border-[#325567] shadow-sm flex flex-col gap-1">
                    <div className="flex items-center justify-between"><p className="text-slate-500 dark:text-[#92b7c9] text-sm font-medium">Biggest Catch</p><Trophy className="text-primary/50" size={24} /></div>
                    <p className="text-2xl font-bold tracking-tight text-primary">12.5 <span className="text-sm font-normal text-slate-400 dark:text-slate-500">lbs</span></p>
                    <p className="text-xs text-slate-400 mt-1">Held by: Sarah Jenkins</p>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="relative w-full max-w-md h-10 group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                    </div>
                    <input className="block w-full h-full pl-10 pr-3 py-2 border border-slate-200 dark:border-[#325567] rounded-lg leading-5 bg-white dark:bg-[#16242c] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary sm:text-sm text-slate-900 dark:text-white transition-all" placeholder="Search angler name, boat or ID..." type="text" />
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button className="h-10 px-4 bg-primary hover:bg-blue-600 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-primary/20">
                        <Download size={18} />
                        <span className="hidden sm:inline">Export CSV</span>
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-[#16242c] rounded-xl border border-slate-200 dark:border-[#325567] shadow-sm overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                        <thead className="bg-slate-50 dark:bg-[#111c22]">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-[#92b7c9] uppercase tracking-wider w-24">Rank</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-[#92b7c9] uppercase tracking-wider">Angler</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-[#92b7c9] uppercase tracking-wider hidden sm:table-cell">Team</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 dark:text-[#92b7c9] uppercase tracking-wider w-32">Fish</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-[#92b7c9] uppercase tracking-wider hidden md:table-cell">Big Bass</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-primary uppercase tracking-wider">Total</th>
                                <th className="px-6 py-4 w-12"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800/50">
                            {rankings.map((angler) => (
                                <tr key={angler.rank} className="bg-white dark:bg-transparent hover:bg-slate-50 dark:hover:bg-[#1f2937] transition-colors cursor-pointer group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm shadow-sm ${angler.rank === 1 ? 'bg-yellow-400 text-yellow-900' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>{angler.rank}</div>
                                            <span className={`text-xs flex items-center font-medium ${angler.movement === 'up' ? 'text-green-500' : (angler.movement === 'down' ? 'text-red-500' : 'text-slate-400')}`}>
                                                {angler.movement === 'up' ? <ArrowUp size={14} /> : (angler.movement === 'down' ? <ArrowDown size={14} /> : <Minus size={14} />)}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-slate-200 dark:bg-slate-700 bg-cover bg-center ring-2 ring-yellow-400/50" style={{ backgroundImage: `url('${angler.avatar}')` }}></div>
                                            <div className="ml-4">
                                                <div className="text-sm font-bold text-slate-900 dark:text-white">{angler.name}</div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400">Pro Division</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                                        <div className="text-sm text-slate-700 dark:text-slate-300">{angler.team}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                                            {angler.fish}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-slate-500 dark:text-slate-400 hidden md:table-cell font-mono">
                                        {angler.big}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="text-lg font-black text-primary font-mono">{angler.total}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <ChevronRight className="text-slate-400 group-hover:text-primary transition-colors" size={20} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
