import { useMemo, useState } from 'react';
import { Accessibility, AlertTriangle, ArrowDownWideNarrow, Clock3, ShieldAlert, Users, Zap } from 'lucide-react';
import { EmptyState, StatCard } from '../../components/common/index.jsx';
import AIDecisionExplanation from '../../components/AIDecisionExplanation.jsx';
import { AUTHORITY_ACTIONS, AUTHORITY_ACTION_SUMMARY } from '../../data/advancedCivicData.js';

const filters = ['Today', 'High Risk', 'Safety', 'Accessibility', 'Recurring'];

const riskColor = {
  CRITICAL: '#dc2626',
  HIGH: '#ea580c',
  MEDIUM: '#ca8a04',
  LOW: '#16a34a',
};

export default function DecisionCenter() {
  const [activeFilters, setActiveFilters] = useState(['Today']);

  const actions = useMemo(() => AUTHORITY_ACTIONS
    .filter((action) => activeFilters.every((filter) => action.tags.includes(filter)))
    .sort((first, second) => second.riskScore - first.riskScore),
  [activeFilters]);

  function toggleFilter(filter) {
    setActiveFilters((current) => current.includes(filter)
      ? current.filter((item) => item !== filter)
      : [...current, filter]);
  }

  return (
    <div className="page-content fade-in">
      <div className="page-header">
        <div>
          <div className="feature-eyebrow"><Zap size={15} /> AUTHORITY OPERATIONS</div>
          <h1 className="page-title">Decision Center</h1>
          <p className="page-subtitle">A ranked, mock-data briefing for deciding what deserves attention today.</p>
        </div>
        <div className="chip"><ArrowDownWideNarrow size={15} /> Ranked by combined civic impact</div>
      </div>

      <div className="decision-center-stats">
        <StatCard icon={<AlertTriangle size={21} />} value={AUTHORITY_ACTION_SUMMARY.critical} label="Critical actions" color="#dc2626" />
        <StatCard icon={<ShieldAlert size={21} />} value={AUTHORITY_ACTION_SUMMARY.high} label="High priority" color="#ea580c" />
        <StatCard icon={<Clock3 size={21} />} value={AUTHORITY_ACTION_SUMMARY.preventive} label="Preventive actions" color="#2563eb" />
        <StatCard icon={<Users size={21} />} value={AUTHORITY_ACTION_SUMMARY.affectedCitizens.toLocaleString()} label="Potentially affected citizens" color="#7c3aed" />
      </div>

      <div className="decision-center-heading">
        <div>
          <div className="decision-center-kicker">Today's top actions</div>
          <h2>Act on the risks with the greatest public impact.</h2>
        </div>
        <div className="decision-center-mock-note">Illustrative triage · Review with field teams</div>
      </div>

      <div className="decision-filter-row" role="group" aria-label="Filter action list">
        {filters.map((filter) => (
          <button
            type="button"
            key={filter}
            className={`decision-filter-chip ${activeFilters.includes(filter) ? 'active' : ''}`}
            aria-pressed={activeFilters.includes(filter)}
            onClick={() => toggleFilter(filter)}
          >
            {filter}
          </button>
        ))}
        {activeFilters.length > 0 && (
          <button type="button" className="decision-clear-filter" onClick={() => setActiveFilters([])}>Clear filters</button>
        )}
      </div>

      {actions.length ? (
        <div className="decision-action-list">
          {actions.map((action, index) => (
            <article className="decision-action-card" key={action.id}>
              <div className="decision-action-rank" style={{ '--action-color': riskColor[action.risk] }}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <i />
              </div>
              <div className="decision-action-content">
                <div className="decision-action-title-row">
                  <div>
                    <div className="decision-action-eyebrow">{action.category} · Recommended response</div>
                    <h3>{action.issue}</h3>
                    <div className="decision-action-location">⌖ {action.location}</div>
                  </div>
                  <div className="decision-action-risk">
                    <span className={`risk-pill risk-${action.risk.toLowerCase()}`}>{action.risk}</span>
                    <strong style={{ color: riskColor[action.risk] }}>{action.riskScore}<small>/100</small></strong>
                  </div>
                </div>

                <div className="decision-action-metrics">
                  <Metric icon={<Users size={15} />} label="Affected citizens" value={action.affectedCitizens.toLocaleString()} />
                  <Metric icon={<Accessibility size={15} />} label="Accessibility impact" value={`${action.accessibilityImpact}/100`} />
                  <Metric icon={<AlertTriangle size={15} />} label="Recurrence" value={`${action.recurrence} reports`} />
                </div>

                <div className="decision-action-recommendation">
                  <span><Zap size={15} /> Recommended action</span>
                  <strong>{action.action}</strong>
                </div>
                <div className="decision-action-why"><strong>Why now?</strong> {action.whyNow}</div>
                <div className="decision-action-footer">
                  <div className="decision-tags">{action.tags.filter((tag) => tag !== 'Today').map((tag) => <span key={tag}>{tag}</span>)}</div>
                  <AIDecisionExplanation
                    title={`${action.issue} · ${action.location}`}
                    score={action.riskScore}
                    factors={action.factors}
                    recommendation={action.action}
                    confidence={action.confidence}
                    triggerLabel="Why now?"
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState icon="🧭" title="No actions match these filters" desc="Try removing a filter to see more ranked actions." />
      )}
      <p className="decision-center-disclaimer">All ranking signals and summary counts are illustrative mock data, not live automated authority decisions.</p>
    </div>
  );
}

function Metric({ icon, label, value }) {
  return (
    <div className="decision-action-metric">
      <span>{icon}{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
