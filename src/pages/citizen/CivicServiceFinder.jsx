import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, Star, Navigation, ShieldCheck, Search } from 'lucide-react';
import { CIVIC_SERVICES, SERVICE_FILTERS, SERVICE_SORT_OPTIONS } from '../../data/civicServices.js';
import { useLanguage } from '../../context/LanguageContext.jsx';

function ServiceCard({ service, onSelect }) {
  const { t } = useLanguage();

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>{service.categoryLabel}</div>
          <h3 style={{ fontSize: 20, fontWeight: 800, margin: 0, wordBreak: 'break-word' }}>{service.name}</h3>
        </div>
        <span className="badge badge-success" style={{ background: '#dcfce7', color: '#166534' }}>{service.badge}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 14 }}>
        <MapPin size={14} />
        <span>{service.distanceKm} km away</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 14 }}>
        <ShieldCheck size={14} />
        <span>{service.accessibility ? 'Accessibility available' : 'Accessibility on request'}</span>
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{service.description}</p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
        <span className="badge badge-assigned">{service.statusLabel}</span>
        <button className="btn btn-primary btn-sm" onClick={() => onSelect(service.id)}>
          {t('viewDetails')}
        </button>
      </div>
    </div>
  );
}

export default function CivicServiceFinder() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('nearest');

  const filteredServices = useMemo(() => {
    const normalized = search.toLowerCase().trim();
    const list = CIVIC_SERVICES.filter(service => {
      const matchesFilter = selectedFilter === 'all' || service.category === selectedFilter;
      const matchesSearch = !normalized || [service.name, service.categoryLabel, service.description].join(' ').toLowerCase().includes(normalized);
      return matchesFilter && matchesSearch;
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'openNow') {
        return Number(b.status === 'open') - Number(a.status === 'open') || a.distanceKm - b.distanceKm;
      }
      if (sortBy === 'accessibilityFriendly') {
        return Number(b.accessibility) - Number(a.accessibility) || a.distanceKm - b.distanceKm;
      }
      return a.distanceKm - b.distanceKm;
    });
  }, [search, selectedFilter, sortBy]);

  const selectedService = CIVIC_SERVICES.find(service => service.id === id) || null;

  if (selectedService) {
    return (
      <div className="page-content fade-in">
        <div className="page-header">
          <div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/citizen/services')}>
              <ArrowLeft size={14} />
              {t('back')}
            </button>
          </div>
        </div>

        <div className="card" style={{ maxWidth: 900, margin: '0 auto', padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                {selectedService.categoryLabel}
              </div>
              <h1 className="page-title" style={{ marginTop: 6 }}>{selectedService.name}</h1>
            </div>
            <span className="badge badge-success">{selectedService.statusLabel}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginTop: 24 }}>
            <div className="card" style={{ padding: 16 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{t('distance')}</div>
              <div style={{ fontSize: 28, fontWeight: 800, marginTop: 8 }}>{selectedService.distanceKm} km</div>
            </div>
            <div className="card" style={{ padding: 16 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{t('status')}</div>
              <div style={{ fontSize: 20, fontWeight: 800, marginTop: 8 }}>{selectedService.statusLabel}</div>
            </div>
            <div className="card" style={{ padding: 16 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{t('accessibilityLabel')}</div>
              <div style={{ fontSize: 20, fontWeight: 800, marginTop: 8 }}>{selectedService.accessibility ? 'Yes' : 'On request'}</div>
            </div>
          </div>

          <div style={{ marginTop: 24, display: 'grid', gap: 18 }}>
            <div>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>{t('description')}</div>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>{selectedService.detail}</p>
            </div>

            <div>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Services</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {selectedService.services.map(service => (
                  <span key={service} className="chip">{service}</span>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>{t('contact')}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)' }}>
                <Phone size={16} />
                <span>{selectedService.contact}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', marginTop: 8 }}>
                <MapPin size={16} />
                <span>{selectedService.address}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 24 }}>
            <button className="btn btn-primary">
              <Navigation size={16} />
              Get Directions
            </button>
            <button className="btn btn-outline">
              <Phone size={16} />
              Call
            </button>
            <button className="btn btn-ghost" onClick={() => navigate('/citizen/map')}>
              View on Map
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('serviceFinder')}</h1>
          <p className="page-subtitle">Find useful civic services nearby.</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 18 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(180px, 1fr)', gap: 12, alignItems: 'center' }}>
          <label style={{ position: 'relative', display: 'block' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              aria-label="Search services"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t('searchServices')}
              style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface-2)' }}
            />
          </label>

          <select
            aria-label={t('sort')}
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface-2)' }}
          >
            {Object.entries(SERVICE_SORT_OPTIONS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
          {SERVICE_FILTERS.map(option => (
            <button
              key={option.id}
              type="button"
              className={`btn btn-sm ${selectedFilter === option.id ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setSelectedFilter(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {filteredServices.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔎</div>
          <div className="empty-state-title">{t('noResults')}</div>
          <div className="empty-state-desc">Try a different search or filter.</div>
        </div>
      ) : (
        <div className="grid-2" style={{ gap: 16 }}>
          {filteredServices.map(service => (
            <ServiceCard key={service.id} service={service} onSelect={(id) => navigate(`/citizen/services/${id}`)} />
          ))}
        </div>
      )}
    </div>
  );
}
