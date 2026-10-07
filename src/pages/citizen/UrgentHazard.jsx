import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Camera, MapPin, ShieldAlert, CheckCircle2 } from 'lucide-react';

const HAZARD_TYPES = [
  { id: 'manhole', label: 'Open manhole', icon: '🕳️' },
  { id: 'pole', label: 'Fallen electric pole', icon: '🪵' },
  { id: 'wire', label: 'Dangerous electrical wire', icon: '⚡' },
  { id: 'flood', label: 'Flooded road', icon: '🌊' },
  { id: 'collapse', label: 'Collapsed structure', icon: '🏚️' },
  { id: 'obstruction', label: 'Major road obstruction', icon: '🚧' },
  { id: 'bridge', label: 'Unsafe bridge', icon: '🌉' },
  { id: 'fire', label: 'Fire or smoke hazard', icon: '🔥' },
];

const DEPARTMENT_MAP = {
  manhole: 'Drainage Department',
  pole: 'Electrical Department',
  wire: 'Electrical Department',
  flood: 'Roads & Infrastructure',
  collapse: 'Public Works Department',
  obstruction: 'Traffic Police',
  bridge: 'Public Works Department',
  fire: 'Fire Safety Department',
};

export default function UrgentHazard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [hazardType, setHazardType] = useState(HAZARD_TYPES[0].id);
  const [location, setLocation] = useState('Near MG Road bus stop');
  const [description, setDescription] = useState('');
  const [photoAdded, setPhotoAdded] = useState(false);

  const selectedHazard = HAZARD_TYPES.find(item => item.id === hazardType) || HAZARD_TYPES[0];

  const department = useMemo(() => DEPARTMENT_MAP[hazardType] || 'Municipal Corporation', [hazardType]);

  const canContinue = step === 1 ? Boolean(hazardType) : step === 2 ? Boolean(location.trim()) : step === 3 ? true : step === 4 ? Boolean(description.trim()) : true;

  const nextStep = () => {
    if (step < 5) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    navigate('/citizen/report', { state: { urgentHazard: true, hazardType, location, description, department } });
  };

  return (
    <div className="page-content fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Urgent Civic Hazard</h1>
          <p className="page-subtitle">For immediate public safety risks that require faster civic attention.</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 860, margin: '0 auto', padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ fontWeight: 700, color: 'var(--text-muted)' }}>Step {step} of 5</div>
          <div className="badge badge-critical">Critical</div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {[1, 2, 3, 4, 5].map(item => (
            <div
              key={item}
              style={{
                flex: 1,
                height: 6,
                borderRadius: 999,
                background: item <= step ? 'linear-gradient(90deg, #dc2626, #ef4444)' : 'var(--border)',
              }}
            />
          ))}
        </div>

        {step === 1 && (
          <div>
            <h2 style={{ fontSize: 26, marginBottom: 16 }}>What is the hazard?</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
              {HAZARD_TYPES.map(item => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={hazardType === item.id}
                  onClick={() => setHazardType(item.id)}
                  style={{
                    padding: 16,
                    borderRadius: 16,
                    border: hazardType === item.id ? '2px solid var(--primary)' : '1px solid var(--border)',
                    background: hazardType === item.id ? '#eff6ff' : 'var(--surface)',
                    textAlign: 'left',
                    fontWeight: 700,
                    fontSize: 15,
                  }}
                >
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{item.icon}</div>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={{ fontSize: 26, marginBottom: 16 }}>Where is it?</h2>
            <label style={{ display: 'block' }}>
              <span style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Location</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, border: '1px solid var(--border)', background: 'var(--surface-2)', borderRadius: 12, padding: '12px 14px' }}>
                <MapPin size={18} color='var(--primary)' />
                <input
                  aria-label="Hazard location"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  style={{ width: '100%', border: 'none', background: 'transparent', fontSize: 15, outline: 'none' }}
                />
              </div>
            </label>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 style={{ fontSize: 26, marginBottom: 16 }}>Add photo</h2>
            <div className="card" style={{ padding: 18, borderStyle: 'dashed' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-muted)' }}>
                <Camera size={24} />
                <div>
                  <div style={{ fontWeight: 700 }}>Optional photo evidence</div>
                  <div style={{ fontSize: 13 }}>Useful for understanding the scale of the risk.</div>
                </div>
              </div>
              <button className="btn btn-outline" style={{ marginTop: 16 }} onClick={() => setPhotoAdded(true)}>
                Upload Photo
              </button>
              {photoAdded && <div style={{ marginTop: 12, color: 'var(--success)', fontWeight: 700 }}>Photo attached</div>}
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 style={{ fontSize: 26, marginBottom: 16 }}>Describe the danger</h2>
            <textarea
              aria-label="Hazard description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={6}
              placeholder="Explain the risk, urgency, and nearby impact."
              style={{ width: '100%', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface-2)', padding: 14, resize: 'vertical' }}
            />
          </div>
        )}

        {step === 5 && (
          <div>
            <h2 style={{ fontSize: 26, marginBottom: 16 }}>Review</h2>
            <div className="card" style={{ padding: 18, background: '#fff7ed', borderColor: '#fed7aa' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <ShieldAlert size={20} color='#c2410c' />
                <strong>URGENT CIVIC HAZARD</strong>
              </div>
              <div style={{ display: 'grid', gap: 12 }}>
                <div><strong>Hazard:</strong> {selectedHazard.label}</div>
                <div><strong>Location:</strong> {location}</div>
                <div><strong>Priority:</strong> Critical</div>
                <div><strong>Recommended Department:</strong> {department}</div>
                <div><strong>Expected Response:</strong> Priority review</div>
                <div><strong>Description:</strong> {description || 'No additional comments provided.'}</div>
              </div>
              <div style={{ marginTop: 18, color: 'var(--text-muted)', fontSize: 13 }}>
                This demo creates a high-priority civic report. For immediate life-threatening emergencies, contact the appropriate emergency service.
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, gap: 12, flexWrap: 'wrap' }}>
          <button className="btn btn-ghost" onClick={prevStep} disabled={step === 1}>
            Back
          </button>

          {step < 5 ? (
            <button className="btn btn-primary" onClick={nextStep} disabled={!canContinue}>
              Next
            </button>
          ) : (
            <button className="btn btn-danger" onClick={handleSubmit}>
              <CheckCircle2 size={16} />
              Submit Hazard
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
