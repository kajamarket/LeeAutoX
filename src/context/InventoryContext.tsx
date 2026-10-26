import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, doc, onSnapshot, setDoc, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { VehicleItem, INITIAL_INVENTORY, getVehicleSlug } from '../data/inventory';

interface InventoryContextType {
  vehicles: VehicleItem[];
  getVehicleById: (id: string | number) => VehicleItem | undefined;
  getVehicleBySlug: (slug: string) => VehicleItem | undefined;
  addVehicle: (vehicle: Omit<VehicleItem, 'id'>) => Promise<VehicleItem>;
  updateVehicle: (id: string | number, updates: Partial<VehicleItem>) => Promise<void>;
  deleteVehicle: (id: string | number) => Promise<void>;
  toggleStatus: (id: string | number, status: 'Available' | 'Reserved' | 'Sold') => Promise<void>;
  resetToDefaults: () => Promise<void>;
  inStockCount: number;
  minPrice: number;
  minPriceFormatted: string;
  isSyncing: boolean;
  cloudSyncStatus: 'synced' | 'local_only' | 'error' | 'syncing';
  cloudSyncError: string | null;
}

const STORAGE_KEY = 'leeautox_inventory_v7';

const normalizeVehicle = (item: any): VehicleItem => {
  let loc = item.location;
  let currLoc = item.currentLocation;
  let cond = item.condition;
  if (!loc || loc === "Lagos, Nigeria" || loc === "Nigeria") {
    loc = "Nigeria";
    if (!currLoc) currLoc = "Lagos, Nigeria";
  } else if (loc === "Canada & USA" || loc.includes("Canada") || loc.includes("USA")) {
    loc = "Canada & USA";
    if (!currLoc) currLoc = item.currentLocation || "Ontario, Canada";
    if (cond === "Located in Canada & USA" || !cond) cond = "Located Overseas";
  }
  return { ...item, location: loc, currentLocation: currLoc, condition: cond || item.condition };
};

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [vehicles, setVehicles] = useState<VehicleItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const loaded = parsed.map(normalizeVehicle);
          for (const item of INITIAL_INVENTORY) {
            if (!loaded.some((v: VehicleItem) => String(v.id) === String(item.id))) {
              loaded.push(item);
            }
          }
          return loaded;
        }
      }
    } catch (e) {
      console.warn('Failed to load inventory from localStorage, using initial inventory', e);
    }
    return INITIAL_INVENTORY;
  });

  const [isSyncing, setIsSyncing] = useState(true);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'synced' | 'local_only' | 'error' | 'syncing'>('syncing');
  const [cloudSyncError, setCloudSyncError] = useState<string | null>(null);

  // Subscribe to real-time Firestore updates across all devices
  useEffect(() => {
    const vehiclesCol = collection(db, 'vehicles');
    let isInitialMount = true;

    const unsubscribe = onSnapshot(
      vehiclesCol,
      async (snapshot) => {
        setIsSyncing(false);
        setCloudSyncStatus('synced');
        setCloudSyncError(null);
        if (snapshot.empty && isInitialMount) {
          isInitialMount = false;
          // Seed initial inventory to Firestore on initial provision
          console.log('Seeding initial inventory to Cloud Firestore...');
          for (const item of INITIAL_INVENTORY) {
            try {
              await setDoc(doc(db, 'vehicles', String(item.id)), item);
            } catch (err) {
              console.warn('Seeding item failed:', item.id, err);
            }
          }
          return;
        }

        if (!snapshot.empty) {
          const remoteVehicles: VehicleItem[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return normalizeVehicle({
              ...data,
              id: docSnap.id,
            });
          });

          // Ensure any default vehicles in INITIAL_INVENTORY are preserved and synced
          for (const item of INITIAL_INVENTORY) {
            if (!remoteVehicles.some((v) => String(v.id) === String(item.id))) {
              remoteVehicles.push(item);
              try {
                setDoc(doc(db, 'vehicles', String(item.id)), item);
              } catch (err) {
                console.warn('Syncing new default item to Firestore failed:', item.id, err);
              }
            }
          }

          // Sort by newest
          remoteVehicles.sort((a, b) => Number(b.id) - Number(a.id) || b.year - a.year);

          setVehicles(remoteVehicles);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteVehicles));
          } catch (e) {
            // ignore
          }
        }
      },
      (error) => {
        setIsSyncing(false);
        setCloudSyncStatus('local_only');
        setCloudSyncError(error?.message || 'Firestore connection in fallback mode');
        console.warn('Firestore real-time listener error. Using local cached inventory.', error);
        try {
          handleFirestoreError(error, OperationType.GET, 'vehicles');
        } catch {
          // Keep app running smoothly with local data
        }
      }
    );

    return () => unsubscribe();
  }, []);

  const getVehicleById = (idOrSlug: string | number): VehicleItem | undefined => {
    const raw = String(idOrSlug).toLowerCase().trim();
    let found = vehicles.find((v) => String(v.id).toLowerCase() === raw);
    if (found) return found;

    found = vehicles.find((v) => getVehicleSlug(v).toLowerCase() === raw);
    if (found) return found;

    const underscoreIdx = raw.indexOf('_');
    if (underscoreIdx !== -1) {
      const prefix = raw.substring(0, underscoreIdx);
      found = vehicles.find((v) => String(v.id).toLowerCase() === prefix);
      if (found) return found;
    }

    return undefined;
  };

  const getVehicleBySlug = (slug: string): VehicleItem | undefined => {
    return getVehicleById(slug);
  };

  const addVehicle = async (vehicleData: Omit<VehicleItem, 'id'>): Promise<VehicleItem> => {
    const newId = String(Date.now());
    const newVehicle: VehicleItem = {
      ...vehicleData,
      id: newId,
    };
    // Optimistic local update
    setVehicles((prev) => [newVehicle, ...prev]);

    // Remote sync to Firestore
    try {
      await setDoc(doc(db, 'vehicles', newId), newVehicle);
      setCloudSyncStatus('synced');
      setCloudSyncError(null);
    } catch (error: any) {
      console.warn('Cloud sync failed on addVehicle, saved locally:', error);
      setCloudSyncStatus('local_only');
      setCloudSyncError(error?.message || 'Remote sync denied. Please sign in as admin with Google.');
    }

    return newVehicle;
  };

  const updateVehicle = async (id: string | number, updates: Partial<VehicleItem>): Promise<void> => {
    setVehicles((prev) =>
      prev.map((v) => (String(v.id) === String(id) ? { ...v, ...updates } : v))
    );

    try {
      await setDoc(doc(db, 'vehicles', String(id)), updates, { merge: true });
      setCloudSyncStatus('synced');
      setCloudSyncError(null);
    } catch (error: any) {
      console.warn('Cloud sync failed on updateVehicle, saved locally:', error);
      setCloudSyncStatus('local_only');
      setCloudSyncError(error?.message || 'Remote sync denied. Please sign in as admin with Google.');
    }
  };

  const deleteVehicle = async (id: string | number): Promise<void> => {
    setVehicles((prev) => prev.filter((v) => String(v.id) !== String(id)));

    try {
      await deleteDoc(doc(db, 'vehicles', String(id)));
      setCloudSyncStatus('synced');
      setCloudSyncError(null);
    } catch (error: any) {
      console.warn('Cloud sync failed on deleteVehicle, deleted locally:', error);
      setCloudSyncStatus('local_only');
      setCloudSyncError(error?.message || 'Remote sync denied. Please sign in as admin with Google.');
    }
  };

  const toggleStatus = async (
    id: string | number,
    status: 'Available' | 'Reserved' | 'Sold'
  ): Promise<void> => {
    await updateVehicle(id, { status });
  };

  const resetToDefaults = async (): Promise<void> => {
    setVehicles(INITIAL_INVENTORY);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_INVENTORY));
      for (const item of INITIAL_INVENTORY) {
        await setDoc(doc(db, 'vehicles', String(item.id)), item);
      }
      setCloudSyncStatus('synced');
      setCloudSyncError(null);
    } catch (e: any) {
      console.warn('Failed to reseed cloud defaults:', e);
      setCloudSyncStatus('local_only');
      setCloudSyncError(e?.message || 'Failed to reseed cloud defaults');
    }
  };

  // Stats calculation
  const availableVehicles = vehicles.filter((v) => v.status !== 'Sold');
  const inStockCount = availableVehicles.length;
  const minPrice =
    vehicles.length > 0
      ? vehicles.reduce(
          (min, v) => (v.numericPrice > 0 && v.numericPrice < min ? v.numericPrice : min),
          vehicles[0].numericPrice || 13000000
        )
      : 13000000;
  const minPriceFormatted = `₦${(minPrice / 1000000).toFixed(0)},000,000`;

  return (
    <InventoryContext.Provider
      value={{
        vehicles,
        getVehicleById,
        getVehicleBySlug,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        toggleStatus,
        resetToDefaults,
        inStockCount,
        minPrice,
        minPriceFormatted,
        isSyncing,
        cloudSyncStatus,
        cloudSyncError,
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
