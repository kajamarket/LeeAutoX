import React, { createContext, useContext, useState, useEffect } from 'react';
import { VehicleItem, INITIAL_INVENTORY } from '../data/inventory';

interface InventoryContextType {
  vehicles: VehicleItem[];
  getVehicleById: (id: string | number) => VehicleItem | undefined;
  addVehicle: (vehicle: Omit<VehicleItem, 'id'>) => VehicleItem;
  updateVehicle: (id: string | number, updates: Partial<VehicleItem>) => void;
  deleteVehicle: (id: string | number) => void;
  toggleStatus: (id: string | number, status: 'Available' | 'Reserved' | 'Sold') => void;
  resetToDefaults: () => void;
  inStockCount: number;
  minPrice: number;
  minPriceFormatted: string;
}

const STORAGE_KEY = 'leeautox_inventory_v3';

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [vehicles, setVehicles] = useState<VehicleItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load inventory from localStorage, using initial inventory', e);
    }
    return INITIAL_INVENTORY;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
    } catch (e) {
      console.error('Failed to save inventory to localStorage', e);
    }
  }, [vehicles]);

  const getVehicleById = (id: string | number) => {
    return vehicles.find(v => String(v.id) === String(id));
  };

  const addVehicle = (vehicleData: Omit<VehicleItem, 'id'>): VehicleItem => {
    const newId = String(Date.now());
    const newVehicle: VehicleItem = {
      ...vehicleData,
      id: newId,
    };
    setVehicles(prev => [newVehicle, ...prev]);
    return newVehicle;
  };

  const updateVehicle = (id: string | number, updates: Partial<VehicleItem>) => {
    setVehicles(prev =>
      prev.map(v => (String(v.id) === String(id) ? { ...v, ...updates } : v))
    );
  };

  const deleteVehicle = (id: string | number) => {
    setVehicles(prev => prev.filter(v => String(v.id) !== String(id)));
  };

  const toggleStatus = (id: string | number, status: 'Available' | 'Reserved' | 'Sold') => {
    updateVehicle(id, { status });
  };

  const resetToDefaults = () => {
    setVehicles(INITIAL_INVENTORY);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_INVENTORY));
    } catch (e) {
      // ignore
    }
  };

  // Stats calculation
  const availableVehicles = vehicles.filter(v => v.status !== 'Sold');
  const inStockCount = availableVehicles.length;
  const minPrice = vehicles.length > 0
    ? vehicles.reduce((min, v) => (v.numericPrice > 0 && v.numericPrice < min ? v.numericPrice : min), vehicles[0].numericPrice || 13000000)
    : 13000000;
  const minPriceFormatted = `₦${(minPrice / 1000000).toFixed(0)},000,000`;

  return (
    <InventoryContext.Provider
      value={{
        vehicles,
        getVehicleById,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        toggleStatus,
        resetToDefaults,
        inStockCount,
        minPrice,
        minPriceFormatted,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
}
