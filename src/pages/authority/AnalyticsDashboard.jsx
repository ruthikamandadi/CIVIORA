import { ANALYTICS_DATA } from '../../data/mockData';

// Simple bar chart component (no external library)
function BarChart({ data, xKey, yKey, color = 'var(--primary)', label }) {
  const max = Math.max(...data.map(d => d[yKey]));
  return (
    <div>
      {label && <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: 'var(--text-muted)' }}>{label}</div>}
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 120 }}>
        {data.map(d => (
          <div key={d[xKey]} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>{d[yKey]}</div>
            <div style={{
              width: '100%',
              height: `${(d[yKey] / max) * 100}px`,
              background: color,
              borderRadius: '4px 4px 0 0',
              minHeight: 4,
              transition: 'height 0.5s',
            }} />
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{d[xKey]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Dual bar chart for monthly trend
function DualBarChart({ data }) {
  const maxVal = Math.max(...data.flatMap(d => [d.reported, d.resolved]));
  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
          <span style={{ width: 12, height: 12, background: '#3b82f6', borderRadius: 3, display: 'inline-block' }} />
          Reported
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
          <span style={{ width: 12, height: 12, background: '#22c55e', borderRadius: 3, display: 'inline-block' }} />
          Resolved
        </span>
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', height: 140 }}>
        {data.map(d => (
          <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', width: '100%' }}>
              <div style={{
                flex: 1,
                height: `${(d.reported / maxVal) * 110}px`,
                background: '#3b82f6',
                borderRadius: '3px 3px 0 0',
                minHeight: 4,
              }} />
              <div style={{
                flex: 1,
                height: `${(d.resolved / maxVal) * 110}px`,
                background: '#22c55e',
                borderRadius: '3px 3px 0 0',
                minHeight: 4,
              }} />
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{d.month}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Donut/ring metric
function CircleMetric({ value, label, color }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: 80, height: 80, borderRadius: '50%',
        background: `conic-gradient(${color} ${value * 3.6}deg, var(--border) 0)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 8px',
        position: 'relative',
      }}>
        <div style={{
          width: 60, height: 60, borderRadius: '50%',
          background: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, fontSize: 16, color,
        }}>
          {value}%
        </div>
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>{label}</div>
    </div>
  );
}

export default function AnalyticsDashboard() {
  const d = ANALYTICS_DATA;

  return (
    <div className="page-content fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">📊 Analytics Dashboard</h1>
          <p className="page-subtitle">Resolution quality metrics, trends, and civic performance indicators.</p>
        </div>
      </div>

      {/* Resolution Quality Metrics */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <div className="card-title">🏆 Resolution Quality Overview</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Not just "closed" – truly resolved</div>
        </div>
        <div style={{ display: 'flex', gap: 32, justifyContent: 'space-around', flexWrap: 'wrap', padding: '8px 0' }}>
          <CircleMetric value={d.resolutionQuality} label="Resolution Quality Score" color="#1e40af" />
          <CircleMetric value={d.firstTimeResolution} label="First-Time Resolution" color="#16a34a" />
          <CircleMetric value={d.citizenVerified} label="Citizen Verified" color="#7c3aed" />
          <CircleMetric value={d.reopened} label="Reopened (Failed)" color="#dc2626" />
          <CircleMetric value={d.recurringIssues} label="Recurring Issues" color="#ea580c" />
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        {/* Monthly Trend */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">📈 Monthly Trend</div>
          </div>
          <DualBarChart data={d.monthlyTrend} />
        </div>

        {/* Top Categories */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">📌 Issues by Category</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {d.topCategories.map(cat => (
              <div key={cat.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                  <span>{cat.name}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{cat.count} ({cat.pct}%)</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${cat.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department Performance */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <div className="card-title">🏛️ Department Performance</div>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Department</th>
                <th>Issues Resolved</th>
                <th>Avg Resolution (Days)</th>
                <th>Quality Score</th>
                <th>Performance</th>
              </tr>
            </thead>
            <tbody>
              {d.deptPerformance.map(dept => (
                <tr key={dept.dept}>
                  <td style={{ fontWeight: 600 }}>{dept.dept}</td>
                  <td>{dept.resolved}</td>
                  <td>{dept.avgDays} days</td>
                  <td>
                    <span style={{
                      fontWeight: 700,
                      color: dept.quality >= 88 ? 'var(--success)' : dept.quality >= 80 ? 'var(--orange)' : 'var(--danger)'
                    }}>
                      {dept.quality}%
                    </span>
                  </td>
                  <td style={{ width: 150 }}>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{
                        width: `${dept.quality}%`,
                        background: dept.quality >= 88 ? 'var(--success)' : dept.quality >= 80 ? 'var(--orange)' : 'var(--danger)',
                      }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid-4">
        {[
          { label: 'Total Reports', value: d.totalReports.toLocaleString(), icon: '📋', color: '#1e40af' },
          { label: 'Resolved', value: d.resolved.toLocaleString(), icon: '✅', color: '#16a34a' },
          { label: 'Active Issues', value: d.active.toLocaleString(), icon: '🔄', color: '#ea580c' },
          { label: 'Avg Resolution', value: `${d.avgResolutionDays} days`, icon: '⏱️', color: '#7c3aed' },
        ].map(s => (
          <div key={s.label} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontWeight: 800, fontSize: 24, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
