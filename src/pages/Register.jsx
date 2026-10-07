import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './auth.css';

export default function Register({ onLogin }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    area: '',
    role: 'citizen',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  function update(key, val) {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: '' }));
  }

  function validate() {
    const errs = {};
    if (!form.name) errs.name = 'Name is required';
    if (!form.email) errs.email = 'Email is required';
    if (!form.phone) errs.phone = 'Phone is required';
    if (!form.area) errs.area = 'Area is required';
    if (!form.password) errs.password = 'Password is required';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    const user = { name: form.name.trim(), email: form.email.trim(), role: form.role, loginMethod: 'normal' };
    onLogin(user);
    if (form.role === 'citizen') navigate('/citizen/dashboard');
    else if (form.role === 'authority') navigate('/authority/dashboard');
    else navigate('/fieldworker/dashboard');
  }

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
          <h2 style={{ color: 'white', fontSize: 28, fontWeight: 800, marginBottom: 16 }}>
            Join the Civic Intelligence Network
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: 24 }}>
            Register to start reporting civic problems in your area. Your reports help build a smarter,
            more responsive civic system for your entire community.
          </p>
          <div className="auth-stats-mini">
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'white' }}>12,480</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Reports Submitted</div>
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'white' }}>8,920</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Issues Resolved</div>
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'white' }}>94%</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Verified Rate</div>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-container">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join CIVIORA and make your city better</p>

          {/* Role Selection */}
          <div className="role-selector" style={{ marginBottom: 20 }}>
            {[
              { val: 'citizen', label: 'Citizen', icon: '👤' },
              { val: 'authority', label: 'Authority', icon: '🏛️' },
              { val: 'fieldworker', label: 'Field Worker', icon: '🔧' },
            ].map(r => (
              <button
                key={r.val}
                className={`role-btn ${form.role === r.val ? 'active' : ''}`}
                onClick={() => update('role', r.val)}
              >
                <span style={{ fontSize: 20 }}>{r.icon}</span>
                <span style={{ fontSize: 12, fontWeight: 600 }}>{r.label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className="form-input" placeholder="Enter your full name" value={form.name} onChange={e => update('name', e.target.value)} />
                {errors.name && <p className="form-error">{errors.name}</p>}
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input className="form-input" placeholder="9876543210" value={form.phone} onChange={e => update('phone', e.target.value)} />
                {errors.phone && <p className="form-error">{errors.phone}</p>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input className="form-input" type="email" placeholder="your@email.com" value={form.email} onChange={e => update('email', e.target.value)} />
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Your Area / Ward *</label>
              <input className="form-input" placeholder="e.g. MG Road, Guntur" value={form.area} onChange={e => update('area', e.target.value)} />
              {errors.area && <p className="form-error">{errors.area}</p>}
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Password *</label>
                <input className="form-input" type="password" placeholder="Create password" value={form.password} onChange={e => update('password', e.target.value)} />
                {errors.password && <p className="form-error">{errors.password}</p>}
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password *</label>
                <input className="form-input" type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} />
                {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div className="alert alert-info" style={{ marginBottom: 16, fontSize: 13 }}>
              🔒 This is a frontend demo. No real personal data is stored or transmitted.
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 12 }}>
              Create Account & Get Started
            </button>
          </form>

          <p className="auth-footer-text">
            Already have an account?{' '}
            <span className="auth-link" onClick={() => navigate('/login')}>Login here</span>
          </p>
        </div>
      </div>
    </div>
  );
}
