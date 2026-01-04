import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, LogIn, LifeBuoy } from 'lucide-react';

export default function AdminLogin() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('password123'); // Default from design
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate network request
        setTimeout(() => {
            // Simple hardcoded check for now (matching V1)
            if (username === 'admin' && (password === 'admin123' || password === 'password123')) {
                navigate('/admin/dashboard');
            } else {
                alert('Invalid credentials');
                setIsLoading(false);
            }
        }, 1000);
    };

    return (
        <div className="flex min-h-screen w-full bg-background-light dark:bg-background-dark font-display text-white">
            {/* Left Side: Image Panel */}
            <div className="hidden relative w-0 flex-1 lg:block">
                <div className="absolute inset-0 h-full w-full bg-cover bg-center"
                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDw64qsqaXbpoP45s71lPhO_XTj71234M0eRV03ibC56wpG9N7BGD5uMo86o_dPbst6GXhZWDDufbZJH0QdD3amcYP8XnWtXXaRESuefShlSDYcn1vsbVCPF6zHuAuhnXPt8T4p9qIEadKvQ8IYOlqYZaoz6Vrn4M4nkFHnfwiFqZl7DWpKxOWqYYL9GNsWF9gLmsx6lJBaCPHGLQY-5udbJeyqOxWh9pS77uoNhX2IqmOyPsrYrZdkBOKlyJyi9Vf9MPdP4U-8oms')" }}>
                    <div className="absolute inset-0 bg-[#111c22]/60 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111c22] via-transparent to-transparent opacity-90"></div>
                </div>
                <div className="absolute bottom-0 left-0 p-20 text-white z-10">
                    <h2 className="text-4xl font-black tracking-tight mb-4">Tournament Master</h2>
                    <p className="text-lg text-text-secondary max-w-md leading-relaxed">
                        Manage your fishing events with precision. Real-time leaderboards, angler tracking, and seamless tournament administration.
                    </p>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-[#111c22] border-l border-[#233c48]">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-3 text-white">
                            <div className="flex items-center justify-center size-10 rounded-lg bg-[#192b33] border border-[#233c48] text-primary">
                                <LogIn className="size-6" />
                            </div>
                            <span className="text-xl font-bold tracking-tight">Tournament Master</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <h1 className="text-white text-3xl font-black leading-tight tracking-[-0.033em]">Admin Portal</h1>
                            <p className="text-text-secondary text-base font-normal leading-normal">Welcome back! Please sign in to manage your fishing tournaments.</p>
                        </div>
                    </div>

                    <div className="mt-8 rounded-lg bg-[#192b33]/50 border border-[#233c48] p-4 flex items-start gap-3">
                        <LifeBuoy className="text-primary text-sm mt-0.5" size={20} />
                        <p className="text-text-secondary text-sm font-normal leading-normal">
                            <span className="text-white font-medium">Demo Credentials:</span><br />
                            Username: <span className="font-mono text-primary">admin</span> / Password: <span className="font-mono text-primary">admin123</span>
                        </p>
                    </div>

                    <div className="mt-8">
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-white" htmlFor="username">Username</label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-text-secondary">
                                        <User size={20} />
                                    </div>
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        required
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="block w-full rounded-lg border border-border-color bg-input-bg py-3 pl-11 pr-4 text-white placeholder-text-secondary focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm"
                                        placeholder="Enter your username"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-white" htmlFor="password">Password</label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-text-secondary">
                                        <Lock size={20} />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full rounded-lg border border-border-color bg-input-bg py-3 pl-11 pr-12 text-white placeholder-text-secondary focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm"
                                        placeholder="••••••••"
                                    />
                                    <div
                                        className="absolute inset-y-0 right-0 flex items-center pr-4 cursor-pointer text-text-secondary hover:text-white transition-colors"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex w-full justify-center items-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-[#111c22] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    <LogIn size={20} />
                                    {isLoading ? 'Signing in...' : 'Sign in'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
