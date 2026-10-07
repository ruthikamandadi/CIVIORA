import { useMemo, useState } from 'react';
import { Activity, CalendarClock, MapPin, ShieldAlert, TrendingUp } from 'lucide-react';
import { EmptyState } from '../../components/common/index.jsx';
import AIDecisionExplanation from '../../components/AIDecisionExplanation.jsx';
import { EARLY_WARNINGS } from '../../data/advancedCivicData.js';

const riskColors = {
  LOW: '#16a34a',
  MEDIUM: '#ca8a04',
  HIGH: '#ea580c',
  CRITICAL: '#dc2626',
};

export default function EarlyWarningCenter() {
  const [areaFilter, setAreaFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [horizonFilter, setHorizonFilter] = useState('');
  const [selectedId, setSelectedId] = useState(EARLY_WARNINGS[0]?.id || '');

  const filteredWarnings = useMemo(() => EARLY_WARNINGS.filter((warning) =>
    (!areaFilter || warning.area === areaFilter) &&
    (!typeFilter || warning.issueType === typeFilter) &&
    (!riskFilter || warning.riskLevel === riskFilter) &&
    (!horizonFilter || warning.timeHorizon === horizonFilter)
  ), [areaFilter, typeFilter, riskFilter, horizonFilter]);

  const selected = filteredWarnings.find((warning) => warning.id === selectedId) || filteredWarnings[0];

  function updateFilter(setter, value) {
    setter(value);
    setSelectedId('');
  }

  return (
    <div className="page-content fade-in">
      <div className="page-header">
        <div>
          <div className="feature-eyebrow"><Activity size={15} /> PREVENT BEFORE ESCALATION</div>
          <h1 className="page-title">Civic Early Warning Center</h1>
          <p className="page-subtitle">Illustrative risk signals from mock incident history help teams decide where preventive checks may help.</p>
        </div>
        <div className="chip"><span className="warning-live-dot" /> Mock outlook · Not live ML</div>
      </div>

      <div className="warning-hero">
        <div>
          <div className="warning-hero-kicker">Emerging civic risks</div>
          <h2>Find the next issue before it becomes a disruption.</h2>
          <p>Review recurrence, nearby reports, and local exposure indicators. Predictions shown here are a frontend demonstration.</p>
        </div>
        <div className="warning-hero-stat">
          <strong>{EARLY_WARNINGS.length}</strong>
          <span>watch areas</span>
          <div className="warning-mini-bars" aria-hidden="true"><i /><i /><i /><i /><i /></div>
        </div>
      </div>

      <div className="warning-filter-bar">
        <FilterSelect label="Area" value={areaFilter} onChange={(value) => updateFilter(setAreaFilter, value)} options={[...new Set(EARLY_WARNINGS.map((item) => item.area))]} />
        <FilterSelect label="Issue type" value={typeFilter} onChange={(value) => updateFilter(setTypeFilter, value)} options={[...new Set(EARLY_WARNINGS.map((item) => item.issueType))]} />
        <FilterSelect label="Risk level" value={riskFilter} onChange={(value) => updateFilter(setRiskFilter, value)} options={Object.keys(riskColors)} />
        <FilterSelect label="Time horizon" value={horizonFilter} onChange={(value) => updateFilter(setHorizonFilter, value)} options={[...new Set(EARLY_WARNINGS.map((item) => item.timeHorizon))]} />
      </div>

      <div className="warning-layout">
        <section className="warning-list" aria-label="Emerging risks">
          {filteredWarnings.length ? filteredWarnings.map((warning, index) => (
            <button
              type="button"
              key={warning.id}
              className={`warning-item ${selected?.id === warning.id ? 'selected' : ''}`}
              onClick={() => setSelectedId(warning.id)}
            >
              <span className="warning-item-rank">{String(index + 1).padStart(2, '0')}</span>
              <span className="warning-item-main">
                <span className="warning-item-heading">
                  <strong>{warning.issueType}</strong>
                  <span className={`risk-pill risk-${warning.riskLevel.toLowerCase()}`}>{warning.riskLevel}</span>
                </span>
                <span className="warning-item-location"><MapPin size={13} />{warning.area}</span>
                <span className="warning-item-meta">{warning.escalation} to possible escalation · {warning.recurrence} related reports</span>
                <span className="warning-meter"><i style={{ width: `${warning.riskScore}%`, background: riskColors[warning.riskLevel] }} /></span>
              </span>
              <span className="warning-item-score" style={{ color: riskColors[warning.riskLevel] }}>{warning.riskScore}</span>
            </button>
          )) : (
            <EmptyState icon="🛰️" title="No matching warnings" desc="Try adjusting the area, issue type, risk level, or time horizon filters." />
          )}
        </section>

        {selected && (
          <aside className="warning-detail card">
            <div className="warning-detail-top">
              <div className="warning-detail-icon"><ShieldAlert size={20} /></div>
              <span className={`risk-pill risk-${selected.riskLevel.toLowerCase()}`}>{selected.riskLevel} risk</span>
            </div>
            <div className="warning-detail-kicker">Emerging risk · {selected.issueType}</div>
            <h2>{selected.area}</h2>
            <p className="warning-impact">{selected.predictedImpact}</p>
            <div className="warning-facts">
              <div><span>Current severity</span><strong>{selected.currentSeverity}</strong></div>
              <div><span>Predicted escalation</span><strong><CalendarClock size={14} />{selected.escalation}</strong></div>
              <div><span>Historical recurrence</span><strong>{selected.recurrence} incidents</strong></div>
            </div>

            <div className="warning-why">
              <div className="warning-section-title"><TrendingUp size={16} /> Why this warning?</div>
              {selected.reasons.map((reason) => <div className="warning-reason" key={reason}><span>+</span>{reason}</div>)}
            </div>

            <div className="warning-action">
              <span>Preventive action</span>
              <p>{selected.recommendedAction}</p>
            </div>
            <AIDecisionExplanation
              title={`${selected.issueType} · ${selected.area}`}
              score={selected.riskScore}
              factors={selected.factors}
              recommendation={selected.recommendedAction}
              confidence={selected.confidence}
              triggerLabel="Explain this warning"
            />
          </aside>
        )}
      </div>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <label className="warning-filter">
      <span>{label}</span>
      <select className="form-input form-select" value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">All {label.toLowerCase()}s</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}
