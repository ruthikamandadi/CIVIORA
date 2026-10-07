import { useState } from 'react';
import { MOCK_ISSUES, WORKERS } from '../../data/mockData';
import { StatusBadge, PriorityBadge, Modal } from '../../components/common/index.jsx';

export default function IssueAssignment() {
  const [issues, setIssues] = useState(MOCK_ISSUES.filter(i => !['resolved'].includes(i.status)));
  const [selected, setSelected] = useState(null);
  const [selectedWorker, setSelectedWorker] = useState('');
  const [deadline, setDeadline] = useState('48');

  function handleAssign() {
    if (!selectedWorker || !selected) return;
    setIssues(prev => prev.map(i =>
      i.id === selected.id ? { ...i, assignedWorker: selectedWorker, status: 'assigned' } : i
    ));
    setSelected(null);
    setSelectedWorker('');
  }

  const unassigned = issues.filter(i => !i.assignedWorker || i.status === 'reported' || i.status === 'ai_analysed');
  const assigned = issues.filter(i => i.assignedWorker && !['reported','ai_analysed'].includes(i.status));

  return (
    <div className="page-content fade-in">
      <div className="page-header">
        <h1 className="page-title">📌 Issue Assignments</h1>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ padding: '8px 16px', background: '#fee2e2', borderRadius: 8, fontSize: 13, fontWeight: 600, color: 'var(--danger)' }}>
            {unassigned.length} Unassigned
          </div>
          <div style={{ padding: '8px 16px', background: '#dcfce7', borderRadius: 8, fontSize: 13, fontWeight: 600, color: 'var(--success)' }}>
            {assigned.length} Assigned
          </div>
        </div>
      </div>

      {/* Unassigned Issues */}
      <div style={{ marginBottom: 32 }}>
        <div className="section-header">
          <div className="section-title">⚠️ Pending Assignment</div>
          <div className="section-subtitle">These issues need to be assigned to field workers immediately.</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {unassigned.map(issue => (
            <div key={issue.id} className="card" style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 13 }}>{issue.id}</span>
                    <StatusBadge status={issue.status} />
                    <PriorityBadge score={issue.priority} />
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{issue.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    📍 {issue.location?.area} · Dept: {issue.department}
                  </div>
                  {issue.fusedReports?.length > 1 && (
                    <div style={{ fontSize: 12, color: 'var(--purple)', fontWeight: 600, marginTop: 4 }}>
                      🔗 {issue.fusedReports.length} reports fused · 👥 {issue.affectedCitizens} affected citizens
                    </div>
                  )}
                </div>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setSelected(issue)}
                >
                  Assign →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Assigned Issues */}
      <div>
        <div className="section-header">
          <div className="section-title">✅ Currently Assigned</div>
        </div>
        <div className="table-wrap card" style={{ padding: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Issue</th>
                <th>Location</th>
                <th>Priority</th>
                <th>Department</th>
                <th>Assigned Worker</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {assigned.map(issue => {
                const worker = WORKERS.find(w => w.id === issue.assignedWorker);
                return (
                  <tr key={issue.id}>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{issue.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--primary)' }}>{issue.id}</div>
                    </td>
                    <td style={{ fontSize: 13 }}>{issue.location?.area}</td>
                    <td><PriorityBadge score={issue.priority} /></td>
                    <td style={{ fontSize: 12 }}>{issue.department}</td>
                    <td style={{ fontSize: 13 }}>{worker?.name || '—'}</td>
                    <td><StatusBadge status={issue.status} /></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-outline btn-sm" onClick={() => setSelected(issue)}>
                          Reassign
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assignment Modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={`Assign – ${selected?.id}`}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setSelected(null)}>Cancel</button>
            <button className="btn btn-success" onClick={handleAssign} disabled={!selectedWorker}>
              ✅ Confirm Assignment
            </button>
          </>
        }
      >
        {selected && (
          <div>
            <div className="alert alert-info" style={{ marginBottom: 16 }}>
              <div>
                <strong>{selected.title}</strong><br />
                Priority: {selected.priority}/100 · {selected.location?.area}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Suggested Department</label>
              <input className="form-input" value={selected.department || 'Municipal Corporation'} readOnly />
            </div>

            <div className="form-group">
              <label className="form-label">Select Field Worker *</label>
              <select
                className="form-input form-select"
                value={selectedWorker}
                onChange={e => setSelectedWorker(e.target.value)}
              >
                <option value="">Choose a field worker...</option>
                {WORKERS.map(w => (
                  <option key={w.id} value={w.id}>
                    {w.name} – {w.dept} ({w.tasks} active tasks)
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Deadline (hours)</label>
              <select className="form-input form-select" value={deadline} onChange={e => setDeadline(e.target.value)}>
                <option value="24">24 hours (Urgent)</option>
                <option value="48">48 hours (High)</option>
                <option value="72">72 hours (Medium)</option>
                <option value="168">1 week (Standard)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Notes for Worker</label>
              <textarea className="form-input form-textarea" placeholder="Special instructions..." rows={2} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
