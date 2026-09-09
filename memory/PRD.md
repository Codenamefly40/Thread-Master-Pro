# Thread Master – Machinist Edition

## Overview
Offline mobile reference app for machinists who cut threads frequently. Provides full Unified and Metric thread spec data with class-based tolerances, tap drill calculations, and 3-wire over-wire measurement.

## Tech Stack
- Expo Router (React Native) with TypeScript
- Fully offline, client-side calculations (no backend / no network calls)
- All thread data + formulas in `/app/frontend/src/data` and `/app/frontend/src/utils`

## Features
- **Home**: Unified vs Metric system selector
- **Threads list**: 56 Unified sizes (#0-80 → 1"-8 incl. UNC/UNF/UNEF/UNS) and 67 Metric sizes (M1 → M25 with Coarse / Fine / Super Fine pitches), all sorted by diameter, with live search bar
- **Spec page** per thread:
  - Internal / External toggle
  - Class of fit selector (1A/2A/3A external, 1B/2B/3B internal)
  - Class-aware dimensions (Major/Pitch/Minor diameters, allowance, tolerances) displayed in both inches and mm
  - **Internal**: tap drill calculator with 50/55/60/65/70/75 % thread engagement, cutting vs forming tap toggle, plus closest standard letter/number/fractional drill suggestion (Unified)
  - **External**: 3-wire measurement calculator showing best wire size (0.57735 × P) with override input; computes Measurement Over Wires (M = E + 3W − 1.5155 × P) for both PD max/min lines

## Calculation Standards
- Basic dimensions per ASME B1.1 (H = √3/2 × P, basic PD = D − 0.6495·P, basic minor = D − 1.0825·P)
- Class tolerances per ASME B1.1 multipliers (1A=1.5×, 2A=1.0×, 3A=0.75×, 1B=1.95×, 2B=1.30×, 3B=0.975×)
- Tap drill: D − (% / 100) × 1.0825 × P (cutting), D − (% / 100) × 0.5413 × P (forming)
