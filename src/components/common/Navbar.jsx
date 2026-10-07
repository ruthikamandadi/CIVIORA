import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home, LayoutDashboard, FilePlus, FileText, Map, Bell, User, LogOut,
  Menu, X, ChevronDown, Wifi, WifiOff, Globe, Activity, TrendingUp, Accessibility,
  Route as RouteIcon, AlertTriangle, ClipboardCheck
} from 'lucide-react';
import './nav.css';
import { useLanguage } from '../../context/LanguageContext.jsx';

// Navbar for public/landing pages
function LanguageSelector({ lang, onLangChange }) {
  return (
    <label className="language-selector" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-muted)', marginRight: 8 }}>
      <Globe size={14} />
      <select
        aria-label="Select language"
        value={lang}
        onChange={(event) => onLangChange && onLangChange(event.target.value)}
        className="lang-select"
      >
        <option value="en">English</option>
        <option value="te">తెలుగు</option>
        <option value="hi">हिन्दी</option>
      </select>
    </label>
  );
}

export function Navbar({ user, onLogout, lang, onLangChange, unreadCount = 0 }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const currentLanguage = lang || language;
  const handleLangChange = onLangChange || setLanguage;

  const citizenLinks = [
    { to: '/', label: t('home'), icon: <Home size={16} /> },
    { to: '/citizen/dashboard', label: t('dashboard'), icon: <LayoutDashboard size={16} /> },
    { to: '/citizen/report', label: t('reportIssue'), icon: <FilePlus size={16} /> },
    { to: '/citizen/missions', label: t('missions'), icon: <TrendingUp size={16} /> },
    { to: '/citizen/passport', label: t('passport'), icon: <User size={16} /> },
    { to: '/citizen/pulse', label: t('neighborhoodPulse'), icon: <Activity size={16} /> },
    { to: '/citizen/services', label: t('services'), icon: <ClipboardCheck size={16} /> },
    { to: '/citizen/urgent-hazard', label: t('urgentHazard'), icon: <AlertTriangle size={16} /> },
    { to: '/citizen/alerts', label: t('nearbyAlerts'), icon: <AlertTriangle size={16} /> },
    { to: '/citizen/help', label: t('help'), icon: <ClipboardCheck size={16} /> },
    { to: '/citizen/accessibility', label: t('accessibility'), icon: <Accessibility size={16} /> },
    { to: '/citizen/safe-route', label: t('safeRoute'), icon: <RouteIcon size={16} /> },
    { to: '/citizen/map', label: t('map'), icon: <Map size={16} /> },
  ];

  const primaryNav = citizenLinks.filter(link => ['/', '/citizen/dashboard', '/citizen/report', '/citizen/missions', '/citizen/passport', '/citizen/pulse', '/citizen/services'].includes(link.to));
  const secondaryNav = citizenLinks.filter(link => !primaryNav.some(item => item.to === link.to));

  const showSecondaryMenu = secondaryNav.length > 0;

  const handleNavClose = () => {
    setMoreOpen(false);
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-brand" onClick={handleNavClose}>
          <div className="navbar-logo">C</div>
          <div>
            <div className="navbar-name">CIVIORA</div>
            <div className="navbar-tagline">AI-Powered Civic Intelligence</div>
          </div>
        </NavLink>

        <div className="navbar-center">
          <ul className="navbar-links">
            {primaryNav.map(link => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) => 'navbar-link' + (isActive ? ' active' : '')}
                  onClick={() => setMoreOpen(false)}
                >
                  {link.icon}
                  {link.label}
                </NavLink>
              </li>
            ))}

            {showSecondaryMenu && (
              <li className="nav-more-item">
                <button
                  type="button"
                  className={`nav-more ${moreOpen ? 'open' : ''}`}
                  onClick={() => setMoreOpen(!moreOpen)}
                  aria-expanded={moreOpen}
                  aria-label="More navigation links"
                >
                  More <ChevronDown size={14} />
                </button>

                {moreOpen && (
                  <div className="nav-more-menu" role="menu" aria-label="More navigation links">
                    {secondaryNav.map(link => (
                      <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) => 'nav-more-link' + (isActive ? ' active' : '')}
                        onClick={() => setMoreOpen(false)}
                      >
                        {link.icon}
                        {link.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </li>
            )}
          </ul>
        </div>

        <div className="navbar-actions">
          <select
            className="lang-select"
            aria-label="Select language"
            value={currentLanguage}
            onChange={e => handleLangChange && handleLangChange(e.target.value)}
          >
            <option value="en">English</option>
            <option value="te">తెలుగు</option>
            <option value="hi">हिन्दी</option>
          </select>

          {user ? (
            <>
              <button className="notif-btn" onClick={() => navigate('/citizen/notifications')}>
                <Bell size={18} />
                {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
              </button>

              <div className="user-menu">
                <div className="user-avatar">{user.name?.[0] || 'U'}</div>
                <span>{user.name?.split(' ')[0]}</span>
                <span className={`role-badge role-${user.role}`}>
                  {user.role === 'citizen' ? 'Citizen' : user.role === 'authority' ? 'Authority' : 'Field Worker'}
                </span>
                <ChevronDown size={14} />
              </div>

              <button className="btn btn-ghost btn-sm" onClick={onLogout}>
                <LogOut size={14} />
                {t('logout')}
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-outline btn-sm" onClick={() => navigate('/login')}>
                {t('login')}
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => navigate('/citizen/report')}>
                <FilePlus size={14} />
                {t('reportIssue')}
              </button>
            </>
          )}

          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Open menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="mobile-nav-panel" role="dialog" aria-label="Mobile navigation">
          <div className="mobile-nav-header">
            <span>CIVIORA</span>
            <button type="button" className="mobile-close" onClick={() => setMenuOpen(false)} aria-label="Close navigation">
              <X size={18} />
            </button>
          </div>
          <div className="mobile-nav-list">
            {citizenLinks.map(link => (
              <NavLink key={link.to} to={link.to} className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
                {link.icon}
                {link.label}
              </NavLink>
            ))}
          </div>
          <div className="mobile-nav-footer">
            <button className="btn btn-outline btn-sm" style={{ width: '100%' }} onClick={() => { navigate('/login'); setMenuOpen(false); }}>
              {t('login')}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

// Sidebar for dashboard layouts
export function Sidebar({ role = 'citizen', user, onLogout, activePath }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const citizenNav = [
    { to: '/citizen/dashboard', label: t('dashboard'), icon: <LayoutDashboard size={18} /> },
    { to: '/citizen/report', label: t('reportIssue'), icon: <FilePlus size={18} /> },
    { to: '/citizen/my-reports', label: t('myReports'), icon: <FileText size={18} /> },
    { to: '/citizen/missions', label: t('missions'), icon: <TrendingUp size={18} /> },
    { to: '/citizen/passport', label: t('passport'), icon: <User size={18} /> },
    { to: '/citizen/pulse', label: t('neighborhoodPulse'), icon: <Activity size={18} /> },
    { to: '/citizen/services', label: t('services'), icon: <ClipboardCheck size={18} /> },
    { to: '/citizen/urgent-hazard', label: t('urgentHazard'), icon: <AlertTriangle size={18} /> },
    { to: '/citizen/alerts', label: t('nearbyAlerts'), icon: <AlertTriangle size={18} /> },
    { to: '/citizen/help', label: t('help'), icon: <ClipboardCheck size={18} /> },
    { to: '/citizen/story', label: t('storyMode'), icon: <Map size={18} /> },
    { to: '/citizen/consensus', label: 'Consensus', icon: <Bell size={18} /> },
    { to: '/citizen/accessibility', label: t('accessibilityImpact'), icon: <Accessibility size={18} /> },
    { to: '/citizen/safe-route', label: t('safeRoute'), icon: <RouteIcon size={18} /> },
    { to: '/citizen/map', label: t('map'), icon: <Map size={18} /> },
    { to: '/citizen/notifications', label: t('notifications'), icon: <Bell size={18} /> },
    { to: '/citizen/profile', label: t('profile'), icon: <User size={18} /> },
  ];

  const authorityNav = [
    { to: '/authority/dashboard', label: t('dashboard'), icon: <LayoutDashboard size={18} /> },
    { to: '/authority/issues', label: t('issues'), icon: <FileText size={18} /> },
    { to: '/authority/map', label: t('map'), icon: <Map size={18} /> },
    { to: '/authority/assignments', label: t('assignments'), icon: <FilePlus size={18} /> },
    { to: '/authority/analytics', label: t('analytics'), icon: <LayoutDashboard size={18} /> },
    { to: '/authority/hotspots', label: t('hotspots'), icon: <Map size={18} /> },
    { to: '/authority/early-warning', label: t('earlyWarning'), icon: <AlertTriangle size={18} /> },
    { to: '/authority/decision-center', label: t('decisionCenter'), icon: <ClipboardCheck size={18} /> },
  ];

  const fieldNav = [
    { to: '/fieldworker/dashboard', label: t('fieldDashboard'), icon: <LayoutDashboard size={18} /> },
    { to: '/fieldworker/tasks', label: t('myTasks'), icon: <FileText size={18} /> },
    { to: '/fieldworker/map', label: t('map'), icon: <Map size={18} /> },
    { to: '/fieldworker/profile', label: t('profile'), icon: <User size={18} /> },
  ];

  const navItems = role === 'authority' ? authorityNav : role === 'fieldworker' ? fieldNav : citizenNav;

  const roleLabel = role === 'authority' ? 'Authority Panel' : role === 'fieldworker' ? 'Field Worker' : 'Citizen Portal';

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${open ? 'open' : ''}`}
        onClick={() => setOpen(false)}
      />

      {/* Mobile hamburger button */}
      <div className="dashboard-menu-bar">
        <button
          className="sidebar-toggle"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <aside className={`sidebar ${open ? 'open' : ''}`}>
        {/* Header */}
        <div className="sidebar-header">
          <NavLink to="/" className="sidebar-brand" onClick={() => setOpen(false)}>
            <div className="sidebar-logo">C</div>
            <div>
              <div className="sidebar-name">CIVIORA</div>
              <div className="sidebar-role">{roleLabel}</div>
            </div>
          </NavLink>
          <button
            type="button"
            className="sidebar-close"
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <ul className="sidebar-nav">
          {navItems.map(item => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}
                onClick={() => setOpen(false)}
              >
                <span className="sidebar-link-icon">{item.icon}</span>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{user?.name?.[0] || 'U'}</div>
            <div>
              <div className="sidebar-user-name">{user?.name || 'User'}</div>
              <div className="sidebar-user-role">{roleLabel}</div>
            </div>
          </div>
          <button
            className="sidebar-link"
            style={{ marginTop: 12 }}
            onClick={() => { onLogout && onLogout(); setOpen(false); }}
          >
            <span className="sidebar-link-icon"><LogOut size={18} /></span>
            {t('logout')}
          </button>
        </div>
      </aside>
    </>
  );
}
