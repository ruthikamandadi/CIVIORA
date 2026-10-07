import { useNavigate } from 'react-router-dom';
import { StatCard, IssueCard, StatusBadge, PriorityBadge } from '../../components/common/index.jsx';
import { MOCK_ISSUES, MOCK_USER } from '../../data/mockData';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { FilePlus, Map, Bell, TrendingUp, AlertTriangle, CheckCircle, Clock, Trophy, Sparkles, Users, Route } from 'lucide-react';

export default function CitizenDashboard({ user }) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const name = user?.name || 'Citizen';

  const myIssues = MOCK_ISSUES.slice(0, 5);
  const activeCount = myIssues.filter(i => !['resolved'].includes(i.status)).length;
  const resolvedCount = myIssues.filter(i => i.status === 'resolved').length;
  const awaitingCount = myIssues.filter(i => i.status === 'awaiting_verification').length;
  const nearbyIssues = MOCK_ISSUES.filter(i => i.priority >= 80 && i.status !== 'resolved').slice(0, 3);

  const quickActions = [
    { icon: <FilePlus size={20} />, label: t('reportIssue'), path: '/citizen/report', color: '#1e40af' },
    { icon: <AlertTriangle size={20} />, label: t('urgentHazard'), path: '/citizen/urgent-hazard', color: '#ef4444' },
    { icon: <Map size={20} />, label: t('nearbyAlerts'), path: '/citizen/alerts', color: '#0ea5e9' },
    { icon: <Bell size={20} />, label: t('services'), path: '/citizen/services', color: '#16a34a' },
    { icon: <Route size={20} />, label: t('safeRoute'), path: '/citizen/safe-route', color: '#7c3aed' },
    { icon: <Users size={20} />, label: t('neighborhoodPulse'), path: '/citizen/pulse', color: '#0ea5e9' },
  ];

  return (
    <div className="page-content fade-in">
      <div className="page-header">
        <div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4 }}>
            {t('goodMorning')}, {name}
          </div>
          <h1 className="page-title">{t('civioraToday')} 👋</h1>
          <p className="page-subtitle">Here’s what needs attention in your area today.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/citizen/report')}>
          <FilePlus size={16} />
          {t('reportNewIssue')}
        </button>
      </div>

      <div className="card" style={{ marginBottom: 24, background: 'linear-gradient(135deg, #f8fafc, #edf4ff)', border: '1px solid #bfdbfe' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 12 }}>
          {[
            { label: '2 high-risk issues nearby', icon: '⚠️' },
            { label: '1 report needs your verification', icon: '📋' },
            { label: '3 report updates', icon: '🔔' },
            { label: '1 civic obstruction nearby', icon: '🚧' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, borderRadius: 12, background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(148, 163, 184, 0.2)' }}>
              <span style={{ fontSize: 22 }}>{item.icon}</span>
              <span style={{ fontWeight: 600, color: 'var(--text)', fontSize: 13 }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: 28 }}>
        <StatCard icon={<FilePlus size={22} />} value={MOCK_USER.reportsSubmitted} label="Total Reports" color="#1e40af" change="+2 this month" />
        <StatCard icon={<CheckCircle size={22} />} value={resolvedCount} label="Resolved" color="#16a34a" change="+1 this week" />
        <StatCard icon={<Clock size={22} />} value={awaitingCount} label="Awaiting Verification" color="#ca8a04" />
        <StatCard icon={<TrendingUp size={22} />} value={activeCount} label="Active Issues" color="#7c3aed" />
      </div>

      <div className="alert alert-info" style={{ marginBottom: 24 }}>
        <span>📡</span>
        <span><strong>Offline Mode Available</strong> – Reports can be saved locally and synced when you reconnect.</span>
      </div>

      <div className="grid-2 dashboard-grid" style={{ alignItems: 'start' }}>
        {/* My Recent Reports */}
        <div>
          <div className="section-header">
            <div className="section-title">📋 My Recent Reports</div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/citizen/my-reports')}>
              View All →
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {myIssues.slice(0, 3).map(issue => (
              <IssueCard
                key={issue.id}
                issue={issue}
                onClick={() => navigate(`/citizen/issue/${issue.id}`)}
              />
            ))}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Priority Issues Nearby */}
          <div>
            <div className="section-header">
              <div className="section-title">⚠️ High-Priority Issues Nearby</div>
              <div className="section-subtitle">Issues needing urgent attention in your area</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {nearbyIssues.map(issue => (
                <div
                  key={issue.id}
                  className="card"
                  style={{ cursor: 'pointer', padding: 16 }}
                  onClick={() => navigate(`/citizen/issue/${issue.id}`)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{issue.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                        {issue.location?.area}
                      </div>
                    </div>
                    <PriorityBadge score={issue.priority} />
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <StatusBadge status={issue.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <div className="section-header">
              <div className="section-title">Quick Actions</div>
            </div>
            <div className="quick-actions-grid">
              {quickActions.map(action => (
                <button
                  key={action.label}
                  className="card"
                  style={{ cursor: 'pointer', textAlign: 'center', padding: 14, border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, minHeight: 110 }}
                  onClick={() => navigate(action.path)}
                >
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: action.color + '15', color: action.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {action.icon}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3 }}>{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Impact Summary */}
          <div className="card" style={{ background: 'linear-gradient(135deg, #eff6ff, #e0f2fe)', border: '1px solid #bfdbfe' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', marginBottom: 8 }}>
              🌟 Your Civic Impact
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              {MOCK_USER.impact}
            </p>
            <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: 20 }}>{MOCK_USER.reportsSubmitted}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Reports</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 800, color: 'var(--success)', fontSize: 20 }}>{MOCK_USER.issuesResolved}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Resolved</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 800, color: 'var(--purple)', fontSize: 20 }}>{MOCK_USER.verificationContributions}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Verifications</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
