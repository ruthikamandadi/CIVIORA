import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './index.css';
import { DEFAULT_LANGUAGE } from './data/translations.js';
import { LanguageProvider } from './context/LanguageContext.jsx';

// Common components
import { Navbar } from './components/common/Navbar.jsx';
import { Sidebar } from './components/common/Navbar.jsx';
import { OfflineBanner, Footer } from './components/common/index.jsx';

// Pages
import LandingPage from './pages/LandingPage.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

// Citizen pages
import CitizenDashboard from './pages/citizen/CitizenDashboard.jsx';
import ReportIssue from './pages/citizen/ReportIssue.jsx';
import MyReports from './pages/citizen/MyReports.jsx';
import IssueDetails from './pages/citizen/IssueDetails.jsx';
import CivicMap from './pages/citizen/CivicMap.jsx';
import Notifications from './pages/citizen/Notifications.jsx';
import CitizenProfile from './pages/citizen/CitizenProfile.jsx';
import CivicMissions from './pages/citizen/CivicMissions.jsx';
import CivicPassport from './pages/citizen/CivicPassport.jsx';
import NeighborhoodPulse from './pages/citizen/NeighborhoodPulse.jsx';
import CivicStory from './pages/citizen/CivicStory.jsx';
import CommunityConsensus from './pages/citizen/CommunityConsensus.jsx';
import AccessibilityImpact from './pages/citizen/AccessibilityImpact.jsx';
import NearbyAlerts from './pages/citizen/NearbyAlerts.jsx';
import HelpCenter from './pages/citizen/HelpCenter.jsx';
import CivicServiceFinder from './pages/citizen/CivicServiceFinder.jsx';
import UrgentHazard from './pages/citizen/UrgentHazard.jsx';

// Authority pages
import AuthorityDashboard from './pages/authority/AuthorityDashboard.jsx';
import IssueManagement from './pages/authority/IssueManagement.jsx';
import IssueAssignment from './pages/authority/IssueAssignment.jsx';
import AnalyticsDashboard from './pages/authority/AnalyticsDashboard.jsx';
import HotspotPrediction from './pages/authority/HotspotPrediction.jsx';

// Field worker pages
import FieldWorkerDashboard from './pages/fieldworker/FieldWorkerDashboard.jsx';
import FieldWorkerProfile from './pages/fieldworker/FieldWorkerProfile.jsx';

import { NOTIFICATIONS_DATA } from './data/mockData';

const SafeRoutePlanner = lazy(() => import('./pages/citizen/SafeRoutePlanner.jsx'));
const EarlyWarningCenter = lazy(() => import('./pages/authority/EarlyWarningCenter.jsx'));
const DecisionCenter = lazy(() => import('./pages/authority/DecisionCenter.jsx'));

// Layout with sidebar for dashboard pages
function DashboardLayout({ user, onLogout, children }) {
  const location = useLocation();
  const role = user?.role || 'citizen';

  const unreadCount = NOTIFICATIONS_DATA.filter(n => !n.read).length;

  return (
    <div className="app-layout">
      <Sidebar role={role} user={user} onLogout={onLogout} activePath={location.pathname} />
      <div className="main-content">
        <div className="dashboard-content">
          {children}
        </div>
      </div>
    </div>
  );
}

// Public layout (navbar)
function PublicLayout({ user, onLogout, lang, onLangChange, children }) {
  const unreadCount = NOTIFICATIONS_DATA.filter(n => !n.read).length;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar user={user} onLogout={onLogout} lang={lang} onLangChange={onLangChange} unreadCount={unreadCount} />
      <div style={{ flex: 1 }}>
        {children}
      </div>
    </div>
  );
}

// Protected route wrapper
function ProtectedRoute({ user, requiredRole, children }) {
  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/" replace />;
  return children;
}

function getDisplayName(userData = {}) {
  const explicitName = typeof userData.name === 'string' ? userData.name.trim() : '';
  if (explicitName && explicitName.toLowerCase() !== 'arjun') return explicitName;

  const email = typeof userData.email === 'string' ? userData.email.trim() : '';
  if (email) {
    const localPart = email.split('@')[0]?.replace(/[._-]+/g, ' ').trim();
    if (localPart) {
      return localPart
        .split(/\s+/)
        .filter(Boolean)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(' ');
    }
  }

  if (userData.role === 'authority') return 'Authority';
  if (userData.role === 'fieldworker') return 'Field Worker';
  return 'Citizen';
}

export default function App() {
  // Try to restore user from localStorage
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('civicpulse_user');
      const alternate = localStorage.getItem('user');
      const raw = saved ? JSON.parse(saved) : alternate ? JSON.parse(alternate) : null;
      if (!raw) return null;
      return { ...raw, name: getDisplayName(raw) };
    } catch {
      return null;
    }
  });

  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('civioraLanguage') || DEFAULT_LANGUAGE;
    } catch {
      return DEFAULT_LANGUAGE;
    }
  });
  const [accessibilitySettings, setAccessibilitySettings] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('civioraAccessibility') || '{}');
    } catch {
      return {};
    }
  });
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Monitor online/offline status
  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('civioraLanguage', lang);
    } catch {
      // ignore storage errors
    }
  }, [lang]);

  useEffect(() => {
    try {
      localStorage.setItem('civioraAccessibility', JSON.stringify(accessibilitySettings));
    } catch {
      // ignore storage errors
    }
  }, [accessibilitySettings]);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-large-text', accessibilitySettings.largeText ? 'true' : 'false');
    root.setAttribute('data-reduced-motion', accessibilitySettings.reducedMotion ? 'true' : 'false');
    root.setAttribute('data-high-contrast', accessibilitySettings.highContrast ? 'true' : 'false');
  }, [accessibilitySettings]);

  function handleLogin(userData) {
    const normalizedUser = {
      ...userData,
      name: getDisplayName(userData),
      role: userData.role || 'citizen',
      loginMethod: userData.loginMethod || 'email',
    };

    setUser(normalizedUser);
    localStorage.setItem('civicpulse_user', JSON.stringify(normalizedUser));
    localStorage.setItem('user', JSON.stringify(normalizedUser));
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userRole', normalizedUser.role);
    localStorage.setItem('loginMethod', normalizedUser.loginMethod);
  }

  function handleLogout() {
    setUser(null);
    localStorage.removeItem('civicpulse_user');
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('loginMethod');
  }

  function handleLangChange(newLang) {
    setLang(newLang);
  }

  function updateAccessibilitySetting(key, value) {
    setAccessibilitySettings(prev => ({ ...prev, [key]: value }));
  }

  return (
    <div className="app-shell" data-large-text={String(Boolean(accessibilitySettings.largeText))} data-reduced-motion={String(Boolean(accessibilitySettings.reducedMotion))} data-high-contrast={String(Boolean(accessibilitySettings.highContrast))}>
      <LanguageProvider language={lang} setLanguage={handleLangChange}>
        <BrowserRouter>
          <OfflineBanner isOnline={isOnline} />

          <Routes>
        {/* Public routes */}
        <Route path="/" element={
          <PublicLayout user={user} onLogout={handleLogout} lang={lang} onLangChange={handleLangChange}>
            <LandingPage />
          </PublicLayout>
        } />

        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onLogin={handleLogin} />} />

        {/* Citizen routes */}
        <Route path="/citizen/dashboard" element={
          <ProtectedRoute user={user}>
            <DashboardLayout user={user} onLogout={handleLogout}>
              <CitizenDashboard user={user} />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/citizen/report" element={
          <DashboardLayout user={user} onLogout={handleLogout}>
            <ReportIssue />
          </DashboardLayout>
        } />

        <Route path="/citizen/my-reports" element={
          <DashboardLayout user={user} onLogout={handleLogout}>
            <MyReports />
          </DashboardLayout>
        } />

        <Route path="/citizen/reports" element={<Navigate to="/citizen/my-reports" replace />} />

        <Route path="/citizen/issue/:id" element={
          <DashboardLayout user={user} onLogout={handleLogout}>
            <IssueDetails />
          </DashboardLayout>
        } />

        <Route path="/citizen/map" element={
          <DashboardLayout user={user} onLogout={handleLogout}>
            <CivicMap />
          </DashboardLayout>
        } />

        <Route path="/citizen/alerts" element={
          <ProtectedRoute user={user}>
            <DashboardLayout user={user} onLogout={handleLogout}>
              <NearbyAlerts />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/citizen/help" element={
          <ProtectedRoute user={user}>
            <DashboardLayout user={user} onLogout={handleLogout}>
              <HelpCenter />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/citizen/services" element={
          <ProtectedRoute user={user}>
            <DashboardLayout user={user} onLogout={handleLogout}>
              <CivicServiceFinder />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/citizen/services/:id" element={
          <ProtectedRoute user={user}>
            <DashboardLayout user={user} onLogout={handleLogout}>
              <CivicServiceFinder />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/citizen/urgent-hazard" element={
          <ProtectedRoute user={user}>
            <DashboardLayout user={user} onLogout={handleLogout}>
              <UrgentHazard />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/citizen/notifications" element={
          <DashboardLayout user={user} onLogout={handleLogout}>
            <Notifications />
          </DashboardLayout>
        } />

        <Route path="/citizen/profile" element={
          <ProtectedRoute user={user}>
            <DashboardLayout user={user} onLogout={handleLogout}>
              <CitizenProfile user={user} />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/citizen/missions" element={
          <ProtectedRoute user={user}>
            <DashboardLayout user={user} onLogout={handleLogout}>
              <CivicMissions />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/citizen/passport" element={
          <ProtectedRoute user={user}>
            <DashboardLayout user={user} onLogout={handleLogout}>
              <CivicPassport user={user} />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/citizen/pulse" element={
          <ProtectedRoute user={user}>
            <DashboardLayout user={user} onLogout={handleLogout}>
              <NeighborhoodPulse />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/citizen/neighborhood-pulse" element={<Navigate to="/citizen/pulse" replace />} />

        <Route path="/citizen/story" element={
          <ProtectedRoute user={user}>
            <DashboardLayout user={user} onLogout={handleLogout}>
              <CivicStory />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/citizen/consensus" element={
          <ProtectedRoute user={user}>
            <DashboardLayout user={user} onLogout={handleLogout}>
              <CommunityConsensus />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/citizen/accessibility" element={
          <ProtectedRoute user={user}>
            <DashboardLayout user={user} onLogout={handleLogout}>
              <AccessibilityImpact />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/citizen/safe-route" element={
          <ProtectedRoute user={user} requiredRole="citizen">
            <DashboardLayout user={user} onLogout={handleLogout}>
              <Suspense fallback={<div className="page-content"><div className="card">Loading route planner…</div></div>}>
                <SafeRoutePlanner />
              </Suspense>
            </DashboardLayout>
          </ProtectedRoute>
        } />

        {/* Authority routes */}
        <Route path="/authority/dashboard" element={
          <ProtectedRoute user={user}>
            <DashboardLayout user={user} onLogout={handleLogout}>
              <AuthorityDashboard user={user} />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/authority/issues" element={
          <ProtectedRoute user={user}>
            <DashboardLayout user={user} onLogout={handleLogout}>
              <IssueManagement />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/authority/assignments" element={
          <ProtectedRoute user={user}>
            <DashboardLayout user={user} onLogout={handleLogout}>
              <IssueAssignment />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/authority/map" element={
          <ProtectedRoute user={user}>
            <DashboardLayout user={user} onLogout={handleLogout}>
              <CivicMap />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/authority/analytics" element={
          <ProtectedRoute user={user}>
            <DashboardLayout user={user} onLogout={handleLogout}>
              <AnalyticsDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/authority/hotspots" element={
          <ProtectedRoute user={user}>
            <DashboardLayout user={user} onLogout={handleLogout}>
              <HotspotPrediction />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/authority/early-warning" element={
          <ProtectedRoute user={user} requiredRole="authority">
            <DashboardLayout user={user} onLogout={handleLogout}>
              <Suspense fallback={<div className="page-content"><div className="card">Loading warning center…</div></div>}>
                <EarlyWarningCenter />
              </Suspense>
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/authority/decision-center" element={
          <ProtectedRoute user={user} requiredRole="authority">
            <DashboardLayout user={user} onLogout={handleLogout}>
              <Suspense fallback={<div className="page-content"><div className="card">Loading decision center…</div></div>}>
                <DecisionCenter />
              </Suspense>
            </DashboardLayout>
          </ProtectedRoute>
        } />

        {/* Field Worker routes */}
        <Route path="/fieldworker/dashboard" element={
          <ProtectedRoute user={user}>
            <DashboardLayout user={user} onLogout={handleLogout}>
              <FieldWorkerDashboard user={user} />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/fieldworker/tasks" element={
          <ProtectedRoute user={user}>
            <DashboardLayout user={user} onLogout={handleLogout}>
              <FieldWorkerDashboard user={user} />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/fieldworker/map" element={
          <ProtectedRoute user={user}>
            <DashboardLayout user={user} onLogout={handleLogout}>
              <CivicMap />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/fieldworker/profile" element={
          <ProtectedRoute user={user}>
            <DashboardLayout user={user} onLogout={handleLogout}>
              <FieldWorkerProfile user={user} />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </div>
  );
}
