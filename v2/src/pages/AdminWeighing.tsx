import { useState, useEffect } from 'react';
import { ChevronRight, RotateCcw, User, Save, Fish, Scale, Edit, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import type { Fisherman, Catch } from '../types';

export default function AdminWeighing() {
    const [participants, setParticipants] = useState<Fisherman[]>([]);
    const [selectedId, setSelectedId] = useState('');
    const [weight, setWeight] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [identifiedFisherman, setIdentifiedFisherman] = useState<Fisherman | null>(null);
    const [recentCatches, setRecentCatches] = useState<{ time: string; name: string; id: string; weight: string }[]>([]);

    useEffect(() => {
        fetchParticipants();
    }, []);

    // Effect to identify fisherman when ID is typed or Scanned
    useEffect(() => {
        if (!selectedId) {
            setIdentifiedFisherman(null);
            return;
        }
        // Strict match for scanning, loose for typing
        const found = participants.find(p => p.id.toLowerCase() === selectedId.toLowerCase());
        if (found) {
            setIdentifiedFisherman(found);
        } else {
            setIdentifiedFisherman(null);
        }
    }, [selectedId, participants]);

    const fetchParticipants = async () => {
        try {
            const data = await api.getData();
            setParticipants(data.fishermen || []);
        } catch (error) {
            console.error('Failed to fetch participants:', error);
        }
    };

    const handleRecordCatch = async () => {
        if (!identifiedFisherman || !weight || parseFloat(weight) <= 0) {
            alert('Please select a valid participant and enter a weight.');
            return;
        }

        setIsLoading(true);
        try {
            const newCatch: Catch = {
                id: crypto.randomUUID(),
                weight: parseFloat(weight),
                timestamp: new Date().toISOString()
            };

            const updatedCatches = [...(identifiedFisherman.catches || []), newCatch];

            await api.updateFisherman(identifiedFisherman.id, {
                catches: updatedCatches
            });

            // Update local state for immediate feedback
            const now = new Date();
            setRecentCatches(prev => [
                {
                    time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    name: identifiedFisherman.name,
                    id: identifiedFisherman.id,
                    weight: parseFloat(weight).toFixed(2)
                },
                ...prev
            ].slice(0, 5));

            setWeight('');
            setSelectedId('');
            setIdentifiedFisherman(null);
            fetchParticipants(); // Refresh data to ensure sync
            alert('Catch recorded successfully!');
        } catch (error) {
            console.error('Failed to record catch:', error);
            alert('Failed to record catch.');
        } finally {
            setIsLoading(false);
        }
    };

    const currentTotalWeight = identifiedFisherman?.catches?.reduce((sum, c) => sum + c.weight, 0).toFixed(2) || '0.00';

    return (
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <span className="hover:text-primary transition-colors cursor-pointer">Dashboard</span>
                <ChevronRight size={16} />
                <span className="text-slate-900 dark:text-white font-medium">Weigh-In Station</span>
            </div>

            {/* Page Heading & Status */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Weigh-In Station</h2>
                    <p className="text-slate-500 dark:text-slate-400">Record catch data accurately in kg. Verify participant ID before submission.</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">System Online</span>
                </div>
            </div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-2">
                {/* Left Column: Input Module (Scanner + Form) */}
                <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
                    {/* Scanner / Camera Card */}
                    <div className="bg-white dark:bg-[#192b33] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden group">
                        <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
                            {/* Simulated Camera Feed Background */}
                            <div className="absolute inset-0 opacity-60 bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCMXVwvljIaPXRE94YDV4ZBrb-uJCgWyYyx8bV-NPFtLIE2-muJZW_A3gH0J-3sL-QeN0bAZiWMAyz55V1zupmHsJg0V7k8-UYnevNGFwBoCztnmRLxN33plzMmokZJ82mUUKWRh-qzEQDFRdyZrVQLPF70UW5RHDe43xWXv7cc4eBiDGMFVA29fNkczfrs0hte4gVmcpcvP0TWIK8XXd8fKKsIIPpOgpSlSZR_iV0eBaV5UPAjqcxJ8lzoyb5sKw0W4E0TMz7t8WQ")' }}></div>

                            {/* Scanning Overlay UI */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-12">
                                <div className="relative w-64 h-64 border-2 border-primary/50 rounded-lg flex flex-col justify-between p-2 shadow-[0_0_100px_rgba(19,164,236,0.15)] backdrop-blur-[1px]">
                                    {/* Corners */}
                                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary -mt-1 -ml-1"></div>
                                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary -mt-1 -mr-1"></div>
                                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary -mb-1 -ml-1"></div>
                                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary -mb-1 -mr-1"></div>
                                    {/* Scan line animation */}
                                    <div className="w-full h-0.5 bg-primary shadow-[0_0_10px_#13a4ec] absolute top-1/2 left-0 animate-[ping_3s_ease-in-out_infinite] opacity-50"></div>
                                </div>
                                <div className="mt-4 px-4 py-2 bg-black/70 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-2">
                                    <Loader2 className="text-primary animate-spin" size={16} />
                                    <p className="text-white text-xs font-medium tracking-wide">Scanning Angler ID...</p>
                                </div>
                            </div>
                        </div>

                        {/* Manual Controls */}
                        <div className="p-6 flex flex-col gap-6">
                            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Input Details</h3>
                                <button onClick={() => { setSelectedId(''); setWeight(''); setIdentifiedFisherman(null); }} className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
                                    <RotateCcw size={16} />
                                    Reset Form
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Participant ID Input */}
                                <label className="flex flex-col gap-2 group">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Participant ID</span>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                            <User size={20} />
                                        </div>
                                        <input
                                            autoFocus
                                            className="w-full h-14 pl-12 pr-4 bg-slate-50 dark:bg-[#101c22] border border-slate-200 dark:border-slate-700 rounded-lg text-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-primary transition-all font-mono"
                                            placeholder="Enter ID (e.g. FISH-123)"
                                            type="text"
                                            value={selectedId}
                                            onChange={(e) => setSelectedId(e.target.value)}
                                        />
                                    </div>
                                </label>
                                {/* Weight Input */}
                                <label className="flex flex-col gap-2">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Fish Weight</span>
                                    <div className="relative">
                                        <input
                                            className="w-full h-14 pl-4 pr-12 bg-slate-50 dark:bg-[#101c22] border border-slate-200 dark:border-slate-700 rounded-lg text-2xl font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-primary transition-all text-right font-mono"
                                            placeholder="0.00"
                                            step="0.01"
                                            type="number"
                                            value={weight}
                                            onChange={(e) => setWeight(e.target.value)}
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">kg</span>
                                    </div>
                                </label>
                            </div>

                            {/* Detected Participant Card (Dynamic View) */}
                            {identifiedFisherman ? (
                                <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-lg p-4 flex flex-col sm:flex-row gap-4 items-center animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex-shrink-0">
                                        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${identifiedFisherman.avatar || "https://ui-avatars.com/api/?name=" + identifiedFisherman.name}')` }}></div>
                                    </div>
                                    <div className="flex-1 text-center sm:text-left">
                                        <p className="text-sm text-primary font-semibold uppercase tracking-wider">Identified</p>
                                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">{identifiedFisherman.name}</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Team: <span className="text-slate-700 dark:text-slate-300 font-medium">{identifiedFisherman.team || 'None'}</span></p>
                                    </div>
                                    <div className="text-right px-4 hidden sm:block">
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Current Total</p>
                                        <p className="text-xl font-mono font-bold text-slate-900 dark:text-white">{currentTotalWeight} kg</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-24 bg-slate-50 dark:bg-[#101c22] border border-slate-200 dark:border-slate-700 border-dashed rounded-lg flex items-center justify-center text-slate-400 text-sm">
                                    Participant not identified...
                                </div>
                            )}

                            {/* Action Button */}
                            <button
                                onClick={handleRecordCatch}
                                disabled={isLoading || !identifiedFisherman || !weight}
                                className={`w-full h-14 mt-2 text-white text-lg font-bold rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 ${isLoading || !identifiedFisherman || !weight
                                    ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed text-slate-500'
                                    : 'bg-primary hover:bg-sky-500 active:bg-sky-600 shadow-primary/20'
                                    }`}
                            >
                                {isLoading ? <Loader2 className="animate-spin" /> : <Save size={24} />}
                                {isLoading ? 'Recording...' : 'Record Catch'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Recent History & Stats */}
                <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
                    {/* Stats Mini-Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-[#192b33] p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                            <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400">
                                <Fish size={20} />
                                <span className="text-xs font-semibold uppercase">Session</span>
                            </div>
                            <p className="text-3xl font-black text-slate-900 dark:text-white">{recentCatches.length}</p>
                        </div>
                        <div className="bg-white dark:bg-[#192b33] p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                            <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400">
                                <Scale size={20} />
                                <span className="text-xs font-semibold uppercase">Last</span>
                            </div>
                            <p className="text-3xl font-black text-slate-900 dark:text-white">{recentCatches[0]?.weight || '0.0'} <span className="text-base font-medium text-slate-400">kg</span></p>
                        </div>
                    </div>

                    {/* Recent Activity Log */}
                    <div className="bg-white dark:bg-[#192b33] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col h-full min-h-[400px]">
                        <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-white/5">
                            <h3 className="font-bold text-slate-900 dark:text-white">Recent Activity</h3>
                            <button className="text-xs font-medium text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary transition-colors">View All</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50 dark:bg-[#101c22] text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">
                                    <tr>
                                        <th className="px-4 py-3">Time</th>
                                        <th className="px-4 py-3">Angler</th>
                                        <th className="px-4 py-3 text-right">Weight</th>
                                        <th className="px-4 py-3 text-center">Act</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-sm">
                                    {recentCatches.length === 0 ? (
                                        <tr><td colSpan={4} className="p-4 text-center text-slate-400">No catches recorded in this session.</td></tr>
                                    ) : recentCatches.map((item, i) => (
                                        <tr key={i} className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                            <td className="px-4 py-3 text-slate-500 dark:text-slate-400 font-mono">{item.time}</td>
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-slate-900 dark:text-white">{item.name}</div>
                                                <div className="text-xs text-slate-500">ID {item.id}</div>
                                            </td>
                                            <td className="px-4 py-3 text-right font-mono font-bold text-slate-900 dark:text-white">{item.weight}</td>
                                            <td className="px-4 py-3 text-center">
                                                <button className="text-slate-400 hover:text-primary transition-colors">
                                                    <Edit size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
