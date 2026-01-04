
import { Image as ImageIcon, Save, Download, AlertTriangle, Trash2, HelpCircle } from 'lucide-react';

export default function AdminSettings() {
    return (
        <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 pb-20">
            {/* Breadcrumbs */}
            <nav className="flex flex-wrap gap-2 mb-6 text-sm">
                <a className="text-slate-500 dark:text-[#92b7c9] hover:text-primary transition-colors font-medium" href="#">Dashboard</a>
                <span className="text-slate-500 dark:text-[#92b7c9] font-medium">/</span>
                <span className="text-slate-900 dark:text-white font-medium">Settings</span>
            </nav>

            {/* Page Heading */}
            <div className="flex flex-col gap-2 mb-8">
                <h1 className="text-slate-900 dark:text-white text-3xl font-black leading-tight tracking-tight">Tournament Settings</h1>
                <p className="text-slate-500 dark:text-[#92b7c9] text-base font-normal">Manage general event configurations, branding, and data controls.</p>
            </div>

            {/* Grid Layout for Settings Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Branding & Config (Spans 2 columns) */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    {/* Event Details Card */}
                    <div className="bg-white dark:bg-[#192b33] rounded-xl border border-slate-200 dark:border-[#325567] overflow-hidden">
                        <div className="p-6 border-b border-slate-200 dark:border-[#325567]">
                            <h2 className="text-slate-900 dark:text-white text-lg font-bold">General Information</h2>
                            <p className="text-slate-500 dark:text-[#92b7c9] text-sm mt-1">Configure the main display details for the public.</p>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Tournament Name Input */}
                            <div className="space-y-2">
                                <label className="block text-slate-900 dark:text-white text-sm font-medium" htmlFor="tournament-name">Tournament Name</label>
                                <input className="form-input flex w-full rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-slate-200 dark:border-[#325567] bg-white dark:bg-[#101c22] h-12 px-4 placeholder:text-slate-400 dark:placeholder-[#92b7c9]/50 text-base transition-all" id="tournament-name" placeholder="e.g., Annual Bassmaster Classic 2024" type="text" defaultValue="Grand Lake Fishing Open 2024" />
                            </div>
                            {/* Background Image Upload */}
                            <div className="space-y-2">
                                <label className="block text-slate-900 dark:text-white text-sm font-medium">Splash Screen / Background Image</label>
                                <div className="mt-2 flex justify-center rounded-xl border border-dashed border-slate-200 dark:border-[#325567] px-6 py-10 bg-slate-50 dark:bg-[#101c22]/50 hover:bg-slate-100 dark:hover:bg-[#101c22] hover:border-primary/50 transition-all cursor-pointer group">
                                    <div className="text-center">
                                        <div className="mx-auto h-12 w-12 text-slate-400 dark:text-[#92b7c9] group-hover:text-primary transition-colors flex items-center justify-center">
                                            <ImageIcon size={48} strokeWidth={1} />
                                        </div>
                                        <div className="mt-4 flex text-sm leading-6 text-gray-500 dark:text-gray-400 justify-center">
                                            <label className="relative cursor-pointer rounded-md bg-transparent font-semibold text-primary focus-within:outline-none hover:text-primary/80" htmlFor="file-upload">
                                                <span>Upload a file</span>
                                                <input className="sr-only" id="file-upload" name="file-upload" type="file" />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs leading-5 text-gray-500 dark:text-gray-500">PNG, JPG, GIF up to 10MB (1920x1080px)</p>
                                    </div>
                                </div>
                                {/* Current Image Preview (Optional) */}
                                <div className="relative mt-4 w-full h-32 rounded-lg overflow-hidden border border-slate-200 dark:border-[#325567] group">
                                    <img className="w-full h-full object-cover opacity-60" alt="Current background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8gBEOC9_x7r_Y_tkGYzC-znbaIqZd052F16PxVff7FckdvEer-FENkTynU2Eqe35btXY7sYuqRT8PMFi4XIV6CpBO5EuOrGITdPjoaFj4QAGouPOmSQEgITVhc3d566PFkWCeeSFmUMJaiyHeokpETwOOa72CysWjaZCsRR6Y3xKOeRll5VO9yNMBWAOuV6063jPc5MlIPelMo4BHrp2AeS9OqAU7ENqkcC_CJRuXNzlXR2lkX8SGnigN_v-pZSZxIwMXb_-o7JY" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <p className="text-white text-xs bg-black/50 px-2 py-1 rounded">Current Background</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-slate-50 dark:bg-[#101c22]/30 border-t border-slate-200 dark:border-[#325567] flex justify-end">
                            <button className="bg-primary hover:bg-primary/90 text-white font-medium py-2.5 px-5 rounded-lg text-sm transition-colors shadow-lg shadow-primary/20 flex items-center gap-2">
                                <Save size={18} />
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Data & Actions */}
                <div className="flex flex-col gap-6">
                    {/* Data Export Card */}
                    <div className="bg-white dark:bg-[#192b33] rounded-xl border border-slate-200 dark:border-[#325567] overflow-hidden">
                        <div className="p-5 border-b border-slate-200 dark:border-[#325567]">
                            <h2 className="text-slate-900 dark:text-white text-lg font-bold">Data &amp; Privacy</h2>
                        </div>
                        <div className="p-5 flex flex-col gap-4">
                            <div>
                                <h3 className="text-slate-900 dark:text-white text-sm font-semibold">Export Data</h3>
                                <p className="text-slate-500 dark:text-[#92b7c9] text-xs mt-1 leading-relaxed">Download a full report of participants, catches, and rankings in CSV format.</p>
                            </div>
                            <button className="w-full border border-slate-200 dark:border-[#325567] hover:border-primary/50 text-slate-500 dark:text-[#92b7c9] hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#101c22] font-medium py-2.5 px-4 rounded-lg text-sm transition-all flex justify-center items-center gap-2">
                                <Download size={18} />
                                Export CSV
                            </button>
                        </div>
                    </div>

                    {/* Danger Zone Card */}
                    <div className="bg-white dark:bg-[#192b33] rounded-xl border border-red-200 dark:border-red-900/30 overflow-hidden relative">
                        {/* Red accent top strip */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-red-600"></div>
                        <div className="p-5 border-b border-red-100 dark:border-red-900/20 bg-red-50 dark:bg-red-950/10">
                            <div className="flex items-center gap-2 text-red-500">
                                <AlertTriangle size={20} />
                                <h2 className="text-slate-900 dark:text-white text-lg font-bold">Danger Zone</h2>
                            </div>
                        </div>
                        <div className="p-5 flex flex-col gap-4">
                            <div>
                                <h3 className="text-slate-900 dark:text-white text-sm font-semibold">Reset Tournament</h3>
                                <p className="text-slate-500 dark:text-[#92b7c9] text-xs mt-1 leading-relaxed">
                                    This will permanently delete all catches, participants, and ranking data. This action cannot be undone.
                                </p>
                            </div>
                            <button className="w-full bg-red-50 dark:bg-red-600/10 hover:bg-red-100 dark:hover:bg-red-600/20 border border-red-200 dark:border-red-600/50 text-red-500 hover:text-red-600 dark:hover:text-red-400 font-medium py-2.5 px-4 rounded-lg text-sm transition-all flex justify-center items-center gap-2">
                                <Trash2 size={18} />
                                Reset All Data
                            </button>
                        </div>
                    </div>

                    {/* Quick Help Card */}
                    <div className="bg-primary/5 rounded-xl border border-primary/20 p-5">
                        <div className="flex gap-3">
                            <HelpCircle className="text-primary" size={24} />
                            <div>
                                <h3 className="text-slate-900 dark:text-white text-sm font-semibold">Need Help?</h3>
                                <p className="text-slate-500 dark:text-[#92b7c9] text-xs mt-1">
                                    Contact support if you need to restore a previous backup.
                                </p>
                                <a className="text-primary text-xs font-medium mt-2 inline-block hover:underline" href="#">Contact Support →</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
