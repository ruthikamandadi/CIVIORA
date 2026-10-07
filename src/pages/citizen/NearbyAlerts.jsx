import { useMemo, useState } from 'react';
import { ALERT_FILTERS, ALERT_SORT_OPTIONS, CIVIC_ALERTS } from '../../data/civicAlerts';

export default function NearbyAlerts() {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [sortBy, setSortBy] = useState('nearest');

  const visibleAlerts = useMemo(() => {
    const filtered = selectedFilter === 'All'
      ? CIVIC_ALERTS
      : CIVIC_ALERTS.filter(alert => alert.category === selectedFilter);

    return [...filtered].sort((a, b) => {
      if (sortBy === 'risk') return Number(b.severity === 'high') - Number(a.severity === 'high') || b.distance - a.distance;
      if (sortBy === 'reported') return b.affectedCitizens - a.affectedCitizens;
      if (sortBy === 'recent') return new Date(b.reportedAt) - new Date(a.reportedAt);
      return a.distance - b.distance;
    });
  }, [selectedFilter, sortBy]);

  return (
    <div className="page-content fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">⚠️ Nearby Civic Alerts</h1>
          <p className="page-subtitle">See urgent civic issues around your area before they escalate.</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="filter-row" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="filter-group" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {ALERT_FILTERS.map(filter => (
              <button
                key={filter.value}
                type="button"
                className={`filter-chip ${selectedFilter === filter.value ? 'active' : ''}`}
                onClick={() => setSelectedFilter(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div style={{ marginLeft: 'auto', minWidth: 180 }}>
            <label htmlFor="alert-sort" className="form-label" style={{ marginBottom: 4 }}>Sort by</label>
            <select
              id="alert-sort"
              className="form-input form-select"
              value={sortBy}
              onChange={event => setSortBy(event.target.value)}
            >
              {ALERT_SORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {visibleAlerts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <div className="empty-state-title">No civic alerts in this filter</div>
          <div className="empty-state-desc">Try changing the category or sorting option.</div>
        </div>
      ) : (
        <div className="alert-grid">
          {visibleAlerts.map(alert => (
            <article key={alert.id} className="alert-card card">
              <div className="alert-card-top">
                <div className="alert-risk-badge">
                  {alert.safetyRisk === 'High' ? '⚠ HIGH SAFETY RISK' : '⚡ MEDIUM SAFETY RISK'}
                </div>
                <span className={`badge badge-${alert.severity === 'high' ? 'high' : 'medium'}`}>
                  {alert.safetyRisk}
                </span>
              </div>

              <h2 className="alert-title">{alert.title}</h2>
              <div className="alert-location">{alert.location}</div>
              <div className="alert-distance">{alert.distance} m away</div>

              <p className="alert-description">{alert.description}</p>

              <div className="alert-metrics">
                <div><strong>Safety Risk:</strong> {alert.safetyRisk}</div>
                <div><strong>Affected Citizens:</strong> {alert.affectedCitizens}</div>
                <div><strong>Recurrence:</strong> {alert.recurrence}×</div>
                <div><strong>Category:</strong> {alert.category}</div>
              </div>

              <div className="alert-footer">
                <span>{alert.department}</span>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => window.location.href = '/citizen/report'}>
                  Report Similar Issue
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
