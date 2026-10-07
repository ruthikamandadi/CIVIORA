import { useState } from 'react';
import { MOCK_ISSUES, CATEGORIES, HOTSPOT_DATA } from '../../data/mockData';
import { StatusBadge, PriorityBadge } from '../../components/common/index.jsx';
import { useNavigate } from 'react-router-dom';

// Fake map with issue markers
function MapCanvas({ issues, hotspots, mode, selectedId, onSelect }) {
  // Normalize lat/lng to canvas positions
  const bounds = {
    minLat: 12.9, maxLat: 17.8,
    minLng: 78.0, maxLng: 83.4,
  };

  function toXY(lat, lng, w = 700, h = 400) {
    const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * w;
    const y = h - ((lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * h;
    return { x, y };
  }

  const catColors = {
    road: '#ef4444', garbage: '#f97316', streetlight: '#eab308',
    water: '#3b82f6', drainage: '#6366f1', toilet: '#8b5cf6',
    traffic: '#ec4899', other: '#14b8a6',
  };

  return (
    <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', background: 'linear-gradient(135deg, #e0f7fa, #b2ebf2)', borderRadius: 12, overflow: 'hidden', border: '1px solid #80deea' }}>
      {/* Grid lines */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Map label */}
      <div style={{ position: 'absolute', top: 12, left: 16, background: 'rgba(255,255,255,0.9)', padding: '4px 12px', borderRadius: 100, fontSize: 12, fontWeight: 600, color: 'var(--primary)' }}>
        🗺️ {mode === 'hotspot' ? 'Predictive Hotspot Map' : 'Civic Issues Map'} – South India Region
      </div>

      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 700 400">
        {/* Draw connectors for fused issues */}
        {issues.filter(i => i.fusedReports?.length > 1).map(issue => {
          const { x, y } = toXY(issue.location.lat, issue.location.lng);
          return (
            <circle key={`ring-${issue.id}`} cx={x} cy={y} r={14} fill="none" stroke="#6366f1" strokeWidth={2} strokeDasharray="4 2" opacity={0.6} />
          );
        })}

        {/* Issue markers */}
        {mode !== 'hotspot' && issues.map(issue => {
          const { x, y } = toXY(issue.location.lat, issue.location.lng);
          const color = catColors[issue.category] || '#64748b';
          const size = issue.priority >= 90 ? 12 : issue.priority >= 75 ? 10 : 8;
          const isSelected = selectedId === issue.id;

          return (
            <g key={issue.id} onClick={() => onSelect(issue.id)} style={{ cursor: 'pointer' }}>
              {isSelected && (
                <circle cx={x} cy={y} r={size + 6} fill={color} opacity={0.2} />
              )}
              <circle cx={x} cy={y} r={size} fill={color} opacity={0.9} stroke="white" strokeWidth={2} />
              {issue.priority >= 90 && (
                <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle" fontSize={8} fill="white" fontWeight="bold">!</text>
              )}
            </g>
          );
        })}

        {/* Hotspot markers */}
        {mode === 'hotspot' && hotspots.map(hs => {
          const { x, y } = toXY(hs.lat, hs.lng);
          const opacity = hs.riskLevel / 100;
          const r = 20 + (hs.riskLevel / 100) * 30;

          return (
            <g key={hs.id} onClick={() => onSelect(hs.id)} style={{ cursor: 'pointer' }}>
              <circle cx={x} cy={y} r={r} fill="#ef4444" opacity={opacity * 0.3} />
              <circle cx={x} cy={y} r={12} fill="#ef4444" opacity={0.9} stroke="white" strokeWidth={2} />
              <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle" fontSize={8} fill="white" fontWeight="bold">⚠</text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div style={{ position: 'absolute', bottom: 12, left: 12, background: 'rgba(255,255,255,0.9)', padding: '8px 12px', borderRadius: 8, fontSize: 11, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {mode !== 'hotspot' ? (
          Object.entries(catColors).slice(0, 4).map(([cat, color]) => (
            <span key={cat} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, display: 'inline-block' }} />
              {cat}
            </span>
          ))
        ) : (
          <span>🔴 Larger circle = higher risk</span>
        )}
      </div>
    </div>
  );
}

export default function CivicMap() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('issues'); // 'issues' | 'hotspot'
  const [selectedId, setSelectedId] = useState(null);
  const [catFilter, setCatFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = MOCK_ISSUES.filter(i =>
    (!catFilter || i.category === catFilter) &&
    (!statusFilter || i.status === statusFilter)
  );

  const selected = mode === 'hotspot'
    ? HOTSPOT_DATA.find(h => h.id === selectedId)
    : MOCK_ISSUES.find(i => i.id === selectedId);

  return (
    <div className="page-content fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">🗺️ Civic Map</h1>
          <p className="page-subtitle">Explore all reported issues and hotspots across the region.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            className={`btn ${mode === 'issues' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => { setMode('issues'); setSelectedId(null); }}
          >
            📍 Issues Map
          </button>
          <button
            className={`btn ${mode === 'hotspot' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => { setMode('hotspot'); setSelectedId(null); }}
          >
            🔥 Hotspot Mode
          </button>
        </div>
      </div>

      {/* Filters (only in issues mode) */}
      {mode === 'issues' && (
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
          <select className="form-input form-select" style={{ width: 160 }} value={catFilter} onChange={e => setCatFilter(e.target.value)}>
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
          <select className="form-input form-select" style={{ width: 160 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            {['reported','assigned','in_progress','awaiting_verification','resolved'].map(s => (
              <option key={s} value={s}>{s.replace(/_/g,' ')}</option>
            ))}
          </select>
          <span style={{ fontSize: 13, color: 'var(--text-muted)', alignSelf: 'center' }}>
            Showing {filtered.length} issues
          </span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' }}>
        {/* Map */}
        <div>
          <MapCanvas
            issues={filtered}
            hotspots={HOTSPOT_DATA}
            mode={mode}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
          {mode === 'hotspot' && (
            <div className="alert alert-warning" style={{ marginTop: 12 }}>
              ⚠️ <strong>Prototype Prediction</strong> – Hotspot areas are identified using historical issue patterns and recurrence analysis. This is not based on real-time ML inference.
            </div>
          )}
        </div>

        {/* Side Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {selected ? (
            mode === 'hotspot' ? (
              <div className="card" style={{ border: '2px solid #fca5a5', background: '#fef2f2' }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--danger)', marginBottom: 12 }}>
                  🔥 Hotspot – {selected.area}
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--danger)' }}>{selected.riskLevel}%</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Risk Score</div>
                </div>
                <div className="progress-bar" style={{ marginBottom: 12 }}>
                  <div className="progress-fill" style={{ width: `${selected.riskLevel}%`, background: 'var(--danger)' }} />
                </div>
                {[
                  { label: 'Likely Issue', value: selected.likelyIssue },
                  { label: 'Historical Issues', value: selected.historicalIssues },
                  { label: 'Reason', value: selected.reason },
                ].map(r => (
                  <div key={r.label} style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{r.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{r.value}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card">
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{selected.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>{selected.id} · {selected.location?.area}</div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                  <StatusBadge status={selected.status} />
                  <PriorityBadge score={selected.priority} />
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 12 }}>
                  {selected.description?.slice(0, 100)}...
                </p>
                {selected.fusedReports?.length > 1 && (
                  <div style={{ fontSize: 12, color: 'var(--purple)', fontWeight: 600, marginBottom: 8 }}>
                    🔗 {selected.fusedReports.length} reports fused
                  </div>
                )}
                <button className="btn btn-primary btn-sm" onClick={() => navigate(`/citizen/issue/${selected.id}`)}>
                  View Full Details →
                </button>
              </div>
            )
          ) : (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>👆</div>
              Click a marker on the map to view issue details.
            </div>
          )}

          {/* List below */}
          <div style={{ maxHeight: 400, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(mode === 'issues' ? filtered : HOTSPOT_DATA).slice(0, 8).map(item => (
              <div
                key={item.id}
                className="card"
                style={{ padding: 12, cursor: 'pointer', background: selectedId === item.id ? '#eff6ff' : 'var(--surface)' }}
                onClick={() => setSelectedId(item.id)}
              >
                <div style={{ fontWeight: 600, fontSize: 13 }}>
                  {mode === 'issues' ? item.title : item.area}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                  {mode === 'issues' ? item.location?.area : `Risk: ${item.riskLevel}%`}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
