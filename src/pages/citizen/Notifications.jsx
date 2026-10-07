import { useState } from 'react';
import { NOTIFICATIONS_DATA } from '../../data/mockData';
import { NotificationCard } from '../../components/common/index.jsx';

export default function Notifications() {
  const [notifs, setNotifs] = useState(NOTIFICATIONS_DATA);
  const [filter, setFilter] = useState('all');

  function markRead(id) {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }

  function markAllRead() {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  }

  const unread = notifs.filter(n => !n.read).length;
  const filtered = filter === 'unread' ? notifs.filter(n => !n.read) : notifs;

  return (
    <div className="page-content fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">🔔 Notifications</h1>
          <p className="page-subtitle">{unread} unread notification{unread !== 1 ? 's' : ''}</p>
        </div>
        {unread > 0 && (
          <button className="btn btn-outline btn-sm" onClick={markAllRead}>
            Mark All as Read
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['all', 'unread'].map(f => (
          <button
            key={f}
            className={`btn ${filter === f ? 'btn-primary' : 'btn-ghost'} btn-sm`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : 'Unread'} {f === 'unread' && unread > 0 ? `(${unread})` : ''}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 700 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🎉</div>
            <div style={{ fontWeight: 600 }}>You're all caught up!</div>
          </div>
        ) : (
          filtered.map(n => (
            <NotificationCard key={n.id} notif={n} onRead={() => markRead(n.id)} />
          ))
        )}
      </div>
    </div>
  );
}
