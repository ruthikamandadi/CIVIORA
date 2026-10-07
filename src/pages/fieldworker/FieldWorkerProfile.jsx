import { MOCK_USER } from '../../data/mockData';
import { WORKERS } from '../../data/mockData';

export default function FieldWorkerProfile({ user }) {
  const worker = WORKERS[0];
  const displayName = user?.name || 'Field Worker';

  return (
    <div className="page-content fade-in" style={{ maxWidth: 700, margin: '0 auto' }}>
      <div className="page-header">
        <h1 className="page-title">🔧 Worker Profile</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div className="card">
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 20 }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'linear-gradient(135deg, #16a34a, #22c55e)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 800, fontSize: 28, flexShrink: 0,
            }}>
              {displayName[0] || 'F'}
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800 }}>{displayName}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{worker.dept}</div>
              <div style={{ marginTop: 8 }}>
                <span className="badge badge-resolved">🟢 Active Field Worker</span>
              </div>
            </div>
          </div>

          {[
            { label: 'Department', value: worker.dept, icon: '🏛️' },
            { label: 'Contact (masked)', value: worker.phone, icon: '📞' },
            { label: 'Active Tasks', value: `${worker.tasks} tasks`, icon: '📋' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{item.label}</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{item.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-title" style={{ marginBottom: 16 }}>📊 Performance Summary</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[
              { val: 48, label: 'Tasks Completed', color: 'var(--success)', icon: '✅' },
              { val: '4.1', label: 'Avg Days', color: 'var(--primary)', icon: '⏱️' },
              { val: '89%', label: 'Quality Score', color: 'var(--purple)', icon: '⭐' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center', padding: 12, background: 'var(--surface-2)', borderRadius: 10 }}>
                <div style={{ fontSize: 20 }}>{s.icon}</div>
                <div style={{ fontWeight: 900, fontSize: 22, color: s.color }}>{s.val}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
