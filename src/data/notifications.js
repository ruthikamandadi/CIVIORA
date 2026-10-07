export const DEFAULT_NOTIFICATIONS = [
  {
    id: 'notif-report-assigned',
    type: 'report',
    category: 'Report Update',
    title: 'Report Update',
    message: 'Your pothole report has been assigned to the Roads Department.',
    time: '2 hours ago',
    read: false,
    priority: 'info'
  },
  {
    id: 'notif-safety-alert',
    type: 'safety',
    category: 'Nearby Safety Alert',
    title: 'Safety Alert',
    message: 'A high-risk road issue was detected near MG Road.',
    time: '15 minutes ago',
    read: false,
    priority: 'danger'
  },
  {
    id: 'notif-verification',
    type: 'verification',
    category: 'Verification Required',
    title: 'Action Required',
    message: 'Please verify the repair of your reported streetlight issue.',
    time: '1 day ago',
    read: false,
    priority: 'warning'
  },
  {
    id: 'notif-resolved',
    type: 'system',
    category: 'Resolved',
    title: 'Resolved',
    message: 'Your drainage complaint has been resolved.',
    time: '2 days ago',
    read: true,
    priority: 'success'
  },
  {
    id: 'notif-community',
    type: 'community',
    category: 'Community Update',
    title: 'Community Update',
    message: 'Community volunteers are organizing a cleanup near Market Road this Saturday.',
    time: '4 days ago',
    read: true,
    priority: 'info'
  }
];

export const NOTIFICATION_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'unread', label: 'Unread' },
  { value: 'report', label: 'Reports' },
  { value: 'safety', label: 'Safety' },
  { value: 'verification', label: 'Verification' }
];

export function getStoredNotifications() {
  try {
    const stored = localStorage.getItem('civioraNotifications');
    if (!stored) return DEFAULT_NOTIFICATIONS;
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length ? parsed : DEFAULT_NOTIFICATIONS;
  } catch {
    return DEFAULT_NOTIFICATIONS;
  }
}
