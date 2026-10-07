import { useState } from 'react';
import { HOTSPOT_DATA, CATEGORIES } from '../../data/mockData';

// Risk gauge indicator
function RiskGauge({ value }) {
  const color = value >= 80 ? '#dc2626' : value >= 65 ? '#ea580c' : '#ca8a04';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: 56, height: 56, borderRadius: '50%',
        background: `conic-gradient(${color} ${value * 3.6}deg, #e2e8f0 0)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <div style={{
          width: 42, height: 42, borderRadius: '50%', background: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, fontSize: 14, color,
        }}>
          {value}%
        </div>
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Risk Score</div>
        <div style={{ fontSize: 13, fontWeight: 700, color }}>
          {value >= 80 ? '🔴 High Risk' : value >= 65 ? '🟠 Medium Risk' : '🟡 Moderate Risk'}
        </div>
      </div>
    </div>
  );
}

// Predictive map
function HotspotMapCanvas({ hotspots, selectedId, onSelect }) {
  const bounds = { minLat: 12.9, maxLat: 17.8, minLng: 78.0, maxLng: 83.4 };

  function toXY(lat, lng, w = 680, h = 360) {
    const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * w;
    const y = h - ((lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * h;
    return { x, y };
  }

  return (
    <div style={{ position: 'relative', width: '100%', paddingTop: '53%', background: 'linear-gradient(160deg, #fef3f2, #fde8d8, #fef9ec)', borderRadius: 14, overflow: 'hidden', border: '1px solid #fca5a5' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div style={{ position: 'absolute', top: 12, left: 16, background: 'rgba(255,255,255,0.9)', padding: '4px 12px', borderRadius: 100, fontSize: 12, fontWeight: 600, color: 'var(--danger)' }}>
        🔥 Predictive Hotspot Map – South India
      </div>

      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 680 360">
        {hotspots.map(hs => {
          const { x, y } = toXY(hs.lat, hs.lng);
          const r = 16 + (hs.riskLevel / 100) * 30;
          const opacity = 0.2 + (hs.riskLevel / 100) * 0.4;
          const isSelected = selectedId === hs.id;

          return (
            <g key={hs.id} onClick={() => onSelect(hs.id)} style={{ cursor: 'pointer' }}>
              {/* Outer glow */}
              <circle cx={x} cy={y} r={r + 10} fill="#ef4444" opacity={opacity * 0.4} />
              {/* Main hotspot circle */}
              <circle cx={x} cy={y} r={r} fill="#ef4444" opacity={opacity + (isSelected ? 0.2 : 0)} stroke={isSelected ? 'white' : 'none'} strokeWidth={2} />
              {/* Center dot */}
              <circle cx={x} cy={y} r={6} fill="#dc2626" stroke="white" strokeWidth={2} />
              {/* Risk label */}
              <text x={x} y={y - r - 8} textAnchor="middle" fontSize={10} fill="#dc2626" fontWeight="bold">{hs.riskLevel}%</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function HotspotPrediction() {
  const [selectedId, setSelectedId] = useState(HOTSPOT_DATA[0]?.id);
  const selected = HOTSPOT_DATA.find(h => h.id === selectedId);

  return (
    <div className="page-content fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">🔥 Predictive Civic Hotspots</h1>
          <p className="page-subtitle">Areas identified as at-risk for future civic problems based on historical patterns.</p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="alert alert-warning" style={{ marginBottom: 20 }}>
        ⚠️ <strong>Prototype Prediction</strong> – CIVIORA analyzes historical issue patterns, recurrence frequency, and location clustering to identify at-risk areas. This is not based on live machine learning inference. Results are illustrative.
      </div>

      {/* How it works */}
      <div className="card" style={{ marginBottom: 24, background: 'linear-gradient(135deg, #fef3f2, #fde8d8)', border: '1px solid #fca5a5' }}>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 12 }}>🧠 How Hotspot Prediction Works</div>
        <div style={{ display: 'flex', gap: 0, flexWrap: 'wrap' }}>
          {[
            { step: '1', label: 'Historical Analysis', desc: 'Issue history analyzed by location clusters' },
            { step: '2', label: 'Recurrence Pattern', desc: 'Areas with repeated same-category issues flagged' },
            { step: '3', label: 'Root Cause Correlation', desc: 'Unresolved root causes increase risk score' },
            { step: '4', label: 'Risk Score Generated', desc: 'Combined score 0–100% risk prediction' },
          ].map((s, i) => (
            <div key={s.step} style={{ flex: 1, minWidth: 150, padding: '8px 16px', borderRight: i < 3 ? '1px solid #fca5a5' : 'none' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--danger)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Step {s.step}</div>
              <div style={{ fontSize: 13, fontWeight: 700, marginTop: 4 }}>{s.label}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'start' }}>
        {/* Map */}
        <div>
          <HotspotMapCanvas
            hotspots={HOTSPOT_DATA}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>

        {/* Side panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Selected hotspot details */}
          {selected && (
            <div className="card" style={{ border: '2px solid #fca5a5', background: '#fef2f2' }}>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 12 }}>📍 {selected.area}</div>
              <RiskGauge value={selected.riskLevel} />
              <div className="divider" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'Likely Issue Type', value: selected.likelyIssue },
                  { label: 'Historical Issues', value: `${selected.historicalIssues} incidents` },
                  { label: 'Risk Reason', value: selected.reason },
                ].map(r => (
                  <div key={r.label}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{r.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{r.value}</div>
                  </div>
                ))}
              </div>
              <button className="btn btn-danger btn-sm" style={{ marginTop: 12, width: '100%', justifyContent: 'center' }}>
                🚨 Issue Preventive Alert
              </button>
            </div>
          )}

          {/* All hotspots list */}
          {HOTSPOT_DATA.map(hs => {
            const riskColor = hs.riskLevel >= 80 ? '#dc2626' : hs.riskLevel >= 65 ? '#ea580c' : '#ca8a04';
            return (
              <div
                key={hs.id}
                className="card"
                style={{ padding: 14, cursor: 'pointer', background: selectedId === hs.id ? '#fef2f2' : 'var(--surface)', border: selectedId === hs.id ? '2px solid #fca5a5' : '1px solid var(--border)' }}
                onClick={() => setSelectedId(hs.id)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{hs.area}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{hs.likelyIssue}</div>
                  </div>
                  <div style={{
                    padding: '4px 10px', borderRadius: 100, fontSize: 13, fontWeight: 800,
                    background: riskColor + '18', color: riskColor
                  }}>
                    {hs.riskLevel}%
                  </div>
                </div>
                <div className="progress-bar" style={{ marginTop: 8 }}>
                  <div className="progress-fill" style={{ width: `${hs.riskLevel}%`, background: riskColor }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
