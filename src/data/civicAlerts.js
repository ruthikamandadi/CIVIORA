export const CIVIC_ALERTS = [
  {
    id: 'alert-pothole-01',
    title: 'Large pothole',
    category: 'Roads',
    location: 'MG Road',
    distance: 320,
    safetyRisk: 'High',
    affectedCitizens: 126,
    recurrence: 3,
    severity: 'high',
    description: 'A large pothole near the college gate is causing repeated near-miss incidents for cyclists and pedestrians.',
    region: 'MG Road, Guntur',
    reportedAt: '2026-09-24T08:15:00Z',
    department: 'Roads & Infrastructure',
    coordinates: { lat: 16.3067, lng: 80.4365 }
  },
  {
    id: 'alert-light-02',
    title: 'Broken streetlight',
    category: 'Safety',
    location: '5th Cross Road',
    distance: 540,
    safetyRisk: 'Medium',
    affectedCitizens: 48,
    recurrence: 1,
    severity: 'medium',
    description: 'Three streetlights remain non-functional after the night shift, leaving the bus stand poorly lit.',
    region: '5th Cross Road, Guntur',
    reportedAt: '2026-09-23T19:10:00Z',
    department: 'Electrical Department',
    coordinates: { lat: 16.31, lng: 80.44 }
  },
  {
    id: 'alert-drainage-03',
    title: 'Blocked drainage',
    category: 'Environment',
    location: 'Brodipet Junction',
    distance: 710,
    safetyRisk: 'High',
    affectedCitizens: 92,
    recurrence: 4,
    severity: 'high',
    description: 'Stagnant water is pooling at the junction, creating a health and mobility risk for commuters.',
    region: 'Brodipet, Guntur',
    reportedAt: '2026-09-22T06:40:00Z',
    department: 'Drainage Department',
    coordinates: { lat: 16.295, lng: 80.42 }
  },
  {
    id: 'alert-garbage-04',
    title: 'Garbage accumulation',
    category: 'Environment',
    location: 'Market Road',
    distance: 940,
    safetyRisk: 'Medium',
    affectedCitizens: 68,
    recurrence: 2,
    severity: 'medium',
    description: 'Overflowing bins and accumulated waste are attracting stray animals near the market.',
    region: 'Market Road, Guntur',
    reportedAt: '2026-09-21T10:30:00Z',
    department: 'Sanitation Department',
    coordinates: { lat: 16.305, lng: 80.43 }
  },
  {
    id: 'alert-crossing-05',
    title: 'Unsafe pedestrian crossing',
    category: 'Accessibility',
    location: 'Lakshmipuram',
    distance: 460,
    safetyRisk: 'High',
    affectedCitizens: 83,
    recurrence: 5,
    severity: 'high',
    description: 'Pedestrians are forced to cross near moving traffic because the marked crossing is missing.',
    region: 'Lakshmipuram, Guntur',
    reportedAt: '2026-09-20T17:05:00Z',
    department: 'Traffic Police',
    coordinates: { lat: 16.315, lng: 80.445 }
  },
  {
    id: 'alert-water-06',
    title: 'Water leakage',
    category: 'Infrastructure',
    location: 'Mangalagiri Road',
    distance: 1180,
    safetyRisk: 'Medium',
    affectedCitizens: 57,
    recurrence: 2,
    severity: 'medium',
    description: 'Water is leaking onto the road surface and creating a slippery layer after every supply cycle.',
    region: 'Mangalagiri Road, Guntur',
    reportedAt: '2026-09-19T14:20:00Z',
    department: 'Water Supply Department',
    coordinates: { lat: 16.288, lng: 80.455 }
  }
];

export const ALERT_FILTERS = [
  { value: 'All', label: 'All' },
  { value: 'Safety', label: 'Safety' },
  { value: 'Roads', label: 'Roads' },
  { value: 'Accessibility', label: 'Accessibility' },
  { value: 'Environment', label: 'Environment' },
  { value: 'Infrastructure', label: 'Infrastructure' }
];

export const ALERT_SORT_OPTIONS = [
  { value: 'nearest', label: 'Nearest' },
  { value: 'risk', label: 'Highest Risk' },
  { value: 'reported', label: 'Most Reported' },
  { value: 'recent', label: 'Recently Reported' }
];
