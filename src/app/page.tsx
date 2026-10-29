import { Activity, ArrowDownRight, ArrowUpRight, BatteryCharging, Bolt, CircleHelp, Sun, Waves } from "lucide-react";
import { Advisor } from "@/components/advisor";

const appliances = [
  { name: "Borehole pump", detail: "1.1 kW · 2 h/day", energy: "2.2 kWh", width: "76%" },
  { name: "Refrigeration", detail: "Estimated daily consumption", energy: "1.4 kWh", width: "48%" },
  { name: "Lights & devices", detail: "Estimated daily consumption", energy: "0.8 kWh", width: "28%" },
];

function MetricCard({ label, value, unit, note, icon: Icon, trend }: {
  label: string; value: string; unit: string; note: string;
  icon: typeof Sun; trend?: "up" | "down";
}) {
  return <section className="metric-card">
    <div className="metric-top"><span className="metric-label">{label}</span><span className="metric-icon"><Icon size={18} /></span></div>
    <div className="metric-value">{value}<span>{unit}</span></div>
    <div className="metric-note">{trend === "up" ? <ArrowUpRight size={14}/> : trend === "down" ? <ArrowDownRight size={14}/> : <Activity size={14}/>} {note}</div>
  </section>;
}

export default function Home() {
  return <main className="app-shell">
    <aside className="sidebar">
      <a className="brand" href="/" aria-label="GridMind home"><span className="brand-mark"><Bolt size={21} fill="currentColor" /></span><span>grid<span>mind</span></span></a>
      <div className="workspace-label">WORKSPACE</div>
      <nav className="nav-list" aria-label="Main navigation">
        <a className="nav-item active" href="#overview"><Activity size={17}/> Overview</a>
        <a className="nav-item" href="#system"><Sun size={17}/> My system</a>
        <a className="nav-item" href="#scenarios"><Waves size={17}/> Scenarios</a>
      </nav>
      <div className="sidebar-bottom"><div className="status-dot"/><div><strong>Demo environment</strong><small>Simulated data · No live hardware</small></div></div>
    </aside>
    <section className="main-panel">
      <header className="topbar"><div className="breadcrumb">Workspace <span>/</span> Overview</div><div className="demo-pill"><span/> SAMPLE INSTALLATION</div></header>
      <div className="content">
        <section className="hero" id="overview"><div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line"/> ENERGY INTELLIGENCE</div>
          <h1>Know your energy.<br/><span>Own your next move.</span></h1>
          <p>Understand your system, explore what-if scenarios, and make better-informed energy decisions.</p>
          <a className="primary-link" href="#advisor">Ask GridMind <span>↗</span></a>
        </div><div className="hero-art" aria-hidden="true"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="sun-core"><Sun size={36}/></div><div className="art-node node-solar"><Sun size={17}/> Solar</div><div className="art-node node-battery"><BatteryCharging size={17}/> Storage</div><div className="art-node node-home"><Bolt size={17}/> Loads</div><div className="flow-line flow-a"/><div className="flow-line flow-b"/><div className="flow-line flow-c"/></div></section>
        <div className="section-heading"><div><div className="section-kicker">YOUR SYSTEM AT A GLANCE</div><h2>Energy overview</h2></div><span className="assumption-note"><CircleHelp size={14}/> Illustrative estimates</span></div>
        <div className="metrics-grid" id="system">
          <MetricCard label="Solar array" value="2.76" unit=" kW" note="Installed capacity · sample" icon={Sun} trend="up"/>
          <MetricCard label="Battery usable" value="4.61" unit=" kWh" note="90% assumed usable fraction" icon={BatteryCharging}/>
          <MetricCard label="Inverter output" value="6.0" unit=" kW" note="Rated steady-state output" icon={Bolt}/>
          <MetricCard label="Pump energy" value="2.20" unit=" kWh/day" note="1.1 kW × 2 hours" icon={Waves} trend="down"/>
        </div>
        <div className="lower-grid" id="scenarios">
          <section className="panel-card"><div className="panel-heading"><div><div className="section-kicker">ESTIMATED DAILY DEMAND</div><h2>Where energy goes</h2></div><span className="small-badge">SAMPLE</span></div>
            <div className="appliance-list">{appliances.map(item => <div className="appliance-row" key={item.name}><div className="appliance-meta"><div><strong>{item.name}</strong><small>{item.detail}</small></div><strong>{item.energy}</strong></div><div className="bar-track"><div className="bar-fill" style={{width:item.width}}/></div></div>)}</div>
            <p className="panel-footnote">Illustrative loads only. Actual consumption and solar generation have not been measured.</p>
          </section>
          <section className="panel-card insight-card"><div className="panel-heading"><div><div className="section-kicker">NEXT BEST STEP</div><h2>Explore a decision</h2></div><span className="spark-icon">✳</span></div><div className="insight-highlight"><div className="insight-symbol"><BatteryCharging size={21}/></div><div><strong>Can I run the pump longer?</strong><p>Compare daily energy demand against estimated usable battery energy.</p></div></div><a className="text-link" href="#advisor">Explore with GridMind <span>↗</span></a></section>
        </div>
        <Advisor/>
        <footer>GRIDMIND · EARLY DEMO <span>Estimates are not electrical safety certification.</span></footer>
      </div>
    </section>
  </main>;
}