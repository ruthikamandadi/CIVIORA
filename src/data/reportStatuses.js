export const REPORT_STATUS_STAGES = [
  { key: 'reported', label: 'Report Submitted', description: 'Your report was received by CIVIORA and assigned a civic reference ID.' },
  { key: 'ai_analysed', label: 'AI Analysis', description: 'AI-assisted review classified the issue and estimated urgency.' },
  { key: 'fused', label: 'Issue Review', description: 'Similar reports in the area were merged to avoid duplication.' },
  { key: 'assigned', label: 'Authority Review', description: 'The issue was reviewed and assigned to the responsible department.' },
  { key: 'in_progress', label: 'Repair In Progress', description: 'Field teams are currently working on the issue.' },
  { key: 'awaiting_verification', label: 'Evidence Uploaded', description: 'The repair work has been completed and evidence has been shared.' },
  { key: 'resolved', label: 'Resolved', description: 'The issue was closed after citizen verification or authority review.' }
];

export const STATUS_MESSAGE_MAP = {
  reported: 'Your report has been submitted and is waiting for civic review.',
  ai_analysed: 'Your issue was reviewed with an AI-assisted draft to assess the urgency and department.',
  fused: 'Similar civic reports in your area were reviewed and merged if needed.',
  assigned: 'Your report was assigned to the Roads Department.',
  in_progress: 'Repair is currently in progress and the field team is on site.',
  awaiting_verification: 'Your verification is required before the issue can be marked complete.',
  resolved: 'This issue has been resolved and closed after verification.'
};
