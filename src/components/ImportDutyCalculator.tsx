import React, { useState } from 'react';
import { CONTACT_INFO } from '../constants';
import { Calculator, AlertTriangle, ArrowRight, CheckCircle2, RefreshCw } from 'lucide-react';
import { PlanPicker, OdometerStepper, RippleButton, PlanOption } from './ui/ImportedControls';

export default function ImportDutyCalculator() {
  const NAIRA_PER_USD = 1425;

  const [vehicleType, setVehicleType] = useState<'sedan' | 'suv' | 'truck' | 'luxury'>('sedan');
  const [vehicleYear, setVehicleYear] = useState<number>(2021);
  const [fobUsd, setFobUsd] = useState<string>('8500');

  const [calculated, setCalculated] = useState<boolean>(false);
  const [results, setResults] = useState({
    fobNaira: 0,
    marineFreightUsd: 0,
    customsDutyNaira: 0,
    surchargeNaira: 0,
    vatNaira: 0,
    etlsNaira: 0,
    clearingAgentNaira: 0,
    totalLandingNaira: 0,
  });

  const planOptions: PlanOption[] = [
    { value: 'sedan', title: 'Sedan', subtitle: 'Standard ocean slot' },
    { value: 'suv', title: 'SUV / Crossover', subtitle: 'Mid-size clearance' },
    { value: 'truck', title: 'Pickup / Truck', subtitle: 'Commercial tariff' },
    { value: 'luxury', title: 'Luxury SUV', subtitle: 'Enclosed / Priority' },
  ];

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const fobVal = parseFloat(fobUsd) || 0;

    let shippingFeeUsd = 2500;
    if (vehicleType === 'suv') shippingFeeUsd = 2800;
    if (vehicleType === 'truck') shippingFeeUsd = 3300;
    if (vehicleType === 'luxury') shippingFeeUsd = 3100;

    const fobNaira = fobVal * NAIRA_PER_USD;
    const freightNaira = shippingFeeUsd * NAIRA_PER_USD;
    const CIF_Naira = fobNaira + freightNaira;

    let dutyRate = 0.20;
    if (vehicleType === 'truck') dutyRate = 0.10;

    let ageRebateFactor = 1.0;
    const age = 2026 - vehicleYear;
    if (age > 10) ageRebateFactor = 0.6;
    else if (age > 5) ageRebateFactor = 0.8;

    const customsDutyNaira = CIF_Naira * dutyRate * ageRebateFactor;
    const surchargeNaira = customsDutyNaira * 0.07;
    const etlsNaira = CIF_Naira * 0.005;
    const vatBase = CIF_Naira + customsDutyNaira + surchargeNaira + etlsNaira;
    const vatNaira = vatBase * 0.075;

    let clearingAgentNaira = 550000;
    if (vehicleType === 'suv') clearingAgentNaira = 650000;
    if (vehicleType === 'truck') clearingAgentNaira = 800000;
    if (vehicleType === 'luxury') clearingAgentNaira = 750000;

    const totalLandingNaira = CIF_Naira + customsDutyNaira + surchargeNaira + vatNaira + etlsNaira + clearingAgentNaira;

    setResults({
      fobNaira,
      marineFreightUsd: shippingFeeUsd,
      customsDutyNaira,
      surchargeNaira,
      vatNaira,
      etlsNaira,
      clearingAgentNaira,
      totalLandingNaira,
    });
    setCalculated(true);
  };

  const formatNaira = (val: number) => '₦' + val.toLocaleString('en-NG', { maximumFractionDigits: 0 });

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
    <div className="lx-card-padded p-6 sm:p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center">
          <Calculator size={20} />
        </div>
        <h3 className="text-xl md:text-2xl font-serif font-normal tracking-tight text-[var(--ink)]">
          Nigeria Custom Landing Cost Calculator
        </h3>
      </div>

      <p className="text-xs md:text-sm mb-8 leading-relaxed text-[var(--ink-2)]">
        Calculate estimated clearing valuations, port surcharges, marine ocean containerization freight, and total cleared landing costs adhering to Nigeria Customs Service Common External Tariff (CET) formulas.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
        <form onSubmit={handleCalculate} className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold tracking-widest uppercase mb-2 font-mono text-[var(--ink-2)]">
              Vehicle Type &amp; Classification
            </label>
            <PlanPicker
              options={planOptions}
              value={vehicleType}
              onChange={(val) => setVehicleType(val as 'sedan' | 'suv' | 'truck' | 'luxury')}
              columns={2}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase mb-2 font-mono text-[var(--ink-2)]">
                Model Year
              </label>
              <OdometerStepper
                value={vehicleYear}
                min={2010}
                max={2026}
                step={1}
                label="Model Year"
                onChange={setVehicleYear}
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="calc-fob-usd" className="block text-[10px] font-bold tracking-widest uppercase mb-2 font-mono text-[var(--ink-2)]">
                FOB Value (USD)
              </label>
              <input
                id="calc-fob-usd"
                type="number"
                value={fobUsd}
                onChange={(e) => setFobUsd(e.target.value)}
                placeholder="e.g. 8500"
                className="w-full min-h-[48px] px-4 py-3 text-sm font-mono font-bold rounded-2xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] outline-none focus:border-[var(--accent)] transition-colors"
                required
              />
            </div>
          </div>

          <RippleButton type="submit" variant="primary" className="w-full py-3.5 text-xs font-mono uppercase tracking-widest">
            <span>Calculate Landing Surcharges</span>
            <ArrowRight size={14} />
          </RippleButton>

          <div className="flex gap-2 items-start pt-1">
            <AlertTriangle className="text-[var(--accent)] shrink-0 mt-0.5" size={16} />
            <span className="text-[11px] leading-relaxed text-[var(--ink-2)]">
              Disclaimer: Calculated duties are projections based on 2026 Common External Tariff rates. Prevailing customs exchange rates can vary slightly by bill-of-lading date.
            </span>
          </div>
        </form>

        {/* Results Pane */}
        <div
          className={`p-6 rounded-2xl border min-h-[340px] flex flex-col justify-between transition-colors ${
            calculated
              ? 'bg-[var(--surface)] border-[var(--accent)]/35'
              : 'bg-[var(--surface)]/60 border-[var(--line)] border-dashed'
          }`}
        >
          {!calculated ? (
            <div className="my-auto text-center py-12">
              <RefreshCw className="mx-auto text-[var(--accent)] mb-4 opacity-70" size={30} />
              <h4 className="font-serif text-lg font-normal mb-1 text-[var(--ink)]">Awaiting Parameters</h4>
              <p className="text-xs text-[var(--ink-2)] max-w-[240px] mx-auto">
                Select classification, model year, and auction FOB value to compile customs landing estimates.
              </p>
            </div>
          ) : (
            <div className="space-y-3.5">
              <div className="flex justify-between items-center border-b border-[var(--line)] pb-2.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--ink-2)]">
                  FOB Value in Naira (@ {NAIRA_PER_USD}/$)
                </span>
                <span className="font-mono font-bold text-sm tabular-nums text-[var(--ink)]">{formatNaira(results.fobNaira)}</span>
              </div>

              <div className="flex justify-between items-center border-b border-[var(--line)] pb-2.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--ink-2)]">
                  Ocean Container Freight
                </span>
                <span className="font-mono font-bold text-sm tabular-nums text-[var(--ink)]">${results.marineFreightUsd.toLocaleString()} USD</span>
              </div>

              <div className="flex justify-between items-center border-b border-[var(--line)] pb-2.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--ink-2)]">
                  Est. Custom CET Duty
                </span>
                <span className="font-mono font-bold text-sm tabular-nums text-[var(--ink)]">{formatNaira(results.customsDutyNaira)}</span>
              </div>

              <div className="flex justify-between items-center border-b border-[var(--line)] pb-2.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--ink-2)]">
                  Customs Levies &amp; VAT
                </span>
                <span className="font-mono font-bold text-sm tabular-nums text-[var(--ink)]">
                  {formatNaira(results.surchargeNaira + results.vatNaira + results.etlsNaira)}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-[var(--line)] pb-2.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--ink-2)]">
                  Port Clearing &amp; Documentation
                </span>
                <span className="font-mono font-bold text-sm tabular-nums text-[var(--ink)]">{formatNaira(results.clearingAgentNaira)}</span>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--accent-soft)] border border-[var(--accent)]/30 mt-4">
                <div className="flex justify-between items-center mb-1 gap-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent)] flex items-center gap-1.5">
                    <CheckCircle2 size={13} />
                    Total Landing Estimate
                  </span>
                  <span className="font-mono font-black text-lg md:text-xl tabular-nums text-[var(--accent)]">
                    {formatNaira(results.totalLandingNaira)}
                  </span>
                </div>
                <p className="text-[10px] text-[var(--ink-2)] leading-relaxed">
                  Includes purchase cost, marine containerization, customs assessments, port taxes, and direct clearing handling.
                </p>
              </div>

              <RippleButton
                type="button"
                variant="primary"
                onClick={handleShareWhatsApp}
                className="w-full mt-2 py-3 font-mono tracking-widest uppercase text-[11px]"
              >
                Forward Projections to WhatsApp
              </RippleButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
