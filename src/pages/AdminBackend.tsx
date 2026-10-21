import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useInventory } from '../context/InventoryContext';
import { VehicleItem, getVehicleUrl } from '../data/inventory';
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
  AlertCircle
} from 'lucide-react';

export default function AdminBackend() {
  const { vehicles, addVehicle, updateVehicle, deleteVehicle, toggleStatus, resetToDefaults } = useInventory();
  
  // Security Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('leeautox_bkend_authenticated') === 'true';
  });
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);

  // Search & Filter
  const [filterKeyword, setFilterKeyword] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);

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
    location: 'Toronto, ON (Canada)',
    status: 'Available' as 'Available' | 'Reserved' | 'Sold',
    image: '',
    imagesText: ''
  });

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPasscode = (import.meta as any).env?.VITE_ADMIN_PASSCODE || 'leeauto2026';
    if (passcode.trim() === correctPasscode || passcode.trim() === 'leeauto2026') {
      setIsAuthenticated(true);
      sessionStorage.setItem('leeautox_bkend_authenticated', 'true');
      setPasscodeError(false);
      showToast('Authentication successful. Welcome to Admin Portal.');
    } else {
      setPasscodeError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('leeautox_bkend_authenticated');
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
      location: 'Toronto, ON (Canada)',
      status: 'Available',
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1000',
      imagesText: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1000\nhttps://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&q=80&w=1000'
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
      location: v.location,
      status: v.status,
      image: v.image,
      imagesText: v.images ? v.images.join('\n') : v.image
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

  const handleFormSubmit = (e: React.FormEvent) => {
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
      status: formData.status,
      image: primaryImage,
      images: imagesList
    };

    if (editingId) {
      updateVehicle(editingId, payload);
      showToast(`Updated "${formData.name}" successfully.`);
    } else {
      addVehicle(payload);
      showToast(`Added new vehicle "${formData.name}".`);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string | number, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from inventory?`)) {
      deleteVehicle(id);
      showToast(`Deleted "${name}".`);
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all inventory vehicles to original seed catalogue? Any custom vehicle additions will be restored.')) {
      resetToDefaults();
      showToast('Inventory reset to default catalogue.');
    }
  };

  // Password Barrier Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-36 pb-20 px-6 flex items-center justify-center bg-slate-950 text-white">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-[#2B59FF]/10 text-[#2B59FF] border border-[#2B59FF]/30 flex items-center justify-center mx-auto mb-6">
            <Lock size={28} />
          </div>

          <h1 className="font-serif text-2xl font-bold text-center mb-2">
            LeeAutoX Administration
          </h1>
          <p className="text-xs text-center text-zinc-400 mb-6 font-mono">
            Restricted Fleet & Catalogue Management Console
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-mono text-zinc-400 block mb-1.5 uppercase tracking-wider">
                Admin Passcode / PIN
              </label>
              <input
                type="password"
                placeholder="Enter access passcode..."
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                autoFocus
                className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#2B59FF] transition-colors"
              />
              {passcodeError && (
                <p className="text-red-400 text-xs mt-2 flex items-center gap-1 font-mono">
                  <AlertCircle size={13} /> Incorrect passcode. Try again.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#2B59FF] hover:bg-blue-600 active:scale-[0.98] text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg cursor-pointer"
            >
              Unlock Console
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-zinc-800/80 text-center">
            <span className="text-[11px] text-zinc-500 font-mono">
              Authorized Personnel Only
            </span>
          </div>
        </div>
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
    <div className="min-h-screen pt-28 pb-24 px-6 md:px-12 bg-slate-950 text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl bg-[#2B59FF] text-white text-xs font-mono font-bold shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 size={16} />
          {toastMessage}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-zinc-800 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#2B59FF]/20 text-[#2B59FF] border border-[#2B59FF]/30 uppercase">
                Console /bkend
              </span>
              <span className="text-xs font-mono text-zinc-400">Database: Active Local Sync</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold mt-1">
              Vehicle Catalogue Manager
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={openAddModal}
              className="px-5 py-2.5 bg-[#2B59FF] hover:bg-blue-600 active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Plus size={16} /> Add Vehicle
            </button>
            <button
              onClick={handleResetDefaults}
              className="p-2.5 rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold transition-all active:scale-[0.98] cursor-pointer"
              title="Reset default catalogue"
            >
              <RefreshCcw size={16} />
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold transition-all active:scale-[0.98] cursor-pointer"
            >
              Lock Console
            </button>
          </div>
        </div>

        {/* Stats Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-1">Total Vehicles</span>
            <span className="font-serif text-2xl font-bold text-white">{vehicles.length}</span>
          </div>
          <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-1">Available Units</span>
            <span className="font-serif text-2xl font-bold text-emerald-400">{availableCount}</span>
          </div>
          <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-1">Reserved Units</span>
            <span className="font-serif text-2xl font-bold text-amber-400">{reservedCount}</span>
          </div>
          <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-1">Sold Units</span>
            <span className="font-serif text-2xl font-bold text-zinc-400">{soldCount}</span>
          </div>
          <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-1">Total Book Value</span>
            <span className="font-serif text-2xl font-bold text-[#2B59FF]">{totalValueFormatted}</span>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input
              type="text"
              placeholder="Search make, model, or VIN..."
              value={filterKeyword}
              onChange={(e) => setFilterKeyword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-black border border-zinc-700 text-white rounded-xl text-xs placeholder-zinc-500 focus:outline-none focus:border-[#2B59FF]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-mono text-zinc-500">Filter Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-black border border-zinc-700 text-white rounded-xl text-xs focus:outline-none focus:border-[#2B59FF]"
            >
              <option value="all">All ({vehicles.length})</option>
              <option value="Available">Available ({availableCount})</option>
              <option value="Reserved">Reserved ({reservedCount})</option>
              <option value="Sold">Sold ({soldCount})</option>
            </select>
          </div>
        </div>

        {/* Vehicles Table */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-black/60 border-b border-zinc-800 text-zinc-400 font-mono uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">Vehicle</th>
                  <th className="py-4 px-6">Year / VIN</th>
                  <th className="py-4 px-6">Price & Deposit</th>
                  <th className="py-4 px-6">Status Toggle</th>
                  <th className="py-4 px-6">Location</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-zinc-500 font-mono">
                      No vehicles found matching current criteria.
                    </td>
                  </tr>
                ) : (
                  filtered.map((v) => (
                    <tr key={v.id} className="hover:bg-zinc-800/40 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={v.image}
                            alt=""
                            className="w-14 h-10 object-cover rounded-lg border border-zinc-700 bg-black shrink-0"
                          />
                          <div>
                            <span className="font-bold text-white text-sm block">{v.name}</span>
                            <span className="text-[11px] text-zinc-400 font-mono">{v.bodyType} • {v.condition}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-mono">
                        <span className="text-white block font-bold">{v.year}</span>
                        <span className="text-zinc-500 text-[11px]">{v.vin || 'No VIN'}</span>
                      </td>
                      <td className="py-4 px-6 font-mono">
                        <span className="text-[#2B59FF] font-bold block">{v.price}</span>
                        <span className="text-zinc-400 text-[11px]">Dep: {v.deposit || '₦0'}</span>
                      </td>
                      <td className="py-4 px-6">
                        <select
                          value={v.status}
                          onChange={(e) => toggleStatus(v.id, e.target.value as any)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-colors cursor-pointer ${
                            v.status === 'Available'
                              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400'
                              : v.status === 'Reserved'
                              ? 'bg-amber-950/60 border-amber-500/40 text-amber-400'
                              : 'bg-zinc-900 border-zinc-700 text-zinc-400'
                          }`}
                        >
                          <option value="Available">Available</option>
                          <option value="Reserved">Reserved</option>
                          <option value="Sold">Sold</option>
                        </select>
                      </td>
                      <td className="py-4 px-6 text-zinc-400 text-[11px] font-mono">
                        {v.location}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={getVehicleUrl(v)}
                            target="_blank"
                            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                            title="View Public Page"
                          >
                            <ExternalLink size={14} />
                          </Link>
                          <button
                            onClick={() => openEditModal(v)}
                            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-blue-400 transition-colors cursor-pointer"
                            title="Edit Vehicle"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(v.id, v.name)}
                            className="p-2 rounded-lg bg-zinc-800 hover:bg-red-900/60 text-red-400 transition-colors cursor-pointer"
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
          <Link to="/" className="text-xs text-zinc-500 hover:text-white underline font-mono">
            ← Return to Public Homepage
          </Link>
        </div>
      </div>

      {/* Add / Edit Vehicle Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="max-w-2xl w-full my-8 bg-zinc-900 border border-zinc-700 rounded-3xl p-6 sm:p-8 shadow-2xl relative text-white">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <Car size={20} className="text-[#2B59FF]" />
              <h2 className="font-serif text-2xl font-bold">
                {editingId ? 'Edit Vehicle Profile' : 'Add New Vehicle to Catalogue'}
              </h2>
            </div>
            <p className="text-xs text-zinc-400 font-mono mb-6">
              Saved items update frontend inventory, search suggestions, and detail pages immediately.
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Vehicle Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2022 Toyota Land Cruiser VXR"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-700 text-sm focus:outline-none focus:border-[#2B59FF]"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Make *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Toyota"
                    value={formData.make}
                    onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-700 text-sm focus:outline-none focus:border-[#2B59FF]"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Model *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Land Cruiser"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-700 text-sm focus:outline-none focus:border-[#2B59FF]"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Year *</label>
                  <input
                    type="number"
                    required
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-700 text-sm focus:outline-none focus:border-[#2B59FF]"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Body Type</label>
                  <select
                    value={formData.bodyType}
                    onChange={(e) => setFormData({ ...formData, bodyType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-700 text-sm focus:outline-none focus:border-[#2B59FF]"
                  >
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Truck">Truck</option>
                    <option value="Van">Van</option>
                    <option value="Coupe">Coupe</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Formatted Price *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ₦25,000,000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-700 text-sm focus:outline-none focus:border-[#2B59FF]"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Numeric Price (for filter) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 25000000"
                    value={formData.numericPrice}
                    onChange={(e) => setFormData({ ...formData, numericPrice: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-700 text-sm focus:outline-none focus:border-[#2B59FF]"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Required Deposit</label>
                  <input
                    type="text"
                    placeholder="e.g. ₦5,000,000"
                    value={formData.deposit}
                    onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-700 text-sm focus:outline-none focus:border-[#2B59FF]"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Mileage</label>
                  <input
                    type="text"
                    placeholder="e.g. 45,000 mi"
                    value={formData.mileage}
                    onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-700 text-sm focus:outline-none focus:border-[#2B59FF]"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Condition Status</label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-700 text-sm focus:outline-none focus:border-[#2B59FF]"
                  >
                    <option value="Clean Title">Clean Title</option>
                    <option value="Run & Drive">Run & Drive</option>
                    <option value="Salvage">Salvage</option>
                    <option value="Enhanced">Enhanced</option>
                    <option value="Stationary">Stationary</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Inventory Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-700 text-sm focus:outline-none focus:border-[#2B59FF]"
                  >
                    <option value="Available">Available</option>
                    <option value="Reserved">Reserved</option>
                    <option value="Sold">Sold</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">VIN #</label>
                  <input
                    type="text"
                    placeholder="17-character VIN"
                    value={formData.vin}
                    onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-700 text-sm font-mono focus:outline-none focus:border-[#2B59FF]"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Toronto, ON (Canada)"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-700 text-sm focus:outline-none focus:border-[#2B59FF]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Specs Summary</label>
                  <input
                    type="text"
                    placeholder="e.g. Twin Turbo V6 • 4WD • Leather Seats • JBL Audio"
                    value={formData.specs}
                    onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-700 text-sm focus:outline-none focus:border-[#2B59FF]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Primary Image URL *</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      required
                      placeholder="https://..."
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-black border border-zinc-700 text-sm focus:outline-none focus:border-[#2B59FF]"
                    />
                    <label className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-mono cursor-pointer flex items-center gap-1.5 shrink-0">
                      <Upload size={14} /> Upload
                      <input type="file" accept="image/*" onChange={handleImageFileUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-mono text-zinc-400 block mb-1">
                    Gallery Images (one URL per line)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="https://...\nhttps://..."
                    value={formData.imagesText}
                    onChange={(e) => setFormData({ ...formData, imagesText: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-700 text-xs font-mono focus:outline-none focus:border-[#2B59FF]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-xs font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#2B59FF] hover:bg-blue-600 active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider shadow-lg"
                >
                  {editingId ? 'Save Changes' : 'Create Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
