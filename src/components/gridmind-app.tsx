"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import {
  Activity, ArrowDownRight, ArrowUpRight, BatteryCharging, Bolt, Camera,
  Check, CircleHelp, FileImage, Plus, RotateCcw, Save, Sun, Trash2, Waves, X,
} from "lucide-react";

type Appliance = { id: string; name: string; watts: number; hours: number; quantity: number };
type SystemConfig = { solarKw: number; batteryKwh: number; inverterKw: number; sunHours: number; solarEfficiency: number; batteryUsable: number };
type Photo = { id: string; name: string; dataUrl: string };
const initialSystem: SystemConfig = { solarKw: 2.76, batteryKwh: 5.12, inverterKw: 6, sunHours: 4.5, solarEfficiency: 0.78, batteryUsable: 0.9 };
const initialAppliances: Appliance[] = [
  { id: "pump", name: "Borehole pump", watts: 1100, hours: 2, quantity: 1 },
  { id: "fridge", name: "Refrigeration", watts: 150, hours: 9.3, quantity: 1 },
  { id: "lights", name: "Lights & devices", watts: 100, hours: 8, quantity: 1 },
];
const fmt = (n: number, digits = 1) => Number.isFinite(n) ? n.toLocaleString(undefined, { maximumFractionDigits: digits, minimumFractionDigits: digits }) : "—";
const uid = () => Math.random().toString(36).slice(2, 10);

export function GridMindApp() {
  const [system, setSystem] = useState<SystemConfig>(initialSystem);
  const [appliances, setAppliances] = useState<Appliance[]>(initialAppliances);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [solarMultiplier, setSolarMultiplier] = useState(100);
  const [saved, setSaved] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("gridmind-project-v1");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.system) setSystem({ ...initialSystem, ...parsed.system });
        if (Array.isArray(parsed.appliances)) setAppliances(parsed.appliances);
        if (Array.isArray(parsed.photos)) setPhotos(parsed.photos);
        if (typeof parsed.solarMultiplier === "number") setSolarMultiplier(parsed.solarMultiplier);
      }
    } catch { /* Start with sample data if local project data is unreadable. */ }
    setHydrated(true);
  }, []);

  const results = useMemo(() => {
    const demand = appliances.reduce((sum, item) => sum + Math.max(0, item.watts) * Math.max(0, item.hours) * Math.max(0, item.quantity) / 1000, 0);
    const generation = Math.max(0, system.solarKw) * Math.max(0, system.sunHours) * Math.max(0, system.solarEfficiency) * solarMultiplier / 100;
    const usableBattery = Math.max(0, system.batteryKwh) * Math.max(0, system.batteryUsable);
    const surplus = generation - demand;
    const runtime = demand > 0 ? usableBattery / demand * 24 : 0;
    return { demand, generation, usableBattery, surplus, runtime, inverterLoad: appliances.reduce((sum, item) => sum + Math.max(0, item.watts) * Math.max(0, item.quantity), 0) / 1000 };
  }, [system, appliances, solarMultiplier]);

  function updateSystem<K extends keyof SystemConfig>(key: K, value: number) {
    setSystem((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }
  function updateAppliance(id: string, key: keyof Appliance, value: string | number) {
    setAppliances((current) => current.map((item) => item.id === id ? { ...item, [key]: value } as Appliance : item));
    setSaved(false);
  }
  async function uploadPhotos(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []).slice(0, 6 - photos.length);
    const accepted = files.filter((file) => file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024);
    const converted = await Promise.all(accepted.map((file) => new Promise<Photo>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => typeof reader.result === "string" ? resolve({ id: uid(), name: file.name, dataUrl: reader.result }) : reject(new Error("Could not read image"));
      reader.onerror = () => reject(new Error("Could not read image"));
      reader.readAsDataURL(file);
    })));
    setPhotos((current) => [...current, ...converted].slice(0, 6));
    setSaved(false);
    event.target.value = "";
  }
  function saveProject() {
    try {
      localStorage.setItem("gridmind-project-v1", JSON.stringify({ system, appliances, photos, solarMultiplier }));
      setSaved(true);
    } catch {
      window.alert("This project is too large to save in browser storage. Remove a few photos and try again.");
    }
  }
  function resetProject() {
    setSystem(initialSystem);
    setAppliances(initialAppliances);
    setPhotos([]);
    setSolarMultiplier(100);
    setSaved(false);
    localStorage.removeItem("gridmind-project-v1");
  }

  return <main className="app-shell">
    <aside className="sidebar">
      <a className="brand" href="#overview" aria-label="GridMind home"><span className="brand-mark"><Bolt size={21} fill="currentColor" /></span><span>grid<span>mind</span></span></a>
      <div className="workspace-label">WORKSPACE</div>
      <nav className="nav-list" aria-label="Main navigation">
        <a className="nav-item active" href="#overview"><Activity size={17}/> Overview</a>
        <a className="nav-item" href="#system"><Sun size={17}/> My system</a>
        <a className="nav-item" href="#equipment"><Camera size={17}/> Equipment</a>
        <a className="nav-item" href="#scenarios"><Waves size={17}/> Scenarios</a>
      </nav>
      <div className="sidebar-bottom"><div className="status-dot"/><div><strong>Local demo</strong><small>No account · No live hardware</small></div></div>
    </aside>
    <section className="main-panel">
      <header className="topbar"><div className="breadcrumb">Workspace <span>/</span> Energy overview</div><div className="demo-pill"><span/> {hydrated ? "PROJECT READY" : "LOADING PROJECT"}</div></header>
      <div className="content">
        <section className="hero" id="overview"><div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line"/> ENERGY INTELLIGENCE</div>
          <h1>Know your energy.<br/><span>Own your next move.</span></h1>
          <p>Build a picture of your energy system, change assumptions, and explore what your setup could support.</p>
          <a className="primary-link" href="#scenarios">Run a scenario <span>↗</span></a>
        </div><div className="hero-art" aria-hidden="true"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="sun-core"><Sun size={36}/></div><div className="art-node node-solar"><Sun size={17}/> Solar</div><div className="art-node node-battery"><BatteryCharging size={17}/> Storage</div><div className="art-node node-home"><Bolt size={17}/> Loads</div><div className="flow-line flow-a"/><div className="flow-line flow-b"/><div className="flow-line flow-c"/></div></section>

        <div className="toolbar"><div><span className="section-kicker">YOUR WORKSPACE</span><p className="toolbar-note">Edit the sample values to model your own installation.</p></div><div className="toolbar-actions"><button className="secondary-button" onClick={resetProject}><RotateCcw size={14}/> Reset sample</button><button className="save-button" onClick={saveProject}><Save size={14}/> {saved ? "Saved locally" : "Save project"}</button></div></div>

        <div className="section-heading"><div><div className="section-kicker">CALCULATED FROM YOUR INPUTS</div><h2>Energy overview</h2></div><span className="assumption-note"><CircleHelp size={14}/> Estimates, not measurements</span></div>
        <div className="metrics-grid" id="system">
          <MetricCard label="Estimated solar/day" value={fmt(results.generation)} unit=" kWh" note={fmt(system.solarKw) + " kW array · adjusted for sun hours"} icon={Sun} trend="up"/>
          <MetricCard label="Usable battery" value={fmt(results.usableBattery)} unit=" kWh" note={fmt(system.batteryUsable * 100, 0) + "% assumed usable"} icon={BatteryCharging}/>
          <MetricCard label="Daily load" value={fmt(results.demand)} unit=" kWh" note={fmt(results.inverterLoad) + " kW combined nameplate load"} icon={Bolt}/>
          <MetricCard label="Energy balance" value={(results.surplus >= 0 ? "+" : "") + fmt(results.surplus)} unit=" kWh/day" note={results.surplus >= 0 ? "Estimated daily surplus" : "Estimated daily shortfall"} icon={Waves} trend={results.surplus >= 0 ? "up" : "down"}/>
        </div>

        <div className="lower-grid" id="scenarios">
          <section className="panel-card"><div className="panel-heading"><div><div className="section-kicker">LOAD BUILDER</div><h2>Where energy goes</h2></div><button className="mini-action" onClick={() => { setAppliances((items) => [...items, { id: uid(), name: "New appliance", watts: 100, hours: 2, quantity: 1 }]); setSaved(false); }}><Plus size={14}/> Add load</button></div>
            <div className="appliance-list">{appliances.map((item) => {
              const energy = Math.max(0, item.watts) * Math.max(0, item.hours) * Math.max(0, item.quantity) / 1000;
              const width = results.demand > 0 ? Math.min(100, energy / results.demand * 100) : 0;
              return <div className="appliance-row" key={item.id}>
                <div className="appliance-edit-head"><input aria-label="Appliance name" value={item.name} maxLength={45} onChange={(e) => updateAppliance(item.id, "name", e.target.value)}/><strong>{fmt(energy)} kWh/day</strong><button className="icon-button" aria-label={"Remove " + item.name} onClick={() => { setAppliances((items) => items.filter((load) => load.id !== item.id)); setSaved(false); }}><Trash2 size={14}/></button></div>
                <div className="load-fields">
                  <label>Power (W)<input type="number" min="0" max="100000" value={item.watts} onChange={(e) => updateAppliance(item.id, "watts", Number(e.target.value))}/></label>
                  <label>Hours/day<input type="number" min="0" max="24" step="0.5" value={item.hours} onChange={(e) => updateAppliance(item.id, "hours", Number(e.target.value))}/></label>
                  <label>Quantity<input type="number" min="0" max="100" step="1" value={item.quantity} onChange={(e) => updateAppliance(item.id, "quantity", Number(e.target.value))}/></label>
                </div>
                <div className="bar-track"><div className="bar-fill" style={{ width: width + "%" }}/></div>
              </div>;
            })}</div>
            <p className="panel-footnote">Daily energy = watts × hours × quantity ÷ 1,000. Actual loads may vary due to duty cycles and startup surges.</p>
          </section>
          <section className="panel-card scenario-card"><div className="panel-heading"><div><div className="section-kicker">WHAT-IF SIMULATOR</div><h2>Change your assumptions</h2></div><span className="spark-icon">✳</span></div>
            <div className="slider-block"><div className="slider-label"><label htmlFor="solarMultiplier">Solar output adjustment</label><strong>{solarMultiplier}%</strong></div><input id="solarMultiplier" type="range" min="0" max="130" step="5" value={solarMultiplier} onChange={(e) => { setSolarMultiplier(Number(e.target.value)); setSaved(false); }}/><div className="range-hints"><span>0% cloudy / offline</span><span>130% strong day</span></div></div>
            <div className="system-fields">
              <label>Solar array (kW)<input type="number" min="0" max="1000" step="0.1" value={system.solarKw} onChange={(e) => updateSystem("solarKw", Number(e.target.value))}/></label>
              <label>Peak sun hours<input type="number" min="0" max="24" step="0.25" value={system.sunHours} onChange={(e) => updateSystem("sunHours", Number(e.target.value))}/></label>
              <label>Battery capacity (kWh)<input type="number" min="0" max="10000" step="0.1" value={system.batteryKwh} onChange={(e) => updateSystem("batteryKwh", Number(e.target.value))}/></label>
              <label>Inverter rating (kW)<input type="number" min="0" max="10000" step="0.1" value={system.inverterKw} onChange={(e) => updateSystem("inverterKw", Number(e.target.value))}/></label>
              <label>PV system efficiency (%)<input type="number" min="0" max="100" value={Math.round(system.solarEfficiency * 100)} onChange={(e) => updateSystem("solarEfficiency", Number(e.target.value) / 100)}/></label>
              <label>Usable battery (%)<input type="number" min="0" max="100" value={Math.round(system.batteryUsable * 100)} onChange={(e) => updateSystem("batteryUsable", Number(e.target.value) / 100)}/></label>
            </div>
            <div className="result-summary"><div><span>Battery-only equivalent</span><strong>{fmt(results.runtime)} hours</strong></div><div><span>Inverter load check</span><strong className={results.inverterLoad > system.inverterKw ? "warning-text" : ""}>{results.inverterLoad > system.inverterKw ? "Above rating" : "Within rating"}</strong></div></div>
            <p className="panel-footnote">Battery-only equivalent assumes the entire daily load could be averaged over 24 hours. It is not a runtime prediction for individual appliances. Inverter check compares combined nameplate watts to rated kW only.</p>
          </section>
        </div>

        <section className="panel-card equipment-card" id="equipment"><div className="panel-heading"><div><div className="section-kicker">EQUIPMENT INVENTORY</div><h2>Photos & confirmed specifications</h2></div><span className="small-badge">LOCAL ONLY</span></div>
          <p className="equipment-intro">Add photos of panels, inverter labels, batteries, or pumps to keep them with this project. Images are stored in this browser only; specifications below are entered manually.</p>
          <label className="upload-zone"><FileImage size={24}/><strong>Choose equipment photos</strong><span>PNG, JPG, or WebP · up to 5 MB each · 6 photos maximum</span><input type="file" accept="image/*" multiple onChange={uploadPhotos} disabled={photos.length >= 6}/></label>
          {photos.length > 0 ? <div className="photo-grid">{photos.map((photo) => <div className="photo-card" key={photo.id}><img src={photo.dataUrl} alt={"Equipment photo: " + photo.name}/><div><span title={photo.name}>{photo.name}</span><button className="icon-button" aria-label={"Remove photo " + photo.name} onClick={() => { setPhotos((items) => items.filter((item) => item.id !== photo.id)); setSaved(false); }}><X size={14}/></button></div></div>)}</div> : <div className="empty-photos"><Camera size={18}/><span>No equipment photos yet. You can still configure the system manually.</span></div>}
          <div className="manual-note"><Check size={15}/><span>Model-based photo recognition is intentionally not enabled yet. Confirm ratings from manufacturer labels or manuals before relying on them.</span></div>
        </section>

        <section className="advisor-card" id="advisor"><div className="advisor-header"><div className="advisor-avatar"><Bolt size={21}/></div><div><div className="section-kicker">MODEL INTEGRATION · LATER PHASE</div><h2>GridMind advisor</h2></div><span className="coming-pill">Coming next</span></div><p className="advisor-description">The core calculator is deterministic and works without an API key. Next, Muse Spark will explain these calculated results, and SAM 3.1 can help identify equipment regions in photos. AI will not replace the simulator’s calculations.</p><div className="integration-list"><span><Check size={14}/> Energy calculations work locally</span><span><Check size={14}/> Inputs and photos stay in this browser</span><span><CircleHelp size={14}/> No AI analysis or hardware control yet</span></div></section>
        <footer>GRIDMIND · INTERACTIVE PROTOTYPE <span>Planning estimates only. Not electrical design, safety certification, or live equipment control.</span></footer>
      </div>
    </section>
  </main>;
}

function MetricCard({ label, value, unit, note, icon: Icon, trend }: {
  label: string; value: string; unit: string; note: string; icon: typeof Sun; trend?: "up" | "down";
}) {
  return <section className="metric-card"><div className="metric-top"><span className="metric-label">{label}</span><span className="metric-icon"><Icon size={18}/></span></div><div className="metric-value">{value}<span>{unit}</span></div><div className="metric-note">{trend === "up" ? <ArrowUpRight size={14}/> : trend === "down" ? <ArrowDownRight size={14}/> : <Activity size={14}/>} {note}</div></section>;
}
