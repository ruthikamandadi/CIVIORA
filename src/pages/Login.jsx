import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './auth.css';

const googleDemoAccounts = [
  { id: 'ruthika', name: 'Ruthika Mandadi', email: 'ruthika@example.com', role: 'citizen' },
  { id: 'priya', name: 'Priya Sharma', email: 'priya@example.com', role: 'citizen' },
  { id: 'demo-citizen', name: 'Demo Citizen', email: 'citizen@example.com', role: 'citizen' },
];

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [role, setRole] = useState('citizen');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const mockCredentials = {
    citizen: { email: 'citizen@demo.com', password: 'demo123', name: 'Citizen Demo' },
    authority: { email: 'authority@demo.com', password: 'demo123', name: 'Authority Demo' },
    fieldworker: { email: 'worker@demo.com', password: 'demo123', name: 'Field Worker Demo' },
  };

  function handleLogin(e) {
    e.preventDefault();
    const creds = mockCredentials[role];

    if (!email || !password) {
      setError('Please enter email and password.');
      return;
    }

    const baseName = (email.split('@')[0] || '').replace(/[._-]+/g, ' ').trim();
    const user = {
      role,
      name: baseName ? baseName.split(/\s+/).map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ') : creds.name,
      email: email || creds.email,
      loginMethod: 'email',
    };

    onLogin(user);

    if (role === 'citizen') navigate('/citizen/dashboard');
    else if (role === 'authority') navigate('/authority/dashboard');
    else navigate('/fieldworker/dashboard');
  }

  function quickLogin(r) {
    const creds = mockCredentials[r];
    const user = { role: r, name: creds.name, email: creds.email, loginMethod: 'email' };
    onLogin(user);
    if (r === 'citizen') navigate('/citizen/dashboard');
    else if (r === 'authority') navigate('/authority/dashboard');
    else navigate('/fieldworker/dashboard');
  }

  function handleGoogleDemoLogin(account) {
    setGoogleLoading(true);

    setTimeout(() => {
      const user = {
        name: account.name,
        email: account.email,
        role: account.role,
        loginMethod: 'google',
      };

      onLogin(user);
      setGoogleModalOpen(false);
      setGoogleLoading(false);
      navigate('/citizen/dashboard');
    }, 500);
  }

  const roleInfo = {
    citizen: { icon: '👤', color: '#1e40af', desc: 'Report civic issues, track status, verify repairs' },
    authority: { icon: '🏛️', color: '#92400e', desc: 'Manage issues, assignments, analytics & hotspots' },
    fieldworker: { icon: '🔧', color: '#166534', desc: 'View tasks, update repair status, upload evidence' },
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <div className="auth-logo">C</div>
          <div>
            <div className="auth-brand-name">CIVIORA</div>
            <div className="auth-brand-tag">AI-Powered Civic Intelligence</div>
          </div>
        </div>
        <div className="auth-visual-content">
          <h2 style={{ color: 'white', fontSize: 32, fontWeight: 800, marginBottom: 16 }}>
            Smarter Civic Governance Starts Here
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: 32 }}>
            Join thousands of citizens, government authorities, and field workers working together
            to identify, prioritize, and resolve civic problems intelligently.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {['🔗 Issue Fusion – Multiple reports merged automatically', '⚡ Smart Priority – Multi-factor urgency scoring', '✅ Verified Resolution – Citizen confirmation required', '📍 Hotspot Prediction – Prevent problems before they occur'].map(t => (
              <div key={t} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-container">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Login to your CIVIORA account</p>

          <div className="role-selector">
            {(['citizen', 'authority', 'fieldworker']).map(r => (
              <button
                key={r}
                className={`role-btn ${role === r ? 'active' : ''}`}
                onClick={() => setRole(r)}
                style={{ borderColor: role === r ? roleInfo[r].color : 'var(--border)' }}
              >
                <span style={{ fontSize: 20 }}>{roleInfo[r].icon}</span>
                <span style={{ fontSize: 12, fontWeight: 600, textTransform: 'capitalize' }}>
                  {r === 'fieldworker' ? 'Field Worker' : r.charAt(0).toUpperCase() + r.slice(1)}
                </span>
              </button>
            ))}
          </div>

          <div className="alert alert-info" style={{ marginBottom: 20, fontSize: 13 }}>
            {roleInfo[role].desc}
          </div>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                className="form-input"
                type="email"
                placeholder={mockCredentials[role].email}
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="form-error" style={{ marginBottom: 12 }}>{error}</p>}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
              Login as {role === 'fieldworker' ? 'Field Worker' : role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          </form>

          <div className="auth-divider">or</div>

          <button
            type="button"
            className="btn btn-google"
            onClick={() => setGoogleModalOpen(true)}
            disabled={googleLoading}
          >
            <span className="google-mark">G</span>
            {googleLoading ? 'Connecting…' : 'Continue with Google'}
          </button>

          <div className="auth-divider">or try demo access</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { role: 'citizen', label: 'Demo Citizen Login', icon: '👤' },
              { role: 'authority', label: 'Demo Authority Login', icon: '🏛️' },
              { role: 'fieldworker', label: 'Demo Field Worker Login', icon: '🔧' },
            ].map(d => (
              <button key={d.role} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }} onClick={() => quickLogin(d.role)}>
                {d.icon} {d.label}
              </button>
            ))}
          </div>

          <p className="auth-footer-text">
            Don't have an account?{' '}
            <span className="auth-link" onClick={() => navigate('/register')}>Register here</span>
          </p>
        </div>
      </div>

      {googleModalOpen && (
        <div className="google-modal-backdrop" onClick={() => setGoogleModalOpen(false)}>
          <div className="google-modal" onClick={(event) => event.stopPropagation()}>
            <div className="google-modal-header">
              <div>
                <div className="google-modal-title">Continue with Google</div>
                <div className="google-modal-subtitle">Choose an account</div>
              </div>
            </div>

            <div className="google-account-list">
              {googleDemoAccounts.map((account) => (
                <button
                  key={account.id}
                  type="button"
                  className="google-account-item"
                  onClick={() => handleGoogleDemoLogin(account)}
                >
                  <div className="google-avatar">{account.name.split(' ').map(part => part[0]).slice(0, 2).join('').toUpperCase()}</div>
                  <div className="google-account-meta">
                    <div className="google-account-name">{account.name}</div>
                    <div className="google-account-email">{account.email}</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="google-modal-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setGoogleModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
