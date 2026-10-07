import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_ISSUES } from '../../data/mockData';
import { IssueCard, SearchBar, FilterBar, EmptyState } from '../../components/common/index.jsx';

const STATUS_FILTERS = [
  { value: 'reported', label: 'Reported' },
  { value: 'ai_analysed', label: 'AI Analysed' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'awaiting_verification', label: 'Awaiting Verification' },
  { value: 'resolved', label: 'Resolved' },
];

const CATEGORY_FILTERS = [
  { value: 'road', label: 'Road/Pothole' },
  { value: 'garbage', label: 'Garbage' },
  { value: 'streetlight', label: 'Streetlight' },
  { value: 'water', label: 'Water Leakage' },
  { value: 'drainage', label: 'Drainage' },
  { value: 'toilet', label: 'Public Toilet' },
  { value: 'traffic', label: 'Traffic/Safety' },
];

export default function MyReports() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: '', category: '' });

  // Combine mock + localStorage reports
  const localReports = JSON.parse(localStorage.getItem('civicpulse_reports') || '[]');
  const allReports = [...localReports, ...MOCK_ISSUES.slice(0, 7)];

  function handleFilter(key, val) {
    setFilters(f => ({ ...f, [key]: val }));
  }

  const filtered = allReports.filter(issue => {
    const matchSearch = !search ||
      issue.title?.toLowerCase().includes(search.toLowerCase()) ||
      issue.id?.toLowerCase().includes(search.toLowerCase()) ||
      issue.location?.area?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filters.status || issue.status === filters.status;
    const matchCat = !filters.category || issue.category === filters.category;
    return matchSearch && matchStatus && matchCat;
  });

  const awaitingCount = allReports.filter(i => i.status === 'awaiting_verification').length;

  return (
    <div className="page-content fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">📋 My Reports</h1>
          <p className="page-subtitle">Track all your submitted civic issue reports.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/citizen/report')}>
          + Report New Issue
        </button>
      </div>

      {/* Verification reminder */}
      {awaitingCount > 0 && (
        <div className="alert alert-warning" style={{ marginBottom: 20 }}>
          🔔 <strong>{awaitingCount} issue(s) are awaiting your verification.</strong> Please confirm if repairs have been completed.
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          { label: 'Total', count: allReports.length, color: 'var(--primary)' },
          { label: 'Active', count: allReports.filter(i => !['resolved'].includes(i.status)).length, color: 'var(--orange)' },
          { label: 'Resolved', count: allReports.filter(i => i.status === 'resolved').length, color: 'var(--success)' },
          { label: 'Awaiting', count: awaitingCount, color: 'var(--warning)' },
        ].map(s => (
          <div key={s.label} style={{
            padding: '8px 16px',
            background: 'var(--surface)',
            border: `1px solid ${s.color}33`,
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <span style={{ fontWeight: 800, fontSize: 18, color: s.color }}>{s.count}</span>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search by title, ID, or area..." />
        </div>
        <FilterBar
          filters={[
            { key: 'status', label: 'All Status', options: STATUS_FILTERS },
            { key: 'category', label: 'All Categories', options: CATEGORY_FILTERS },
          ]}
          values={filters}
          onChange={handleFilter}
        />
      </div>

      {/* Issues */}
      {filtered.length === 0 ? (
        <EmptyState icon="📭" title="No reports found" desc="Try adjusting your search or filters." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filtered.map(issue => (
            <IssueCard
              key={issue.id}
              issue={issue}
              onClick={() => navigate(`/citizen/issue/${issue.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
