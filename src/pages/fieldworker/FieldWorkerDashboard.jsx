import { useState } from 'react';
import { MOCK_ISSUES, WORKERS } from '../../data/mockData';
import { StatusBadge, PriorityBadge, Modal } from '../../components/common/index.jsx';

// Mock tasks for this field worker
const MY_TASKS = MOCK_ISSUES.filter(i => i.assignedWorker === 'w1' || i.assignedWorker === 'w3' || i.assignedWorker === 'w2')
  .filter(i => i.status !== 'resolved');

// Task checklist component
function TaskChecklist({ task }) {
  const [checks, setChecks] = useState({
    reached: false,
    inspected: false,
    repaired: false,
    evidence: false,
  });
  const [uploadModal, setUploadModal] = useState(false);
  const [imageMock, setImageMock] = useState(null);
  const [completed, setCompleted] = useState(task.status === 'awaiting_verification');

  const steps = [
    { key: 'reached', label: 'Reached location' },
    { key: 'inspected', label: 'Inspected issue' },
    { key: 'repaired', label: 'Repair completed' },
    { key: 'evidence', label: 'Before/after evidence uploaded' },
  ];

  const allDone = Object.values(checks).every(Boolean);

  function toggleCheck(key) {
    setChecks(prev => ({ ...prev, [key]: !prev[key] }));
  }

  function handleComplete() {
    setCompleted(true);
  }

  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, gap: 8, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{task.title}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
            📍 {task.location?.area} · {task.location?.landmark}
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
            <StatusBadge status={completed ? 'awaiting_verification' : task.status} />
            <PriorityBadge score={task.priority} />
          </div>
        </div>
        <span style={{ fontSize: 12, color: 'var(--text-muted)', background: 'var(--surface-2)', padding: '4px 10px', borderRadius: 8 }}>
          {task.id}
        </span>
      </div>

      {completed ? (
        <div className="alert alert-success">
          ✅ Task marked complete. Awaiting citizen verification.
        </div>
      ) : (
        <>
          {/* Checklist */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
            {steps.map(step => (
              <label
                key={step.key}
                style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14, fontWeight: 500 }}
              >
                <input
                  type="checkbox"
                  checked={checks[step.key]}
                  onChange={() => toggleCheck(step.key)}
                  style={{ width: 18, height: 18, cursor: 'pointer' }}
                />
                <span style={{ color: checks[step.key] ? 'var(--success)' : 'var(--text)' }}>
                  {checks[step.key] ? '✅' : '☐'} {step.label}
                </span>
              </label>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => toggleCheck('reached')}
            >
              🔧 Start Work
            </button>
            <button
              className="btn btn-accent btn-sm"
              onClick={() => setUploadModal(true)}
            >
              📸 Upload Evidence
            </button>
            <button
              className="btn btn-success btn-sm"
              disabled={!allDone}
              onClick={handleComplete}
            >
              ✅ Complete Task
            </button>
          </div>

          {!allDone && (
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
              Complete all checklist items to mark task as done.
            </div>
          )}
        </>
      )}

      {/* Upload Evidence Modal */}
      <Modal
        open={uploadModal}
        onClose={() => setUploadModal(false)}
        title="📸 Upload Repair Evidence"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setUploadModal(false)}>Close</button>
            <button className="btn btn-success" onClick={() => { toggleCheck('evidence'); setUploadModal(false); }}>
              ✅ Save Evidence
            </button>
          </>
        }
      >
        <div>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 16 }}>
            Upload before and after photos of the repair. These will be used for AI verification and citizen confirmation.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--danger)', marginBottom: 6 }}>🔴 Before (from report)</div>
              <div style={{ height: 100, background: '#fee2e2', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, border: '1px solid #fca5a5' }}>📷</div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--success)', marginBottom: 6 }}>🟢 After (upload)</div>
              <div style={{ height: 100, background: '#f0fdf4', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #86efac', position: 'relative', cursor: 'pointer', fontSize: 24 }}>
                {imageMock ? '✅' : '📤'}
                <input type="file" accept="image/*" onChange={() => setImageMock(true)} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
              </div>
            </div>
          </div>
          <div className="form-group" style={{ marginTop: 16 }}>
            <label className="form-label">Repair Notes</label>
            <textarea className="form-input form-textarea" placeholder="Describe what was repaired..." rows={3} />
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function FieldWorkerDashboard({ user }) {
  const workerName = user?.name || 'Field Worker';

  return (
    <div className="page-content fade-in" style={{ maxWidth: 700, margin: '0 auto' }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>Field Worker Dashboard</div>
          <h1 className="page-title">{workerName} 🔧</h1>
          <p className="page-subtitle">Today's assignments and repair tasks</p>
        </div>
      </div>

      {/* Today's stats */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        {[
          { label: 'Total Tasks', value: MY_TASKS.length, color: 'var(--primary)' },
          { label: 'In Progress', value: MY_TASKS.filter(t => t.status === 'in_progress').length, color: 'var(--orange)' },
          { label: 'Pending Assignment', value: MY_TASKS.filter(t => t.status === 'assigned').length, color: 'var(--warning)' },
        ].map(s => (
          <div key={s.label} style={{
            flex: 1, minWidth: 100,
            padding: '14px 16px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            textAlign: 'center',
          }}>
            <div style={{ fontWeight: 800, fontSize: 24, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Alert */}
      <div className="alert alert-warning" style={{ marginBottom: 20 }}>
        ⚠️ You have {MY_TASKS.filter(t => t.priority >= 85).length} high-priority tasks today. Please complete urgent repairs first.
      </div>

      {/* Task List */}
      <div className="section-header">
        <div className="section-title">📋 Today's Assignments ({MY_TASKS.length})</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {MY_TASKS.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
            🎉 No tasks for today!
          </div>
        ) : (
          MY_TASKS.sort((a, b) => b.priority - a.priority).map(task => (
            <TaskChecklist key={task.id} task={task} />
          ))
        )}
      </div>

      {/* Navigation hint */}
      <div className="card" style={{ marginTop: 24, background: 'var(--surface-2)', border: 'none' }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>🗺️ Need directions?</div>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Use the Map tab to view your task locations and get navigation assistance.
        </p>
      </div>
    </div>
  );
}
