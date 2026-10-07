import { useState } from 'react';
import { ArrowRight, MapPin, Sparkles, TrendingUp, Wrench } from 'lucide-react';
import { MOCK_ISSUES } from '../../data/mockData';

const chapterFrames = [
  { key: 'problem', title: 'Chapter 1', subtitle: 'Problem discovered', emoji: '⚠️', description: 'A community member notices an obstruction or hazard damaging everyday life and safety.' },
  { key: 'community', title: 'Chapter 2', subtitle: 'Community noticed it', emoji: '👥', description: 'Multiple people flag the same concern and the issue starts to gain visible momentum.' },
  { key: 'action', title: 'Chapter 3', subtitle: 'Action started', emoji: '🚧', description: 'A public team or local worker begins repair work and starts responding to the concern.' },
  { key: 'repair', title: 'Chapter 4', subtitle: 'Repair completed', emoji: '🛠️', description: 'The issue is addressed and the area starts returning to a usable state.' },
  { key: 'impact', title: 'Chapter 5', subtitle: 'Community impact', emoji: '📈', description: 'The repair changes daily routines, commuting, access, and public confidence.' },
  { key: 'current', title: 'Chapter 6', subtitle: 'Current condition', emoji: '✅', description: 'Residents can now see the neighborhood in a safer and more reliable condition.' },
];

export default function CivicStory() {
  const [selectedIssueId, setSelectedIssueId] = useState(MOCK_ISSUES[0].id);

  const issue = MOCK_ISSUES.find((item) => item.id === selectedIssueId) || MOCK_ISSUES[0];

  const stories = chapterFrames.map((chapter, index) => {
    const stats = [
      { label: 'Priority', value: issue.priority },
      { label: 'Status', value: issue.status.replace(/_/g, ' ') },
      { label: 'Area', value: issue.location.area.split(',')[0] },
    ];

    return {
      ...chapter,
      detail: index === 0
        ? `Residents reported a ${issue.title.toLowerCase()} near ${issue.location.landmark}.`
        : index === 1
          ? `The pattern was recognized across ${issue.fusedReports.length + 1} nearby reports.`
          : index === 2
            ? 'The issue moved from notice to work, with local teams taking active steps.'
            : index === 3
              ? 'The repair was completed and the problem was visibly addressed.'
              : index === 4
                ? `The community saw improved access, reduced risk, and stronger confidence.`
                : 'The neighborhood is now in a healthier condition for daily routines and movement.',
      stats,
    };
  });

  return (
    <div className="page-content fade-in">
      <div className="page-header">
        <div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4 }}>
            Civic narrative view
          </div>
          <h1 className="page-title">Civic Story Mode</h1>
          <p className="page-subtitle">Follow how a neighborhood issue grows, responds, and improves over time.</p>
        </div>
        <button className="btn btn-primary">
          <Sparkles size={16} />
          Story timeline
        </button>
      </div>

      <div className="card story-issue-picker">
        <div className="story-picker-label">Select a civic issue</div>
        <div className="story-picker-row">
          {MOCK_ISSUES.slice(0, 4).map((item) => (
            <button
              key={item.id}
              className={`story-option ${selectedIssueId === item.id ? 'active' : ''}`}
              onClick={() => setSelectedIssueId(item.id)}
            >
              {item.title}
            </button>
          ))}
        </div>
      </div>

      <div className="story-hero card">
        <div className="story-hero-visual">
          <span>{issue.category}</span>
          <div className="story-hero-badge">{issue.priority} priority</div>
        </div>
        <div className="story-hero-copy">
          <h2>{issue.title}</h2>
          <p>{issue.description}</p>
          <div className="story-hero-stats">
            <div>
              <span className="story-stat-label">Area</span>
              <strong>{issue.location.area}</strong>
            </div>
            <div>
              <span className="story-stat-label">Status</span>
              <strong>{issue.status.replace(/_/g, ' ')}</strong>
            </div>
            <div>
              <span className="story-stat-label">Issue ID</span>
              <strong>{issue.id}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="story-grid">
        {stories.map((chapter) => (
          <div key={chapter.key} className="card story-card">
            <div className="story-step-marker">{chapter.title}</div>
            <div className="story-card-visual">
              <div className="story-card-icon">{chapter.emoji}</div>
            </div>
            <div className="story-card-copy">
              <h3>{chapter.subtitle}</h3>
              <p>{chapter.detail}</p>
            </div>
            <div className="story-card-stats">
              {chapter.stats.map((stat) => (
                <div key={`${chapter.key}-${stat.label}`}>
                  <span>{stat.label}</span>
                  <strong>{stat.value}</strong>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
