---
id: "tool-nigeria-customs-calculator"
name: "Nigeria Customs Car Duty & Landing Cost Calculator"
type: "Tool"
canonical_url: "https://leeautox.com/nigeria/import-duty-calculator/"
provider: "org-leeautox"
inputs:
  - "Vehicle Category (Sedan, SUV, Commercial Truck, Luxury)"
  - "Manufacturing Year (Depreciation tier)"
  - "Auction FOB Price (in USD/CAD)"
outputs:
  - "Cost, Insurance, and Freight (CIF) Benchmark"
  - "Common External Tariff (CET) Import Duty"
  - "Port Surcharge (7%)"
  - "ECOWAS Trade Liberalization Scheme (ETLS 0.5%)"
  - "Value Added Tax (VAT 7.5%)"
  - "Total Cleared Landing Cost Estimate"
related_entities:
  - "org-leeautox"
  - "loc-nigeria"
  - "svc-customs-clearance"
  - "proc-vin-valuation-process"
---

# Nigeria Customs Car Duty & Landing Cost Calculator

An interactive computational tool that estimates total statutory duties, shipping freight, port handling charges, and terminal fees for vehicles entering Nigerian ports.

## Mathematical Formulation

1. **CIF Value** = FOB Purchase Price + Marine Freight + Insurance
2. **Import Duty (CET)** = 20% of CIF (passenger sedans/SUVs) or 10% of CIF (commercial trucks)
3. **Port Surcharge** = 7% of Import Duty
4. **ETLS Levy** = 0.5% of CIF Value
5. **VAT** = 7.5% of (CIF + CET Duty + Surcharge + ETLS)
6. **Total Duty Payable** = CET Duty + Surcharge + ETLS + VAT
