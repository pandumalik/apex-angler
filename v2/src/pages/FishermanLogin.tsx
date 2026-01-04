import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Anchor, IdCard, ArrowRight, HelpCircle } from 'lucide-react';

export default function FishermanLogin() {
    const navigate = useNavigate();
    const [participantId, setParticipantId] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!participantId.trim()) return;

        setIsLoading(true);
        // Simulate network request
        setTimeout(() => {
            // TODO: Validate ID against server/local data
            // For now, allow any ID to enter dashboard to demo UI
            navigate('/dashboard');
            // In real app: navigate('/dashboard', { state: { fishermanId: participantId } });
        }, 800);
    };

    return (
        <div className="min-h-screen flex flex-col bg-background-dark font-display text-white relative overflow-x-hidden">
            <div className="relative flex grow flex-col items-center justify-center p-4">

                {/* Background Abstract Image */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                    <div
                        className="absolute top-0 left-0 w-full h-full opacity-30 bg-cover bg-center mix-blend-overlay"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=2070&auto=format&fit=crop')" }}
                    ></div>
                    {/* Radial Gradient overlay implemented via CSS class in design, mimicked here with inline style or class if custom configured. 
              Using simple absolute overlay for now to ensure readability. */}
                    <div className="absolute inset-0 bg-background-dark/80"></div>
                </div>

                {/* Login Card */}
                <div className="relative z-10 w-full max-w-[480px] flex flex-col bg-[#192b33] rounded-2xl shadow-2xl border border-[#233c48]/50 overflow-hidden">

                    {/* Header Section */}
                    <div className="flex flex-col items-center pt-10 pb-4 px-8 text-center">
                        {/* Logo Icon */}
                        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-primary">
                            <Anchor className="text-4xl" size={40} />
                        </div>
                        {/* Headline */}
                        <h1 className="text-white text-[28px] font-bold leading-tight tracking-tight mb-2">Welcome, Angler</h1>
                        {/* Body Text */}
                        <p className="text-slate-400 text-base font-normal leading-relaxed">
                            Please enter your unique Participant ID to access the live leaderboard and submit your catches.
                        </p>
                    </div>

                    {/* Form Section */}
                    <div className="px-8 pb-10 pt-2 w-full">
                        <form onSubmit={handleLogin} className="flex flex-col gap-5">
                            {/* Input Field */}
                            <div className="flex flex-col gap-2">
                                <label className="text-white text-sm font-medium leading-normal pl-1" htmlFor="participant-id">Participant ID</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                        <IdCard size={24} />
                                    </div>
                                    <input
                                        id="participant-id"
                                        type="text"
                                        autoFocus
                                        value={participantId}
                                        onChange={(e) => setParticipantId(e.target.value.toUpperCase())}
                                        className="block w-full rounded-xl text-white border border-[#325567] bg-[#111c22] focus:border-primary focus:ring-1 focus:ring-primary h-14 pl-12 pr-4 placeholder:text-slate-500 text-base font-normal transition-all shadow-sm"
                                        placeholder="Enter your 6-digit ID"
                                        maxLength={6}
                                    />
                                </div>
                            </div>

                            {/* Action Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-6 bg-primary hover:bg-[#0f8ecf] text-white text-base font-bold leading-normal tracking-[0.015em] transition-colors shadow-lg shadow-primary/20 mt-2 disabled:opacity-70"
                            >
                                {isLoading ? (
                                    <span className="truncate">Entering...</span>
                                ) : (
                                    <>
                                        <span className="truncate">Enter Tournament</span>
                                        <ArrowRight className="ml-2" size={20} />
                                    </>
                                )}
                            </button>

                            {/* Helper Links */}
                            <div className="flex items-center justify-between mt-4">
                                <button type="button" className="text-sm text-slate-400 hover:text-primary transition-colors flex items-center gap-1 group">
                                    <HelpCircle size={16} className="group-hover:rotate-12 transition-transform" />
                                    Where do I find my ID?
                                </button>
                                <button type="button" className="text-sm text-slate-400 hover:text-white transition-colors">
                                    Contact Admin
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Bottom Accent */}
                    <div className="h-1.5 w-full bg-gradient-to-r from-[#192b33] via-primary to-[#192b33]"></div>
                </div>

                {/* Footer Copyright */}
                <div className="relative z-10 mt-8 text-center">
                    <p className="text-slate-500 text-xs">© 2024 Tournament Tracker. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}
