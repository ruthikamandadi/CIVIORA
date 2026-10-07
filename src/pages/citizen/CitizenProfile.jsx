import { MOCK_USER } from '../../data/mockData';

export default function CitizenProfile({ user }) {
  const profile = { ...MOCK_USER, name: user?.name || 'Citizen', email: user?.email || 'citizen@example.com' };

  return (
    <div className="page-content fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">👤 Citizen Profile</h1>
          <p className="page-subtitle">Your civic identity and contribution summary.</p>
        </div>
      </div>

      <div className="grid-2" style={{ alignItems: 'start', maxWidth: 900 }}>
        {/* Profile Card */}
        <div className="card">
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 24 }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 800, fontSize: 28,
              flexShrink: 0,
            }}>
              {profile.name[0]}
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800 }}>{profile.name}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{profile.email}</div>
              <div style={{ marginTop: 8 }}>
                <span className="badge badge-assigned">✅ Verified Citizen</span>
              </div>
            </div>
          </div>

          {[
            { label: 'Citizen ID', value: profile.citizenId, icon: '🆔' },
            { label: 'Area / Ward', value: profile.area, icon: '📍' },
            { label: 'Joined Date', value: profile.joinedDate, icon: '📅' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{item.label}</div>
                <div style={{ fontSize: 14, fontWeight: 600, marginTop: 1 }}>{item.value}</div>
              </div>
            </div>
          ))}

          <button className="btn btn-outline" style={{ marginTop: 20, width: '100%', justifyContent: 'center' }}>
            ✏️ Edit Profile
          </button>
        </div>

        {/* Contribution & Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Contribution */}
          <div className="card" style={{ background: 'linear-gradient(135deg, #eff6ff, #e0f2fe)', border: '1px solid #bfdbfe' }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--primary)', marginBottom: 12 }}>
              🌟 Your Civic Impact
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 16 }}>
              {profile.impact}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[
                { val: profile.reportsSubmitted, label: 'Reports Submitted', color: 'var(--primary)', icon: '📋' },
                { val: profile.issuesResolved, label: 'Issues Resolved', color: 'var(--success)', icon: '✅' },
                { val: profile.verificationContributions, label: 'Verifications', color: 'var(--purple)', icon: '🔍' },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center', padding: '12px', background: 'white', borderRadius: 10, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 20 }}>{s.icon}</div>
                  <div style={{ fontWeight: 900, fontSize: 24, color: s.color, marginTop: 4 }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Civic Rank */}
          <div className="card">
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>🏅 Civic Contributor Rank</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ fontSize: 36 }}>🥈</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--primary)' }}>Silver Reporter</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Top 15% of citizens in your ward</div>
              </div>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '72%' }} />
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
              72/100 points toward Gold Reporter status
            </div>
          </div>

          {/* Privacy note */}
          <div className="alert alert-info">
            🔒 <strong>Privacy Protected</strong> – Your personal information (phone, address) is never displayed on public dashboards. Only aggregated civic data is shown.
          </div>
        </div>
      </div>
    </div>
  );
}
