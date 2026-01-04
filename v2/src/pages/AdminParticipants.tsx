import { Search, ChevronDown, Copy, Ban, Info, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AdminParticipants() {
    // Mock Data
    const participants = [
        { id: 'FISH-8829', name: 'John Fisher', email: 'john.fisher@example.com', team: 'The Big Catchers', regDate: 'Oct 24, 2023', status: 'Active', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyogy6dGURlVDjO9wHmdG2xnv0n1M8L8o5goSFTZnizkWFPwRG8hCBlvy8UFPhqCujkS1L45usSpaQjrHm7qZ2peHHw3ocbA086NtAXpXJEJqhcaVomCCp99oc-q8CS8ewww_DsX7KFPKbnep0WMNG1KiTxZRcHM_pG3zj4dPXYitW6MMkznZ6eWKQ6K0tXsmWKO_I9QUtfkF_U6IC19L3ItvO3LLqOozqK9efh0PBiPXYCvdh136KmmvhycSen7dyqKlVBJwdkRM' },
        { id: 'FISH-9921', name: 'Sarah Hooks', email: 'sarah.h@example.com', team: 'River Raiders', regDate: 'Oct 22, 2023', status: 'Active', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUgJwWVCAMh5kEkaS7ZwESxd-2GC4ocwfsaURJGAVx-ExKm4QXXtKCG8G5mJIy-Pe2-6t-vN48joXn04zQoBD0yXNZD1kqwLJop0CcapE4yOvN7lwRe8FhtpC_9OPmdH5tOjHFEnMCyBaTUPQ4DBs4ZhTBSOs-Dyi8rzZaq-rtqQ-9Hne1wP1LG3qalks0bG57H6pKw6gNT2EY2huw4Txola-0aCOdOJ4vorNItl4shZ6raCxJdHCPodXEShh8dgbYLzhJPPhQJ54' },
        { id: 'FISH-1022', name: 'Mike Trout', email: 'mike.trout@example.com', team: 'Individual', regDate: 'Oct 20, 2023', status: 'Disqualified', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHr4-PB9h70mpUDKcKm8CutlGIbpxfHKglwCdP9aqvE9ZtNGHInobYdhgTejOdsYyUWskq6-gdBwC7jglEBf0RTgOVqH7MypeV1z37_cPetSUHV-6M6s1UWn606N3mJTTkCn3b0JhV9MYqfZn8gjzWePfV0AdImv0rao3Ov5z_74LEhX_QKS5vyQb6LhLr-exRbZFyGeG4Im67iWUCxcVHXy-ZmyiOq5-EiQo75qHQrZirvoJc_ZMF1FC_dbmhwekNPcKOAsy6LnI' },
        { id: 'FISH-4401', name: 'Emily Bass', email: 'emily.bass@example.com', team: 'Bass Masters', regDate: 'Oct 19, 2023', status: 'Active', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcgLBHAzPFCelFwZ5g2LOjNtOJ0goRHLnVeoZNkvd8h7CP8xbftXBN6rTTe6DghMjgrnY72DPTWgwA-8QjqlwDqp2BjIP6NciYG0MuGiyD43TovcJJasD-QSHzHisOfuwoD3fS4rU18uxO_2G49rSdavXxaMGabwEnjsbTLkNDEgseQdu9UM_y6m0I2cNcemP9ctvVHC9aWIq8Xdnd_eMLXqYWjHaNKefdAI4sDH77uvoZKOMvZdVtIDz-7KtUnnQqgacdVJUhqqA' },
    ];

    return (
        <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
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
                <button className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-primary hover:bg-primary/90 text-white text-sm font-bold shadow-lg shadow-primary/20 transition-all">
                    <Plus size={20} />
                    <span>Add Participant</span>
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1 rounded-xl p-5 border border-slate-200 dark:border-[#325567] bg-white dark:bg-[#16262e]">
                    <p className="text-slate-500 dark:text-[#92b7c9] text-sm font-medium">Total Participants</p>
                    <p className="text-slate-900 dark:text-white text-2xl font-bold">142</p>
                </div>
                <div className="flex flex-col gap-1 rounded-xl p-5 border border-slate-200 dark:border-[#325567] bg-white dark:bg-[#16262e]">
                    <p className="text-slate-500 dark:text-[#92b7c9] text-sm font-medium">Active Anglers</p>
                    <p className="text-slate-900 dark:text-white text-2xl font-bold">138</p>
                </div>
                <div className="flex flex-col gap-1 rounded-xl p-5 border border-slate-200 dark:border-[#325567] bg-white dark:bg-[#16262e]">
                    <p className="text-slate-500 dark:text-[#92b7c9] text-sm font-medium">Disqualified</p>
                    <p className="text-red-500 dark:text-red-400 text-2xl font-bold">4</p>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#92b7c9]" size={20} />
                    <input className="w-full rounded-lg bg-white dark:bg-[#192b33] border border-slate-200 dark:border-[#325567] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-[#92b7c9] h-12 pl-12 pr-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="Search by name or ID..." />
                </div>
                <div className="relative w-full sm:w-48">
                    <select className="w-full appearance-none rounded-lg bg-white dark:bg-[#192b33] border border-slate-200 dark:border-[#325567] text-slate-900 dark:text-white h-12 px-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none cursor-pointer">
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
                            {participants.map((p) => (
                                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-[#1e2e38] transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-cover bg-center bg-gray-200 dark:bg-gray-700" style={{ backgroundImage: `url('${p.avatar}')` }}></div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-900 dark:text-white">{p.name}</p>
                                                <p className="text-xs text-slate-500 dark:text-[#92b7c9]">{p.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-sm text-slate-500 dark:text-[#92b7c9]">{p.id}</span>
                                            <button className="text-primary hover:text-slate-900 dark:hover:text-white transition-colors" title="Copy ID">
                                                <Copy size={16} />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`text-sm ${p.team === 'Individual' ? 'text-slate-400 italic' : 'text-slate-900 dark:text-white'}`}>{p.team}</span>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-sm text-slate-500 dark:text-[#92b7c9]">{p.regDate}</span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${p.status === 'Active' ? 'bg-emerald-400/10 text-emerald-600 dark:text-emerald-400 border-emerald-400/20' : 'bg-red-400/10 text-red-600 dark:text-red-400 border-red-400/20'}`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        {p.status === 'Active' ? (
                                            <button className="inline-flex items-center justify-center rounded p-2 text-red-500 dark:text-red-400 hover:bg-red-400/10 transition-colors" title="Disqualify Participant">
                                                <Ban size={20} />
                                            </button>
                                        ) : (
                                            <button className="inline-flex items-center justify-center rounded p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors" title="Details">
                                                <Info size={20} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination (Visual Only) */}
                <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-[#1e2e38] border-t border-slate-200 dark:border-[#325567]">
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-slate-500 dark:text-[#92b7c9]">
                                Showing <span className="font-medium text-slate-900 dark:text-white">1</span> to <span className="font-medium text-slate-900 dark:text-white">{participants.length}</span> of <span className="font-medium text-slate-900 dark:text-white">142</span> results
                            </p>
                        </div>
                        <div>
                            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                <a href="#" className="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 dark:ring-[#325567] hover:bg-slate-100 dark:hover:bg-[#325567] focus:z-20 focus:outline-offset-0">
                                    <span className="sr-only">Previous</span>
                                    <ChevronLeft size={20} />
                                </a>
                                <a href="#" aria-current="page" className="relative z-10 inline-flex items-center bg-primary px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">1</a>
                                <a href="#" className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-900 dark:text-[#92b7c9] ring-1 ring-inset ring-slate-300 dark:ring-[#325567] hover:bg-slate-100 dark:hover:bg-[#325567] focus:z-20 focus:outline-offset-0">2</a>
                                <a href="#" className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-900 dark:text-[#92b7c9] ring-1 ring-inset ring-slate-300 dark:ring-[#325567] hover:bg-slate-100 dark:hover:bg-[#325567] focus:z-20 focus:outline-offset-0">3</a>
                                <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-700 dark:text-[#92b7c9] ring-1 ring-inset ring-slate-300 dark:ring-[#325567] focus:outline-offset-0">...</span>
                                <a href="#" className="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 dark:ring-[#325567] hover:bg-slate-100 dark:hover:bg-[#325567] focus:z-20 focus:outline-offset-0">
                                    <span className="sr-only">Next</span>
                                    <ChevronRight size={20} />
                                </a>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
