import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_ISSUES, CATEGORIES, WORKERS } from '../../data/mockData';
import {
  StatusBadge, PriorityBadge, Timeline, BeforeAfterViewer, VerificationCard, PriorityScoreCard
} from '../../components/common/index.jsx';
import IssueStatusTimeline from '../../components/IssueStatusTimeline.jsx';
import { getFullPriorityBreakdown } from '../../utils/priority';
import AIDecisionExplanation from '../../components/AIDecisionExplanation.jsx';

// Issue Fusion visual
function IssueFusionPanel({ issue }) {
  if (!issue.fusedReports || issue.fusedReports.length <= 1) return null;

  return (
    <div className="card" style={{ border: '2px solid #e0e7ff', background: '#eef2ff' }}>
      <div style={{ fontWeight: 700, fontSize: 16, color: '#4338ca', marginBottom: 16 }}>
        🔗 Issue Fusion – AI Deduplication
      </div>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
        These individual citizen reports were automatically detected as describing the same physical problem.
        They have been merged into one unified civic issue.
      </p>

      {/* Individual reports */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 10, marginBottom: 16 }}>
        {issue.fusedReports.map(rId => (
          <div key={rId} style={{
            padding: '10px 12px',
            background: 'white',
            border: '1px solid #c7d2fe',
            borderRadius: 8,
            textAlign: 'center',
            fontSize: 13,
            fontWeight: 600,
            color: '#4338ca',
          }}>
            # {rId}
          </div>
        ))}
      </div>

      {/* Arrow */}
      <div style={{ textAlign: 'center', fontSize: 24, margin: '8px 0' }}>⬇️</div>

      {/* Fused issue */}
      <div style={{
        padding: '16px',
        background: 'linear-gradient(135deg, #4338ca, #6366f1)',
        borderRadius: 12,
        color: 'white',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.8, marginBottom: 4 }}>FUSED CIVIC ISSUE</div>
        <div style={{ fontSize: 22, fontWeight: 900 }}>{issue.id}</div>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 12, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12 }}>📊 Reports merged: {issue.fusedReports.length}</span>
          <span style={{ fontSize: 12 }}>👥 Affected: {issue.affectedCitizens} citizens</span>
          <span style={{ fontSize: 12 }}>🔁 Recurrence: {issue.recurrenceCount}x</span>
          <span style={{ fontSize: 12 }}>⚡ Priority: {issue.priority}/100</span>
        </div>
      </div>
    </div>
  );
}

// Root Cause panel
function RootCausePanel({ issue, breakdown }) {
  if (!issue.rootCause) return null;

  return (
    <div className="card">
      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>🧠 Root Cause Analysis</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[
          { icon: '🔍', label: 'Observed Problem', value: issue.title },
          { icon: '📊', label: 'Historical Reports', value: `${issue.recurrenceCount + 14} similar reports in this area` },
          { icon: '🔁', label: 'Recurrence Level', value: issue.recurrenceCount >= 3 ? 'High' : 'Medium' },
          { icon: '💡', label: 'Identified Root Cause', value: issue.rootCause },
        ].map(row => (
          <div key={row.label} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '10px 12px', background: 'var(--surface-2)', borderRadius: 8 }}>
            <span style={{ fontSize: 18 }}>{row.icon}</span>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{row.label}</div>
              <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{row.value}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="alert alert-info" style={{ marginTop: 16 }}>
        💡 <strong>AI Recommendation:</strong> Instead of repeatedly repairing this issue, authorities should inspect the underlying cause: "{issue.rootCause}"
      </div>
      <div style={{ marginTop: 12 }}>
        <AIDecisionExplanation
          title={`${issue.title} root-cause recommendation`}
          score={breakdown.total}
          factors={Object.values(breakdown.factors).map((factor) => ({
            label: factor.label,
            value: factor.score,
            kind: ['Waiting Time', 'Location Risk'].includes(factor.label) ? 'risk' : 'positive',
          }))}
          recommendation={`Inspect the underlying cause before repeating surface repairs: ${issue.rootCause}`}
          confidence={issue.aiConfidence || 75}
          triggerLabel="Explain this recommendation"
        />
      </div>
    </div>
  );
}

export default function IssueDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issues, setIssues] = useState(MOCK_ISSUES);
  const [verifyMsg, setVerifyMsg] = useState(null);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectFeedback, setRejectFeedback] = useState('');

  const issue = issues.find(i => i.id === id) || MOCK_ISSUES[0];
  if (!issue) return <div className="page-content"><p>Issue not found.</p></div>;

  const cat = CATEGORIES.find(c => c.id === issue.category);
  const worker = issue.assignedWorker ? WORKERS.find(w => w.id === issue.assignedWorker) : null;
  const breakdown = getFullPriorityBreakdown(issue);

  function handleVerify(result) {
    if (result === 'yes') {
      setIssues(prev => prev.map(i => i.id === issue.id ? { ...i, status: 'resolved', citizenVerified: true } : i));
      setVerifyMsg('✅ Thank you! You have confirmed this issue is resolved.');
    } else {
      setShowRejectForm(true);
    }
  }

  function handleReject() {
    setIssues(prev => prev.map(i => i.id === issue.id ? { ...i, status: 'reopened', citizenVerified: false } : i));
    setVerifyMsg('🔴 Issue marked as NOT resolved. It has been reopened for re-inspection.');
    setShowRejectForm(false);
  }

  return (
    <div className="page-content fade-in">
      {/* Back */}
      <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>
        ← Back
      </button>

      {/* Header */}
      <div className="page-header">
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 36 }}>{cat?.icon || '📌'}</span>
          <div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)' }}>{issue.id}</span>
              <StatusBadge status={issue.status} />
              <PriorityBadge score={issue.priority} />
            </div>
            <h1 className="page-title" style={{ fontSize: 22 }}>{issue.title}</h1>
            <p className="page-subtitle">📍 {issue.location?.area} · {issue.location?.landmark}</p>
          </div>
        </div>
      </div>

      {verifyMsg && (
        <div className={`alert ${verifyMsg.startsWith('✅') ? 'alert-success' : 'alert-danger'}`} style={{ marginBottom: 20 }}>
          {verifyMsg}
        </div>
      )}

      <div className="grid-2" style={{ alignItems: 'start' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Summary */}
          <div className="card">
            <div className="card-header"><div className="card-title">Issue Summary</div></div>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.6 }}>{issue.description}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: 'Category', value: cat?.label },
                { label: 'Department', value: issue.department },
                { label: 'Reported Date', value: issue.reportedDate },
                { label: 'Affected Citizens', value: `~${issue.affectedCitizens}` },
                { label: 'Recurrence Count', value: `${issue.recurrenceCount}x` },
                { label: 'AI Confidence', value: `${issue.aiConfidence}%` },
              ].map(row => (
                <div key={row.label}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{row.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{row.value || 'N/A'}</div>
                </div>
              ))}
            </div>

            {worker && (
              <div style={{ marginTop: 16, padding: '12px', background: 'var(--surface-2)', borderRadius: 8, display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  {worker.name[0]}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{worker.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Field Worker · {worker.dept}</div>
                </div>
              </div>
            )}
          </div>

          {/* Issue Fusion */}
          <IssueFusionPanel issue={issue} />

          {/* Root Cause */}
          <RootCausePanel issue={issue} breakdown={breakdown} />

          {/* Before/After */}
          <BeforeAfterViewer issue={issue} />

          {/* Citizen Verification */}
          {!verifyMsg && (
            <VerificationCard issue={issue} onVerify={handleVerify} />
          )}

          {showRejectForm && (
            <div className="card" style={{ border: '2px solid var(--danger)', background: '#fef2f2' }}>
              <div style={{ fontWeight: 700, marginBottom: 12 }}>📸 Report Issue Not Fixed</div>
              <textarea
                className="form-input form-textarea"
                placeholder="Describe what is still wrong..."
                value={rejectFeedback}
                onChange={e => setRejectFeedback(e.target.value)}
                rows={3}
              />
              <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                <button className="btn btn-danger" onClick={handleReject}>Submit & Reopen Issue</button>
                <button className="btn btn-ghost" onClick={() => setShowRejectForm(false)}>Cancel</button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Timeline */}
          <div className="card">
            <div className="card-header"><div className="card-title">📅 Issue Timeline</div></div>
            <IssueStatusTimeline report={issue} status={issue.status} />
          </div>

          {/* Priority Score */}
          <PriorityScoreCard breakdown={breakdown} />
          <AIDecisionExplanation
            title={`${issue.title} priority`}
            score={breakdown.total}
            factors={Object.values(breakdown.factors).map((factor) => ({
              label: factor.label,
              value: factor.score,
              kind: ['Waiting Time', 'Location Risk'].includes(factor.label) ? 'risk' : 'positive',
            }))}
            recommendation={issue.rootCause
              ? `Inspect the underlying cause: ${issue.rootCause}`
              : 'Review the issue details and confirm the appropriate response with the responsible team.'}
            confidence={issue.aiConfidence || 75}
            triggerLabel="Explain this priority"
          />
        </div>
      </div>
    </div>
  );
}
