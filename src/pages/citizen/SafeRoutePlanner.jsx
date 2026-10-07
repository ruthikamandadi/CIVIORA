import { useEffect, useMemo, useState } from 'react';
import { Accessibility, AlertTriangle, ArrowRight, Clock3, MapPin, Route, ShieldCheck, Sparkles } from 'lucide-react';
import { EmptyState } from '../../components/common/index.jsx';
import { SAFE_ROUTE_LOCATIONS, SAFE_ROUTE_OPTIONS } from '../../data/advancedCivicData.js';

export default function SafeRoutePlanner() {
  const [start, setStart] = useState(SAFE_ROUTE_LOCATIONS[0]);
  const [destination, setDestination] = useState(SAFE_ROUTE_LOCATIONS[2]);
  const [resultsVisible, setResultsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState('safer');
  const sameLocation = start === destination;

  useEffect(() => {
    if (!loading) return undefined;
    const timer = window.setTimeout(() => {
      setLoading(false);
      setResultsVisible(true);
    }, 450);
    return () => window.clearTimeout(timer);
  }, [loading]);

  const selectedRoute = useMemo(
    () => SAFE_ROUTE_OPTIONS.find((routeOption) => routeOption.id === selectedRouteId) || SAFE_ROUTE_OPTIONS[1],
    [selectedRouteId]
  );

  function findRoutes(event) {
    event.preventDefault();
    if (sameLocation) return;
    setResultsVisible(false);
    setLoading(true);
  }

  return (
    <div className="page-content fade-in">
      <div className="page-header">
        <div>
          <div className="feature-eyebrow"><Route size={15} /> ROUTE AROUND CIVIC BARRIERS</div>
          <h1 className="page-title">Safe Route Planner</h1>
          <p className="page-subtitle">Compare illustrative routes by travel time, reported issues, safety, and accessibility.</p>
        </div>
        <div className="chip"><MapPin size={14} /> Mock route data · No GPS required</div>
      </div>

      <form className="route-search card" onSubmit={findRoutes}>
        <label className="route-location-field">
          <span className="route-location-icon start"><span /></span>
          <span className="route-field-content">
            <span className="filter-label">Start location</span>
            <select className="form-input form-select" value={start} onChange={(event) => setStart(event.target.value)}>
              {SAFE_ROUTE_LOCATIONS.map((location) => <option value={location} key={location}>{location}</option>)}
            </select>
          </span>
        </label>
        <div className="route-search-connector" aria-hidden="true"><ArrowRight size={18} /></div>
        <label className="route-location-field">
          <span className="route-location-icon destination"><MapPin size={19} /></span>
          <span className="route-field-content">
            <span className="filter-label">Destination</span>
            <select className="form-input form-select" value={destination} onChange={(event) => setDestination(event.target.value)}>
              {SAFE_ROUTE_LOCATIONS.map((location) => <option value={location} key={location}>{location}</option>)}
            </select>
          </span>
        </label>
        <button type="submit" className="btn btn-primary route-find-button" disabled={loading || sameLocation}>
          {loading ? <><span className="route-spinner" /> Checking routes</> : <><Route size={17} /> Find Route</>}
        </button>
        {sameLocation && <span className="route-form-error">Choose two different locations to compare routes.</span>}
      </form>

      {loading && (
        <div className="route-loading card">
          <div className="route-loading-rings"><span /><span /><span /></div>
          <strong>Checking mock route conditions…</strong>
          <span>Comparing issue exposure, crossings, and step-free access.</span>
        </div>
      )}

      {resultsVisible && !loading && (
        <>
          <div className="route-result-heading">
            <div>
              <div className="feature-eyebrow"><Sparkles size={15} /> THREE WAYS TO GET THERE</div>
              <h2>{start} <ArrowRight size={19} /> {destination}</h2>
            </div>
            <span className="route-result-note">Demonstration route estimates</span>
          </div>

          <div className="route-planner-layout">
            <div className="route-option-list">
              {SAFE_ROUTE_OPTIONS.map((routeOption) => (
                <button
                  type="button"
                  className={`route-option-card ${selectedRouteId === routeOption.id ? 'active' : ''}`}
                  style={{ '--route-accent': routeOption.color }}
                  key={routeOption.id}
                  onClick={() => setSelectedRouteId(routeOption.id)}
                >
                  <div className="route-option-top">
                    <span className="route-option-icon">
                      {routeOption.id === 'accessible' ? <Accessibility size={19} /> : routeOption.id === 'safer' ? <ShieldCheck size={19} /> : <Clock3 size={19} />}
                    </span>
                    <span className="route-option-title"><strong>{routeOption.name}</strong><small>{routeOption.subtitle}</small></span>
                    <span className="route-option-time">{routeOption.time}<small>min</small></span>
                  </div>
                  <div className="route-option-stats">
                    <Metric label="Safety" score={routeOption.safety} />
                    <Metric label="Accessibility" score={routeOption.accessibility} />
                  </div>
                  <div className="route-option-footer">
                    <span>{routeOption.distance} km</span>
                    <span className={routeOption.issueCount ? 'route-issue-count' : 'route-clear-count'}>
                      {routeOption.issueCount ? <><AlertTriangle size={14} /> {routeOption.issueCount} issue{routeOption.issueCount === 1 ? '' : 's'}</> : <><ShieldCheck size={14} /> Clear of known issues</>}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <section className="route-map-card card" aria-label="Illustrative route comparison map">
              <div className="route-map-topline">
                <div><span className="route-map-dot start-dot" />{start}</div>
                <span className="route-map-live"><i /> Mock issue overlay</span>
              </div>
              <div className="route-map-canvas">
                <div className="route-map-grid" />
                <svg viewBox="0 0 640 360" role="img" aria-label={`${selectedRoute.name} shown on a mock map`}>
                  <path d="M45 180 C105 145 115 68 205 87 S300 154 355 123 S440 45 510 94 S563 175 600 180" fill="none" stroke="#cbd5e1" strokeWidth="18" strokeLinecap="round" />
                  <path d="M52 190 C112 229 164 259 227 224 S324 170 365 204 S467 280 530 223 S572 184 600 180" fill="none" stroke="#cbd5e1" strokeWidth="15" strokeLinecap="round" />
                  <path d="M48 172 C153 117 195 180 260 172 S394 96 450 165 S526 212 600 180" fill="none" stroke="#cbd5e1" strokeWidth="13" strokeLinecap="round" />
                  <path d={selectedRoute.path} fill="none" stroke={selectedRoute.color} strokeWidth="8" strokeLinecap="round" strokeDasharray="1 1" />
                  {[[176, 142], [305, 178], [430, 222]].slice(0, selectedRoute.issueCount).map(([x, y], index) => (
                    <g key={index}><circle cx={x} cy={y} r="15" fill="#fff" stroke="#fca5a5" strokeWidth="2" /><text x={x} y={y + 5} textAnchor="middle" fontSize="14" fill="#dc2626">!</text></g>
                  ))}
                  <circle cx="48" cy="172" r="11" fill="#16a34a" stroke="white" strokeWidth="4" />
                  <circle cx="600" cy="180" r="12" fill="#dc2626" stroke="white" strokeWidth="4" />
                </svg>
                <span className="route-map-label start-label">START</span>
                <span className="route-map-label end-label">DESTINATION</span>
              </div>
              <div className="route-map-legend">
                <span><i className="legend-route" style={{ background: selectedRoute.color }} />Selected route</span>
                <span><i className="legend-risk">!</i>Reported civic issue</span>
              </div>
              <div className="route-map-destination"><MapPin size={15} />{destination}</div>
              {selectedRoute.risks.length > 0 ? (
                <div className="route-risk-note"><AlertTriangle size={16} /><div><strong>Route considerations</strong><p>{selectedRoute.risks.join(' · ')}</p></div></div>
              ) : (
                <div className="route-clear-note"><ShieldCheck size={16} />No known civic issue markers on this mock route.</div>
              )}
            </section>
          </div>
          <p className="route-disclaimer">Route lines and scores are sample data for demonstration only. Confirm current conditions locally before traveling.</p>
        </>
      )}

      {!resultsVisible && !loading && (
        <div className="route-empty-prompt">
          <div className="route-empty-art"><Route size={33} /><span><ShieldCheck size={20} /></span></div>
          <h2>Plan around known barriers</h2>
          <p>Select locations above to compare three mock routes with different safety and accessibility trade-offs.</p>
          <button type="button" className="btn btn-outline" onClick={() => { setStart(SAFE_ROUTE_LOCATIONS[0]); setDestination(SAFE_ROUTE_LOCATIONS[2]); setResultsVisible(true); }}>
            View sample route
          </button>
        </div>
      )}

      {resultsVisible && !loading && SAFE_ROUTE_OPTIONS.length === 0 && (
        <EmptyState icon="🧭" title="No route options available" desc="There are no mock routes for this pair of locations yet." />
      )}
    </div>
  );
}

function Metric({ label, score }) {
  return (
    <div className="route-metric">
      <div><span>{label}</span><strong>{score}<small>/100</small></strong></div>
      <div className="route-metric-bar"><i style={{ width: `${score}%` }} /></div>
    </div>
  );
}
