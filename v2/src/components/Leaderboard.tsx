
import { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, Minus, ChevronRight, Users, Scale, Trophy, Search, Download } from 'lucide-react';
import { api } from '../services/api';
import type { Fisherman } from '../types';

export default function Leaderboard() {
    const [rankings, setRankings] = useState<any[]>([]);
    const [stats, setStats] = useState({ participants: 0, totalWeight: 0, bigBass: 0, bigBassHolder: '-' });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchData();
        // Optional: Polling for live updates
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const data = await api.getData();
            processLeaderboard(data.fishermen || []);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const processLeaderboard = (fishermen: Fisherman[]) => {
        let totalW = 0;
        let maxBass = 0;
        let maxBassHolder = '-';

        const processed = fishermen
            .filter(f => f.status === 'Active') // Only show active
            .map(f => {
                const catches = f.catches || [];
                const totalWeight = catches.reduce((sum, c) => sum + c.weight, 0);
                const bigBass = catches.reduce((max, c) => Math.max(max, c.weight), 0);

                totalW += totalWeight;
                if (bigBass > maxBass) {
                    maxBass = bigBass;
                    maxBassHolder = f.name;
                }

                return {
                    id: f.id,
                    name: f.name,
                    team: f.team,
                    fishCount: catches.length,
                    bigBass: bigBass,
                    totalWeight: totalWeight,
                    avatar: f.avatar
                };
            })
            .sort((a, b) => b.totalWeight - a.totalWeight) // Sort by heavy bags
            .map((f, index) => ({
                ...f,
                rank: index + 1,
                movement: 'same' // Placeholder logic for movement
            }));

        setRankings(processed);
        setStats({
            participants: fishermen.length,
            totalWeight: parseFloat(totalW.toFixed(2)),
            bigBass: maxBass,
            bigBassHolder: maxBassHolder
        });
    };

    if (isLoading) return <div className="p-10 text-center text-slate-500">Loading Leaderboard...</div>;

    return (
        <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-[#16242c] p-5 rounded-xl border border-slate-200 dark:border-[#325567] shadow-sm flex flex-col gap-1">
                    <div className="flex items-center justify-between"><p className="text-slate-500 dark:text-[#92b7c9] text-sm font-medium">Total Participants</p><Users className="text-primary/50" size={24} /></div>
                    <p className="text-2xl font-bold tracking-tight">{stats.participants} <span className="text-sm font-normal text-slate-400">Anglers</span></p>
                </div>
                <div className="bg-white dark:bg-[#16242c] p-5 rounded-xl border border-slate-200 dark:border-[#325567] shadow-sm flex flex-col gap-1 relative overflow-hidden">
                    <div className="absolute right-0 top-0 h-full w-1 bg-primary"></div>
                    <div className="flex items-center justify-between"><p className="text-slate-500 dark:text-[#92b7c9] text-sm font-medium">Total Catch Weight</p><Scale className="text-primary/50" size={24} /></div>
                    <p className="text-2xl font-bold tracking-tight">{stats.totalWeight.toFixed(2)} <span className="text-sm font-normal text-slate-400">kg</span></p>
                </div>
                <div className="bg-white dark:bg-[#16242c] p-5 rounded-xl border border-slate-200 dark:border-[#325567] shadow-sm flex flex-col gap-1">
                    <div className="flex items-center justify-between"><p className="text-slate-500 dark:text-[#92b7c9] text-sm font-medium">Biggest Catch</p><Trophy className="text-primary/50" size={24} /></div>
                    <p className="text-2xl font-bold tracking-tight text-primary">{stats.bigBass.toFixed(2)} <span className="text-sm font-normal text-slate-400 dark:text-slate-500">kg</span></p>
                    <p className="text-xs text-slate-400 mt-1">Held by: {stats.bigBassHolder}</p>
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
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-[#92b7c9] uppercase tracking-wider">ID</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-[#92b7c9] uppercase tracking-wider">Angler</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-[#92b7c9] uppercase tracking-wider hidden sm:table-cell">Team</th>

                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-[#92b7c9] uppercase tracking-wider hidden md:table-cell">Big Bass</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-primary uppercase tracking-wider">Total</th>
                                <th className="px-6 py-4 w-12"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800/50">
                            {rankings.length === 0 ? (
                                <tr><td colSpan={6} className="p-8 text-center text-slate-500">No catches yet. Start fishing!</td></tr>
                            ) : rankings.map((angler) => (
                                <tr key={angler.rank} className="bg-white dark:bg-transparent hover:bg-slate-50 dark:hover:bg-[#1f2937] transition-colors cursor-pointer group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm shadow-sm ${angler.rank === 1 ? 'bg-yellow-400 text-yellow-900' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>{angler.rank}</div>
                                            <span className={`text-xs flex items-center font-medium ${angler.movement === 'up' ? 'text-green-500' : (angler.movement === 'down' ? 'text-red-500' : 'text-slate-400')}`}>
                                                {angler.movement === 'up' ? <ArrowUp size={14} /> : (angler.movement === 'down' ? <ArrowDown size={14} /> : <Minus size={14} />)}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-slate-500 dark:text-slate-400">
                                        {angler.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-slate-200 dark:bg-slate-700 bg-cover bg-center ring-2 ring-yellow-400/50" style={{ backgroundImage: `url('${angler.avatar || "https://ui-avatars.com/api/?name=" + angler.name}')` }}></div>
                                            <div className="ml-4">
                                                <div className="text-sm font-bold text-slate-900 dark:text-white">{angler.name}</div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400">Pro Division</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                                        <div className="text-sm text-slate-700 dark:text-slate-300">{angler.team || 'Individual'}</div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-slate-500 dark:text-slate-400 hidden md:table-cell font-mono">
                                        {angler.bigBass.toFixed(2)} kg
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="text-lg font-black text-primary font-mono">{angler.totalWeight.toFixed(2)} kg</div>
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
