import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, Coins, Flag, Sparkles, Target, Trophy } from 'lucide-react';

const STORAGE_KEY = 'civicpulse_missions';

const defaultMissions = [
  {
    id: 'pedestrian-safety',
    title: 'Report an unsafe pedestrian area',
    description: 'Capture a public crossing or footpath problem that affects walkability and safety.',
    difficulty: 'Medium',
    points: 140,
    progress: 68,
    status: 'in_progress',
    weekly: true,
    category: 'Safety',
    due: 'This week',
  },
  {
    id: 'damaged-facility',
    title: 'Identify a damaged public facility',
    description: 'Spot a broken public amenity that needs repair, like benches, lights, or fencing.',
    difficulty: 'Easy',
    points: 110,
    progress: 100,
    status: 'completed',
    weekly: true,
    category: 'Infrastructure',
    due: 'Completed',
  },
  {
    id: 'verify-resolution',
    title: 'Verify a resolved issue',
    description: 'Check whether a previously reported civic issue has been repaired to a safe standard.',
    difficulty: 'Medium',
    points: 160,
    progress: 32,
    status: 'in_progress',
    weekly: true,
    category: 'Verification',
    due: 'This week',
  },
  {
    id: 'community-check',
    title: 'Complete a community safety check',
    description: 'Review a neighborhood route and note any visibility, lighting, or accessibility problems.',
    difficulty: 'Hard',
    points: 180,
    progress: 0,
    status: 'new',
    weekly: false,
    category: 'Mobility',
    due: 'Available now',
  },
  {
    id: 'neighborhood-confirmation',
    title: 'Help confirm a neighborhood issue',
    description: 'Add your voice to a shared issue so local teams can see the scale of the problem.',
    difficulty: 'Easy',
    points: 95,
    progress: 100,
    status: 'completed',
    weekly: false,
    category: 'Community',
    due: 'Completed',
  },
];

function readStoredMissions() {
  if (typeof window === 'undefined') return defaultMissions;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultMissions;

    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed) && parsed.length) return parsed;
    return defaultMissions;
  } catch {
    return defaultMissions;
  }
}

export default function CivicMissions() {
  const [missions, setMissions] = useState(readStoredMissions);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(missions));
    }
  }, [missions]);

  const summary = useMemo(() => {
    const completed = missions.filter((mission) => mission.progress >= 100).length;
    const active = missions.filter((mission) => mission.progress > 0 && mission.progress < 100).length;
    const totalPoints = missions.reduce((sum, mission) => {
      const earned = mission.progress >= 100 ? mission.points : Math.round((mission.points * mission.progress) / 100);
      return sum + earned;
    }, 0);
    const averageProgress = Math.round(
      missions.reduce((sum, mission) => sum + mission.progress, 0) / Math.max(missions.length, 1)
    );

    return { completed, active, totalPoints, averageProgress };
  }, [missions]);

  const weeklyMissions = missions.filter((mission) => mission.weekly);

  const missionHistory = missions
    .filter((mission) => mission.progress >= 100)
    .map((mission) => ({
      title: mission.title,
      points: mission.points,
      category: mission.category,
      date: mission.due === 'Completed' ? 'Today' : mission.due,
    }));

  const updateMissionProgress = (missionId) => {
    setMissions((current) =>
      current.map((mission) => {
        if (mission.id !== missionId) return mission;

        const nextProgress = mission.progress >= 100 ? 100 : Math.min(100, mission.progress + 25);
        return {
          ...mission,
          progress: nextProgress,
          status: nextProgress >= 100 ? 'completed' : 'in_progress',
          due: nextProgress >= 100 ? 'Completed' : 'In progress',
        };
      })
    );
  };

  return (
    <div className="page-content fade-in">
      <div className="page-header">
        <div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4 }}>
            Community action tracker
          </div>
          <h1 className="page-title">Civic Mission System</h1>
          <p className="page-subtitle">Build neighborhood momentum with small, visible steps for safer public spaces.</p>
        </div>
        <button className="btn btn-primary">
          <Flag size={16} />
          Weekly focus
        </button>
      </div>

      <div className="grid-4" style={{ marginBottom: 28 }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dbeafe', color: '#1e40af' }}>
            <Trophy size={20} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{summary.completed}</div>
            <div className="stat-label">Missions complete</div>
            <div className="stat-change stat-up">+2 this week</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dcfce7', color: '#16a34a' }}>
            <CheckCircle2 size={20} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{summary.averageProgress}%</div>
            <div className="stat-label">Average progress</div>
            <div className="stat-change stat-up">Steady momentum</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7', color: '#ca8a04' }}>
            <Coins size={20} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{summary.totalPoints}</div>
            <div className="stat-label">Impact points</div>
            <div className="stat-change stat-up">Local contributions</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e0e7ff', color: '#4338ca' }}>
            <Target size={20} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{summary.active}</div>
            <div className="stat-label">Active missions</div>
            <div className="stat-change stat-up">Ready to continue</div>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        <div>
          <div className="section-header">
            <div className="section-title">Current missions</div>
            <div className="section-subtitle">Progress updates save automatically in your browser.</div>
          </div>

          <div className="mission-grid">
            {missions.map((mission) => (
              <div key={mission.id} className="card mission-card">
                <div className="mission-card-top">
                  <span className={`mission-difficulty difficulty-${mission.difficulty.toLowerCase()}`}>
                    {mission.difficulty}
                  </span>
                  <span className="chip">{mission.points} pts</span>
                </div>

                <div className="mission-meta">
                  <Sparkles size={14} />
                  {mission.category}
                </div>

                <h3 className="mission-title">{mission.title}</h3>
                <p className="mission-description">{mission.description}</p>

                <div className="mission-progress-row">
                  <span>{mission.progress}%</span>
                  <span>{mission.due}</span>
                </div>
                <div className="progress-bar" style={{ marginTop: 8 }}>
                  <div
                    className="progress-fill"
                    style={{
                      width: `${mission.progress}%`,
                      background: mission.progress >= 100 ? '#16a34a' : '#1e40af',
                    }}
                  />
                </div>

                <button
                  className={`mission-action ${mission.progress >= 100 ? 'complete' : ''}`}
                  onClick={() => updateMissionProgress(mission.id)}
                >
                  {mission.progress >= 100 ? 'Completed' : mission.progress > 0 ? 'Advance progress' : 'Start mission'}
                  <ArrowRight size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card">
            <div className="section-header">
              <div className="section-title">Weekly missions</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {weeklyMissions.map((mission) => (
                <div key={mission.id} className="weekly-item">
                  <div>
                    <div className="weekly-label">{mission.title}</div>
                    <div className="weekly-subtext">{mission.category}</div>
                  </div>
                  <div className="weekly-progress">{mission.progress}%</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="section-header" style={{ marginBottom: 12 }}>
              <div className="section-title">Mission history</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {missionHistory.length > 0 ? (
                missionHistory.map((item) => (
                  <div key={item.title} className="history-item">
                    <div className="history-icon"><CheckCircle2 size={16} /></div>
                    <div>
                      <div className="history-title">{item.title}</div>
                      <div className="history-meta">{item.category} · {item.points} pts</div>
                    </div>
                    <div className="history-date">{item.date}</div>
                  </div>
                ))
              ) : (
                <div className="empty-state" style={{ padding: 20 }}>
                  <div className="empty-state-icon">🏁</div>
                  <div className="empty-state-title">No completed missions yet</div>
                  <div className="empty-state-desc">Start a mission to build your civic track record.</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
