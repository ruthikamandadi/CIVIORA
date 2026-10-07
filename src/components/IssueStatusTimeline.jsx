import { REPORT_STATUS_STAGES, STATUS_MESSAGE_MAP } from '../data/reportStatuses.js';

export default function IssueStatusTimeline({ report, status }) {
  const timeline = Array.isArray(report?.timeline) && report.timeline.length > 0
    ? report.timeline
    : REPORT_STATUS_STAGES.map(stage => ({ step: stage.key, date: report?.reportedDate || '—', note: stage.description }));

  const activeStatus = status || report?.status || 'reported';
  const stageOrder = REPORT_STATUS_STAGES.map(stage => stage.key);
  const currentIndex = Math.max(0, stageOrder.indexOf(activeStatus) === -1 ? stageOrder.length - 1 : stageOrder.indexOf(activeStatus));

  return (
    <div className="issue-status-timeline" aria-label="Issue status timeline">
      {REPORT_STATUS_STAGES.map((stage, index) => {
        const isComplete = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isUpcoming = index > currentIndex;
        const matchingEvent = timeline.find(item => item.step === stage.key) || timeline[index] || {};
        const departmentText = report?.department ? `Responsible department: ${report.department}` : 'Department review in progress';

        return (
          <div key={stage.key} className={`timeline-stage ${isComplete ? 'complete' : ''} ${isCurrent ? 'current' : ''} ${isUpcoming ? 'upcoming' : ''}`}>
            <div className="timeline-node-wrap">
              <div className={`timeline-node ${isComplete ? 'complete' : ''} ${isCurrent ? 'current' : ''} ${isUpcoming ? 'upcoming' : ''}`}>
                {isComplete ? '✓' : index + 1}
              </div>
              {index < REPORT_STATUS_STAGES.length - 1 && <div className="timeline-connector" />}
            </div>

            <div className="timeline-content-panel">
              <div className="timeline-heading-row">
                <span className="timeline-label">{stage.label}</span>
                {isCurrent && <span className="timeline-current-badge">Current</span>}
              </div>

              <p className="timeline-summary">
                {matchingEvent?.note || stage.description}
              </p>

              {matchingEvent?.date && (
                <div className="timeline-meta">
                  <span>{matchingEvent.date}</span>
                  {matchingEvent?.time && <span>{matchingEvent.time}</span>}
                </div>
              )}

              {(isCurrent || isComplete) && (
                <div className="timeline-detail">
                  {STATUS_MESSAGE_MAP[stage.key] || departmentText}
                </div>
              )}

              {isUpcoming && (
                <div className="timeline-detail timeline-detail-muted">
                  {stage.description}
                </div>
              )}

              {report?.department && isCurrent && (
                <div className="timeline-department">
                  {departmentText}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
