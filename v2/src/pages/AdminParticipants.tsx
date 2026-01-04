import { useState, useEffect } from 'react';
import { Search, ChevronDown, Copy, Ban, Info, Plus, X, UserPlus } from 'lucide-react';
import { api } from '../services/api';
import type { Fisherman } from '../types';

export default function AdminParticipants() {
    const [participants, setParticipants] = useState<Fisherman[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'disqualified'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Form State
    const [newFisherman, setNewFisherman] = useState({ name: '', email: '', team: '', id: '' });

    useEffect(() => {
        fetchParticipants();
    }, []);

    const fetchParticipants = async () => {
        try {
            const data = await api.getData();
            setParticipants(data.fishermen || []);
        } catch (error) {
            console.error('Failed to fetch participants:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddParticipant = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Check if ID is provided, if not generate one (6-digit ID like V1)
            const idToUse = newFisherman.id.trim() || Math.floor(100000 + Math.random() * 900000).toString();

            await api.registerFisherman({
                name: newFisherman.name,
                email: newFisherman.email,
                team: newFisherman.team || 'Individual',
                id: idToUse,
            });
            setShowAddModal(false);
            setNewFisherman({ name: '', email: '', team: '', id: '' });
            fetchParticipants(); // Refresh list
        } catch (error) {
            console.error('Failed to register:', error);
            alert('Failed to register participant');
        }
    };

    const handleDisqualify = async (id: string) => {
        if (!confirm('Are you sure you want to disqualify this participant?')) return;
        try {
            await api.updateFisherman(id, { status: 'Disqualified' });
            fetchParticipants();
        } catch (error) {
            console.error('Failed to disqualify:', error);
        }
    };

    // Derived State
    const filteredParticipants = participants.filter(p => {
        const matchesStatus = filterStatus === 'all' ||
            (filterStatus === 'active' && p.status === 'Active') ||
            (filterStatus === 'disqualified' && p.status === 'Disqualified');

        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.team && p.team.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesStatus && matchesSearch;
    });

    const activeCount = participants.filter(p => p.status === 'Active').length;
    const disqualifiedCount = participants.filter(p => p.status === 'Disqualified').length;

    return (
        <div className="max-w-[1200px] mx-auto flex flex-col gap-6 relative">
            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-[#192b33] rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-[#325567] overflow-hidden">
                        <div className="p-6 border-b border-slate-200 dark:border-[#325567] flex justify-between items-center">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <UserPlus size={24} className="text-primary" />
                                Add Participant
                            </h3>
                            <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-500 dark:hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleAddParticipant} className="p-6 flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                                <input required type="text" value={newFisherman.name} onChange={e => setNewFisherman({ ...newFisherman, name: e.target.value })} className="w-full rounded-lg border border-slate-300 dark:border-[#325567] bg-white dark:bg-[#111c22] px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none" placeholder="e.g. John Doe" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                                <input required type="email" value={newFisherman.email} onChange={e => setNewFisherman({ ...newFisherman, email: e.target.value })} className="w-full rounded-lg border border-slate-300 dark:border-[#325567] bg-white dark:bg-[#111c22] px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none" placeholder="e.g. john@example.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Team Name (Optional)</label>
                                <input type="text" value={newFisherman.team} onChange={e => setNewFisherman({ ...newFisherman, team: e.target.value })} className="w-full rounded-lg border border-slate-300 dark:border-[#325567] bg-white dark:bg-[#111c22] px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none" placeholder="e.g. River Rats" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Participant ID (Optional)</label>
                                <input type="text" value={newFisherman.id} onChange={e => setNewFisherman({ ...newFisherman, id: e.target.value.toUpperCase() })} className="w-full rounded-lg border border-slate-300 dark:border-[#325567] bg-white dark:bg-[#111c22] px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none" placeholder="Leave blank to auto-generate" />
                            </div>
                            <button type="submit" className="mt-2 w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-primary/20">
                                Register Participant
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Breadcrumbs */}
            <div className="flex flex-wrap gap-2 text-sm">
                <span className="text-slate-500 dark:text-[#92b7c9]">Dashboard</span>
                <span className="text-slate-500 dark:text-[#92b7c9]">/</span>
                <span className="text-slate-500 dark:text-[#92b7c9]">Tournament A</span>
                <span className="text-slate-500 dark:text-[#92b7c9]">/</span>
                <span className="text-slate-900 dark:text-white font-medium">Participants</span>
            </div>

            {/* Page Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-slate-900 dark:text-white text-3xl font-black tracking-tight">Participants Management</h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-primary hover:bg-primary/90 text-white text-sm font-bold shadow-lg shadow-primary/20 transition-all"
                >
                    <Plus size={20} />
                    <span>Add Participant</span>
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1 rounded-xl p-5 border border-slate-200 dark:border-[#325567] bg-white dark:bg-[#16262e]">
                    <p className="text-slate-500 dark:text-[#92b7c9] text-sm font-medium">Total Participants</p>
                    <p className="text-slate-900 dark:text-white text-2xl font-bold">{participants.length}</p>
                </div>
                <div className="flex flex-col gap-1 rounded-xl p-5 border border-slate-200 dark:border-[#325567] bg-white dark:bg-[#16262e]">
                    <p className="text-slate-500 dark:text-[#92b7c9] text-sm font-medium">Active Anglers</p>
                    <p className="text-slate-900 dark:text-white text-2xl font-bold">{activeCount}</p>
                </div>
                <div className="flex flex-col gap-1 rounded-xl p-5 border border-slate-200 dark:border-[#325567] bg-white dark:bg-[#16262e]">
                    <p className="text-slate-500 dark:text-[#92b7c9] text-sm font-medium">Disqualified</p>
                    <p className="text-red-500 dark:text-red-400 text-2xl font-bold">{disqualifiedCount}</p>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#92b7c9]" size={20} />
                    <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-lg bg-white dark:bg-[#192b33] border border-slate-200 dark:border-[#325567] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-[#92b7c9] h-12 pl-12 pr-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        placeholder="Search by name or ID..."
                    />
                </div>
                <div className="relative w-full sm:w-48">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as any)}
                        className="w-full appearance-none rounded-lg bg-white dark:bg-[#192b33] border border-slate-200 dark:border-[#325567] text-slate-900 dark:text-white h-12 px-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none cursor-pointer"
                    >
                        <option value="all">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="disqualified">Disqualified</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#92b7c9] pointer-events-none" size={20} />
                </div>
            </div>

            {/* Data Table */}
            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-[#325567] bg-white dark:bg-[#16262e]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-[#1e2e38] border-b border-slate-200 dark:border-[#325567]">
                                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#92b7c9]">Participant</th>
                                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#92b7c9]">ID</th>
                                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#92b7c9]">Team</th>
                                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#92b7c9]">Reg. Date</th>
                                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#92b7c9]">Status</th>
                                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#92b7c9] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-[#325567]">
                            {isLoading ? (
                                <tr><td colSpan={6} className="p-8 text-center text-slate-500">Loading participants...</td></tr>
                            ) : filteredParticipants.length === 0 ? (
                                <tr><td colSpan={6} className="p-8 text-center text-slate-500">No participants found.</td></tr>
                            ) : (
                                filteredParticipants.map((p) => (
                                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-[#1e2e38] transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-cover bg-center bg-gray-200 dark:bg-gray-700" style={{ backgroundImage: `url('${p.avatar || "https://ui-avatars.com/api/?name=" + p.name}')` }}></div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900 dark:text-white">{p.name}</p>
                                                    <p className="text-xs text-slate-500 dark:text-[#92b7c9]">{p.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-sm text-slate-500 dark:text-[#92b7c9]">{p.id}</span>
                                                <button
                                                    onClick={() => navigator.clipboard.writeText(p.id)}
                                                    className="text-primary hover:text-slate-900 dark:hover:text-white transition-colors"
                                                    title="Copy ID">
                                                    <Copy size={16} />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`text-sm ${p.team === 'Individual' ? 'text-slate-400 italic' : 'text-slate-900 dark:text-white'}`}>{p.team}</span>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-sm text-slate-500 dark:text-[#92b7c9]">{new Date(p.registeredAt).toLocaleDateString()}</span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${p.status === 'Active' ? 'bg-emerald-400/10 text-emerald-600 dark:text-emerald-400 border-emerald-400/20' : 'bg-red-400/10 text-red-600 dark:text-red-400 border-red-400/20'}`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            {p.status === 'Active' ? (
                                                <button onClick={() => handleDisqualify(p.id)} className="inline-flex items-center justify-center rounded p-2 text-red-500 dark:text-red-400 hover:bg-red-400/10 transition-colors" title="Disqualify Participant">
                                                    <Ban size={20} />
                                                </button>
                                            ) : (
                                                <button className="inline-flex items-center justify-center rounded p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors" title="Details">
                                                    <Info size={20} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination (Visual Only for now) */}
                <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-[#1e2e38] border-t border-slate-200 dark:border-[#325567]">
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-slate-500 dark:text-[#92b7c9]">
                                Showing <span className="font-medium text-slate-900 dark:text-white">{filteredParticipants.length > 0 ? 1 : 0}</span> to <span className="font-medium text-slate-900 dark:text-white">{filteredParticipants.length}</span> of <span className="font-medium text-slate-900 dark:text-white">{participants.length}</span> results
                            </p>
                        </div>
                        <div>
                            {/* Pagination Logic Omitted for Brevity in this batch */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
