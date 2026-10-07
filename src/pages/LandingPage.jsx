import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './landing.css';
import { Footer } from '../components/common/index.jsx';

const stats = [
  { value: '12,480', label: 'Total Reports', icon: '📋' },
  { value: '8,920', label: 'Resolved Issues', icon: '✅' },
  { value: '1,240', label: 'Active Issues', icon: '🔄' },
  { value: '94%', label: 'Citizen Verification', icon: '🤝' },
  { value: '87%', label: 'Resolution Quality', icon: '⭐' },
];

const features = [
  {
    icon: '🔗',
    title: 'Issue Fusion',
    desc: 'Multiple reports about the same problem are automatically detected and merged into one unified civic issue, avoiding duplicates and combining community data.',
  },
  {
    icon: '🧠',
    title: 'Root-Cause Intelligence',
    desc: 'Instead of treating each repair in isolation, CIVIORA identifies patterns across recurring reports to detect the underlying cause of the problem.',
  },
  {
    icon: '⚡',
    title: 'Smart Priority Engine',
    desc: 'Issues are scored across 5 dimensions: severity, affected population, recurrence history, waiting time, and location risk – not just first-come-first-serve.',
  },
  {
    icon: '📸',
    title: 'Evidence-Based Verification',
    desc: 'Before/after images uploaded by field workers are flagged for AI comparison. Citizens then independently verify if the repair actually solved the problem.',
  },
  {
    icon: '📍',
    title: 'Hotspot Prediction',
    desc: 'Historical issue patterns are analyzed to identify locations at risk of future civic problems before they become serious – enabling preventive action.',
  },
  {
    icon: '📊',
    title: 'Resolution Quality Analytics',
    desc: 'CIVIORA measures not just "closed" issues but first-time resolution rate, citizen verification rate, reopened issues, and recurring problem areas.',
  },
];

const workflow = [
  { step: 1, icon: '📱', label: 'Citizen Report', desc: 'Photo + description or voice input' },
  { step: 2, icon: '🤖', label: 'AI Analysis', desc: 'Category, severity, location extracted' },
  { step: 3, icon: '🔗', label: 'Issue Fusion', desc: 'Similar reports merged together' },
  { step: 4, icon: '🧠', label: 'Root Cause', desc: 'Recurring patterns identified' },
  { step: 5, icon: '⚡', label: 'Priority Score', desc: 'Multi-factor urgency ranking' },
  { step: 6, icon: '🏛️', label: 'Assignment', desc: 'Sent to correct department + worker' },
  { step: 7, icon: '🔧', label: 'Field Repair', desc: 'Worker completes task with evidence' },
  { step: 8, icon: '✅', label: 'Verification', desc: 'Citizen confirms actual resolution' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">🏙️ CIVIORA — AI-Powered Civic Intelligence &amp; Problem Resolution Platform</div>
          <h1 className="hero-title">
            <span className="brand-highlight">CIVIORA</span>
          </h1>
          <p className="hero-tagline">Understand Problems. Predict Risks. Drive Resolution.</p>
          <p className="hero-desc">
            An AI-powered civic intelligence platform that understands local problems, combines duplicate reports,
            identifies recurring causes, prioritizes urgent issues and verifies whether repairs actually solved the problem.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/citizen/report')}>
              📝 Report an Issue
            </button>
            <button className="btn btn-outline btn-lg" onClick={() => navigate('/citizen/map')}>
              🗺️ Explore Civic Map
            </button>
            <button className="btn btn-ghost btn-lg" onClick={() => navigate('/login')}>
              Login / Register
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card-stack">
            <div className="floating-card card-1">
              <span>🔗</span>
              <span>4 reports fused into CP-204</span>
            </div>
            <div className="floating-card card-2">
              <span>⚡</span>
              <span>Priority Score: 91/100</span>
            </div>
            <div className="floating-card card-3">
              <span>✅</span>
              <span>91% Citizen Verified</span>
            </div>
            <div className="hero-map-mock">
              <div className="map-dot d1">🔴</div>
              <div className="map-dot d2">🟡</div>
              <div className="map-dot d3">🔴</div>
              <div className="map-dot d4">🟢</div>
              <div className="map-lines" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="stats-strip">
        {stats.map(s => (
          <div key={s.label} className="stat-strip-item">
            <span className="stat-strip-icon">{s.icon}</span>
            <div className="stat-strip-value">{s.value}</div>
            <div className="stat-strip-label">{s.label}</div>
          </div>
        ))}
      </section>

      {/* How It Works – Workflow */}
      <section className="section">
        <div className="section-center">
          <div className="tag-pill">How It Works</div>
          <h2 className="section-h2">The CIVIORA Intelligent Workflow</h2>
          <p className="section-p">
            Unlike traditional complaint portals, CIVIORA treats civic issues as intelligent entities – fusing related reports,
            detecting root causes, and verifying actual resolution.
          </p>
          <div className="workflow-grid">
            {workflow.map((w, i) => (
              <div key={w.step} className="workflow-step">
                <div className="workflow-icon">{w.icon}</div>
                <div className="workflow-step-num">Step {w.step}</div>
                <div className="workflow-label">{w.label}</div>
                <div className="workflow-desc">{w.desc}</div>
                {i < workflow.length - 1 && <div className="workflow-arrow">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="section section-alt">
        <div className="section-center">
          <div className="tag-pill">Key Intelligence Features</div>
          <h2 className="section-h2">What Makes CIVIORA Different</h2>
          <p className="section-p">
            CIVIORA differentiates itself by combining civic reporting with issue fusion, root-cause intelligence,
            intelligent prioritization, evidence-based resolution verification, and recurrence prediction.
          </p>
          <div className="features-grid">
            {features.map(f => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Roles */}
      <section className="section">
        <div className="section-center">
          <div className="tag-pill">Built For Everyone</div>
          <h2 className="section-h2">Three Sides of Civic Intelligence</h2>
          <div className="roles-grid">
            <div className="role-card citizen-card">
              <div className="role-icon">👤</div>
              <h3>For Citizens</h3>
              <ul>
                <li>📱 Report via photo, text or voice</li>
                <li>🔗 See your report fused with others</li>
                <li>📍 Track status in real-time</li>
                <li>✅ Verify if repair actually worked</li>
                <li>📊 View civic statistics near you</li>
              </ul>
              <button className="btn btn-primary" onClick={() => navigate('/register')}>
                Join as Citizen
              </button>
            </div>
            <div className="role-card authority-card">
              <div className="role-icon">🏛️</div>
              <h3>For Authorities</h3>
              <ul>
                <li>📊 Intelligent issue prioritization</li>
                <li>🧠 Root cause identification</li>
                <li>🗺️ Hotspot prediction maps</li>
                <li>📋 Department-wise analytics</li>
                <li>📈 Resolution quality tracking</li>
              </ul>
              <button className="btn btn-primary" onClick={() => navigate('/login')}>
                Authority Login
              </button>
            </div>
            <div className="role-card worker-card">
              <div className="role-icon">🔧</div>
              <h3>For Field Workers</h3>
              <ul>
                <li>📋 Organized task checklist</li>
                <li>📍 GPS-guided navigation</li>
                <li>📸 Evidence upload system</li>
                <li>✔️ Step-by-step work tracking</li>
                <li>📅 Deadline notifications</li>
              </ul>
              <button className="btn btn-primary" onClick={() => navigate('/login')}>
                Worker Login
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Public Impact */}
      <section className="impact-section">
        <div className="section-center">
          <h2 style={{ color: 'white', marginBottom: 12 }}>Public Impact Dashboard</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 40 }}>
            Transparent civic data. No personal information displayed.
          </p>
          <div className="impact-grid">
            <div className="impact-item">
              <div className="impact-value">12,480</div>
              <div className="impact-label">Total Civic Issues Reported</div>
            </div>
            <div className="impact-item">
              <div className="impact-value">8,920</div>
              <div className="impact-label">Issues Resolved</div>
            </div>
            <div className="impact-item">
              <div className="impact-value">4.2 days</div>
              <div className="impact-label">Average Resolution Time</div>
            </div>
            <div className="impact-item">
              <div className="impact-value">94%</div>
              <div className="impact-label">Citizen Verification Rate</div>
            </div>
          </div>
          <div style={{ marginTop: 40, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-lg" style={{ background: 'white', color: 'var(--primary)' }} onClick={() => navigate('/citizen/report')}>
              📝 Report a Problem
            </button>
            <button className="btn btn-lg" style={{ background: 'transparent', color: 'white', border: '2px solid rgba(255,255,255,0.5)' }} onClick={() => navigate('/login')}>
              View Full Dashboard
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
