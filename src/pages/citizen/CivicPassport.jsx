import { useMemo } from 'react';
import { Award, BadgeCheck, Clock3, Crown, MapPinned, ShieldCheck, Sparkles, Star } from 'lucide-react';

function readStoredMissions() {
  if (typeof window === 'undefined') return [];

  try {
    const stored = window.localStorage.getItem('civicpulse_missions');
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const badgeList = [
  { title: 'First Report', icon: '🧭', color: '#dbeafe', text: '#1d4ed8' },
  { title: 'Neighborhood Watch', icon: '👁️', color: '#dcfce7', text: '#15803d' },
  { title: 'Local Hero', icon: '⭐', color: '#fef3c7', text: '#b45309' },
  { title: 'Community Builder', icon: '🤝', color: '#ede9fe', text: '#6d28d9' },
];

export default function CivicPassport({ user }) {
  const savedMissions = readStoredMissions();
  const currentUser = user || (() => {
    try {
      const stored = JSON.parse(localStorage.getItem('user') || 'null');
      return stored || null;
    } catch {
      return null;
    }
  })();
  const profileName = currentUser?.name || 'Citizen';
  const profileInitials = profileName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || 'C';

  const missionCount = useMemo(
    () => savedMissions.filter((mission) => mission.progress >= 100).length,
    [savedMissions]
  );

  const contributionLevel = missionCount >= 4 ? 'Community Champion' : missionCount >= 2 ? 'Civic Contributor' : 'Active Citizen';
  const reportsContributed = 17 + missionCount * 2;
  const issuesVerified = 9 + missionCount;
  const confirmations = 48 + missionCount * 6;
  const impactPoints = 1840 + missionCount * 220;

  const stats = [
    { label: 'Reports contributed', value: reportsContributed, icon: <MapPinned size={18} />, color: '#1e40af' },
    { label: 'Issues verified', value: issuesVerified, icon: <ShieldCheck size={18} />, color: '#16a34a' },
    { label: 'Community confirmations', value: confirmations, icon: <UsersIcon size={18} />, color: '#7c3aed' },
    { label: 'Missions completed', value: missionCount, icon: <Award size={18} />, color: '#ea580c' },
  ];

  const timeline = [
    { title: 'First issue submitted', detail: 'Reported a streetlight outage in your neighborhood.', date: 'Mar 2024' },
    { title: 'Verification streak', detail: 'Confirmed multiple repaired civic issues for peers.', date: 'Jun 2024' },
    { title: 'Mission milestone', detail: 'Completed active community safety missions in the city.', date: 'Sep 2024' },
  ];

  return (
    <div className="page-content fade-in">
      <div className="page-header">
        <div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4 }}>
            Civic contribution profile
          </div>
          <h1 className="page-title">Civic Contribution Passport</h1>
          <p className="page-subtitle">Your neighborhood footprint, verified by actions and community trust.</p>
        </div>
        <div className="chip" style={{ fontSize: 13, padding: '8px 14px' }}>
          <Crown size={15} />
          {contributionLevel}
        </div>
      </div>

      <div className="passport-shell card">
        <div className="passport-header">
          <div className="passport-profile">
            <div className="passport-avatar">{profileInitials}</div>
            <div>
              <div className="passport-name">{profileName}</div>
              <div className="passport-meta">Citizen ID · CIT-2024-00782</div>
            </div>
          </div>
          <div className="passport-points">
            <div className="passport-points-label">Impact points</div>
            <div className="passport-points-value">{impactPoints}</div>
          </div>
        </div>

        <div className="passport-stat-grid">
          {stats.map((stat) => (
            <div key={stat.label} className="passport-stat-card">
              <div className="passport-stat-icon" style={{ background: `${stat.color}1A`, color: stat.color }}>
                {stat.icon}
              </div>
              <div>
                <div className="passport-stat-value">{stat.value}</div>
                <div className="passport-stat-label">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: 28, alignItems: 'start' }}>
        <div className="card">
          <div className="section-header">
            <div className="section-title">Contribution timeline</div>
          </div>
          <div className="timeline">
            {timeline.map((item, index) => (
              <div key={item.title} className="timeline-item">
                <div className={`timeline-dot ${index < 2 ? 'completed' : 'pending'}`} />
                <div className="timeline-content">
                  <div className="timeline-step">{item.title}</div>
                  <div className="timeline-date">{item.date}</div>
                  <div className="timeline-note">{item.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="section-header">
            <div className="section-title">Achievement badges</div>
          </div>
          <div className="passport-badge-grid">
            {badgeList.map((badge) => (
              <div key={badge.title} className="badge-card" style={{ background: badge.color }}>
                <div className="badge-icon" style={{ color: badge.text }}>{badge.icon}</div>
                <div className="badge-title" style={{ color: badge.text }}>{badge.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function UsersIcon({ size = 18 }) {
  return <UsersIconSvg size={size} />;
}

function UsersIconSvg({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 19v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1" />
      <circle cx="10" cy="7" r="3" />
      <path d="M22 19v-1a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
