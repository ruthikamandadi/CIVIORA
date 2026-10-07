import { useEffect, useMemo, useState } from 'react';
import { Accessibility, AlertTriangle, ArrowRight, Eye, HeartPulse, ShieldAlert, Users } from 'lucide-react';
import { ACCESSIBILITY_ISSUES, ACCESSIBILITY_GROUPS } from '../../data/accessibilityData.js';

const STORAGE_KEY = 'civicpulse_accessibility_impact';

const levelColors = {
  LOW: '#16a34a',
  MEDIUM: '#f59e0b',
  HIGH: '#ea580c',
  CRITICAL: '#dc2626',
};

const levelScore = { LOW: 1, MEDIUM: 2, HIGH: 3, CRITICAL: 4 };

function getImpactScore(issue) {
  const total = Object.values(issue.impact).reduce((sum, item) => sum + levelScore[item.level], 0);
  const maxPossible = ACCESSIBILITY_GROUPS.length * 4;
  return Math.min(100, Math.round((total / maxPossible) * 100));
}

export default function AccessibilityImpact() {
  const [selectedIssueId, setSelectedIssueId] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return saved.selectedIssueId || ACCESSIBILITY_ISSUES[0].id;
    } catch {
      return ACCESSIBILITY_ISSUES[0].id;
    }
  });

  const [selectedGroup, setSelectedGroup] = useState('All groups');
  const [compareIssueA, setCompareIssueA] = useState(ACCESSIBILITY_ISSUES[0].id);
  const [compareIssueB, setCompareIssueB] = useState(ACCESSIBILITY_ISSUES[1].id);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ selectedIssueId, selectedGroup }));
    } catch {
      // ignore storage errors in restricted browser contexts
    }
  }, [selectedIssueId, selectedGroup]);

  const selectedIssue = ACCESSIBILITY_ISSUES.find((issue) => issue.id === selectedIssueId) || ACCESSIBILITY_ISSUES[0];
  const issueA = ACCESSIBILITY_ISSUES.find((issue) => issue.id === compareIssueA) || ACCESSIBILITY_ISSUES[0];
  const issueB = ACCESSIBILITY_ISSUES.find((issue) => issue.id === compareIssueB) || ACCESSIBILITY_ISSUES[1];

  const filteredGroups = selectedGroup === 'All groups' ? ACCESSIBILITY_GROUPS : [selectedGroup];

  const impactCards = filteredGroups.map((group) => {
    const entry = selectedIssue.impact[group];
    return {
      group,
      level: entry.level,
      score: entry.score,
      color: levelColors[entry.level],
      why: entry.why,
    };
  });

  const overallScore = useMemo(() => getImpactScore(selectedIssue), [selectedIssue]);

  const summaryStats = useMemo(() => {
    const entries = Object.values(selectedIssue.impact);
    const highCount = entries.filter((entry) => entry.level === 'HIGH' || entry.level === 'CRITICAL').length;
    const mediumCount = entries.filter((entry) => entry.level === 'MEDIUM').length;
    return { highCount, mediumCount };
  }, [selectedIssue]);

  const comparison = useMemo(() => {
    const statsA = {
      overall: issueA.overallImpact,
      mobility: issueA.breakdown.Mobility,
      safety: issueA.breakdown.Safety,
      affected: Object.keys(issueA.impact).length,
    };
    const statsB = {
      overall: issueB.overallImpact,
      mobility: issueB.breakdown.Mobility,
      safety: issueB.breakdown.Safety,
      affected: Object.keys(issueB.impact).length,
    };

    return [
      { label: 'Overall impact', a: statsA.overall, b: statsB.overall, unit: '%' },
      { label: 'Mobility', a: statsA.mobility, b: statsB.mobility, unit: '%' },
      { label: 'Safety', a: statsA.safety, b: statsB.safety, unit: '%' },
      { label: 'Affected groups', a: statsA.affected, b: statsB.affected, unit: '' },
    ];
  }, [issueA, issueB]);

  const impactBreakdownCards = Object.entries(selectedIssue.breakdown).map(([label, value]) => ({
    label,
    value,
    color: value >= 80 ? '#1e40af' : value >= 65 ? '#8b5cf6' : '#f59e0b',
  }));

  return (
    <div className="page-content fade-in">
      <div className="page-header">
        <div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4 }}>
            Who is affected and how?
          </div>
          <h1 className="page-title">Accessibility Impact</h1>
          <p className="page-subtitle">View how a civic problem changes access, mobility, safety, and everyday independence for different community groups.</p>
        </div>
        <button className="btn btn-primary">
          <Accessibility size={16} />
          Accessibility overview
        </button>
      </div>

      <div className="card accessibility-summary">
        <div className="accessibility-summary-top">
          <div>
            <div className="section-title">Overall accessibility impact score</div>
            <div className="section-subtitle">A user-centered accessibility view, separate from the smart priority model.</div>
          </div>
          <div className="accessibility-score">{overallScore}</div>
        </div>
        <div className="support-meter" style={{ marginTop: 16 }}>
          <div className="support-meter-fill" style={{ width: `${overallScore}%`, background: 'linear-gradient(90deg, #1e40af, #7c3aed, #f97316)' }} />
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: 24, alignItems: 'start' }}>
        <div className="card">
          <div className="section-header">
            <div className="section-title">Issue selector</div>
          </div>

          <div className="consensus-select-wrap">
            {ACCESSIBILITY_ISSUES.map((issue) => (
              <button
                key={issue.id}
                className={`story-option ${selectedIssueId === issue.id ? 'active' : ''}`}
                onClick={() => setSelectedIssueId(issue.id)}
              >
                {issue.name}
              </button>
            ))}
          </div>

          <div className="issue-consensus-card">
            <div className="issue-consensus-header">
              <div>
                <div className="issue-consensus-id">{selectedIssue.name}</div>
                <h3>{selectedIssue.location}</h3>
              </div>
              <span className="chip">{selectedIssue.impactLevel}</span>
            </div>
            <p>{selectedIssue.description}</p>

            <div style={{ marginTop: 16 }}>
              <div className="filter-row">
                <label className="filter-label" htmlFor="affected-group">Group filter</label>
                <select
                  id="affected-group"
                  className="form-input form-select"
                  value={selectedGroup}
                  onChange={(event) => setSelectedGroup(event.target.value)}
                >
                  <option value="All groups">All groups</option>
                  {ACCESSIBILITY_GROUPS.map((group) => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="section-header">
            <div className="section-title">Impact breakdown</div>
          </div>

          <div className="impact-card-grid">
            {impactBreakdownCards.map((item) => (
              <div key={item.label} className="impact-card" style={{ borderColor: item.color }}>
                <div className="impact-card-header">
                  <div className="impact-card-title">{item.label}</div>
                  <span className="impact-badge" style={{ background: `${item.color}22`, color: item.color }}>
                    {item.value}%
                  </span>
                </div>
                <div className="impact-meter">
                  <div className="impact-meter-fill" style={{ width: `${item.value}%`, background: item.color }} />
                </div>
                <div className="impact-score-number">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: 24, alignItems: 'start' }}>
        <div className="card">
          <div className="section-header">
            <div className="section-title">Why this issue matters</div>
          </div>
          <div className="impact-explanation">
            <div className="impact-explanation-header">
              <div className="impact-icon-wrap"><HeartPulse size={18} /></div>
              <strong>{selectedIssue.name}</strong>
            </div>
            <p>{selectedIssue.explanation}</p>
            <div className="why-it-matters-box">
              <AlertTriangle size={16} />
              <span>{selectedIssue.whyItMatters}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="section-header">
            <div className="section-title">Recommended action</div>
          </div>
          <div className="summary-box">
            <div className="summary-item">
              <div className="summary-icon"><ShieldAlert size={16} /></div>
              <div>
                <div className="summary-label">Priority response</div>
                <div className="summary-value">{selectedIssue.impactLevel}</div>
              </div>
            </div>
            <div className="summary-item">
              <div className="summary-icon"><Eye size={16} /></div>
              <div>
                <div className="summary-label">High-impact groups</div>
                <div className="summary-value">{summaryStats.highCount}</div>
              </div>
            </div>
            <div className="summary-item">
              <div className="summary-icon"><Users size={16} /></div>
              <div>
                <div className="summary-label">Medium-impact groups</div>
                <div className="summary-value">{summaryStats.mediumCount}</div>
              </div>
            </div>
            <div className="recommendation-box">
              <ArrowRight size={16} />
              <span>{selectedIssue.recommendedAction}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <div className="section-header">
          <div className="section-title">Issue comparison</div>
          <div className="section-subtitle">Compare two civic issues on accessibility impact.</div>
        </div>

        <div className="comparison-grid">
          <div className="filter-row">
            <label className="filter-label">Issue A</label>
            <select className="form-input form-select" value={compareIssueA} onChange={(event) => setCompareIssueA(event.target.value)}>
              {ACCESSIBILITY_ISSUES.map((issue) => (
                <option key={issue.id} value={issue.id}>{issue.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-row">
            <label className="filter-label">Issue B</label>
            <select className="form-input form-select" value={compareIssueB} onChange={(event) => setCompareIssueB(event.target.value)}>
              {ACCESSIBILITY_ISSUES.map((issue) => (
                <option key={issue.id} value={issue.id}>{issue.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="comparison-table-wrap">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Metric</th>
                <th>{issueA.name}</th>
                <th>{issueB.name}</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((item) => (
                <tr key={item.label}>
                  <td>{item.label}</td>
                  <td>{item.a}{item.unit}</td>
                  <td>{item.b}{item.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
