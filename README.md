# GridMind — Powerhouse Studio

GridMind is an interactive 3D electrical-system planning workspace for homes, farms and small off-grid installations. Build a virtual power house, place equipment, connect components, edit nameplate values, and inspect first-pass system checks.

## Run locally

Requirements: Node.js 20.9+ and npm.

```bash
npm install
npm run dev
```

Open http://localhost:3000. The 3D workspace and simulator run in the browser and do not require API credentials.

## What works now

- **Interactive 3D workspace:** WebGL scene with orbit, zoom, component selection, drag-to-reposition and animated power-flow markers.
- **Equipment library:** solar panels, grid supply, generators, wind turbines, micro-hydro, batteries, hybrid inverters, charge controllers, distribution boards, soft starters, borehole pumps, lights, fridges, socket circuits, EV chargers, air conditioners and custom loads.
- **Add as many components as needed:** add multiple pumps/boreholes, lighting circuits, batteries, inverters and other equipment; edit each component's name, rated power, voltage, rating, quantity and phase.
- **Connections:** create visual cable links between equipment; connected components are drawn in the 3D scene.
- **Local projects:** save and restore the current equipment layout in browser local storage, or reset to the sample borehole installation.
- **Live checks:** connected load against inverter nameplate capacity, installed PV, estimated daily PV yield, source/load balance and an illustrative pump-start estimate.
- **BMS and surge warnings:** edit battery continuous and peak current limits, inverter surge rating, pump start multiplier, and assumed soft-starter reduction to explore how those assumptions affect the estimate.
- **Design review:** flags for BMS limits, inverter surge, PV string/MPPT compatibility, phase and motor characteristics, protection, cable sizing and earthing.

## Simulation boundaries

The 3D renderer is a lightweight WebGL scene, not a detailed CAD/BIM model. Equipment geometry and cable paths are conceptual.

The electrical calculations are deterministic first-pass estimates. The pump-start estimate uses editable assumptions for motor starting multiplier and soft-starter reduction; it does not calculate a measured motor current waveform or reproduce a specific inverter/BMS overload curve. The current estimate uses the first battery in the bank and does not yet model series/parallel battery topology, battery voltage sag, detailed MPPT behaviour, power factor, harmonics, phase imbalance, cable voltage drop, protection coordination or earthing.

A positive daily energy balance does not prove that the system can handle an instantaneous motor start. Always verify exact equipment datasheets and have a qualified electrical professional design and inspect the installation. This app does not control live equipment and is not an electrical design certificate.

## Development checks

```bash
npm run typecheck
npm run lint
npm run build
```

## Privacy

The equipment layout is saved in browser local storage on the current device/browser. There is no account, shared project database or live hardware connection in this prototype.
