import { useMemo, useState } from 'react';
import { Activity, Leaf, MapPin, ShieldCheck, Sparkles, TrainFront, Trees, Users } from 'lucide-react';
import { MOCK_ISSUES } from '../../data/mockData';

const areaProfiles = {
  'My Area': {
    summary: 'Strong local activity with improving public access and safety.',
    metrics: { Safety: 82, Cleanliness: 74, Accessibility: 79, Mobility: 86, Environment: 76, Infrastructure: 71, Community: 88 },
  },
  'Nearby Area': {
    summary: 'Active commuter routes need stronger maintenance and visibility.',
    metrics: { Safety: 74, Cleanliness: 69, Accessibility: 71, Mobility: 80, Environment: 72, Infrastructure: 66, Community: 81 },
  },
  'City Center': {
    summary: 'High footfall creates fast-moving change in traffic and sanitation.',
    metrics: { Safety: 68, Cleanliness: 62, Accessibility: 73, Mobility: 64, Environment: 70, Infrastructure: 75, Community: 79 },
  },
  'Residential Area': {
    summary: 'Neighborhood life is stable and community engagement remains healthy.',
    metrics: { Safety: 86, Cleanliness: 80, Accessibility: 84, Mobility: 78, Environment: 85, Infrastructure: 82, Community: 90 },
  },
  'Market Area': {
    summary: 'Crowded commercial zones require stronger cleanup and safety checks.',
    metrics: { Safety: 63, Cleanliness: 59, Accessibility: 66, Mobility: 71, Environment: 68, Infrastructure: 62, Community: 74 },
  },
};

const metricMeta = {
  Safety: { color: '#1e40af', icon: <ShieldCheck size={16} /> },
  Cleanliness: { color: '#16a34a', icon: <Sparkles size={16} /> },
  Accessibility: { color: '#7c3aed', icon: <Users size={16} /> },
  Mobility: { color: '#f59e0b', icon: <TrainFront size={16} /> },
  Environment: { color: '#0ea5e9', icon: <Leaf size={16} /> },
  Infrastructure: { color: '#ea580c', icon: <MapPin size={16} /> },
  Community: { color: '#ec4899', icon: <Activity size={16} /> },
};

const areaOptions = Object.keys(areaProfiles);

export default function NeighborhoodPulse() {
  const [selectedArea, setSelectedArea] = useState('My Area');

  const { pulseScore, metrics, issueSummary } = useMemo(() => {
    const profile = areaProfiles[selectedArea];
    const areaIssues = MOCK_ISSUES.filter((issue) => {
      const text = issue.location?.area || '';
      if (selectedArea === 'My Area') return /guntur|market|lakshmipuram|brodipet|mg/i.test(text);
      if (selectedArea === 'Nearby Area') return /guntur|lakshmipuram|brodipet/i.test(text);
      if (selectedArea === 'City Center') return /mg road|market road|city center|bus stand/i.test(text);
      if (selectedArea === 'Residential Area') return /lakshmipuram|residential|apartment|cross/i.test(text);
      if (selectedArea === 'Market Area') return /market road|market|vegetable market/i.test(text);
      return true;
    });

    const avgPriority = areaIssues.length
      ? Math.round(areaIssues.reduce((sum, issue) => sum + (issue.priority || 0), 0) / areaIssues.length)
      : 68;

    const scoreBase = 100 - (avgPriority / 3);
    const fixedScore = Math.max(52, Math.min(96, Math.round(scoreBase + (selectedArea === 'Residential Area' ? 8 : 0) - (selectedArea === 'Market Area' ? 7 : 0))));

    const adjustedMetrics = Object.fromEntries(
      Object.entries(profile.metrics).map(([label, value]) => {
        const issueModifier = selectedArea === 'Market Area' && (label === 'Cleanliness' || label === 'Safety') ? -9 : 0;
        const areaModifier = selectedArea === 'Residential Area' && (label === 'Community' || label === 'Safety') ? 6 : 0;
        return [label, Math.max(45, Math.min(99, value + issueModifier + areaModifier))];
      })
    );

    return {
      pulseScore: fixedScore,
      metrics: adjustedMetrics,
      issueSummary: areaIssues.length
        ? `${areaIssues.length} live civic issues are influencing this neighborhood signal.`
        : 'No active local issues are currently increasing neighborhood risk.',
    };
  }, [selectedArea]);

  return (
    <div className="page-content fade-in">
      <div className="page-header">
        <div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4 }}>
            Live civic conditions
          </div>
          <h1 className="page-title">Neighborhood Pulse</h1>
          <p className="page-subtitle">A quick read of how your neighborhood is feeling today.</p>
        </div>
        <button className="btn btn-accent">
          <Activity size={16} />
          Live signal
        </button>
      </div>

      <div className="pulse-layout">
        <div className="card pulse-score-panel">
          <div className="area-switcher">
            {areaOptions.map((area) => (
              <button
                key={area}
                className={`area-option ${selectedArea === area ? 'active' : ''}`}
                onClick={() => setSelectedArea(area)}
              >
                {area}
              </button>
            ))}
          </div>

          <div
            className="pulse-score-ring"
            style={{
              background: `conic-gradient(#1e40af ${pulseScore * 3.6}deg, rgba(148, 163, 184, 0.18) 0deg)`,
            }}
          >
            <div className="pulse-score-center">
              <div className="pulse-score-number">{pulseScore}</div>
              <div className="pulse-score-label">Neighborhood Pulse Score</div>
            </div>
          </div>

          <div className="pulse-summary">
            <div className="pulse-summary-title">{selectedArea}</div>
            <p>{areaProfiles[selectedArea].summary}</p>
            <div className="pulse-summary-note">{issueSummary}</div>
          </div>
        </div>

        <div className="pulse-grid">
          {Object.entries(metrics).map(([label, value]) => (
            <div key={label} className="pulse-metric card">
              <div className="pulse-metric-header">
                <div className="pulse-metric-label">{metricMeta[label].icon} {label}</div>
                <div className="pulse-metric-value">{value}%</div>
              </div>
              <div className="pulse-ring" style={{ background: `conic-gradient(${metricMeta[label].color} ${value * 3.6}deg, rgba(148,163,184,0.15) 0deg)` }}>
                <div className="pulse-ring-inner">{value}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
