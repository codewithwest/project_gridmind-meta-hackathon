"use client";

import { useMemo, useState } from "react";
import {
  Activity, AlertTriangle, BatteryCharging, CheckCircle2, Cloud, Droplets,
  Gauge, Info, Play, RotateCcw, Sun, Zap,
} from "lucide-react";

const fmt = (value: number, digits = 0) => value.toLocaleString(undefined, { maximumFractionDigits: digits, minimumFractionDigits: digits });

export function SystemDesigner() {
  const [solarWatts, setSolarWatts] = useState(1300);
  const [startWatts, setStartWatts] = useState(3500);
  const [inverterEfficiency, setInverterEfficiency] = useState(92);
  const [batteryVoltage, setBatteryVoltage] = useState(25.6);
  const [bmsContinuous, setBmsContinuous] = useState(100);
  const [bmsPeak, setBmsPeak] = useState(120);
  const [inverterSurge, setInverterSurge] = useState(7200);
  const [sunHours, setSunHours] = useState(5.5);
  const [pvEfficiency, setPvEfficiency] = useState(88);
  const [pumpHours, setPumpHours] = useState(1);
  const [cloudy, setCloudy] = useState(false);
  const [running, setRunning] = useState(false);

  const result = useMemo(() => {
    const dcDemand = startWatts / Math.max(0.5, inverterEfficiency / 100);
    const batteryWatts = Math.max(0, dcDemand - solarWatts);
    const batteryAmps = batteryWatts / Math.max(1, batteryVoltage);
    const dailySolar = 1.65 * sunHours * pvEfficiency / 100;
    const dailyDemand = 0.6 + 0.8 + 1.2 * pumpHours;
    const dailyBalance = dailySolar - dailyDemand;
    const continuousMargin = bmsContinuous - batteryAmps;
    const nearLimit = batteryAmps >= bmsContinuous * 0.9;
    return { dcDemand, batteryWatts, batteryAmps, dailySolar, dailyDemand, dailyBalance, continuousMargin, nearLimit, inverterSurgeOk: startWatts <= inverterSurge };
  }, [solarWatts, startWatts, inverterEfficiency, batteryVoltage, bmsContinuous, inverterSurge, sunHours, pvEfficiency, pumpHours]);

  const critical = result.batteryAmps > bmsPeak;
  const elevated = result.batteryAmps > bmsContinuous;
  const setCloud = (value: boolean) => {
    setCloudy(value);
    setSolarWatts(value ? 500 : 1300);
    setRunning(value);
  };

  return <main className="designer-page">
    <header className="designer-top">
      <div><a className="designer-back" href="/">← Back to overview</a><div className="section-kicker">GRIDMIND / SYSTEM DESIGNER</div><h1>Design it. <span>Stress-test it.</span></h1><p>Explore your proposed solar borehole system in a 3D-style workspace and simulate the electrical constraints before installation.</p></div>
      <div className="designer-status"><span/> SIMULATION MODEL · ESTIMATES</div>
    </header>

    <section className="designer-scene-card">
      <div className="scene-heading"><div><span className="section-kicker">01 / SYSTEM LAYOUT</span><h2>Daytime borehole configuration</h2></div><div className="scene-legend"><span><i className="legend-solar"/> DC solar</span><span><i className="legend-battery"/> Battery DC</span><span><i className="legend-load"/> AC load</span></div></div>
      <div className={"isometric-scene " + (running ? "is-running" : "")}>
        <div className="scene-sun"><Sun size={30}/><span>{cloudy ? "Cloud passing" : "Solar active"}</span></div>
        <div className="scene-ground"/>
        <div className="scene-panels">
          {[0,1,2].map((item) => <div className="panel-3d" key={item}><div className="panel-grid">{Array.from({length:12},(_,i)=><i key={i}/>)}</div><div className="panel-leg"/></div>)}
          <span className="scene-label panel-label">3 × 550W PV array <b>1.65 kWp</b></span>
        </div>
        <div className="scene-cable cable-pv"><i/><i/><i/></div>
        <div className="scene-inverter"><div className="inverter-face"><span>GRIDMIND MODEL</span><strong>LUXPOWER</strong><b>GETA · 3.6kW</b><small>24V DC / AC OUTPUT</small><em>{running ? "PUMP START EVENT" : "STANDBY"}</em></div><span className="scene-label inverter-label">Hybrid inverter</span></div>
        <div className="scene-cable cable-battery"><i/><i/><i/></div>
        <div className="scene-battery"><div className="battery-body"><BatteryCharging size={27}/><strong>LiFePO₄</strong><b>24V · 100Ah</b><small>2.56 kWh</small><span>BMS 100A / 120A</span></div><span className="scene-label battery-label">Battery bank</span></div>
        <div className="scene-cable cable-ac"><i/><i/><i/></div>
        <div className="scene-starter"><div className="starter-body"><span>CARLO GAVAZZI</span><strong>RSBS</strong><small>SOFT STARTER</small></div><span className="scene-label starter-label">Soft starter</span></div>
        <div className="scene-cable cable-pump"><i/><i/><i/></div>
        <div className="scene-pump"><div className="pump-body"><Droplets size={27}/><strong>1.5 HP</strong><small>BOREHOLE PUMP</small></div><span className="scene-label pump-label">Motor load</span></div>
        <div className="scene-flow-caption">{running ? "STARTUP EVENT · DC BUS UNDER LOAD" : "SELECT A SCENARIO TO TRACE POWER FLOW"}</div>
      </div>
      <div className="scene-controls"><button className={!cloudy ? "scene-mode active" : "scene-mode"} onClick={()=>setCloud(false)}><Sun size={15}/> Strong sun</button><button className={cloudy ? "scene-mode active" : "scene-mode"} onClick={()=>setCloud(true)}><Cloud size={15}/> Cloud passes</button><button className="scene-run" onClick={()=>setRunning(!running)}><Play size={14}/>{running ? "Pause event" : "Run pump start"}</button><button className="scene-reset" onClick={()=>{setSolarWatts(1300);setStartWatts(3500);setInverterEfficiency(92);setBatteryVoltage(25.6);setBmsContinuous(100);setBmsPeak(120);setInverterSurge(7200);setSunHours(5.5);setPvEfficiency(88);setPumpHours(1);setCloudy(false);setRunning(false);}}><RotateCcw size={14}/> Reset</button></div>
    </section>

    <section className="simulation-grid">
      <div className="designer-panel">
        <div className="panel-heading"><div><span className="section-kicker">02 / LIVE PARAMETERS</span><h2>Startup conditions</h2></div><Gauge size={19}/></div>
        <Parameter label="PV power available now" value={solarWatts} unit="W" min={0} max={1650} step={25} onChange={setSolarWatts}/>
        <Parameter label="Pump startup AC demand" value={startWatts} unit="W" min={1800} max={5000} step={50} onChange={setStartWatts}/>
        <Parameter label="Inverter efficiency" value={inverterEfficiency} unit="%" min={80} max={98} step={1} onChange={setInverterEfficiency}/>
        <Parameter label="Battery voltage under load" value={batteryVoltage} unit="V" min={22} max={29} step={0.1} onChange={setBatteryVoltage}/>
        <div className="parameter-divider"/>
        <div className="panel-heading"><div><span className="section-kicker">03 / BATTERY LIMITS</span><h2>BMS configuration</h2></div><BatteryCharging size={19}/></div>
        <Parameter label="Continuous discharge limit" value={bmsContinuous} unit="A" min={50} max={200} step={5} onChange={setBmsContinuous}/>
        <Parameter label="Peak discharge limit" value={bmsPeak} unit="A" min={50} max={250} step={5} onChange={setBmsPeak}/>
        <Parameter label="Inverter surge capability" value={inverterSurge} unit="W" min={3600} max={12000} step={100} onChange={setInverterSurge}/>
        <div className="parameter-divider"/>
        <div className="panel-heading"><div><span className="section-kicker">04 / DAILY ENERGY</span><h2>Operating assumptions</h2></div><Sun size={19}/></div>
        <Parameter label="Peak sun hours" value={sunHours} unit="h" min={2} max={8} step={0.25} onChange={setSunHours}/>
        <Parameter label="PV system efficiency" value={pvEfficiency} unit="%" min={60} max={95} step={1} onChange={setPvEfficiency}/>
        <Parameter label="Pump runtime per day" value={pumpHours} unit="h" min={0} max={6} step={0.25} onChange={setPumpHours}/>
      </div>

      <div className="designer-results">
        <div className="designer-panel result-panel">
          <div className="panel-heading"><div><span className="section-kicker">05 / CALCULATED RESPONSE</span><h2>Battery startup stress</h2></div><Activity size={19}/></div>
          <div className="primary-reading"><span>Estimated battery current</span><strong className={critical ? "reading-critical" : elevated ? "reading-warning" : ""}>{fmt(result.batteryAmps,1)} <small>A DC</small></strong><div className="reading-bar"><i style={{width:Math.min(100,result.batteryAmps/Math.max(1,bmsPeak)*100)+"%"}}/></div><div className="reading-scale"><span>0A</span><span>{bmsContinuous}A continuous</span><span>{bmsPeak}A peak</span></div></div>
          <div className="result-metrics"><div><span>DC power required</span><strong>{fmt(result.dcDemand)} W</strong></div><div><span>PV contribution</span><strong>{fmt(solarWatts)} W</strong></div><div><span>Battery supplies</span><strong>{fmt(result.batteryWatts)} W</strong></div><div><span>Continuous headroom</span><strong className={result.continuousMargin < 0 ? "reading-warning" : ""}>{fmt(result.continuousMargin,1)} A</strong></div><div><span>Inverter surge check</span><strong className={result.inverterSurgeOk ? "" : "reading-warning"}>{result.inverterSurgeOk ? "Within rating" : "Above rating"}</strong></div></div>
          <div className={"engineering-alert " + (critical ? "alert-critical" : elevated ? "alert-warning" : "alert-ok")}>
            {critical ? <AlertTriangle size={18}/> : elevated ? <AlertTriangle size={18}/> : <CheckCircle2 size={18}/>}
            <div><strong>{critical ? "Above configured peak BMS limit" : elevated ? "Above continuous BMS limit" : "Within configured BMS limits"}</strong><p>{critical ? "The estimated current exceeds the configured peak rating. Do not treat this configuration as acceptable without verified manufacturer data and professional review." : elevated ? "The estimate is above continuous rating. Peak duration and BMS overload curve must be checked against the battery manual." : "The simplified estimate is below both configured current limits. This does not establish that the battery, inverter or motor startup is compatible."}</p></div>
          </div>
        </div>

        <div className="designer-panel daily-panel">
          <div className="panel-heading"><div><span className="section-kicker">06 / DAILY ENERGY BALANCE</span><h2>Solar vs demand</h2></div><Zap size={19}/></div>
          <div className="daily-balance"><div><span>Estimated PV yield</span><strong>{fmt(result.dailySolar,2)} <small>kWh/day</small></strong></div><div><span>Estimated daily demand</span><strong>{fmt(result.dailyDemand,2)} <small>kWh/day</small></strong></div></div>
          <div className="balance-track"><i style={{width:Math.min(100,result.dailyDemand/Math.max(0.01,result.dailySolar)*100)+"%"}}/></div>
          <div className="balance-footer"><span>Net daily energy</span><strong className={result.dailyBalance < 0 ? "reading-warning" : ""}>{result.dailyBalance >= 0 ? "+" : ""}{fmt(result.dailyBalance,2)} kWh</strong></div>
          <p className="result-footnote">Demand assumes 0.6 kWh/day for the fridge, 0.8 kWh/day idle consumption, and 1.2 kWh per pump runtime hour. Solar yield uses the entered peak-sun-hours and efficiency assumptions.</p>
        </div>
      </div>
    </section>

    <section className="designer-panel warnings-panel">
      <div className="panel-heading"><div><span className="section-kicker">07 / ENGINEERING REVIEW</span><h2>Recommendations & warnings</h2></div><span className="review-label">INPUT-BASED CHECKS</span></div>
      <div className="warning-list">
        <Warning severity={critical ? "critical" : elevated || result.nearLimit ? "warning" : "success"} title={critical ? "Battery peak current exceeded" : elevated ? "Battery continuous current exceeded" : result.nearLimit ? "Battery current has little headroom" : "Estimated startup current within configured limits"} text={critical ? "Estimated battery current is above the entered peak BMS limit. Validate with the exact battery discharge curve and inverter data." : elevated ? "Estimated battery current exceeds the continuous BMS rating. Confirm the permitted peak duration and recovery requirements." : result.nearLimit ? "The estimate is within 10% of the continuous BMS limit. Small PV dips or battery-voltage sag could push it over the limit." : "This simplified estimate is below the entered limits; verify the manufacturer's transient-current specifications."}/>
        <Warning severity={result.inverterSurgeOk ? "info" : "critical"} title={result.inverterSurgeOk ? "Startup power below entered inverter surge rating" : "Startup power exceeds inverter surge rating"} text={result.inverterSurgeOk ? "The entered startup wattage is below the configured surge rating. Confirm surge duration, motor power factor and inverter overload curve." : "The entered motor startup wattage exceeds the configured inverter surge capability. Verify the actual motor-start profile and inverter overload specification."}/>
        <Warning severity="warning" title="PV string compatibility not checked" text="Three panels in series must be checked against inverter maximum PV open-circuit voltage, MPPT range and input current, including cold-weather voltage rise."/>
        <Warning severity="warning" title="Soft-starter and motor match unverified" text="Confirm the exact RSBS variant, pump phase, motor full-load current, starting method and manufacturer-approved application. A ramp-time dial alone does not prove a 50–60% current reduction."/>
        <Warning severity="warning" title="Protection and cable sizing not validated" text="Breaker/fuse ratings, DC interrupt rating, cable ampacity, voltage drop, earthing, isolation and fault protection require a qualified design for the actual installation."/>
        <Warning severity="info" title="Daily energy surplus is not a startup guarantee" text="A positive daily kWh balance does not prove sufficient instantaneous power. Cloud transients, battery voltage sag, inverter limits and motor power factor still matter."/>
      </div>
    </section>
    <footer className="designer-footer">GRIDMIND SYSTEM DESIGNER <span>Conceptual simulation only · Not an electrical design, compliance certificate or equipment-control system.</span></footer>
  </main>;
}

function Parameter({label,value,unit,min,max,step,onChange}:{label:string;value:number;unit:string;min:number;max:number;step:number;onChange:(value:number)=>void}) {
  return <label className="parameter"><span>{label}<b>{fmt(value,step<1?2:0)} {unit}</b></span><input type="range" min={min} max={max} step={step} value={value} onChange={event=>onChange(Number(event.target.value))}/></label>;
}
function Warning({severity,title,text}:{severity:"critical"|"warning"|"success"|"info";title:string;text:string}) {
  const Icon = severity==="success" ? CheckCircle2 : severity==="info" ? Info : AlertTriangle;
  return <div className={"warning-item warning-"+severity}><Icon size={18}/><div><strong>{title}</strong><p>{text}</p></div></div>;
}
