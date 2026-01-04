import React, { useState, useEffect } from 'react';
import { Trophy, Scale, UserPlus, Ban, Fish, QrCode, ClipboardList, Settings, Download, Trash2, Edit3, Image as ImageIcon, RotateCcw, LogIn, User, Shield, ArrowLeft, LogOut, Lock, Key } from 'lucide-react';

// --- KONFIGURASI APP ---
const DEFAULT_BG = "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop"; 
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123"
};

// Kunci Penyimpanan Lokal
const STORAGE_KEY_DATA = 'fishing_data_fishermen';
const STORAGE_KEY_SETTINGS = 'fishing_data_settings';
const STORAGE_KEY_SESSION = 'fishing_user_session';

// --- Logika ID ---
const generateFishermanId = (existingIds) => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  let newId = '';
  do {
    newId = '';
    for (let i = 0; i < 3; i++) newId += letters.charAt(Math.floor(Math.random() * letters.length));
    for (let i = 0; i < 3; i++) newId += numbers.charAt(Math.floor(Math.random() * numbers.length));
  } while (existingIds.includes(newId));
  return newId;
};

const INITIAL_DATA = [
  { id: 'JDO101', name: 'Joko Widodo', weight: 15.2, isEliminated: false },
  { id: 'JSM202', name: 'Susi Susanti', weight: 12.8, isEliminated: false },
];

export default function App() {
  // --- Global State ---
  const [viewMode, setViewMode] = useState('landing'); // landing, admin_login, admin, fisherman_login, fisherman_dashboard

  // --- Load Data from LocalStorage ---
  const [fishermen, setFishermen] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DATA);
      return saved ? JSON.parse(saved) : INITIAL_DATA;
    } catch (e) { return INITIAL_DATA; }
  });

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      return saved ? JSON.parse(saved) : { eventName: "Lomba Mancing Mania 2025", bgImage: DEFAULT_BG };
    } catch (e) { return { eventName: "Lomba Mancing Mania 2025", bgImage: DEFAULT_BG }; }
  });

  // Session State
  const [currentFishermanId, setCurrentFishermanId] = useState(null);

  // Login Inputs
  const [loginId, setLoginId] = useState('');
  const [adminUserEntry, setAdminUserEntry] = useState('');
  const [adminPassEntry, setAdminPassEntry] = useState('');

  // UI State
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState('leaderboard');

  // Form Inputs
  const [regName, setRegName] = useState('');
  const [catchId, setCatchId] = useState('');
  const [catchWeight, setCatchWeight] = useState('');
  const [elimId, setElimId] = useState('');
  const [generatedId, setGeneratedId] = useState(null);

  // --- 1. PERSISTENCE EFFECTS ---
  // Simpan Data setiap kali berubah
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(fishermen));
  }, [fishermen]);

  // Simpan Settings setiap kali berubah
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  }, [settings]);

  // --- 2. SESSION RESTORE (Fix Refresh Logout) ---
  useEffect(() => {
    const savedSession = localStorage.getItem(STORAGE_KEY_SESSION);
    if (savedSession) {
      const session = JSON.parse(savedSession);
      if (session.role === 'admin') {
        setViewMode('admin');
      } else if (session.role === 'fisherman') {
        // Pastikan user masih ada di database
        const isValidUser = fishermen.some(f => f.id === session.id);
        if (isValidUser) {
          setCurrentFishermanId(session.id);
          setViewMode('fisherman_dashboard');
        } else {
          localStorage.removeItem(STORAGE_KEY_SESSION);
        }
      }
    }
  }, []);

  // --- Helper Functions ---
  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const saveSession = (role, id = null) => {
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify({ role, id }));
  };

  const clearSession = () => {
    localStorage.removeItem(STORAGE_KEY_SESSION);
  };

  // --- Actions (Local Logic) ---

  const handleRegister = (e) => {
    e.preventDefault();
    if (!regName.trim()) return;

    const existingIds = fishermen.map(f => f.id);
    const newId = generateFishermanId(existingIds);
    
    const newFisherman = {
      id: newId,
      name: regName,
      weight: 0,
      isEliminated: false
    };

    setFishermen([...fishermen, newFisherman]);
    setGeneratedId(newId);
    setRegName('');
    showNotification(`Berhasil mendaftarkan ${regName}`);
  };

  const handleAddCatch = (e) => {
    e.preventDefault();
    const id = catchId.toUpperCase().trim();
    const weight = parseFloat(catchWeight);
    const fishermanIndex = fishermen.findIndex(f => f.id === id);

    if (fishermanIndex === -1) return showNotification('ID tidak ditemukan!', 'error');
    if (fishermen[fishermanIndex].isEliminated) return showNotification('Pemancing didiskualifikasi!', 'error');

    const updatedList = [...fishermen];
    updatedList[fishermanIndex].weight += weight;
    setFishermen(updatedList);
    
    setCatchId('');
    setCatchWeight('');
    showNotification(`Berhasil menambahkan ${weight}kg`);
  };

  const handleEliminate = (e) => {
    e.preventDefault();
    const id = elimId.toUpperCase().trim();
    const fishermanIndex = fishermen.findIndex(f => f.id === id);

    if (fishermanIndex === -1) return showNotification('ID tidak ditemukan!', 'error');

    const updatedList = [...fishermen];
    updatedList[fishermanIndex].isEliminated = true;
    setFishermen(updatedList);

    setElimId('');
    showNotification(`Pemancing ${id} didiskualifikasi`);
  };

  // Settings Updates
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Warning: LocalStorage has ~5MB limit. Large images might fail.
      if (file.size > 1000000) { 
         return showNotification("Gambar terlalu besar untuk LocalStorage (Maks 1MB)", "error");
      }
      const reader = new FileReader();
      reader.onloadend = () => {
         setSettings({ ...settings, bgImage: reader.result });
         showNotification("Background diupdate!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearData = () => {
    if (!window.confirm("Hapus SEMUA data? Ini tidak bisa dibatalkan.")) return;
    setFishermen([]);
    setGeneratedId(null);
    showNotification("Semua data telah dihapus.", "error");
  };

  // --- Login/Logout Handlers ---

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminUserEntry === ADMIN_CREDENTIALS.username && adminPassEntry === ADMIN_CREDENTIALS.password) {
      setViewMode('admin');
      saveSession('admin');
      setAdminUserEntry('');
      setAdminPassEntry('');
      showNotification("Login Admin Berhasil!");
    } else {
      showNotification("Username/Password salah!", "error");
    }
  };

  const handleFishermanLogin = (e) => {
    e.preventDefault();
    const id = loginId.toUpperCase().trim();
    const found = fishermen.find(f => f.id === id);
    
    if (found) {
      setCurrentFishermanId(found.id);
      setViewMode('fisherman_dashboard');
      saveSession('fisherman', found.id);
      setLoginId('');
    } else {
      showNotification("ID tidak ditemukan.", "error");
    }
  };

  const handleLogout = () => {
    clearSession();
    setViewMode('landing');
    setCurrentFishermanId(null);
  };

  const sortedFishermen = [...fishermen].sort((a, b) => b.weight - a.weight);
  const currentFisherman = fishermen.find(f => f.id === currentFishermanId);

  // --- Views ---

  if (viewMode === 'landing') {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center blur-[2px] opacity-20" style={{ backgroundImage: `url(${settings.bgImage})` }}></div>
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full relative z-10 text-center border-t-4 border-sky-500">
          <Fish size={64} className="mx-auto text-sky-500 mb-4" />
          <h1 className="text-2xl font-bold text-stone-800 mb-2 uppercase">{settings.eventName}</h1>
          <p className="text-stone-500 mb-8">Selamat datang di aplikasi manajemen lomba.</p>
          <div className="space-y-4">
            <button onClick={() => setViewMode('fisherman_login')} className="w-full flex items-center justify-center gap-3 p-4 bg-sky-500 hover:bg-sky-600 text-white rounded-xl transition-all shadow-md group">
              <User size={24} className="group-hover:scale-110 transition-transform"/>
              <div className="text-left"><div className="font-bold text-lg">Peserta / Pemancing</div><div className="text-xs text-sky-100">Lihat klasemen</div></div>
            </button>
            <button onClick={() => setViewMode('admin_login')} className="w-full flex items-center justify-center gap-3 p-4 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-all border-2 border-transparent hover:border-stone-300 group">
              <Shield size={24} className="text-stone-500 group-hover:text-stone-700"/>
              <div className="text-left"><div className="font-bold text-lg">Panitia / Admin</div><div className="text-xs text-stone-400">Kelola lomba</div></div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (viewMode === 'fisherman_login') {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
         {notification && <div className="fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-lg text-white font-bold z-50 bg-red-500">{notification.msg}</div>}
         <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full relative">
            <button onClick={() => setViewMode('landing')} className="absolute top-4 left-4 text-stone-400 hover:text-stone-600"><ArrowLeft size={24} /></button>
            <div className="text-center mb-6 mt-4"><h2 className="text-2xl font-bold text-stone-800">Login Peserta</h2></div>
            <form onSubmit={handleFishermanLogin} className="space-y-4">
                <input type="text" className="w-full p-4 text-center text-2xl font-mono uppercase border-2 border-stone-200 rounded-xl focus:border-sky-500 outline-none" placeholder="ABC123" value={loginId} onChange={(e) => setLoginId(e.target.value)} maxLength={6}/>
                <button className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-xl shadow-lg transition-transform active:scale-95">Masuk</button>
            </form>
         </div>
      </div>
    );
  }

  if (viewMode === 'admin_login') {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
         {notification && <div className="fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-lg text-white font-bold z-50 bg-red-500">{notification.msg}</div>}
         <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full relative border-t-4 border-stone-600">
            <button onClick={() => setViewMode('landing')} className="absolute top-4 left-4 text-stone-400 hover:text-stone-600"><ArrowLeft size={24} /></button>
            <div className="text-center mb-6 mt-4"><Shield size={40} className="mx-auto text-stone-600 mb-2"/><h2 className="text-2xl font-bold text-stone-800">Login Panitia</h2></div>
            <form onSubmit={handleAdminLogin} className="space-y-4">
                <input type="text" className="w-full p-3 pl-4 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 outline-none" placeholder="Username" value={adminUserEntry} onChange={(e) => setAdminUserEntry(e.target.value)}/>
                <input type="password" className="w-full p-3 pl-4 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 outline-none" placeholder="Password" value={adminPassEntry} onChange={(e) => setAdminPassEntry(e.target.value)}/>
                <button className="w-full bg-stone-700 hover:bg-stone-800 text-white font-bold py-3 rounded-xl shadow-lg transition-transform active:scale-95">Masuk Dashboard</button>
            </form>
         </div>
      </div>
    );
  }

  // Dashboard Renderer (Shared Layout for Admin & Fisherman)
  if (viewMode === 'admin' || viewMode === 'fisherman_dashboard') {
    const isAdmin = viewMode === 'admin';
    return (
      <div className="min-h-screen bg-[#FDFBF7] font-sans text-slate-800 pb-20">
        {notification && <div className={`fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-lg text-white font-bold z-50 animate-bounce ${notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>{notification.msg}</div>}
        
        {/* Header */}
        <div className="w-full h-48 relative overflow-hidden shadow-md border-b-4 border-white">
           <div className="absolute inset-0 w-full h-full bg-cover bg-center blur-[4px] scale-110 transition-all duration-500" style={{ backgroundImage: `url(${settings.bgImage})` }}></div>
           <div className="absolute inset-0 bg-black/40"></div>
           <div className="absolute inset-0 flex flex-col justify-center items-center z-10 text-white p-4">
              <Fish size={48} className="mb-2 text-sky-300 drop-shadow-md" />
              <h1 className="text-3xl md:text-4xl font-bold text-center drop-shadow-lg tracking-wide uppercase">{settings.eventName}</h1>
              {isAdmin && <div className="mt-2 text-xs font-bold bg-red-500 px-2 py-0.5 rounded text-white">MODE ADMIN</div>}
              {!isAdmin && currentFisherman && <div className="mt-2 flex items-center gap-2 bg-white/20 px-4 py-1 rounded-full backdrop-blur-sm"><User size={16} /><span className="font-medium">Halo, {currentFisherman.name}</span></div>}
           </div>
           
           {/* LOGOUT BUTTON FIXED (z-50 + cursor-pointer) */}
           <button 
              onClick={handleLogout}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-md transition z-50 cursor-pointer shadow-lg border border-white/20"
              title="Keluar"
           >
              <LogOut size={20} />
           </button>
        </div>

        {/* --- Navigation (Admin Only) --- */}
        {isAdmin && (
          <div className="max-w-4xl mx-auto -mt-6 relative z-10 px-2 sm:px-4">
            <div className="flex flex-row shadow-lg rounded-xl overflow-hidden bg-white">
              <TabButton active={activeTab === 'register'} onClick={() => setActiveTab('register')} icon={<UserPlus size={20} />} label="Daftar" color="bg-sky-500" />
              <TabButton active={activeTab === 'add-catch'} onClick={() => setActiveTab('add-catch')} icon={<Scale size={20} />} label="Timbang" color="bg-sky-500" />
              <TabButton active={activeTab === 'leaderboard'} onClick={() => setActiveTab('leaderboard')} icon={<Trophy size={20} />} label="Klasemen" color="bg-sky-500" />
              <TabButton active={activeTab === 'eliminate'} onClick={() => setActiveTab('eliminate')} icon={<Ban size={20} />} label="Eliminasi" color="bg-red-400" />
              <TabButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings size={20} />} label="Atur" color="bg-slate-500" />
            </div>
          </div>
        )}

        {/* --- Content --- */}
        <div className="max-w-4xl mx-auto mt-8 px-4 pb-20">
          
          {/* Leaderboard View (Available to both) */}
          {(!isAdmin || activeTab === 'leaderboard') && (
            <div className="bg-[#FFFDF5] rounded-xl shadow-sm border border-stone-200 overflow-hidden">
               {/* Fisherman Header */}
               {!isAdmin && (
                  <div className="p-4 bg-sky-50 border-b border-sky-100 flex items-center justify-between">
                      <h3 className="font-bold text-sky-800 flex items-center gap-2"><Trophy size={20} className="text-yellow-500"/> Klasemen Sementara</h3>
                      <span className="text-xs text-stone-500 bg-white px-2 py-1 rounded border border-stone-200">Offline Mode</span>
                  </div>
               )}
               <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-[#FDFBF7] border-b border-stone-200">
                      <th className="p-4 pl-8 font-bold text-stone-700 w-24">Rank</th>
                      <th className="p-4 font-bold text-stone-700">Nama</th>
                      <th className="p-4 font-bold text-stone-700 text-right pr-8">Total Berat (kg)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedFishermen.map((f, index) => {
                      const isMe = currentFishermanId === f.id;
                      return (
                        <tr key={f.id} className={`border-b border-stone-100 last:border-0 transition-colors ${isMe ? 'bg-yellow-50 ring-1 ring-inset ring-yellow-300' : 'hover:bg-stone-50'} ${f.isEliminated ? 'opacity-50 grayscale bg-stone-100' : ''}`}>
                          <td className="p-4 pl-8 font-mono text-stone-500">{index + 1}.</td>
                          <td className="p-4 font-medium text-lg text-stone-800 flex items-center gap-2">
                            {f.name}
                            {isMe && <span className="text-[10px] font-bold text-yellow-700 bg-yellow-200 px-1.5 rounded">ANDA</span>}
                            {f.isEliminated && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">DISKUALIFIKASI</span>}
                          </td>
                          <td className="p-4 text-right pr-8 font-mono text-lg font-bold text-stone-700">{f.weight ? f.weight.toFixed(2) : '0.00'}</td>
                        </tr>
                      );
                    })}
                    {sortedFishermen.length === 0 && <tr><td colSpan="3" className="p-8 text-center text-stone-400">Menunggu data...</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Admin Exclusive Views */}
          {isAdmin && activeTab === 'register' && (
            <div className="bg-white p-8 rounded-xl shadow-sm max-w-lg mx-auto border border-stone-200">
              <h2 className="text-2xl font-bold text-center mb-6 text-stone-700">Pendaftaran Baru</h2>
              <form onSubmit={handleRegister} className="space-y-4">
                <input type="text" className="w-full p-3 border border-stone-300 rounded-lg outline-none" placeholder="Nama Lengkap" value={regName} onChange={(e) => setRegName(e.target.value)} />
                <button className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-lg shadow-md">Daftar</button>
              </form>
              {generatedId && (
                <div className="mt-8 p-6 bg-stone-50 rounded-lg text-center border-2 border-dashed border-stone-300">
                  <div className="bg-white p-4 inline-block shadow-sm rounded-lg mb-2">
                     <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${generatedId}`} alt="QR" className="w-32 h-32" />
                  </div>
                  <p className="text-3xl font-mono font-bold text-sky-600">{generatedId}</p>
                </div>
              )}
            </div>
          )}

          {isAdmin && activeTab === 'add-catch' && (
            <div className="bg-white p-8 rounded-xl shadow-sm max-w-lg mx-auto border border-stone-200">
               <h2 className="text-2xl font-bold text-center mb-6 text-stone-700">Timbang Ikan</h2>
               <form onSubmit={handleAddCatch} className="space-y-4">
                <div className="flex gap-2">
                    <input type="text" className="w-full p-3 border border-stone-300 rounded-lg outline-none uppercase font-mono" placeholder="ID: ABC123" value={catchId} onChange={(e) => setCatchId(e.target.value)} maxLength={6} />
                    <button type="button" className="bg-stone-100 p-3 rounded-lg"><QrCode /></button>
                </div>
                <div className="flex gap-2">
                    <input type="number" step="0.01" className="w-full p-3 border border-stone-300 rounded-lg outline-none" placeholder="0.00 kg" value={catchWeight} onChange={(e) => setCatchWeight(e.target.value)} />
                    <button type="button" onClick={() => setCatchWeight((Math.random() * 5 + 0.5).toFixed(2))} className="bg-green-100 text-green-700 px-4 rounded-lg text-sm font-bold">Auto</button>
                </div>
                <button className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-lg shadow-md">Simpan</button>
              </form>
            </div>
          )}

          {isAdmin && activeTab === 'eliminate' && (
            <div className="bg-white p-8 rounded-xl shadow-sm max-w-lg mx-auto border border-red-100">
               <h2 className="text-2xl font-bold text-center mb-6 text-red-600">Diskualifikasi</h2>
               <form onSubmit={handleEliminate} className="space-y-4">
                <input type="text" className="w-full p-3 border border-red-200 rounded-lg outline-none uppercase font-mono bg-red-50" placeholder="ID: ABC123" value={elimId} onChange={(e) => setElimId(e.target.value)} maxLength={6} />
                <button className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg shadow-md">Diskualifikasi</button>
              </form>
            </div>
          )}

          {isAdmin && activeTab === 'settings' && (
            <div className="bg-white p-8 rounded-xl shadow-sm max-w-lg mx-auto border border-stone-200">
               <h2 className="text-2xl font-bold text-center mb-6 text-stone-700">Pengaturan</h2>
               <div className="space-y-6">
                  <div className="p-4 border border-blue-100 bg-blue-50 rounded-lg">
                    <h3 className="font-bold text-stone-700 mb-2">Nama Acara</h3>
                    <input type="text" value={settings.eventName} onChange={(e) => setSettings({ ...settings, eventName: e.target.value })} className="w-full p-2 border border-blue-200 rounded" />
                  </div>
                  <div className="p-4 border border-purple-100 bg-purple-50 rounded-lg">
                    <h3 className="font-bold text-stone-700 mb-2">Background</h3>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-sm" />
                  </div>
                  <div className="p-4 border border-red-100 bg-red-50 rounded-lg">
                    <button onClick={handleClearData} className="w-full bg-white border border-red-300 text-red-600 hover:bg-red-500 hover:text-white font-bold py-2 px-4 rounded-lg transition">Hapus Semua Data (Lokal)</button>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}

function TabButton({ active, onClick, icon, label, color }) {
  return (
    <button onClick={onClick} className={`flex-1 flex flex-col items-center justify-center py-4 px-1 sm:px-2 transition-all duration-300 outline-none ${active ? 'text-white' : 'text-stone-400 hover:bg-stone-50'} ${active ? color : 'bg-transparent'}`}>
      <div className={`mb-1 ${active ? 'scale-110' : 'scale-100'}`}>{icon}</div>
      <span className="text-[10px] sm:text-sm font-bold tracking-wide">{label}</span>
    </button>
  );
}