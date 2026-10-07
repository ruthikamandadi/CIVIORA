import { useNavigate } from 'react-router-dom';
import { MOCK_ISSUES, ANALYTICS_DATA } from '../../data/mockData';
import { StatCard, StatusBadge, PriorityBadge } from '../../components/common/index.jsx';

export default function AuthorityDashboard({ user }) {
  const navigate = useNavigate();
  const name = user?.name || 'Authority';

  const stats = {
    total: MOCK_ISSUES.length,
    high: MOCK_ISSUES.filter(i => i.priority >= 80).length,
    inProgress: MOCK_ISSUES.filter(i => i.status === 'in_progress').length,
    awaitingVerification: MOCK_ISSUES.filter(i => i.status === 'awaiting_verification').length,
    resolved: MOCK_ISSUES.filter(i => i.status === 'resolved').length,
    reopened: MOCK_ISSUES.filter(i => i.status === 'reopened').length,
  };

  const highPriority = MOCK_ISSUES.filter(i => i.priority >= 85 && i.status !== 'resolved').slice(0, 5);
  const recentActivity = MOCK_ISSUES.slice(0, 6);

  return (
    <div className="page-content fade-in">
      <div className="page-header">
        <div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500, marginBottom: 4 }}>Authority Dashboard</div>
          <h1 className="page-title">{name} 🏛️</h1>
          <p className="page-subtitle">Municipal Civic Intelligence Overview</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/authority/map')}>🗺️ View Map</button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/authority/issues')}>📋 All Issues</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid-3" style={{ marginBottom: 24 }}>
        <StatCard icon="📋" value={stats.total} label="Total Issues" color="#1e40af" change="+12 today" />
        <StatCard icon="🚨" value={stats.high} label="High Priority" color="#dc2626" change="+3 critical" />
        <StatCard icon="🔧" value={stats.inProgress} label="In Progress" color="#ea580c" />
        <StatCard icon="⏳" value={stats.awaitingVerification} label="Awaiting Verification" color="#ca8a04" />
        <StatCard icon="✅" value={stats.resolved} label="Resolved" color="#16a34a" change="+5 today" />
        <StatCard icon="🔄" value={ANALYTICS_DATA.resolutionQuality + '%'} label="Resolution Quality" color="#7c3aed" />
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        {/* High Priority Issues */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div className="section-title">🚨 High Priority Issues</div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/authority/issues')}>View All →</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {highPriority.map(issue => (
              <div
                key={issue.id}
                className="card"
                style={{ padding: 14, cursor: 'pointer' }}
                onClick={() => navigate(`/citizen/issue/${issue.id}`)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{issue.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                      {issue.id} · {issue.location?.area}
                    </div>
                    <div style={{ marginTop: 6, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <StatusBadge status={issue.status} />
                      {issue.fusedReports?.length > 1 && (
                        <span style={{ fontSize: 11, color: 'var(--purple)', fontWeight: 600 }}>🔗 {issue.fusedReports.length} fused</span>
                      )}
                    </div>
                  </div>
                  <PriorityBadge score={issue.priority} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Quick stats */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: 16 }}>📊 Today's Summary</div>
            {[
              { label: 'New Reports Today', value: 12, color: 'var(--primary)' },
              { label: 'Assignments Made', value: 8, color: 'var(--orange)' },
              { label: 'Issues Resolved Today', value: 5, color: 'var(--success)' },
              { label: 'Citizen Verifications', value: 14, color: 'var(--purple)' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{s.label}</span>
                <span style={{ fontWeight: 700, color: s.color }}>{s.value}</span>
              </div>
            ))}
          </div>

          {/* Department performance */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: 14 }}>🏛️ Department Activity</div>
            {ANALYTICS_DATA.deptPerformance.map(dept => (
              <div key={dept.dept} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                  <span style={{ fontWeight: 500 }}>{dept.dept}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{dept.quality}% quality</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${dept.quality}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: 12 }}>⚡ Quick Actions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: '📋 Manage All Issues', path: '/authority/issues' },
                { label: '📌 Issue Assignments', path: '/authority/assignments' },
                { label: '📊 Analytics Dashboard', path: '/authority/analytics' },
                { label: '🔥 Hotspot Prediction', path: '/authority/hotspots' },
                { label: '⚠️ Early Warning Center', path: '/authority/early-warning' },
                { label: '✅ Decision Center', path: '/authority/decision-center' },
              ].map(a => (
                <button
                  key={a.label}
                  className="btn btn-outline"
                  style={{ justifyContent: 'flex-start', width: '100%' }}
                  onClick={() => navigate(a.path)}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
