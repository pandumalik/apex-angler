import React, { useState, useEffect } from 'react';
import { Trophy, Scale, UserPlus, Ban, Fish, QrCode, ClipboardList, Settings, Download, Trash2, Edit3, Image as ImageIcon, RotateCcw, LogIn, User, Shield, ArrowLeft, LogOut, Lock, Key, Wifi, WifiOff, Users, ChevronDown, ChevronUp, Calendar, Copy, CheckCircle2, X } from 'lucide-react';

// --- LIBRARY TAMBAHAN (UNCOMMENT DI LOKAL) ---
// 1. Jalankan di terminal: npm install @yudiel/react-qr-scanner
// 2. Uncomment baris import di bawah ini saat dijalankan di komputer Anda:
import { Scanner } from '@yudiel/react-qr-scanner';

// --- KONFIGURASI HOST ---
// Gunakan hardcoded localhost untuk preview di sini agar tidak error.
// Saat di lokal, Anda bisa menggunakan: 
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";
// const API_BASE_URL = "http://localhost:3001/api";

const DEFAULT_BG = "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop";
const ADMIN_CREDENTIALS = { username: "admin", password: "admin123" };
const STORAGE_KEY_SESSION = 'fishing_user_session';
const STORAGE_KEY_DATA = 'fishing_data_fishermen'; // For Offline Fallback

// --- HEADERS KHUSUS NGROK ---
const API_HEADERS = {
  'Content-Type': 'application/json',
  'ngrok-skip-browser-warning': 'true'
};

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

export default function App() {
  // --- Global State ---
  const [viewMode, setViewMode] = useState('landing');

  // --- Data ---
  const [fishermen, setFishermen] = useState([]);
  const [settings, setSettings] = useState({ eventName: "Lomba Mancing Mania", bgImage: DEFAULT_BG });
  const [isConnected, setIsConnected] = useState(false);

  // Session & Inputs
  const [currentFishermanId, setCurrentFishermanId] = useState(null);
  const [loginId, setLoginId] = useState('');
  const [adminUserEntry, setAdminUserEntry] = useState('');
  const [adminPassEntry, setAdminPassEntry] = useState('');
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState('leaderboard');

  // Form Inputs
  const [regName, setRegName] = useState('');
  const [catchId, setCatchId] = useState('');
  const [catchWeight, setCatchWeight] = useState('');
  const [elimId, setElimId] = useState('');
  const [generatedId, setGeneratedId] = useState(null);

  // New State
  const [showParticipantList, setShowParticipantList] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  // --- 1. SYNC DATA (HYBRID) ---
  const fetchData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/data`, {
        headers: API_HEADERS
      });

      if (response.ok) {
        const data = await response.json();
        setFishermen(data.fishermen || []);
        if (data.settings) setSettings(data.settings);
        setIsConnected(true);
      } else {
        throw new Error("Server not reachable");
      }
    } catch (error) {
      setIsConnected(false);
      // Fallback to LocalStorage if Server is down
      const savedLocal = localStorage.getItem(STORAGE_KEY_DATA);
      if (savedLocal) {
        setFishermen(JSON.parse(savedLocal));
      }
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  // --- 2. SAVE LOCAL FALLBACK ---
  useEffect(() => {
    if (!isConnected) {
      localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(fishermen));
    }
  }, [fishermen, isConnected]);

  // --- 3. SESSION RESTORE ---
  useEffect(() => {
    const savedSession = localStorage.getItem(STORAGE_KEY_SESSION);
    if (savedSession) {
      const session = JSON.parse(savedSession);
      if (session.role === 'admin') {
        setViewMode('admin');
        setActiveTab('participants');
      } else if (session.role === 'fisherman') {
        setCurrentFishermanId(session.id);
        setViewMode('fisherman_dashboard');
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

  const formatDate = (isoString) => {
    if (!isoString) return "-";
    return new Date(isoString).toLocaleString('id-ID', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const copyToClipboard = (text) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showNotification(`ID ${text} disalin!`);
      }).catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
  };

  const fallbackCopy = (text) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (successful) showNotification(`ID ${text} disalin!`);
    } catch (err) {
      showNotification("Gagal menyalin ID", "error");
    }
  };

  // --- SCANNER LOGIC ---
  const handleScanResult = (scannedValue) => {
    if (scannedValue) {
      const code = typeof scannedValue === 'string' ? scannedValue : scannedValue?.[0]?.rawValue;
      if (code) {
        setCatchId(code);
        setIsScanning(false);
        showNotification(`QR Terdeteksi: ${code}`);
      }
    }
  };

  const handleScanError = (error) => {
    if (error?.message?.includes("Permission")) {
      showNotification("Izin kamera ditolak. Cek browser settings.", "error");
    }
  };

  // --- ACTIONS (HYBRID: SERVER OR LOCAL) ---

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regName.trim()) return showNotification("Isi data terlebih dahulu", "error");

    const existingIds = fishermen.map(f => f.id);
    const newId = generateFishermanId(existingIds);
    const newFisherman = {
      id: newId,
      name: regName,
      weight: 0,
      isEliminated: false,
      registeredAt: new Date().toISOString()
    };

    if (isConnected) {
      try {
        await fetch(`${API_BASE_URL}/register`, {
          method: 'POST',
          headers: API_HEADERS,
          body: JSON.stringify(newFisherman)
        });
        setGeneratedId(newId);
        setRegName('');
        fetchData();
        showNotification(`Berhasil mendaftarkan ${regName}`);
      } catch (error) {
        showNotification("Gagal menghubungi server", "error");
      }
    } else {
      setFishermen([...fishermen, newFisherman]);
      setGeneratedId(newId);
      setRegName('');
      showNotification(`Berhasil mendaftarkan (Offline)`);
    }
  };

  const handleAddCatch = async (e) => {
    e.preventDefault();
    if (!catchId.trim() || !catchWeight) return showNotification("Isi data terlebih dahulu", "error");

    const id = catchId.toUpperCase().trim();
    const weight = parseFloat(catchWeight);
    const fishermanIndex = fishermen.findIndex(f => f.id === id);

    if (fishermanIndex === -1) return showNotification('ID tidak ditemukan!', 'error');
    if (fishermen[fishermanIndex].isEliminated) return showNotification('Diskualifikasi!', 'error');

    if (isConnected) {
      try {
        const newWeight = (fishermen[fishermanIndex].weight || 0) + weight;
        await fetch(`${API_BASE_URL}/update/${id}`, {
          method: 'POST',
          headers: API_HEADERS,
          body: JSON.stringify({ weight: newWeight })
        });
        setCatchId('');
        setCatchWeight('');
        fetchData();
        showNotification(`Berhasil menambahkan ${weight}kg`);
      } catch (error) {
        showNotification("Gagal update data", "error");
      }
    } else {
      const updated = [...fishermen];
      updated[fishermanIndex].weight += weight;
      setFishermen(updated);
      setCatchId('');
      setCatchWeight('');
      showNotification(`Berhasil (Offline)`);
    }
  };

  const handleEliminate = async (id) => {
    if (!window.confirm(`Yakin ingin mendiskualifikasi peserta ${id}?`)) return;

    if (isConnected) {
      try {
        await fetch(`${API_BASE_URL}/update/${id}`, {
          method: 'POST',
          headers: API_HEADERS,
          body: JSON.stringify({ isEliminated: true })
        });
        fetchData();
        showNotification(`Pemancing ${id} didiskualifikasi`);
      } catch (error) {
        showNotification("Gagal update data", "error");
      }
    } else {
      const updated = fishermen.map(f => f.id === id ? { ...f, isEliminated: true } : f);
      setFishermen(updated);
      showNotification(`Diskualifikasi (Offline)`);
    }
  };

  const handleUpdateSettings = async (newSettings) => {
    if (isConnected) {
      try {
        await fetch(`${API_BASE_URL}/settings`, {
          method: 'POST',
          headers: API_HEADERS,
          body: JSON.stringify(newSettings)
        });
        fetchData();
      } catch (error) {
        showNotification("Gagal update setting", "error");
      }
    } else {
      setSettings({ ...settings, ...newSettings });
      showNotification("Setting tersimpan (Offline)");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10000000) return showNotification("Max 10MB", "error");
      const reader = new FileReader();
      reader.onloadend = () => {
        handleUpdateSettings({ bgImage: reader.result });
        showNotification("Background diupdate!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Nama", "TotalBerat_KG", "Status", "Waktu_Daftar"];
    const rows = fishermen.map(f => [
      f.id,
      f.name,
      f.weight.toFixed(2),
      f.isEliminated ? 'Diskualifikasi' : 'Aktif',
      formatDate(f.registeredAt)
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "data_lomba_mancing.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showNotification("Data berhasil diekspor ke CSV!");
  };

  const handleClearData = async () => {
    if (!window.confirm("Hapus SEMUA data?")) return;
    if (isConnected) {
      try {
        await fetch(`${API_BASE_URL}/clear`, { method: 'POST', headers: API_HEADERS });
        setGeneratedId(null);
        fetchData();
        showNotification("Database Host Direset", "error");
      } catch (e) { showNotification("Gagal reset", "error"); }
    } else {
      setFishermen([]);
      setGeneratedId(null);
      showNotification("Data Offline Dihapus", "error");
    }
  };

  // --- Auth Handlers ---
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (!adminUserEntry.trim() || !adminPassEntry.trim()) return showNotification("Isi data terlebih dahulu", "error");

    if (adminUserEntry === ADMIN_CREDENTIALS.username && adminPassEntry === ADMIN_CREDENTIALS.password) {
      setViewMode('admin');
      saveSession('admin');
      setAdminUserEntry('');
      setAdminPassEntry('');
      setActiveTab('participants');
    } else {
      showNotification("Login Gagal", "error");
    }
  };

  const handleFishermanLogin = (e) => {
    e.preventDefault();
    if (!loginId.trim()) return showNotification("Isi data terlebih dahulu", "error");

    const id = loginId.toUpperCase().trim();
    const found = fishermen.find(f => f.id === id);
    if (found) {
      setCurrentFishermanId(found.id);
      setViewMode('fisherman_dashboard');
      saveSession('fisherman', found.id);
      setLoginId('');
    } else {
      showNotification(isConnected ? "ID tidak ditemukan di Server" : "ID tidak ditemukan (Mode Offline)", "error");
    }
  };

  const handleLogout = () => {
    clearSession();
    setViewMode('landing');
    setCurrentFishermanId(null);
  };

  const sortedFishermen = [...fishermen].sort((a, b) => b.weight - a.weight);
  const currentFisherman = fishermen.find(f => f.id === currentFishermanId);

  // --- RENDER ---

  if (viewMode === 'landing') {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center blur-[2px] opacity-20" style={{ backgroundImage: `url(${settings.bgImage || DEFAULT_BG})` }}></div>

        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 ${isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {isConnected ? <Wifi size={14} /> : <WifiOff size={14} />}
          {isConnected ? "Terhubung ke Host" : "Host Tidak Ditemukan"}
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full relative z-10 text-center border-t-4 border-sky-500">
          <Fish size={64} className="mx-auto text-sky-500 mb-4" />
          <h1 className="text-2xl font-bold text-stone-800 mb-2 uppercase">{settings.eventName}</h1>
          <p className="text-stone-500 mb-8">Aplikasi Lomba (Host Mode)</p>
          <div className="space-y-4">
            <button onClick={() => setViewMode('fisherman_login')} className="w-full flex items-center justify-center gap-3 p-4 bg-sky-500 hover:bg-sky-600 text-white rounded-xl transition-all shadow-md group">
              <User size={24} className="group-hover:scale-110 transition-transform" />
              <div className="text-left"><div className="font-bold text-lg">Peserta / Pemancing</div><div className="text-xs text-sky-100">Lihat klasemen</div></div>
            </button>
            <button onClick={() => setViewMode('admin_login')} className="w-full flex items-center justify-center gap-3 p-4 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-all border-2 border-transparent hover:border-stone-300 group">
              <Shield size={24} className="text-stone-500 group-hover:text-stone-700" />
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
        {notification && (
          <div className={`fixed top-6 left-1/2 -translate-x-1/2 px-6 py-2.5 rounded-full shadow-2xl z-[100] text-sm font-medium text-center backdrop-blur-md border flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300 ${notification.type === 'error' ? 'bg-red-500/80 border-red-400/50 text-white' : 'bg-emerald-500/80 border-emerald-400/50 text-white'
            }`}>
            {notification.msg}
          </div>
        )}
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full relative">
          <button onClick={() => setViewMode('landing')} className="absolute top-4 left-4 text-stone-400 hover:text-stone-600"><ArrowLeft size={24} /></button>
          <div className="text-center mb-6 mt-4"><h2 className="text-2xl font-bold text-stone-800">Login Peserta</h2></div>
          <form onSubmit={handleFishermanLogin} className="space-y-4">
            <input type="text" className="w-full p-4 text-center text-2xl font-mono uppercase border-2 border-stone-200 rounded-xl focus:border-sky-500 outline-none" placeholder="ABC123" value={loginId} onChange={(e) => setLoginId(e.target.value)} maxLength={6} />
            <button className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-xl shadow-lg transition-transform active:scale-95">Masuk</button>
          </form>
        </div>
      </div>
    );
  }

  if (viewMode === 'admin_login') {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
        {notification && (
          <div className={`fixed top-6 left-1/2 -translate-x-1/2 px-6 py-2.5 rounded-full shadow-2xl z-[100] text-sm font-medium text-center backdrop-blur-md border flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300 ${notification.type === 'error' ? 'bg-red-500/80 border-red-400/50 text-white' : 'bg-emerald-500/80 border-emerald-400/50 text-white'
            }`}>
            {notification.msg}
          </div>
        )}
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full relative border-t-4 border-stone-600">
          <button onClick={() => setViewMode('landing')} className="absolute top-4 left-4 text-stone-400 hover:text-stone-600"><ArrowLeft size={24} /></button>
          <div className="text-center mb-6 mt-4"><Shield size={40} className="mx-auto text-stone-600 mb-2" /><h2 className="text-2xl font-bold text-stone-800">Login Panitia</h2></div>
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <input type="text" className="w-full p-3 pl-4 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 outline-none" placeholder="Username" value={adminUserEntry} onChange={(e) => setAdminUserEntry(e.target.value)} />
            <input type="password" className="w-full p-3 pl-4 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 outline-none" placeholder="Password" value={adminPassEntry} onChange={(e) => setAdminPassEntry(e.target.value)} />
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
        {/* Notification */}
        {notification && (
          <div className={`fixed top-6 left-1/2 -translate-x-1/2 px-6 py-2.5 rounded-full shadow-2xl z-[100] text-sm font-medium text-center backdrop-blur-md border flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300 ${notification.type === 'error' ? 'bg-red-500/80 border-red-400/50 text-white' : 'bg-emerald-500/80 border-emerald-400/50 text-white'
            }`}>
            {notification.msg}
          </div>
        )}

        {/* Header */}
        <div className="w-full h-64 relative overflow-hidden shadow-md border-b-4 border-white">
          <div className="absolute inset-0 w-full h-full bg-cover bg-center blur-[4px] scale-110 transition-all duration-500" style={{ backgroundImage: `url(${settings.bgImage || DEFAULT_BG})` }}></div>
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 flex flex-col justify-center items-center z-10 text-white p-4">
            <Fish size={48} className="mb-2 text-sky-300 drop-shadow-md" />
            <h1 className="text-3xl md:text-4xl font-bold text-center drop-shadow-lg tracking-wide uppercase">{settings.eventName}</h1>

            {isAdmin && <div className="mt-2 flex items-center gap-2 bg-white/20 px-4 py-1 rounded-full backdrop-blur-sm shadow-lg border border-white/20"><Shield size={16} className="text-red-300" /><span className="font-medium text-red-100">Mode Admin</span></div>}
            {!isAdmin && currentFisherman && <div className="mt-2 flex items-center gap-2 bg-white/20 px-4 py-1 rounded-full backdrop-blur-sm shadow-lg border border-white/20"><User size={16} className="text-sky-300" /><span className="font-medium text-sky-100">Halo, {currentFisherman.name}</span></div>}
          </div>

          <div className="absolute top-4 left-4 z-50">
            <div className={`p-2 rounded-full backdrop-blur-md transition shadow-lg border border-white/20 flex items-center justify-center bg-white/20`} title={isConnected ? "Terhubung" : "Offline"}>
              {isConnected ? <Wifi size={20} className="text-green-300" /> : <WifiOff size={20} className="text-red-300" />}
            </div>
          </div>

          <button onClick={handleLogout} className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-md transition z-50 cursor-pointer shadow-lg border border-white/20" title="Keluar">
            <LogOut size={20} />
          </button>
        </div>

        {/* --- Navigation (Admin Only) --- */}
        {isAdmin && (
          <div className="max-w-4xl mx-auto -mt-6 relative z-10 px-2 sm:px-4">
            <div className="flex flex-row shadow-lg rounded-xl overflow-hidden bg-white">
              <TabButton active={activeTab === 'participants'} onClick={() => setActiveTab('participants')} icon={<Users size={20} />} label="Peserta" color="bg-sky-500" />
              <TabButton active={activeTab === 'add-catch'} onClick={() => setActiveTab('add-catch')} icon={<Scale size={20} />} label="Timbang" color="bg-sky-500" />
              <TabButton active={activeTab === 'leaderboard'} onClick={() => setActiveTab('leaderboard')} icon={<Trophy size={20} />} label="Klasemen" color="bg-sky-500" />
              <TabButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings size={20} />} label="Atur" color="bg-slate-500" />
            </div>
          </div>
        )}

        {/* --- Content --- */}
        <div className="max-w-4xl mx-auto mt-8 px-4 pb-20">

          {/* --- MODAL SCANNER KAMERA --- */}
          {isScanning && (
            <div className="fixed inset-0 z-[100] bg-black flex flex-col justify-center items-center">
              <button onClick={() => setIsScanning(false)} className="absolute top-4 right-4 text-white bg-white/10 p-2 rounded-full z-50"><X size={32} /></button>
              <h3 className="text-white text-lg font-bold mb-4 z-50">Scan QR Code Peserta</h3>
              <div className="w-full max-w-sm aspect-square bg-black relative border-2 border-sky-500 overflow-hidden rounded-xl">

                {/* UNCOMMENT DI LOKAL UNTUK MENGGUNAKAN KAMERA */}
                <Scanner
                  onScan={(result) => handleScanResult(result)}
                  onError={(error) => handleScanError(error)}
                  styles={{ container: { width: '100%', height: '100%' } }}
                />

                {/* Placeholder untuk Preview (JIKA SCANNER ERROR/LOADING) */}
                <div className="absolute inset-0 -z-10 flex flex-col items-center justify-center text-white/50">
                  <QrCode size={64} className="animate-pulse" />
                  <p className="mt-4 text-sm text-center px-8">Memuat Kamera...</p>
                </div>

                {/* Viewfinder Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-64 h-64 border-2 border-white/10 rounded-xl relative">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-400 rounded-tl-lg shadow-[0_0_10px_rgba(74,222,128,0.5)]"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-400 rounded-tr-lg shadow-[0_0_10px_rgba(74,222,128,0.5)]"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-400 rounded-bl-lg shadow-[0_0_10px_rgba(74,222,128,0.5)]"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-400 rounded-br-lg shadow-[0_0_10px_rgba(74,222,128,0.5)]"></div>
                    {/* Scanning Line Animation */}
                    <div className="absolute left-0 right-0 h-0.5 bg-green-400/80 shadow-[0_0_15px_rgba(74,222,128,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
                  </div>
                </div>

              </div>
              <p className="text-white/60 mt-4 text-sm z-50">Arahkan kamera ke QR Code peserta</p>
            </div>
          )}

          {/* Leaderboard View */}
          {(!isAdmin || activeTab === 'leaderboard') && (
            <div className="bg-[#FFFDF5] rounded-xl shadow-sm border border-stone-200 overflow-hidden">
              {!isAdmin && (
                <div className="p-4 bg-sky-50 border-b border-sky-100 flex items-center justify-between">
                  <h3 className="font-bold text-sky-800 flex items-center gap-2"><Trophy size={20} className="text-yellow-500" /> Klasemen Sementara</h3>
                  <span className="text-xs text-sky-600 bg-white px-2 py-1 rounded border border-sky-200 animate-pulse">Live Data</span>
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

          {/* Admin: Peserta */}
          {isAdmin && activeTab === 'participants' && (
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-stone-200">
                <h2 className="text-2xl font-bold text-center mb-6 text-stone-700">Daftar Peserta Baru</h2>
                <form onSubmit={handleRegister} className="space-y-4">
                  <input type="text" className="w-full p-3 border border-stone-300 rounded-lg outline-none" placeholder="Nama Lengkap" value={regName} onChange={(e) => setRegName(e.target.value)} />
                  <button className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-lg shadow-md">Daftar</button>
                </form>
                {generatedId && <div className="mt-8 p-6 bg-stone-50 rounded-lg text-center border-2 border-dashed border-stone-300"><div className="bg-white p-4 inline-block shadow-sm rounded-lg mb-2"><img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${generatedId}`} alt="QR" className="w-32 h-32" /></div><p className="text-3xl font-mono font-bold text-sky-600">{generatedId}</p></div>}
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
                <div className="p-4 bg-stone-50 border-b border-stone-100"><h3 className="font-bold text-stone-700 flex items-center gap-2"><Users size={20} /> Manajemen Peserta ({fishermen.length})</h3></div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-stone-100 text-stone-600"><tr><th className="p-3">ID (Salin)</th><th className="p-3">Nama</th><th className="p-3">Waktu Daftar</th><th className="p-3 text-right">Aksi</th></tr></thead>
                    <tbody className="divide-y divide-stone-100">
                      {[...fishermen].reverse().map((f) => (
                        <tr key={f.id} className="hover:bg-stone-50">
                          <td className="p-3"><button onClick={() => copyToClipboard(f.id)} className={`font-mono font-bold px-2 py-1 rounded text-xs border flex items-center gap-1 hover:brightness-90 active:scale-95 transition ${f.isEliminated ? 'bg-red-100 text-red-600 border-red-200' : 'bg-green-100 text-green-600 border-green-200'}`}><Copy size={10} /> {f.id}</button></td>
                          <td className="p-3 text-stone-800 font-medium">{f.name}</td>
                          <td className="p-3 text-stone-500 font-mono text-xs">{formatDate(f.registeredAt)}</td>
                          <td className="p-3 text-right">{!f.isEliminated ? <button onClick={() => handleEliminate(f.id)} className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg border border-red-100 hover:bg-red-100 transition font-medium">Diskualifikasi</button> : <span className="text-xs text-stone-400 italic">Sudah Diskualifikasi</span>}</td>
                        </tr>
                      ))}
                      {fishermen.length === 0 && <tr><td colSpan="4" className="p-8 text-center text-stone-400">Belum ada data.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {isAdmin && activeTab === 'add-catch' && (
            <div className="bg-white p-8 rounded-xl shadow-sm max-w-lg mx-auto border border-stone-200">
              <h2 className="text-2xl font-bold text-center mb-6 text-stone-700">Timbang Ikan</h2>
              <form onSubmit={handleAddCatch} className="space-y-4">
                <div className="flex gap-2"><input type="text" className="w-full p-3 border border-stone-300 rounded-lg outline-none uppercase font-mono" placeholder="ID: ABC123" value={catchId} onChange={(e) => setCatchId(e.target.value)} maxLength={6} /><button type="button" onClick={() => setIsScanning(true)} className="bg-stone-100 hover:bg-stone-200 p-3 rounded-lg text-stone-600"><QrCode /></button></div>
                <div className="flex gap-2"><input type="number" step="0.01" className="w-full p-3 border border-stone-300 rounded-lg outline-none" placeholder="0.00 kg" value={catchWeight} onChange={(e) => setCatchWeight(e.target.value)} /><button type="button" onClick={() => setCatchWeight((Math.random() * 5 + 0.5).toFixed(2))} className="bg-green-100 text-green-700 px-4 rounded-lg text-sm font-bold">Auto</button></div>
                <button className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-lg shadow-md">Simpan</button>
              </form>
            </div>
          )}

          {isAdmin && activeTab === 'settings' && (
            <div className="bg-white p-8 rounded-xl shadow-sm max-w-lg mx-auto border border-stone-200">
              <h2 className="text-2xl font-bold text-center mb-6 text-stone-700">Pengaturan Host</h2>
              <div className="space-y-6">
                <div className="p-4 border border-blue-100 bg-blue-50 rounded-lg"><h3 className="font-bold text-stone-700 mb-2">Nama Acara</h3><input type="text" value={settings.eventName} onChange={(e) => handleUpdateSettings({ eventName: e.target.value })} className="w-full p-2 border border-blue-200 rounded" /></div>
                <div className="p-4 border border-purple-100 bg-purple-50 rounded-lg"><h3 className="font-bold text-stone-700 mb-2">Background</h3><input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-sm" />
                  <button onClick={() => { handleUpdateSettings({ bgImage: DEFAULT_BG }); showNotification("Reset ke default"); }} className="flex items-center gap-2 text-xs font-bold text-stone-500 hover:text-stone-800 transition-colors mt-2"><RotateCcw size={14} /> Reset ke Default</button></div>

                <div className="p-4 border border-stone-100 bg-stone-50 rounded-lg"><div className="flex items-center gap-3 mb-2"><div className="bg-green-100 p-2 rounded-full text-green-600"><Download size={20} /></div><h3 className="font-bold text-stone-700">Ekspor Data</h3></div><p className="text-sm text-stone-500 mb-4 ml-12">Unduh klasemen saat ini sebagai file .CSV (Excel).</p><button onClick={handleExportCSV} className="w-full ml-auto bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition">Unduh CSV</button></div>
                <hr className="border-stone-100" />
                <div className="p-4 border border-red-100 bg-red-50 rounded-lg"><button onClick={handleClearData} className="w-full bg-white border border-red-300 text-red-600 hover:bg-red-500 hover:text-white font-bold py-2 px-4 rounded-lg transition">Hapus Semua Data Host</button></div>
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
  return <button onClick={onClick} className={`flex-1 flex flex-col items-center justify-center py-4 px-1 sm:px-2 transition-all duration-300 outline-none ${active ? 'text-white' : 'text-stone-400 hover:bg-stone-50'} ${active ? color : 'bg-transparent'}`}><div className={`mb-1 ${active ? 'scale-110' : 'scale-100'}`}>{icon}</div><span className="text-[10px] sm:text-sm font-bold tracking-wide">{label}</span></button>;
}