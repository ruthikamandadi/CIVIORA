import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_ISSUES, CATEGORIES, DEPARTMENTS, WORKERS } from '../../data/mockData';
import { StatusBadge, PriorityBadge, SearchBar, Modal } from '../../components/common/index.jsx';

export default function IssueManagement() {
  const navigate = useNavigate();
  const [issues, setIssues] = useState(MOCK_ISSUES);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: '', category: '', priority: '' });
  const [assignModal, setAssignModal] = useState(null); // issue to assign
  const [selectedWorker, setSelectedWorker] = useState('');

  function handleFilter(key, val) {
    setFilters(f => ({ ...f, [key]: val }));
  }

  const filtered = issues.filter(issue => {
    const s = search.toLowerCase();
    const matchSearch = !search || issue.title?.toLowerCase().includes(s) || issue.id?.toLowerCase().includes(s) || issue.location?.area?.toLowerCase().includes(s);
    const matchStatus = !filters.status || issue.status === filters.status;
    const matchCat = !filters.category || issue.category === filters.category;
    const matchPriority = !filters.priority ||
      (filters.priority === 'critical' && issue.priority >= 90) ||
      (filters.priority === 'high' && issue.priority >= 75 && issue.priority < 90) ||
      (filters.priority === 'medium' && issue.priority < 75);
    return matchSearch && matchStatus && matchCat && matchPriority;
  });

  function handleAssign() {
    if (!selectedWorker || !assignModal) return;
    setIssues(prev => prev.map(i =>
      i.id === assignModal.id
        ? { ...i, assignedWorker: selectedWorker, status: 'assigned' }
        : i
    ));
    setAssignModal(null);
    setSelectedWorker('');
  }

  function handleStatusChange(issueId, newStatus) {
    setIssues(prev => prev.map(i => i.id === issueId ? { ...i, status: newStatus } : i));
  }

  return (
    <div className="page-content fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">📋 Issue Management</h1>
          <p className="page-subtitle">All civic issues – search, filter, assign, and track.</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Showing {filtered.length} of {issues.length}</span>
        </div>
      </div>

      {/* Search & Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search by title, ID, or area..." />
        </div>
        <select className="form-input form-select" style={{ width: 150 }} value={filters.status} onChange={e => handleFilter('status', e.target.value)}>
          <option value="">All Status</option>
          {['reported','ai_analysed','assigned','in_progress','awaiting_verification','resolved','reopened'].map(s => (
            <option key={s} value={s}>{s.replace(/_/g,' ')}</option>
          ))}
        </select>
        <select className="form-input form-select" style={{ width: 150 }} value={filters.category} onChange={e => handleFilter('category', e.target.value)}>
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        <select className="form-input form-select" style={{ width: 140 }} value={filters.priority} onChange={e => handleFilter('priority', e.target.value)}>
          <option value="">All Priority</option>
          <option value="critical">Critical (90+)</option>
          <option value="high">High (75-89)</option>
          <option value="medium">Medium (&lt;75)</option>
        </select>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Issue ID</th>
                <th>Category / Title</th>
                <th>Location</th>
                <th>Priority</th>
                <th>Fused</th>
                <th>Department</th>
                <th>Status</th>
                <th>Worker</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(issue => {
                const cat = CATEGORIES.find(c => c.id === issue.category);
                const worker = issue.assignedWorker ? WORKERS.find(w => w.id === issue.assignedWorker) : null;
                return (
                  <tr key={issue.id}>
                    <td>
                      <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 13 }}>{issue.id}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span>{cat?.icon}</span>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{issue.title}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{cat?.label}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>{issue.location?.area}</td>
                    <td><PriorityBadge score={issue.priority} /></td>
                    <td>
                      {issue.fusedReports?.length > 1 ? (
                        <span style={{ fontSize: 12, color: 'var(--purple)', fontWeight: 600 }}>
                          🔗 {issue.fusedReports.length}
                        </span>
                      ) : '—'}
                    </td>
                    <td style={{ fontSize: 12 }}>{issue.department || '—'}</td>
                    <td><StatusBadge status={issue.status} /></td>
                    <td style={{ fontSize: 12 }}>{worker ? worker.name : '—'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => navigate(`/citizen/issue/${issue.id}`)}
                        >
                          View
                        </button>
                        {!['resolved'].includes(issue.status) && (
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => { setAssignModal(issue); setSelectedWorker(issue.assignedWorker || ''); }}
                          >
                            Assign
                          </button>
                        )}
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
        open={!!assignModal}
        onClose={() => setAssignModal(null)}
        title={`Assign Issue – ${assignModal?.id}`}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setAssignModal(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAssign}>Confirm Assignment</button>
          </>
        }
      >
        {assignModal && (
          <div>
            <div style={{ marginBottom: 16, padding: '12px', background: 'var(--surface-2)', borderRadius: 8 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{assignModal.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                Priority: {assignModal.priority}/100 · {assignModal.location?.area}
              </div>
              <div style={{ marginTop: 8 }}>
                <StatusBadge status={assignModal.status} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Suggested Department</label>
              <input className="form-input" value={assignModal.department || 'Municipal Corporation'} readOnly style={{ background: 'var(--surface-2)' }} />
            </div>

            <div className="form-group">
              <label className="form-label">Select Field Worker *</label>
              <select className="form-input form-select" value={selectedWorker} onChange={e => setSelectedWorker(e.target.value)}>
                <option value="">Choose worker...</option>
                {WORKERS.map(w => (
                  <option key={w.id} value={w.id}>{w.name} – {w.dept} (Tasks: {w.tasks})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Deadline</label>
              <select className="form-input form-select">
                <option>24 hours (Urgent)</option>
                <option>48 hours (High)</option>
                <option>72 hours (Medium)</option>
                <option>1 week (Standard)</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button className="btn btn-outline btn-sm" onClick={() => handleStatusChange(assignModal?.id, 'in_progress')}>
                🔄 Mark In Progress
              </button>
              <button className="btn btn-danger btn-sm">
                ⬆️ Escalate Issue
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
