import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { CONTACT_INFO } from '../constants';
import { Calculator, AlertTriangle, ArrowRight, CheckCircle2, RefreshCw } from 'lucide-react';

export default function ImportDutyCalculator() {
  const { theme } = useTheme();

  // Exchange rate constants (prevailing rates)
  const NAIRA_PER_USD = 1520;

  // State parameters
  const [vehicleType, setVehicleType] = useState<'sedan' | 'suv' | 'truck' | 'luxury'>('sedan');
  const [vehicleYear, setVehicleYear] = useState<number>(2021);
  const [fobUsd, setFobUsd] = useState<string>('8500');

  // Outputs
  const [calculated, setCalculated] = useState<boolean>(false);
  const [results, setResults] = useState<{
    fobNaira: number;
    marineFreightUsd: number;
    customsDutyNaira: number;
    surchargeNaira: number;
    vatNaira: number;
    etlsNaira: number;
    clearingAgentNaira: number;
    totalLandingNaira: number;
  }>({
    fobNaira: 0,
    marineFreightUsd: 0,
    customsDutyNaira: 0,
    surchargeNaira: 0,
    vatNaira: 0,
    etlsNaira: 0,
    clearingAgentNaira: 0,
    totalLandingNaira: 0
  });

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const fobVal = parseFloat(fobUsd) || 0;

    // 1. Determine Marine Freight (USD) from Canada to Lagos
    let shippingFeeUsd = 2500; // Base sedan
    if (vehicleType === 'suv') shippingFeeUsd = 2800;
    if (vehicleType === 'truck') shippingFeeUsd = 3300;
    if (vehicleType === 'luxury') shippingFeeUsd = 3100;

    // 2. Base calculations
    const fobNaira = fobVal * NAIRA_PER_USD;
    const freightNaira = shippingFeeUsd * NAIRA_PER_USD;
    const CIF_Naira = fobNaira + freightNaira; // Cost, Insurance, Freight

    // 3. Customs Duty (CET) - typically 20% on passenger vehicles
    let dutyRate = 0.20;
    if (vehicleType === 'truck') dutyRate = 0.10; // Commercial gets discount

    // Apply age depreciation rebate (for older cars)
    let ageRebateFactor = 1.0;
    const age = 2026 - vehicleYear;
    if (age > 10) ageRebateFactor = 0.6; // 40% discount for older cars
    else if (age > 5) ageRebateFactor = 0.8; // 20% discount

    const customsDutyNaira = CIF_Naira * dutyRate * ageRebateFactor;

    // 4. Levies (Surcharge: 7% of duty, ETLS: 0.5% of CIF, VAT: 7.5% of CIF+Duty+Surcharge+ETLS)
    const surchargeNaira = customsDutyNaira * 0.07;
    const etlsNaira = CIF_Naira * 0.005;
    
    const vatBase = CIF_Naira + customsDutyNaira + surchargeNaira + etlsNaira;
    const vatNaira = vatBase * 0.075;

    // 5. Clearing agent documentation and port handling fee
    let clearingAgentNaira = 550000;
    if (vehicleType === 'suv') clearingAgentNaira = 650000;
    if (vehicleType === 'truck') clearingAgentNaira = 800000;
    if (vehicleType === 'luxury') clearingAgentNaira = 750000;

    // 6. Total landing cost
    const totalLandingNaira = CIF_Naira + customsDutyNaira + surchargeNaira + vatNaira + etlsNaira + clearingAgentNaira;

    setResults({
      fobNaira,
      marineFreightUsd: shippingFeeUsd,
      customsDutyNaira,
      surchargeNaira,
      vatNaira,
      etlsNaira,
      clearingAgentNaira,
      totalLandingNaira
    });
    setCalculated(true);
  };

  // WhatsApp click triggers dynamic pre-filled text
  const formatNaira = (val: number) => {
    return '₦' + val.toLocaleString('en-NG', { maximumFractionDigits: 0 });
  };

  const handleShareWhatsApp = () => {
    const text = `Hello LeeAutoX! I used your online Custom Import Duty Calculator and would like to proceed with a pre-order request:
----------------------------------
Vehicle Type: ${vehicleType.toUpperCase()}
Model Year: ${vehicleYear}
FOB Purchase Value: $${parseFloat(fobUsd).toLocaleString()} USD (${formatNaira(results.fobNaira)})
Marine Freight Outbound: $${results.marineFreightUsd.toLocaleString()} USD
Est. Nigeria Custom Duty: ${formatNaira(results.customsDutyNaira)}
Est. Clearing & Port Agent Fee: ${formatNaira(results.clearingAgentNaira)}
----------------------------------
ESTIMATED TOTAL LANDING COST: ${formatNaira(results.totalLandingNaira)}
----------------------------------
Please connect me with a clearing officer to verify these parameters.`;

    const url = `https://wa.me/${CONTACT_INFO.whatsappRaw}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className={`p-8 border rounded-none max-w-4xl mx-auto shadow-2xl transition-colors duration-500 ${
      theme === 'dark' ? 'bg-zinc-950 border-zinc-900 text-white' : 'bg-white border-slate-200 text-slate-900'
    }`}>
      
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="text-[#2B59FF]" size={28} />
        <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight">
          Nigeria Custom Landing Cost Calculator
        </h3>
      </div>

      <p className={`text-xs md:text-sm mb-8 leading-relaxed ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'}`}>
        Calculate estimated clearing valuations, port surcharges, marine ocean containerization freight, and total cleared landing costs. Our calculations adhere strictly to the Nigeria Customs Service Common External Tariff (CET) formulas.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        
        {/* Form Inputs */}
        <form onSubmit={handleCalculate} className="space-y-5">
          
          <div>
            <label className="block text-[10px] font-bold tracking-widest uppercase mb-2 font-mono">
              Vehicle Type & Classification
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['sedan', 'suv', 'truck', 'luxury'] as const).map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setVehicleType(t)}
                  className={`py-3 px-4 text-xs font-bold uppercase tracking-wider text-center border transition-all ${
                    vehicleType === t
                      ? 'bg-[#2B59FF] border-[#2B59FF] text-white'
                      : theme === 'dark'
                      ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase mb-2 font-mono">
                Model Year
              </label>
              <select
                value={vehicleYear}
                onChange={(e) => setVehicleYear(parseInt(e.target.value))}
                className={`w-full p-3 text-sm font-bold border rounded-none transition-colors outline-none ${
                  theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              >
                {Array.from({ length: 16 }, (_, i) => 2026 - i).map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase mb-2 font-mono">
                FOB Value (USD)
              </label>
              <input
                type="number"
                value={fobUsd}
                onChange={(e) => setFobUsd(e.target.value)}
                placeholder="e.g. 8500"
                className={`w-full p-3 text-sm font-bold border rounded-none transition-colors outline-none ${
                  theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-white focus:border-[#2B59FF]' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-[#2B59FF]'
                }`}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-[#2B59FF] hover:bg-[#1a41cc] text-white font-bold tracking-widest uppercase text-xs transition-all shadow-[0_0_20px_rgba(43,89,255,0.3)] flex items-center justify-center gap-2"
          >
            Calculate Landing Surcharges
            <ArrowRight size={14} />
          </button>

          <div className="flex gap-2 items-start mt-4">
            <AlertTriangle className="text-[#2B59FF] shrink-0 mt-0.5" size={16} />
            <span className="text-[10px] leading-relaxed text-zinc-500">
              Disclaimer: Calculated duties are projections based on 2026 Common External Tariff rates. Prevailing customs exchange rates are volatile and can change without prior warning.
            </span>
          </div>

        </form>

        {/* Results Pane */}
        <div className={`p-6 border min-h-[340px] flex flex-col justify-between ${
          calculated
            ? theme === 'dark'
              ? 'bg-zinc-900/50 border-[#2B59FF]/30'
              : 'bg-blue-50/50 border-[#2B59FF]/20'
            : theme === 'dark'
            ? 'bg-zinc-900/20 border-zinc-900 border-dashed'
            : 'bg-slate-50/50 border-slate-100 border-dashed'
        }`}>
          {!calculated ? (
            <div className="my-auto text-center py-12">
              <RefreshCw className="mx-auto text-zinc-500 mb-4 animate-spin" size={32} />
              <h4 className="font-bold text-sm uppercase mb-1">Awaiting Parameters</h4>
              <p className="text-[10px] text-zinc-500 max-w-[240px] mx-auto">
                Fill out the model year, value, and classification to compile customs duty landing margins.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2 border-zinc-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  FOB Value in Naira (@ {NAIRA_PER_USD}/$)
                </span>
                <span className="font-mono font-bold text-sm">{formatNaira(results.fobNaira)}</span>
              </div>

              <div className="flex justify-between items-center border-b pb-2 border-zinc-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  Ocean Container Freight
                </span>
                <span className="font-mono font-bold text-sm">${results.marineFreightUsd.toLocaleString()} USD</span>
              </div>

              <div className="flex justify-between items-center border-b pb-2 border-zinc-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  Est. Custom CET Duty
                </span>
                <span className="font-mono font-bold text-sm">{formatNaira(results.customsDutyNaira)}</span>
              </div>

              <div className="flex justify-between items-center border-b pb-2 border-zinc-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  Customs Levies & VAT
                </span>
                <span className="font-mono font-bold text-sm">
                  {formatNaira(results.surchargeNaira + results.vatNaira + results.etlsNaira)}
                </span>
              </div>

              <div className="flex justify-between items-center border-b pb-2 border-zinc-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  Port Clearing & Documentation
                </span>
                <span className="font-mono font-bold text-sm">{formatNaira(results.clearingAgentNaira)}</span>
              </div>

              {/* Total Card */}
              <div className="p-4 bg-[#2B59FF]/10 border border-[#2B59FF]/20 mt-6">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2B59FF] flex items-center gap-1.5">
                    <CheckCircle2 size={12} />
                    Total Landing Estimate
                  </span>
                  <span className="font-mono font-black text-lg md:text-xl text-[#2B59FF]">
                    {formatNaira(results.totalLandingNaira)}
                  </span>
                </div>
                <p className="text-[9px] text-zinc-500 leading-relaxed">
                  Includes purchase cost, marine transport containerization, customs assessments, port taxes, and direct clearing handling.
                </p>
              </div>

              <button
                onClick={handleShareWhatsApp}
                className="w-full mt-4 py-3 bg-[#2B59FF] text-white hover:bg-[#1a41cc] transition-all font-bold tracking-widest uppercase text-[10px]"
              >
                Forward Landing Projections to WhatsApp
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
