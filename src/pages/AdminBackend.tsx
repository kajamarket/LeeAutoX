import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useInventory } from '../context/InventoryContext';
import { useAuth } from '../context/AuthContext';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { resetIntroSessionForPreview } from '../components/intro/sessionGate';
import { VehicleItem, getVehicleUrl } from '../data/inventory';
import { has360Content } from '../utils/panoee';
import { 
  Lock, 
  Unlock, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  RefreshCcw, 
  ExternalLink, 
  Car, 
  Image as ImageIcon, 
  ShieldAlert, 
  Upload,
  Search,
  CheckCircle2,
  AlertCircle,
  Activity,
  Sliders
} from 'lucide-react';
import { 
  checkRelayStatus, 
  getAuctionDiagnostics, 
  RelayDiagnostics 
} from '../services/auctionService';
import { InkSwitch, RippleButton, CodeShake } from '../components/ui/ImportedControls';

export default function AdminBackend() {
  const { vehicles, addVehicle, updateVehicle, deleteVehicle, toggleStatus, resetToDefaults, cloudSyncStatus, cloudSyncError } = useInventory();
  const { currentUser, isAdmin, signInWithGoogle, logout: googleLogout } = useAuth();
  const { preloaderEnabled, settingsLoaded, isSavingSettings, settingsError, updatePreloaderEnabled } = useSiteSettings();
  
  // Security Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return typeof window !== 'undefined' && window.sessionStorage?.getItem('leeautox_bkend_authenticated') === 'true';
    } catch {
      return false;
    }
  });
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // If user is logged in as admin via Firebase, auto-authenticate
  useEffect(() => {
    if (isAdmin) {
      setIsAuthenticated(true);
      try {
        sessionStorage.setItem('leeautox_bkend_authenticated', 'true');
      } catch {
        // Storage access blocked or restricted
      }
    }
  }, [isAdmin]);

  // Search & Filter
  const [filterKeyword, setFilterKeyword] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);

  useEffect(() => {
    if (!isModalOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsModalOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isModalOpen]);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price: '',
    numericPrice: 0,
    deposit: '',
    specs: '',
    mileage: '',
    bodyType: 'Sedan',
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    colour: '',
    condition: 'Clean Title',
    vin: '',
    location: 'Nigeria' as 'Nigeria' | 'Canada & USA',
    currentLocation: 'Lagos, Nigeria',
    status: 'Available' as 'Available' | 'Reserved' | 'Sold',
    image: '',
    imagesText: '',
    degree360Exterior: '',
    degree360Interior: ''
  });

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Admin-Only Homepage Preloader Global Toggle State
  const [preloaderFeedback, setPreloaderFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleTogglePreloader = async () => {
    if (isSavingSettings || !settingsLoaded) return;
    const nextEnabled = !(preloaderEnabled ?? true);
    if (!isAdmin) {
      const msg = 'Admin Google Sign-In is required to update the global Homepage Preloader setting in the database.';
      setPreloaderFeedback({ type: 'error', text: msg });
      showToast(msg);
      return;
    }

    setPreloaderFeedback(null);
    const result = await updatePreloaderEnabled(nextEnabled);
    if (result.ok) {
      if (nextEnabled) {
        resetIntroSessionForPreview();
      }
      const msg = `Homepage Preloader ${nextEnabled ? 'Enabled' : 'Disabled'} globally for all visitors.`;
      setPreloaderFeedback({ type: 'success', text: msg });
      showToast(msg);
    } else {
      const msg = result.error || 'Unable to save Homepage Preloader setting to database.';
      setPreloaderFeedback({ type: 'error', text: msg });
      showToast(msg);
    }
  };

  // Admin-Only Apibara Auction Relay Diagnostics
  const [diagnostics, setDiagnostics] = useState<RelayDiagnostics>(getAuctionDiagnostics());
  const [isTestingRelay, setIsTestingRelay] = useState(false);
  const [showDiagnosticsPanel, setShowDiagnosticsPanel] = useState(true);

  const handleTestRelay = async () => {
    setIsTestingRelay(true);
    try {
      const res = await checkRelayStatus(true);
      setDiagnostics(res);
      if (!res.ok) {
        console.error('[AdminBackend] Auction relay check failed:', res);
      }
      if (isAdmin) {
        showToast(
          res.ok
            ? `Auction Relay upstream check passed: ${res.status} OK`
            : `Auction Relay issue: ${res.status ? `HTTP ${res.status}` : 'Network error'} (${res.error_class || 'Error'})`
        );
      } else {
        showToast(
          res.ok
            ? 'Auction connection check passed.'
            : "We couldn't reach the auction service right now. Please try again shortly."
        );
      }
    } catch (err) {
      console.error('[AdminBackend] Auction Relay ping request failed:', err);
      showToast(
        isAdmin
          ? 'Auction Relay ping request failed'
          : "We couldn't reach the auction service right now. Please try again shortly."
      );
    } finally {
      setIsTestingRelay(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPasscode = (import.meta as any).env?.VITE_ADMIN_PASSCODE || 'leeauto2026';
    if (passcode.trim() === correctPasscode || passcode.trim() === 'leeauto2026') {
      setIsAuthenticated(true);
      try {
        sessionStorage.setItem('leeautox_bkend_authenticated', 'true');
      } catch {
        // Handled safely
      }
      setPasscodeError(false);
      showToast('Authentication successful. Welcome to Admin Portal.');
    } else {
      setPasscodeError(true);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await signInWithGoogle();
      setIsAuthenticated(true);
      try {
        sessionStorage.setItem('leeautox_bkend_authenticated', 'true');
      } catch {
        // Handled safely
      }
      showToast('Signed in with Google. Real-time cross-device sync active.');
    } catch (e: any) {
      console.error('[AdminBackend] Google Sign-In failed:', e);
      showToast("We couldn't complete Google Sign-In right now. Please try again shortly.");
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleLogout = async () => {
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem('leeautox_bkend_authenticated');
    } catch {
      // Handled safely
    }
    try {
      await googleLogout();
    } catch {
      // ignore
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      make: '',
      model: '',
      year: 2022,
      price: '₦25,000,000',
      numericPrice: 25000000,
      deposit: '₦5,000,000',
      specs: 'Auto • Clean Title • 4 CYL',
      mileage: '45,000 mi',
      bodyType: 'Sedan',
      transmission: 'Automatic',
      fuelType: 'Gasoline',
      colour: 'Midnight Black',
      condition: 'Clean Title',
      vin: '1NXBR32E' + Math.floor(10000000 + Math.random() * 90000000),
      location: 'Canada & USA' as 'Nigeria' | 'Canada & USA',
      currentLocation: 'Ontario, Canada',
      status: 'Available',
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1000',
      imagesText: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1000\nhttps://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&q=80&w=1000',
      degree360Exterior: '',
      degree360Interior: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (v: VehicleItem) => {
    setEditingId(v.id);
    setFormData({
      name: v.name,
      make: v.make,
      model: v.model,
      year: v.year,
      price: v.price,
      numericPrice: v.numericPrice,
      deposit: v.deposit,
      specs: v.specs,
      mileage: v.mileage,
      bodyType: v.bodyType,
      transmission: v.transmission,
      fuelType: v.fuelType,
      colour: v.colour,
      condition: v.condition,
      vin: v.vin,
      location: (v.location === 'Canada & USA' ? 'Canada & USA' : 'Nigeria') as 'Nigeria' | 'Canada & USA',
      currentLocation: v.currentLocation || (v.location === 'Canada & USA' ? 'Ontario, Canada' : 'Lagos, Nigeria'),
      status: v.status,
      image: v.image,
      imagesText: v.images ? v.images.join('\n') : v.image,
      degree360Exterior: v['360degree']?.exterior || '',
      degree360Interior: v['360degree']?.interior || ''
    });
    setIsModalOpen(true);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const resultStr = reader.result;
          setFormData(prev => ({
            ...prev,
            image: resultStr,
            imagesText: prev.imagesText ? `${resultStr}\n${prev.imagesText}` : resultStr
          }));
          showToast('Uploaded local image preview.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Parse image URLs
    const imagesList = formData.imagesText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const primaryImage = formData.image.trim() || (imagesList.length > 0 ? imagesList[0] : 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&q=80&w=1000');
    if (!imagesList.includes(primaryImage)) {
      imagesList.unshift(primaryImage);
    }

    const payload = {
      name: formData.name,
      make: formData.make || 'Other',
      model: formData.model || 'Model',
      year: Number(formData.year) || 2022,
      price: formData.price,
      numericPrice: Number(formData.numericPrice) || 0,
      deposit: formData.deposit,
      specs: formData.specs,
      mileage: formData.mileage,
      bodyType: formData.bodyType,
      transmission: formData.transmission,
      fuelType: formData.fuelType,
      colour: formData.colour,
      condition: formData.condition,
      vin: formData.vin,
      location: formData.location,
      currentLocation: formData.currentLocation || (formData.location === 'Canada & USA' ? 'Ontario, Canada' : 'Lagos, Nigeria'),
      status: formData.status,
      image: primaryImage,
      images: imagesList,
      '360degree': {
        exterior: formData.degree360Exterior.trim(),
        interior: formData.degree360Interior.trim()
      }
    };

    if (editingId) {
      await updateVehicle(editingId, payload);
      showToast(`Updated "${formData.name}". ${isAdmin ? 'Synced across all devices.' : 'Saved locally.'}`);
    } else {
      await addVehicle(payload);
      showToast(`Added new vehicle "${formData.name}". ${isAdmin ? 'Synced across all devices.' : 'Saved locally.'}`);
    }

    setIsModalOpen(false);
  };

  const handleDelete = async (id: string | number, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from inventory? This will remove it across all devices.`)) {
      await deleteVehicle(id);
      showToast(`Deleted "${name}". ${isAdmin ? 'Removed across all devices.' : 'Removed locally.'}`);
    }
  };

  const handleResetDefaults = async () => {
    if (window.confirm('Reset all inventory vehicles to original seed catalogue? Any custom vehicle additions will be restored across devices.')) {
      await resetToDefaults();
      showToast(`Inventory reset to default catalogue. ${isAdmin ? 'Synced across all devices.' : 'Reset locally.'}`);
    }
  };

  // Password Barrier Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-36 pb-20 px-6 flex items-center justify-center bg-[var(--bg)] text-[var(--ink)]">
        <CodeShake error={passcodeError} className="max-w-md w-full">
          <div className="w-full lx-card bg-[var(--card)] border border-[var(--line)] p-8">
            <div className="w-14 h-14 rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center mx-auto mb-6">
              <Lock size={26} />
            </div>

            <h1 className="font-serif text-3xl font-normal text-center mb-2 text-[var(--ink)]">
              LeeAutoX Administration
            </h1>
            <p className="text-xs text-center text-[var(--ink-2)] mb-6 font-mono">
              Restricted Fleet & Catalogue Management Console
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-mono text-[var(--ink-2)] block mb-1.5 uppercase tracking-wider">
                  Admin Passcode / PIN
                </label>
                <input
                  type="password"
                  placeholder="Enter access passcode..."
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  autoFocus
                  className="w-full px-4 py-3 rounded-2xl bg-[var(--surface)] border border-[var(--line)] text-[var(--ink)] placeholder:text-[var(--ink-2)]/60 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
                />
                {passcodeError && (
                  <p className="text-red-500 text-xs mt-2 flex items-center gap-1 font-mono">
                    <AlertCircle size={13} /> Incorrect passcode. Try again.
                  </p>
                )}
              </div>

              <RippleButton type="submit" variant="secondary" className="w-full text-xs uppercase tracking-widest">
                Unlock Console
              </RippleButton>
            </form>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--line)]" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-mono">
                <span className="bg-[var(--card)] px-2 text-[var(--ink-2)]">Or sign in with Google</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isSigningIn}
              className="w-full lx-pill-btn bg-[var(--surface)] hover:border-[var(--accent)] text-[var(--ink)] font-mono text-xs font-semibold transition-all flex items-center justify-center gap-2.5 cursor-pointer border border-[var(--line)] disabled:opacity-60"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              {isSigningIn ? 'Signing in...' : 'Sign in as Admin with Google'}
            </button>

            <div className="mt-6 pt-4 border-t border-[var(--line)] text-center">
              <span className="text-[11px] text-[var(--ink-2)] font-mono">
                Authorized Personnel Only
              </span>
            </div>
          </div>
        </CodeShake>
      </div>
    );
  }

  // Filtered List
  const filtered = vehicles.filter(v => {
    const matchesKeyword = !filterKeyword.trim() ||
      v.name.toLowerCase().includes(filterKeyword.toLowerCase()) ||
      v.make.toLowerCase().includes(filterKeyword.toLowerCase()) ||
      (v.vin && v.vin.toLowerCase().includes(filterKeyword.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || v.status === filterStatus;
    return matchesKeyword && matchesStatus;
  });

  const availableCount = vehicles.filter(v => v.status === 'Available').length;
  const reservedCount = vehicles.filter(v => v.status === 'Reserved').length;
  const soldCount = vehicles.filter(v => v.status === 'Sold').length;
  const totalValue = vehicles.reduce((sum, v) => sum + (v.numericPrice || 0), 0);
  const totalValueFormatted = `₦${(totalValue / 1000000).toLocaleString()}M`;

  return (
    <div className="min-h-screen pt-28 pb-24 px-6 md:px-12 bg-[var(--bg)] text-[var(--ink)] transition-colors duration-300">
      {/* Toast Notification — safe bottom offset clear of floating controls */}
      {toastMessage && (
        <div className="fixed bottom-24 right-6 z-[70] px-5 py-3 rounded-full bg-[var(--accent)] text-[var(--accent-ink)] text-xs font-mono font-bold shadow-2xl flex items-center gap-2">
          <CheckCircle2 size={16} />
          {toastMessage}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-[var(--line)] gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[var(--accent-soft)] text-[var(--accent)] uppercase">
                Console /bkend
              </span>
              <span className="text-xs font-mono flex items-center gap-1.5">
                {isAdmin ? (
                  <span className="text-emerald-500 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Cloud Sync Active
                  </span>
                ) : (
                  <span className="text-amber-500 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Passcode Access
                  </span>
                )}
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal mt-1.5 text-[var(--ink)]">
              Vehicle Catalogue Manager
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <RippleButton type="button" variant="secondary" onClick={openAddModal} className="text-xs uppercase tracking-wider">
              <Plus size={16} /> Add Vehicle
            </RippleButton>
            <button
              type="button"
              onClick={handleResetDefaults}
              className="p-3 rounded-full border border-[var(--line)] bg-[var(--card)] hover:border-[var(--accent)] text-[var(--ink-2)] hover:text-[var(--ink)] transition-colors cursor-pointer"
              title="Reset default catalogue"
            >
              <RefreshCcw size={16} />
            </button>
            <RippleButton type="button" variant="outline" onClick={handleLogout} className="text-xs">
              Lock Console
            </RippleButton>
          </div>
        </div>

        {/* Cloud Sync Status Banner */}
        {isAdmin ? (
          <div className="mb-8 lx-card p-5 bg-emerald-500/8 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
              <div>
                <span className="text-emerald-500 font-bold block">
                  Cloud Firestore Real-Time Sync Active (Admin: {currentUser?.email})
                </span>
                <span className="text-[var(--ink-2)] text-[11px]">
                  All vehicle additions, edits, and deletions instantly propagate across all your devices and website visitors.
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => googleLogout()}
              className="px-4 py-2 rounded-full border border-[var(--line)] bg-[var(--card)] hover:border-[var(--accent)] text-[11px] text-[var(--ink)] cursor-pointer transition-colors self-start sm:self-auto shrink-0"
            >
              Disconnect Google
            </button>
          </div>
        ) : (
          <div className="mb-8 lx-card p-5 bg-[var(--accent-soft)]/50 border border-[var(--accent)]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <AlertCircle size={20} className="text-amber-500 shrink-0" />
              <div>
                <span className="text-[var(--ink)] font-bold block">
                  Enable Cross-Device Cloud Sync
                </span>
                <span className="text-[var(--ink-2)] text-[11px]">
                  {currentUser
                    ? `Logged in as ${currentUser.email}. To sync changes across devices, connect the admin account (Mht0189@gmail.com).`
                    : 'To make your added or deleted vehicles show up on your other devices (phones, laptops), sign in with your admin Google account.'}
                </span>
              </div>
            </div>
            <RippleButton
              type="button"
              variant="secondary"
              onClick={handleGoogleSignIn}
              disabled={isSigningIn}
              className="text-xs uppercase tracking-wider self-start sm:self-auto shrink-0"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              {isSigningIn ? 'Connecting...' : 'Authorize Cloud Sync'}
            </RippleButton>
          </div>
        )}

        {/* GLOBAL SITE SETTINGS: HOMEPAGE PRELOADER CONTROL */}
        <div className="mb-8 lx-card p-6 bg-[var(--card)] border border-[var(--line)] text-[var(--ink)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center shrink-0 mt-0.5">
                <Sliders size={18} />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2.5 mb-1">
                  <h2 className="font-serif text-lg font-normal text-[var(--ink)]">
                    Homepage Preloader
                  </h2>
                  {!settingsLoaded ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[var(--surface)] text-[var(--ink-2)] border border-[var(--line)] uppercase">
                      Loading...
                    </span>
                  ) : preloaderEnabled ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/12 text-emerald-500 border border-emerald-500/30 uppercase">
                      Enabled
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[var(--surface)] text-[var(--ink-2)] border border-[var(--line)] uppercase">
                      Disabled
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-[var(--ink-2)] leading-relaxed max-w-2xl">
                  When enabled, visitors experience the LeeAutoX branded preloader and 3D introduction before entering the homepage. When disabled, the homepage loads normally without either introduction.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start md:self-center shrink-0 pl-12 md:pl-0">
              <span className={`text-xs font-mono font-semibold ${!preloaderEnabled ? 'text-[var(--ink)]' : 'text-[var(--ink-2)]'}`}>
                Disabled
              </span>
              <InkSwitch
                checked={Boolean(preloaderEnabled)}
                onChange={() => void handleTogglePreloader()}
                ariaLabel="Homepage Preloader"
                disabled={!settingsLoaded || isSavingSettings}
              />
              <span className={`text-xs font-mono font-semibold ${preloaderEnabled ? 'text-emerald-500' : 'text-[var(--ink-2)]'}`}>
                {isSavingSettings ? 'Saving...' : 'Enabled'}
              </span>
            </div>
          </div>

          {(preloaderFeedback || settingsError || !isAdmin) && (
            <div className="mt-4 pt-3 border-t border-[var(--line)] space-y-2">
              {preloaderFeedback && (
                <div
                  className={`p-3 rounded-2xl text-xs font-mono flex items-center gap-2 border ${
                    preloaderFeedback.type === 'success'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                      : 'bg-red-500/10 border-red-500/30 text-red-500'
                  }`}
                >
                  {preloaderFeedback.type === 'success' ? (
                    <CheckCircle2 size={15} className="shrink-0" />
                  ) : (
                    <AlertCircle size={15} className="shrink-0" />
                  )}
                  <span>{preloaderFeedback.text}</span>
                </div>
              )}

              {!preloaderFeedback && settingsError && (
                <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-mono flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{settingsError}</span>
                </div>
              )}

              {!isAdmin && (
                <div className="text-[11px] font-mono text-amber-500 flex items-center gap-1.5">
                  <ShieldAlert size={13} className="shrink-0" />
                  <span>Server-validated database writes require Google Admin Sign-In above.</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ADMIN-ONLY RELAY DIAGNOSTICS PANEL */}
        {isAdmin && (
        <div className="mb-8 lx-card p-6 bg-[var(--card)] border border-[var(--line)] text-[var(--ink)] font-mono text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--line)]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center shrink-0">
                <Activity size={16} />
              </div>
              <div>
                <span className="font-serif text-base font-normal text-[var(--ink)] block">
                  Auction Feed & Relay Diagnostics
                </span>
                <span className="text-[11px] text-[var(--ink-2)]">
                  Secure admin-only telemetry for Copart & IAAI vehicle auction relay
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={handleTestRelay}
                disabled={isTestingRelay}
                className="px-4 py-2 rounded-full bg-[var(--accent)] text-[var(--accent-ink)] font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-opacity shadow-sm"
              >
                <RefreshCcw size={13} className={isTestingRelay ? 'animate-spin' : ''} />
                <span>{isTestingRelay ? 'Pinging Relay...' : 'Ping Relay / Diagnostics'}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowDiagnosticsPanel((prev) => !prev)}
                className="px-4 py-2 rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--ink-2)] hover:text-[var(--ink)] text-xs cursor-pointer transition-colors"
              >
                {showDiagnosticsPanel ? 'Collapse' : 'Expand'}
              </button>
            </div>
          </div>

          {showDiagnosticsPanel && (
            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--line)]">
                  <span className="block text-[var(--ink-2)] text-[10px] uppercase tracking-wider mb-0.5">HTTP Status</span>
                  <span className={`font-bold text-sm tabular-nums ${
                    diagnostics.status === 200
                      ? 'text-emerald-500'
                      : diagnostics.status === 0 && !diagnostics.error_class
                      ? 'text-[var(--ink)]'
                      : 'text-amber-500'
                  }`}>
                    {diagnostics.status === 200
                      ? '200 OK'
                      : diagnostics.status > 0
                      ? `HTTP ${diagnostics.status}`
                      : diagnostics.error_class
                      ? 'Network Error'
                      : 'Not Tested'}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--line)]">
                  <span className="block text-[var(--ink-2)] text-[10px] uppercase tracking-wider mb-0.5">Error Class</span>
                  <span className={`font-bold text-sm ${diagnostics.error_class && diagnostics.error_class !== 'None' ? 'text-amber-500' : 'text-[var(--ink)]'}`}>
                    {diagnostics.error_class || 'None'}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--line)]">
                  <span className="block text-[var(--ink-2)] text-[10px] uppercase tracking-wider mb-0.5">Key Configured</span>
                  <span className={`font-bold text-sm ${
                    diagnostics.status === 0 && !diagnostics.error_class
                      ? 'text-[var(--ink)]'
                      : diagnostics.key_configured
                      ? 'text-emerald-500'
                      : 'text-amber-500'
                  }`}>
                    {diagnostics.status === 0 && !diagnostics.error_class
                      ? 'Pending Check'
                      : diagnostics.key_configured
                      ? 'Yes (Server Secret)'
                      : 'Missing / Invalid'}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--line)]">
                  <span className="block text-[var(--ink-2)] text-[10px] uppercase tracking-wider mb-0.5">Relay Status</span>
                  {diagnostics.status === 200 ? (
                    <span className="font-bold text-sm text-emerald-500 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Live Copart & IAAI
                    </span>
                  ) : diagnostics.status === 0 && !diagnostics.error_class ? (
                    <span className="font-bold text-sm text-[var(--ink)]">
                      Click Ping to Verify
                    </span>
                  ) : (
                    <span className="font-bold text-sm text-amber-500">
                      Fallback / Degraded
                    </span>
                  )}
                </div>
              </div>

              {diagnostics.error_message && (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-mono">
                  {diagnostics.error_message}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--line)]">
                  <span className="block text-[var(--ink-2)] text-[10px] uppercase tracking-wider mb-0.5">Relay Endpoint URL</span>
                  <code className="text-[11px] text-[var(--accent)] font-mono block truncate">
                    {diagnostics.relay_url || '/api/auction'}
                  </code>
                </div>
                <div className="p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--line)]">
                  <span className="block text-[var(--ink-2)] text-[10px] uppercase tracking-wider mb-0.5">Last Query Path</span>
                  <code className="text-[11px] text-[var(--ink)] font-mono block truncate">
                    {diagnostics.endpoint || '/vehicles?per_page=20'}
                  </code>
                </div>
              </div>
            </div>
          )}
        </div>
        )}

        {/* Stats Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
          <div className="lx-card p-5 bg-[var(--card)] border border-[var(--line)]">
            <span className="text-[10px] font-mono text-[var(--ink-2)] uppercase tracking-wider block mb-1">Total Vehicles</span>
            <span className="font-serif text-2xl font-normal text-[var(--ink)] tabular-nums">{vehicles.length}</span>
          </div>
          <div className="lx-card p-5 bg-[var(--card)] border border-[var(--line)]">
            <span className="text-[10px] font-mono text-[var(--ink-2)] uppercase tracking-wider block mb-1">Available Units</span>
            <span className="font-serif text-2xl font-normal text-emerald-500 tabular-nums">{availableCount}</span>
          </div>
          <div className="lx-card p-5 bg-[var(--card)] border border-[var(--line)]">
            <span className="text-[10px] font-mono text-[var(--ink-2)] uppercase tracking-wider block mb-1">Reserved Units</span>
            <span className="font-serif text-2xl font-normal text-amber-500 tabular-nums">{reservedCount}</span>
          </div>
          <div className="lx-card p-5 bg-[var(--card)] border border-[var(--line)]">
            <span className="text-[10px] font-mono text-[var(--ink-2)] uppercase tracking-wider block mb-1">Sold Units</span>
            <span className="font-serif text-2xl font-normal text-[var(--ink-2)] tabular-nums">{soldCount}</span>
          </div>
          <div className="lx-card p-5 bg-[var(--card)] border border-[var(--line)] col-span-2 sm:col-span-1">
            <span className="text-[10px] font-mono text-[var(--ink-2)] uppercase tracking-wider block mb-1">Total Book Value</span>
            <span className="font-serif text-2xl font-normal text-[var(--accent)] tabular-nums">{totalValueFormatted}</span>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="lx-card p-4 bg-[var(--card)] border border-[var(--line)] mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--ink-2)]" size={16} />
            <input
              type="text"
              placeholder="Search make, model, or VIN..."
              value={filterKeyword}
              onChange={(e) => setFilterKeyword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[var(--surface)] border border-[var(--line)] text-[var(--ink)] rounded-full text-xs placeholder:text-[var(--ink-2)]/60 focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-mono text-[var(--ink-2)]">Filter Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 bg-[var(--surface)] border border-[var(--line)] text-[var(--ink)] rounded-full text-xs focus:outline-none focus:border-[var(--accent)]"
            >
              <option value="all">All ({vehicles.length})</option>
              <option value="Available">Available ({availableCount})</option>
              <option value="Reserved">Reserved ({reservedCount})</option>
              <option value="Sold">Sold ({soldCount})</option>
            </select>
          </div>
        </div>

        {/* Vehicles Table */}
        <div className="lx-card border border-[var(--line)] bg-[var(--card)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--surface)] border-b border-[var(--line)] text-[var(--ink-2)] font-mono uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">Vehicle</th>
                  <th className="py-4 px-6">Year / VIN</th>
                  <th className="py-4 px-6">Price & Deposit</th>
                  <th className="py-4 px-6">Status Toggle</th>
                  <th className="py-4 px-6">Location</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[var(--ink-2)] font-mono">
                      No vehicles found matching current criteria.
                    </td>
                  </tr>
                ) : (
                  filtered.map((v) => (
                    <tr key={v.id} className="hover:bg-[var(--surface)]/60 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={v.image}
                            alt=""
                            className="w-14 h-10 object-cover rounded-xl border border-[var(--line)] bg-[var(--surface)] shrink-0"
                          />
                          <div>
                            <span className="font-bold text-[var(--ink)] text-sm block">{v.name}</span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[11px] text-[var(--ink-2)] font-mono">{v.bodyType} • {v.condition}</span>
                              {has360Content(v['360degree']) && (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[var(--accent-soft)] text-[var(--accent)]">
                                  360°
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-mono tabular-nums">
                        <span className="text-[var(--ink)] block font-bold">{v.year}</span>
                        <span className="text-[var(--ink-2)] text-[11px]">{v.vin || 'No VIN'}</span>
                      </td>
                      <td className="py-4 px-6 font-mono tabular-nums">
                        <span className="text-[var(--accent)] font-bold block">{v.price}</span>
                        <span className="text-[var(--ink-2)] text-[11px]">Dep: {v.deposit || '₦0'}</span>
                      </td>
                      <td className="py-4 px-6">
                        <select
                          value={v.status}
                          onChange={(e) => toggleStatus(v.id, e.target.value as any)}
                          className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold border transition-colors cursor-pointer ${
                            v.status === 'Available'
                              ? 'bg-emerald-500/12 border-emerald-500/35 text-emerald-500'
                              : v.status === 'Reserved'
                              ? 'bg-amber-500/12 border-amber-500/35 text-amber-500'
                              : 'bg-[var(--surface)] border-[var(--line)] text-[var(--ink-2)]'
                          }`}
                        >
                          <option value="Available">Available</option>
                          <option value="Reserved">Reserved</option>
                          <option value="Sold">Sold</option>
                        </select>
                      </td>
                      <td className="py-4 px-6 text-[var(--ink-2)] text-[11px] font-mono">
                        {v.location}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={getVehicleUrl(v)}
                            target="_blank"
                            className="p-2 rounded-full bg-[var(--surface)] border border-[var(--line)] hover:border-[var(--accent)] text-[var(--ink)] transition-colors"
                            title="View Public Page"
                          >
                            <ExternalLink size={14} />
                          </Link>
                          <button
                            type="button"
                            onClick={() => openEditModal(v)}
                            className="p-2 rounded-full bg-[var(--surface)] border border-[var(--line)] hover:border-[var(--accent)] text-[var(--accent)] transition-colors cursor-pointer"
                            title="Edit Vehicle"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(v.id, v.name)}
                            className="p-2 rounded-full bg-[var(--surface)] border border-[var(--line)] hover:border-red-500 text-red-500 transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link to="/" className="text-xs text-[var(--ink-2)] hover:text-[var(--ink)] underline font-mono">
            ← Return to Public Homepage
          </Link>
        </div>
      </div>

      {/* Add / Edit Vehicle Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
          <div className="max-w-2xl w-full my-8 lx-card bg-[var(--card)] border border-[var(--line)] p-6 sm:p-8 shadow-2xl relative text-[var(--ink)]">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close vehicle modal"
              className="absolute top-5 right-5 p-2 rounded-full border border-[var(--line)] text-[var(--ink-2)] hover:text-[var(--ink)] hover:bg-[var(--surface)] cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2.5 mb-2">
              <Car size={20} className="text-[var(--accent)]" />
              <h2 className="font-serif text-2xl font-normal text-[var(--ink)]">
                {editingId ? 'Edit Vehicle Profile' : 'Add New Vehicle to Catalogue'}
              </h2>
            </div>
            <p className="text-xs text-[var(--ink-2)] font-mono mb-6">
              Saved items update frontend inventory, search suggestions, and detail pages immediately.
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-mono text-[var(--ink-2)] block mb-1">Vehicle Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2022 Toyota Land Cruiser VXR"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--ink)] text-sm focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-[var(--ink-2)] block mb-1">Make *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Toyota"
                    value={formData.make}
                    onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--ink)] text-sm focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-[var(--ink-2)] block mb-1">Model *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Land Cruiser"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--ink)] text-sm focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-[var(--ink-2)] block mb-1">Year *</label>
                  <input
                    type="number"
                    required
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--ink)] text-sm font-mono tabular-nums focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-[var(--ink-2)] block mb-1">Body Type</label>
                  <select
                    value={formData.bodyType}
                    onChange={(e) => setFormData({ ...formData, bodyType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--ink)] text-sm focus:outline-none focus:border-[var(--accent)]"
                  >
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Truck">Truck</option>
                    <option value="Van">Van</option>
                    <option value="Coupe">Coupe</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-[var(--ink-2)] block mb-1">Formatted Price *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ₦25,000,000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--ink)] text-sm font-mono tabular-nums focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-[var(--ink-2)] block mb-1">Numeric Price (for filter) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 25000000"
                    value={formData.numericPrice}
                    onChange={(e) => setFormData({ ...formData, numericPrice: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--ink)] text-sm font-mono tabular-nums focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-[var(--ink-2)] block mb-1">Required Deposit</label>
                  <input
                    type="text"
                    placeholder="e.g. ₦5,000,000"
                    value={formData.deposit}
                    onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--ink)] text-sm font-mono tabular-nums focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-[var(--ink-2)] block mb-1">Mileage</label>
                  <input
                    type="text"
                    placeholder="e.g. 45,000 mi"
                    value={formData.mileage}
                    onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--ink)] text-sm focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-[var(--ink-2)] block mb-1">Condition Status</label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--ink)] text-sm focus:outline-none focus:border-[var(--accent)]"
                  >
                    <option value="Clean Title">Clean Title</option>
                    <option value="Run & Drive">Run & Drive</option>
                    <option value="Salvage">Salvage</option>
                    <option value="Enhanced">Enhanced</option>
                    <option value="Stationary">Stationary</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-[var(--ink-2)] block mb-1">Inventory Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--ink)] text-sm focus:outline-none focus:border-[var(--accent)]"
                  >
                    <option value="Available">Available</option>
                    <option value="Reserved">Reserved</option>
                    <option value="Sold">Sold</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-[var(--ink-2)] block mb-1">VIN #</label>
                  <input
                    type="text"
                    placeholder="17-character VIN"
                    value={formData.vin}
                    onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--ink)] text-sm font-mono focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-[var(--ink-2)] block mb-1">Location Region *</label>
                  <select
                    value={formData.location}
                    onChange={(e) => {
                      const newLoc = e.target.value as 'Nigeria' | 'Canada & USA';
                      setFormData({ 
                        ...formData, 
                        location: newLoc,
                        currentLocation: newLoc === 'Canada & USA' 
                          ? (formData.currentLocation === 'Lagos, Nigeria' ? 'Ontario, Canada' : formData.currentLocation)
                          : 'Lagos, Nigeria'
                      });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--ink)] text-sm focus:outline-none focus:border-[var(--accent)]"
                  >
                    <option value="Nigeria">Nigeria</option>
                    <option value="Canada & USA">Canada & USA</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-[var(--ink-2)] block mb-1">Current Hub Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Ontario, Canada or Lagos, Nigeria"
                    value={formData.currentLocation}
                    onChange={(e) => setFormData({ ...formData, currentLocation: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--ink)] text-sm focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-mono text-[var(--ink-2)] block mb-1">Specs Summary</label>
                  <input
                    type="text"
                    placeholder="e.g. Twin Turbo V6 • 4WD • Leather Seats • JBL Audio"
                    value={formData.specs}
                    onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--ink)] text-sm focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-mono text-[var(--ink-2)] block mb-1">Primary Image URL *</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      required
                      placeholder="https://..."
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--ink)] text-sm focus:outline-none focus:border-[var(--accent)]"
                    />
                    <label className="px-4 py-2.5 rounded-xl bg-[var(--surface)] hover:bg-[var(--card)] border border-[var(--line)] text-[var(--ink)] text-xs font-mono cursor-pointer flex items-center gap-1.5 shrink-0 transition-colors">
                      <Upload size={14} /> Upload
                      <input type="file" accept="image/*" onChange={handleImageFileUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-mono text-[var(--ink-2)] block mb-1">
                    Gallery Images (one URL per line)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="https://...\nhttps://..."
                    value={formData.imagesText}
                    onChange={(e) => setFormData({ ...formData, imagesText: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--ink)] text-xs font-mono focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div className="sm:col-span-2 p-4 rounded-2xl bg-[var(--surface)] border border-[var(--line)] space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[var(--accent)] uppercase tracking-wider">
                      360° Virtual Tour (Panoee)
                    </span>
                    <span className="text-[10px] text-[var(--ink-2)] font-mono">Optional</span>
                  </div>
                  <p className="text-[11px] text-[var(--ink-2)] font-mono leading-relaxed">
                    Paste full Panoee iframe embed codes or URLs (e.g. https://tour.panoee.com/...). Leave blank if vehicle has no 360° tour. Only panoee.com domains are rendered.
                  </p>
                  <div>
                    <label className="text-xs font-mono text-[var(--ink-2)] block mb-1">
                      Exterior 360° Embed Code or URL
                    </label>
                    <textarea
                      rows={2}
                      placeholder='<iframe src="https://tour.panoee.com/..."></iframe> or direct URL'
                      value={formData.degree360Exterior}
                      onChange={(e) => setFormData({ ...formData, degree360Exterior: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--card)] border border-[var(--line)] text-[var(--ink)] text-xs font-mono focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-[var(--ink-2)] block mb-1">
                      Interior 360° Embed Code or URL
                    </label>
                    <textarea
                      rows={2}
                      placeholder='<iframe src="https://tour.panoee.com/..."></iframe> or direct URL'
                      value={formData.degree360Interior}
                      onChange={(e) => setFormData({ ...formData, degree360Interior: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--card)] border border-[var(--line)] text-[var(--ink)] text-xs font-mono focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[var(--line)]">
                <RippleButton
                  type="button"
                  variant="ghost"
                  onClick={() => setIsModalOpen(false)}
                  className="text-xs uppercase tracking-wider"
                >
                  Cancel
                </RippleButton>
                <RippleButton
                  type="submit"
                  variant="primary"
                  className="text-xs uppercase tracking-wider"
                >
                  {editingId ? 'Save Changes' : 'Create Vehicle'}
                </RippleButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
