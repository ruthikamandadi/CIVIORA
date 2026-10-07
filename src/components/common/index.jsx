import { useState } from 'react';
// Reusable common components for CIVIORA
import { STATUS_LABELS, STATUS_COLORS, CATEGORIES } from '../../data/mockData';
import { getPriorityColor, getPriorityLabel } from '../../utils/priority';

// ===== StatusBadge =====
export function StatusBadge({ status }) {
  return (
    <span className={`badge badge-${status}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}

// ===== PriorityBadge =====
export function PriorityBadge({ score }) {
  const label = getPriorityLabel(score);
  const color = getPriorityColor(score);
  return (
    <span
      className="badge"
      style={{
        background: color + '22',
        color: color,
        border: `1px solid ${color}44`
      }}
    >
      {label} ({score})
    </span>
  );
}

// ===== StatCard =====
export function StatCard({ icon, value, label, change, color = '#1e40af', suffix = '' }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: color + '18', color }}>
        {icon}
      </div>
      <div className="stat-info">
        <div className="stat-value">{value}{suffix}</div>
        <div className="stat-label">{label}</div>
        {change && (
          <div className={`stat-change ${change.startsWith('+') ? 'stat-up' : 'stat-down'}`}>
            {change}
          </div>
        )}
      </div>
    </div>
  );
}

// ===== IssueCard =====
export function IssueCard({ issue, onClick }) {
  const cat = CATEGORIES.find(c => c.id === issue.category);
  return (
    <div
      className="card"
      style={{ cursor: 'pointer' }}
      onClick={onClick}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 24 }}>{cat?.icon || '📌'}</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>{issue.title}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              {issue.id} · {issue.location?.area}
            </div>
          </div>
        </div>
        <PriorityBadge score={issue.priority} />
      </div>

      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12, lineHeight: 1.5 }}>
        {issue.description?.slice(0, 100)}...
      </p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <StatusBadge status={issue.status} />
        <div style={{ display: 'flex', gap: 12 }}>
          {issue.fusedReports?.length > 1 && (
            <span style={{ fontSize: 12, color: 'var(--purple)', fontWeight: 600 }}>
              🔗 {issue.fusedReports.length} reports fused
            </span>
          )}
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            📅 {issue.reportedDate}
          </span>
        </div>
      </div>
    </div>
  );
}

// ===== Timeline =====
export function Timeline({ steps, currentStatus }) {
  const allSteps = [
    'reported', 'ai_analysed', 'fused', 'assigned', 'in_progress',
    'awaiting_verification', 'resolved'
  ];

  const completedSteps = steps?.map(s => s.step) || [];

  return (
    <div className="timeline">
      {allSteps.map(step => {
        const done = completedSteps.includes(step);
        const stepData = steps?.find(s => s.step === step);
        return (
          <div key={step} className="timeline-item">
            <div className={`timeline-dot ${done ? 'completed' : 'pending'}`} />
            <div className="timeline-content">
              <div className="timeline-step" style={{ color: done ? 'var(--text)' : 'var(--text-light)' }}>
                {STATUS_LABELS[step]}
              </div>
              {stepData && (
                <>
                  <div className="timeline-date">{stepData.date}</div>
                  <div className="timeline-note">{stepData.note}</div>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ===== Modal =====
export function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">{title}</div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

// ===== LoadingSpinner =====
export function LoadingSpinner() {
  return (
    <div className="loading-center">
      <div className="spinner" />
    </div>
  );
}

// ===== EmptyState =====
export function EmptyState({ icon = '📭', title = 'Nothing here', desc = '' }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <div className="empty-state-title">{title}</div>
      {desc && <div className="empty-state-desc">{desc}</div>}
    </div>
  );
}

// ===== SearchBar =====
export function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div style={{ position: 'relative' }}>
      <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 16 }}>
        🔍
      </span>
      <input
        className="form-input"
        style={{ paddingLeft: 36 }}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

// ===== FilterBar =====
export function FilterBar({ filters, values, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
      {filters.map(f => (
        <select
          key={f.key}
          className="form-input form-select"
          style={{ width: 'auto', minWidth: 140 }}
          value={values[f.key] || ''}
          onChange={e => onChange(f.key, e.target.value)}
        >
          <option value="">{f.label}</option>
          {f.options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ))}
    </div>
  );
}

// ===== PriorityScore (detailed) =====
export function PriorityScoreCard({ breakdown }) {
  if (!breakdown) return null;
  const { total, factors } = breakdown;
  const color = getPriorityColor(total);

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">⚡ Priority Score</div>
        <div style={{
          fontSize: 28,
          fontWeight: 800,
          color,
        }}>
          {total}<span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-muted)' }}>/100</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {Object.values(factors).map(f => (
          <div key={f.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
              <span style={{ fontWeight: 500 }}>{f.label}</span>
              <span style={{ color: 'var(--text-muted)' }}>{f.score}/{f.max}</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${(f.score / f.max) * 100}%`,
                  background: color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="alert alert-info" style={{ marginTop: 16 }}>
        Priority score is computed from civic impact factors: severity, affected population, recurrence, waiting time, and location risk.
      </div>
    </div>
  );
}

// ===== NotificationCard =====
export function NotificationCard({ notif, onRead }) {
  const typeIcons = {
    assignment: '📋',
    fusion: '🔗',
    verification: '✅',
    hotspot: '⚠️',
    status: '🔄',
    resolved: '🎉',
  };

  return (
    <div
      className="card"
      style={{
        cursor: 'pointer',
        borderLeft: `4px solid ${notif.read ? 'var(--border)' : 'var(--primary)'}`,
        background: notif.read ? 'var(--surface)' : '#eff6ff',
      }}
      onClick={onRead}
    >
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <span style={{ fontSize: 22, flexShrink: 0 }}>{typeIcons[notif.type] || '🔔'}</span>
        <div>
          <p style={{ fontSize: 14, color: 'var(--text)', marginBottom: 4 }}>{notif.message}</p>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{notif.date}</span>
        </div>
        {!notif.read && (
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: 'var(--primary)', flexShrink: 0, marginTop: 4
          }} />
        )}
      </div>
    </div>
  );
}

// ===== BeforeAfterViewer =====
export function BeforeAfterViewer({ issue }) {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">📸 Before / After Evidence</div>
        {issue.verificationScore > 0 && (
          <span style={{
            background: '#dcfce7', color: '#16a34a', padding: '4px 12px',
            borderRadius: 100, fontSize: 13, fontWeight: 700
          }}>
            ✓ AI Verified: {issue.verificationScore}%
          </span>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Before */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--danger)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
            🔴 Before (Citizen Report)
          </div>
          <div style={{
            aspectRatio: '4/3',
            background: 'linear-gradient(135deg, #fee2e2, #fecaca)',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 36,
            border: '2px solid #fca5a5',
          }}>
            📷
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6, textAlign: 'center' }}>
            Reported: {issue.reportedDate}
          </div>
        </div>

        {/* After */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--success)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
            🟢 After (Worker Evidence)
          </div>
          <div style={{
            aspectRatio: '4/3',
            background: issue.status === 'resolved' || issue.status === 'awaiting_verification'
              ? 'linear-gradient(135deg, #dcfce7, #bbf7d0)'
              : 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 36,
            border: issue.status === 'resolved' || issue.status === 'awaiting_verification'
              ? '2px solid #86efac' : '2px dashed var(--border-dark)',
          }}>
            {issue.status === 'resolved' || issue.status === 'awaiting_verification' ? '✅' : '⏳'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6, textAlign: 'center' }}>
            {issue.status === 'resolved' || issue.status === 'awaiting_verification'
              ? 'Repair completed by field worker'
              : 'Evidence not yet uploaded'
            }
          </div>
        </div>
      </div>

      {(issue.status === 'awaiting_verification' || issue.status === 'resolved') && (
        <div className="alert alert-success" style={{ marginTop: 16 }}>
          <div>
            <strong>AI Repair Verification</strong><br />
            Verification Score: {issue.verificationScore}% · Evidence Quality: Good<br />
            Status: "
            {issue.verificationScore >= 80
              ? 'Likely Resolved – Ready for Citizen Verification'
              : 'Partially Resolved – May need re-inspection'
            }"
          </div>
        </div>
      )}
    </div>
  );
}

// ===== VerificationCard =====
export function VerificationCard({ issue, onVerify }) {
  if (issue.status !== 'awaiting_verification') return null;

  return (
    <div className="card" style={{ border: '2px solid var(--warning)', background: '#fffbeb' }}>
      <div className="card-header">
        <div className="card-title">🔔 Citizen Verification Required</div>
      </div>
      <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 16 }}>
        The field worker has marked this issue as repaired. Please verify whether the problem has actually been resolved in your area.
      </p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button className="btn btn-success" onClick={() => onVerify('yes')}>
          ✓ Yes, issue is resolved
        </button>
        <button className="btn btn-danger" onClick={() => onVerify('no')}>
          ✕ No, issue still exists
        </button>
      </div>
    </div>
  );
}

// ===== VoiceButton =====
export function VoiceButton({ onResult }) {
  const [listening, setListening] = useState(false);

  const mockTexts = [
    'I have been seeing a large pothole near the government hospital for the last two weeks. It is getting bigger and causing traffic.',
    'The streetlight near our colony has not been working for 5 days. It is very dark and unsafe at night.',
    'Garbage has been piling up near the market entrance. Nobody is collecting it and there is a bad smell.',
    'Water pipeline is leaking near the main road. Water is flowing waste on the street.',
  ];

  function handleClick() {
    setListening(true);
    // Simulate 2-second "voice capture"
    setTimeout(() => {
      const text = mockTexts[Math.floor(Math.random() * mockTexts.length)];
      onResult && onResult(text);
      setListening(false);
    }, 2000);
  }

  return (
    <button
      className={`btn ${listening ? 'btn-danger' : 'btn-outline'}`}
      onClick={handleClick}
      disabled={listening}
    >
      {listening ? (
        <>
          <span className="pulse">🎙️</span> Listening...
        </>
      ) : (
        <>🎤 Describe by Voice</>
      )}
    </button>
  );
}

// ===== OfflineBanner =====
export function OfflineBanner({ isOnline }) {
  if (isOnline) return null;
  return (
    <div className="offline-banner">
      <span>📡</span>
      You are offline. Your report will be saved locally and synchronized when internet connection returns.
    </div>
  );
}

// ===== Footer =====
export function Footer() {
  return (
    <footer style={{
      background: 'var(--sidebar-bg)',
      color: 'rgba(255,255,255,0.5)',
      padding: '32px 24px',
      marginTop: 'auto',
      textAlign: 'center',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{
            width: 32, height: 32,
            background: 'linear-gradient(135deg, #1e40af, #0ea5e9)',
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 800, fontSize: 14,
          }}>C</div>
          <span style={{ color: 'white', fontWeight: 700, fontSize: 18 }}>CIVIORA</span>
        </div>
        <p style={{ fontSize: 13, maxWidth: 500, margin: '0 auto 16px' }}>
          CIVIORA — AI-Powered Civic Intelligence &amp; Problem Resolution Platform. Understand Problems. Predict Risks. Drive Resolution.
        </p>
        <div style={{ fontSize: 12 }}>
          © 2026 CIVIORA · Frontend Prototype · Built with React + Vite · Data is simulated for demonstration
        </div>
      </div>
    </footer>
  );
}
