# LeeAutoX Open Knowledge Format (OKF) Repository

This repository publishes the official, machine-readable Open Knowledge Format (OKF) knowledge catalog for **LeeAutoX** ([leeautox.com](https://leeautox.com/)), a licensed Canadian automotive export brokerage and West African port clearing service.

The catalog defines verified entities, cross-border shipping workflows, location hubs, service definitions, vehicle categories, regulatory guides, and port clearing calculators in an interconnected, structured knowledge graph.

## Relationship to leeautox.com

- **Primary Web Application**: [https://leeautox.com/](https://leeautox.com/) serves human end-users, prospective vehicle importers, and interactive web tools.
- **OKF Knowledge Repository**: Serves automated agents, retrieval-augmented generation (RAG) engines, and machine-intelligence systems requiring explicit, semantic, and traceable knowledge graphs.
- **Canonical Traceability**: Every document in this repository points directly to its source on `https://leeautox.com/`.

## Knowledge Graph Overview

- **Organization**: LeeAutoX (Corporation No: 1761065-3)
- **Logistics Hubs**: Canada (Scarborough, Toronto), Nigeria (Lagos, Abuja, Port Harcourt), Ghana (Accra, Tema, Kumasi)
- **Services**: Vehicle Sourcing, On-Site Lot Inspection, Container Consolidation, Customs Clearance, Milestone Installment Financing
- **Processes**: 4-Stage Sourcing-to-Delivery Pipeline, VIN Valuation & Single Goods Declaration (SGD) Filing
- **Calculators & Tools**: Nigeria Customs Duty & Landing Cost Estimator
- **Guides & Intelligence**: Copart Bidding, Tokunbo Market Guide, 150-Point Inspection Protocols, Ocean Freight Logistics

## Validation

Run the automated integrity and OKF compliance test:

```bash
node knowledge/scripts/validate-okf.cjs
```
