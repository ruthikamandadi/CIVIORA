import { useMemo, useState } from 'react';
import { CheckCircle2, HeartHandshake, MessageSquareText, ShieldPlus, Users } from 'lucide-react';
import { MOCK_ISSUES } from '../../data/mockData';

const supportOptions = ['Affects me', 'Affects my family', 'Affects my route', 'Safety concern', 'Accessibility concern'];

const defaultSupportMap = {
  'CP-198': { 'Affects me': 132, 'Affects my family': 96, 'Affects my route': 78, 'Safety concern': 118, 'Accessibility concern': 52 },
  'CP-204': { 'Affects me': 118, 'Affects my family': 72, 'Affects my route': 88, 'Safety concern': 105, 'Accessibility concern': 46 },
  'CP-215': { 'Affects me': 81, 'Affects my family': 62, 'Affects my route': 70, 'Safety concern': 94, 'Accessibility concern': 35 },
  'CP-187': { 'Affects me': 110, 'Affects my family': 84, 'Affects my route': 67, 'Safety concern': 98, 'Accessibility concern': 58 },
};

const recentConfirmations = {
  'CP-198': [
    { name: 'Asha', reason: 'Affects my family', time: '2 min ago' },
    { name: 'Dinesh', reason: 'Safety concern', time: '8 min ago' },
    { name: 'Meenakshi', reason: 'Accessibility concern', time: '12 min ago' },
  ],
  'CP-204': [
    { name: 'Rohit', reason: 'Affects my route', time: '4 min ago' },
    { name: 'Leela', reason: 'Safety concern', time: '10 min ago' },
    { name: 'Nandini', reason: 'Affects me', time: '16 min ago' },
  ],
  'CP-215': [
    { name: 'Kiran', reason: 'Safety concern', time: '5 min ago' },
    { name: 'Rani', reason: 'Affects my family', time: '14 min ago' },
  ],
  'CP-187': [
    { name: 'Karthik', reason: 'Affects my route', time: '7 min ago' },
    { name: 'Shalini', reason: 'Accessibility concern', time: '19 min ago' },
  ],
};

export default function CommunityConsensus() {
  const [selectedIssueId, setSelectedIssueId] = useState('CP-198');
  const [supportData, setSupportData] = useState(defaultSupportMap);

  const issue = MOCK_ISSUES.find((item) => item.id === selectedIssueId) || MOCK_ISSUES[0];

  const summary = useMemo(() => {
    const currentCounts = supportData[selectedIssueId] || defaultSupportMap[selectedIssueId];
    const totalSupport = Object.values(currentCounts).reduce((sum, value) => sum + value, 0);
    const affectedPercentage = Math.min(100, Math.round((totalSupport / Math.max(issue.affectedCitizens, 1)) * 100));
    const confidence = Math.min(97, Math.max(52, Math.round((affectedPercentage * 0.7) + 30)));
    return { currentCounts, totalSupport, affectedPercentage, confidence };
  }, [issue, selectedIssueId, supportData]);

  const handleSupport = (label) => {
    setSupportData((current) => ({
      ...current,
      [selectedIssueId]: {
        ...(current[selectedIssueId] || defaultSupportMap[selectedIssueId]),
        [label]: (current[selectedIssueId]?.[label] || 0) + 1,
      },
    }));
  };

  return (
    <div className="page-content fade-in">
      <div className="page-header">
        <div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4 }}>
            Community validation
          </div>
          <h1 className="page-title">Community Consensus</h1>
          <p className="page-subtitle">Confirm existing issues without creating duplicate reports.</p>
        </div>
        <button className="btn btn-success">
          <CheckCircle2 size={16} />
          Verified by residents
        </button>
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        <div className="card">
          <div className="section-header">
            <div className="section-title">Shared issue</div>
          </div>

          <div className="consensus-select-wrap">
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

          <div className="issue-consensus-card">
            <div className="issue-consensus-header">
              <div>
                <div className="issue-consensus-id">{issue.id}</div>
                <h3>{issue.title}</h3>
              </div>
              <span className="chip">{issue.location.area}</span>
            </div>
            <p>{issue.description}</p>

            <div className="consensus-actions">
              {supportOptions.map((option) => (
                <button key={option} className="consensus-option" onClick={() => handleSupport(option)}>
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card support-summary">
            <div className="section-header" style={{ marginBottom: 12 }}>
              <div className="section-title">Community support</div>
            </div>

            <div className="support-metrics">
              <div>
                <span className="support-label">Support count</span>
                <strong>{summary.totalSupport}</strong>
              </div>
              <div>
                <span className="support-label">Affected citizens</span>
                <strong>{summary.affectedPercentage}%</strong>
              </div>
              <div>
                <span className="support-label">Confidence</span>
                <strong>{summary.confidence}%</strong>
              </div>
            </div>

            <div className="support-meter">
              <div className="support-meter-fill" style={{ width: `${summary.affectedPercentage}%` }} />
            </div>
          </div>

          <div className="card">
            <div className="section-header">
              <div className="section-title">Recent confirmations</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(recentConfirmations[selectedIssueId] || []).map((entry) => (
                <div key={`${entry.name}-${entry.time}`} className="confirmation-item">
                  <div className="confirmation-avatar">{entry.name.slice(0, 1)}</div>
                  <div>
                    <div className="confirmation-name">{entry.name}</div>
                    <div className="confirmation-reason">{entry.reason}</div>
                  </div>
                  <div className="confirmation-time">{entry.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
