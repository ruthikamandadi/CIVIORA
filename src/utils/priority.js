// Priority calculation utilities for CIVIORA

/**
 * Calculate priority score from individual factors.
 * Maximum score is 100.
 */
export function calculatePriorityScore({
  severityScore = 0,    // max 30: how severe the physical damage
  affectedScore = 0,    // max 20: how many people are affected
  recurrenceScore = 0,  // max 20: how many times this has occurred before
  waitingScore = 0,     // max 15: how long it has been waiting
  riskScore = 0,        // max 15: location risk factor
}) {
  const total = severityScore + affectedScore + recurrenceScore + waitingScore + riskScore;
  return Math.min(100, Math.round(total));
}

/**
 * Convert raw severity string to a score out of 30.
 */
export function severityToScore(severity) {
  switch (severity?.toLowerCase()) {
    case 'critical': return 30;
    case 'high': return 22;
    case 'medium': return 14;
    case 'low': return 6;
    default: return 10;
  }
}

/**
 * Convert number of affected people to a score out of 20.
 */
export function affectedToScore(count) {
  if (count >= 400) return 20;
  if (count >= 200) return 17;
  if (count >= 100) return 13;
  if (count >= 50) return 9;
  if (count >= 20) return 5;
  return 2;
}

/**
 * Convert recurrence count to a score out of 20.
 */
export function recurrenceToScore(count) {
  if (count >= 5) return 20;
  if (count >= 4) return 17;
  if (count >= 3) return 14;
  if (count >= 2) return 10;
  if (count >= 1) return 6;
  return 0;
}

/**
 * Convert days waiting (since reported) to a score out of 15.
 */
export function waitingToScore(days) {
  if (days >= 14) return 15;
  if (days >= 7) return 11;
  if (days >= 3) return 7;
  if (days >= 1) return 4;
  return 1;
}

/**
 * Compute full priority breakdown for an issue.
 */
export function getFullPriorityBreakdown(issue) {
  const severityScore = severityToScore(issue.severity);
  const affectedScore = affectedToScore(issue.affectedCitizens || 0);
  const recurrenceScore = recurrenceToScore(issue.recurrenceCount || 0);

  // Calculate days since reported
  const reportedDate = new Date(issue.reportedDate);
  const now = new Date();
  const days = Math.max(0, Math.floor((now - reportedDate) / (1000 * 60 * 60 * 24)));
  const waitingScore = waitingToScore(days);

  // Location risk: base on recurrence + affected combined heuristic
  const riskScore = Math.min(15, Math.round((severityScore / 30) * 15));

  const total = calculatePriorityScore({
    severityScore,
    affectedScore,
    recurrenceScore,
    waitingScore,
    riskScore,
  });

  return {
    total,
    factors: {
      severity: { score: severityScore, max: 30, label: 'Severity' },
      affected: { score: affectedScore, max: 20, label: 'Affected People' },
      recurrence: { score: recurrenceScore, max: 20, label: 'Recurrence' },
      waiting: { score: waitingScore, max: 15, label: 'Waiting Time' },
      risk: { score: riskScore, max: 15, label: 'Location Risk' },
    },
  };
}

/**
 * Get a color class based on priority score.
 */
export function getPriorityColor(score) {
  if (score >= 90) return '#dc2626'; // red
  if (score >= 75) return '#ea580c'; // orange
  if (score >= 60) return '#ca8a04'; // yellow
  return '#16a34a'; // green
}

/**
 * Get priority label from score.
 */
export function getPriorityLabel(score) {
  if (score >= 90) return 'Critical';
  if (score >= 75) return 'High';
  if (score >= 60) return 'Medium';
  return 'Low';
}

/**
 * Format date string to readable format.
 */
export function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

/**
 * Calculate days elapsed since a date.
 */
export function daysAgo(dateStr) {
  if (!dateStr) return 0;
  const d = new Date(dateStr);
  const now = new Date();
  return Math.max(0, Math.floor((now - d) / (1000 * 60 * 60 * 24)));
}
