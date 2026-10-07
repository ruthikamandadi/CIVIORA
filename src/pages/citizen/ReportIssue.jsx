import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../../data/mockData';
import { VoiceButton } from '../../components/common/index.jsx';
import AIDecisionExplanation from '../../components/AIDecisionExplanation.jsx';
import { Bot, Link2, ClipboardList, Lightbulb, Zap } from 'lucide-react';
import './reportIssue.css';

// AI Analysis simulation
function AIAnalysisResult({ formData }) {
  const navigate = useNavigate();
  const aiMap = {
    road: { category: 'Road Damage', severity: 'High', confidence: 94, cause: 'Repeated road surface deterioration / drainage issue', dept: 'Roads & Infrastructure' },
    garbage: { category: 'Sanitation Issue', severity: 'High', confidence: 91, cause: 'Insufficient waste collection frequency', dept: 'Sanitation Department' },
    streetlight: { category: 'Electrical Failure', severity: 'Medium', confidence: 88, cause: 'Faulty underground cable segment', dept: 'Electrical Department' },
    water: { category: 'Water Infrastructure', severity: 'High', confidence: 89, cause: 'Aging pipeline / supply disruption', dept: 'Water Supply Department' },
    drainage: { category: 'Drainage Blockage', severity: 'Medium', confidence: 85, cause: 'Blocked drain causing water accumulation', dept: 'Drainage Department' },
    traffic: { category: 'Traffic Safety Risk', severity: 'Medium', confidence: 82, cause: 'Non-functional signal / road marking issue', dept: 'Traffic Police' },
    toilet: { category: 'Sanitation Facility Failure', severity: 'Medium', confidence: 80, cause: 'Water supply or fixture malfunction', dept: 'Public Works Department' },
    other: { category: 'General Civic Issue', severity: 'Medium', confidence: 78, cause: 'Requires field inspection', dept: 'Municipal Corporation' },
  };

  const ai = aiMap[formData.category] || aiMap.other;
  const priority = ai.severity === 'High' ? 87 : 72;
  const priorityFactors = priority >= 80
    ? [
      { label: 'Issue severity', value: 25, kind: 'risk', detail: `${ai.severity} severity for ${ai.category.toLowerCase()}.` },
      { label: 'Potential public exposure', value: 21, kind: 'risk', detail: 'The reported issue may affect people using the nearby public route.' },
      { label: 'Recurrence potential', value: 18, kind: 'risk', detail: 'The described cause can recur if the underlying condition remains.' },
      { label: 'Location details supplied', value: 13, kind: 'positive', detail: 'A location is available for the field team to verify.' },
      { label: 'Issue category matched', value: 10, kind: 'positive', detail: 'The selected category maps to a responsible civic department.' },
    ]
    : [
      { label: 'Issue severity', value: 20, kind: 'risk', detail: `${ai.severity} severity for ${ai.category.toLowerCase()}.` },
      { label: 'Potential public exposure', value: 18, kind: 'risk', detail: 'The reported issue may affect people using the nearby public route.' },
      { label: 'Recurrence potential', value: 14, kind: 'risk', detail: 'The described cause may need field inspection to confirm recurrence.' },
      { label: 'Location details supplied', value: 12, kind: 'positive', detail: 'A location is available for the field team to verify.' },
      { label: 'Issue category matched', value: 8, kind: 'positive', detail: 'The selected category maps to a responsible civic department.' },
    ];

  return (
    <div className="report-result">
      <div className="alert alert-success">
        ✅ <strong>Report submitted successfully!</strong> AI analysis is complete.
      </div>

      <section className="report-result-section report-ai-understanding">
        <h2 className="report-result-title">
          <Bot size={19} aria-hidden="true" />
          AI Understanding
        </h2>
        <div className="report-ai-grid">
          {[
            { label: 'Category', value: ai.category },
            { label: 'Severity', value: ai.severity },
            { label: 'AI Confidence', value: `${ai.confidence}%` },
            { label: 'Suggested Dept.', value: ai.dept },
          ].map(item => (
            <div className="report-ai-field" key={item.label}>
              <div className="report-ai-label">{item.label}</div>
              <div className="report-ai-value">{item.value}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="report-result-section report-duplicate-detection">
        <h2 className="report-result-title">
          <Link2 size={18} aria-hidden="true" />
          Potential Duplicate Detection
        </h2>
        <p className="report-duplicate-copy">
          <strong>3 similar reports found nearby.</strong> These reports may belong to the same physical problem.
        </p>
        <div className="report-duplicate-note">
          <Link2 size={15} aria-hidden="true" />
          <span>Issue Fusion: Your report may be merged with Report #1042, #1067, and #1098 to form a unified civic issue.</span>
        </div>
        <button type="button" className="report-review-link" onClick={() => navigate('/citizen/my-reports')}>
          Review similar reports
        </button>
      </section>

      <section className="report-result-section report-priority-analysis">
        <h2 className="report-result-title">
          <Zap size={18} aria-hidden="true" />
          Priority Analysis
        </h2>
        <div className="report-priority-summary">
          <div className="report-priority-score" aria-label={`Priority score ${priority} out of 100`}>
            {priority}
          </div>
          <div>
            <div className="report-priority-score-label">Priority Score: {priority}/100</div>
            <div className="report-priority-urgency">Medium urgency</div>
          </div>
        </div>
        <div className="report-root-cause">
          <Lightbulb size={17} aria-hidden="true" />
          <p><strong>AI Root Cause Hint:</strong> {ai.cause}</p>
        </div>
        <div className="report-priority-explanation">
          <AIDecisionExplanation
            title="Report priority assessment"
            score={priority}
            factors={priorityFactors}
            recommendation={`${ai.cause}. Route the report to ${ai.dept} for field review.`}
            confidence={ai.confidence}
            triggerLabel="Explain this priority"
          />
        </div>
      </section>

      <div className="report-result-actions">
        <button className="btn btn-primary" onClick={() => window.location.href = '/citizen/my-reports'}>
          <ClipboardList size={16} aria-hidden="true" />
          View My Reports
        </button>
        <button className="btn btn-outline" onClick={() => window.location.reload()}>
          Report Another
        </button>
      </div>
    </div>
  );
}

// Step indicator
function StepIndicator({ currentStep, totalSteps }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 28 }}>
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s, idx) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: s <= currentStep ? 'var(--primary)' : 'var(--border)',
            color: s <= currentStep ? 'white' : 'var(--text-muted)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700,
            transition: 'all 0.3s',
          }}>
            {s < currentStep ? '✓' : s}
          </div>
          {idx < totalSteps - 1 && (
            <div style={{ height: 2, width: 40, background: s < currentStep ? 'var(--primary)' : 'var(--border)', margin: '0 4px' }} />
          )}
        </div>
      ))}
      <div style={{ marginLeft: 16, fontSize: 13, color: 'var(--text-muted)' }}>
        Step {currentStep} of {totalSteps}
      </div>
    </div>
  );
}

export default function ReportIssue() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [draftForm, setDraftForm] = useState({
    type: '',
    description: '',
    location: 'MG Road, Guntur',
    severity: 'High',
    image: null,
  });
  const [form, setForm] = useState({
    category: '',
    description: '',
    location: { lat: 16.3067, lng: 80.4365, area: 'MG Road, Guntur', landmark: 'Near Government Hospital' },
    imagePreview: null,
  });
  const [errors, setErrors] = useState({});

  function update(key, val) {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: '' }));
  }

  function validateStep() {
    const errs = {};
    if (step === 1 && !form.category) errs.category = 'Please select a category';
    if (step === 3 && !form.description) errs.description = 'Please describe the issue';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function nextStep() {
    if (!validateStep()) return;
    setStep(s => Math.min(s + 1, 5));
  }

  function prevStep() {
    setStep(s => Math.max(s - 1, 1));
  }

  function inferIssueSummary(text) {
    const lower = (text || '').toLowerCase();
    const matched = Object.entries({
      road: ['pothole', 'road', 'crack', 'speed breaker', 'asphalt'],
      garbage: ['garbage', 'waste', 'trash', 'dump', 'bin'],
      streetlight: ['streetlight', 'light', 'dark', 'lamp', 'electricity'],
      water: ['water leakage', 'pipeline', 'drainage', 'leak', 'water'],
      drainage: ['drainage', 'blocked drain', 'stagnant water', 'flooding'],
      traffic: ['traffic', 'crossing', 'signal', 'accident', 'unsafe'],
      toilet: ['toilet', 'restroom', 'public toilet', 'sanitation'],
    }).find(([, keywords]) => keywords.some(keyword => lower.includes(keyword)));

    const issueType = matched ? matched[0] : 'other';
    const categoryMap = {
      road: { issueType: 'Road / Pothole', severity: 'High', risk: 'High', cause: 'Road surface damage', affected: ['Pedestrians', 'Two-wheelers'], department: 'Roads & Infrastructure' },
      garbage: { issueType: 'Waste / Garbage', severity: 'High', risk: 'Medium', cause: 'Improper waste collection', affected: ['Residents', 'Shoppers'], department: 'Sanitation Department' },
      streetlight: { issueType: 'Streetlight', severity: 'Medium', risk: 'High', cause: 'Electrical outage or broken fixture', affected: ['Night commuters', 'Pedestrians'], department: 'Electrical Department' },
      water: { issueType: 'Water Leakage', severity: 'High', risk: 'High', cause: 'Pipeline damage or leak', affected: ['Pedestrians', 'Local residents'], department: 'Water Supply Department' },
      drainage: { issueType: 'Drainage', severity: 'Medium', risk: 'High', cause: 'Blocked stormwater channel', affected: ['Residents', 'Commuters'], department: 'Drainage Department' },
      traffic: { issueType: 'Traffic Safety', severity: 'Medium', risk: 'High', cause: 'Unsafe road conditions or missing signage', affected: ['Drivers', 'Pedestrians'], department: 'Traffic Police' },
      toilet: { issueType: 'Public Sanitation', severity: 'Medium', risk: 'Medium', cause: 'Maintenance or infrastructure failure', affected: ['Public users', 'Women and children'], department: 'Public Works Department' },
      other: { issueType: 'General Civic Issue', severity: 'Medium', risk: 'Medium', cause: 'Requires on-site inspection', affected: ['Residents'], department: 'Municipal Corporation' },
    };

    return categoryMap[issueType];
  }

  function handleSubmit() {
    const saved = JSON.parse(localStorage.getItem('civicpulse_reports') || '[]');
    const issueSummary = inferIssueSummary(form.description || form.category);
    const newReport = {
      id: `CP-${Date.now()}`,
      category: form.category,
      title: issueSummary.issueType,
      description: form.description,
      location: form.location,
      status: 'reported',
      reportedDate: new Date().toISOString().split('T')[0],
      priority: issueSummary.severity === 'High' ? 84 : 71,
      severity: issueSummary.severity.toLowerCase(),
      department: issueSummary.department,
      affectedCitizens: 58,
      recurrenceCount: 2,
      timeline: [
        { step: 'reported', date: new Date().toISOString().split('T')[0], note: 'Issue reported by citizen' },
        { step: 'ai_analysed', date: new Date().toISOString().split('T')[0], note: 'AI-assisted draft created for review' },
        { step: 'assigned', date: new Date().toISOString().split('T')[0], note: `Assigned to ${issueSummary.department}` },
      ],
      rootCause: issueSummary.cause,
      aiConfidence: 91,
    };
    saved.push(newReport);
    localStorage.setItem('civicpulse_reports', JSON.stringify(saved));
    setSubmitted(true);
  }

  // Mock image upload
  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => update('imagePreview', reader.result);
    reader.readAsDataURL(file);
  }

  const stepLabels = ['Category', 'Photo', 'Description', 'Location', 'Submit'];
  const draftSummary = inferIssueSummary(form.description || form.category);

  return (
    <div className="page-content fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">📝 Report a Civic Issue</h1>
          <p className="page-subtitle">Help improve your city by reporting problems in your area.</p>
        </div>
      </div>

      <div className={`report-content-shell${submitted ? ' is-submitted' : ''}`}>
        {!submitted ? (
          <div className="card" style={{ padding: 32 }}>
            {/* Step Indicator */}
            <StepIndicator currentStep={step} totalSteps={5} />

            {/* Step 1: Category */}
            {step === 1 && (
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Select Issue Category</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 20 }}>What type of problem are you reporting?</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => update('category', cat.id)}
                      style={{
                        padding: 16,
                        borderRadius: 12,
                        border: `2px solid ${form.category === cat.id ? cat.color : 'var(--border)'}`,
                        background: form.category === cat.id ? cat.color + '12' : 'var(--surface)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 8,
                        transition: 'all 0.2s',
                      }}
                    >
                      <span style={{ fontSize: 28 }}>{cat.icon}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: form.category === cat.id ? cat.color : 'var(--text-muted)', textAlign: 'center', lineHeight: 1.3 }}>
                        {cat.label}
                      </span>
                    </button>
                  ))}
                </div>
                {errors.category && <p className="form-error" style={{ marginTop: 8 }}>{errors.category}</p>}
              </div>
            )}

            {/* Step 2: Photo */}
            {step === 2 && (
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Upload Photo</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 20 }}>A photo helps AI understand the problem better. (Optional)</p>
                <div
                  style={{
                    border: '2px dashed var(--border-dark)',
                    borderRadius: 12,
                    padding: 32,
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: 'var(--surface-2)',
                    position: 'relative',
                  }}
                >
                  {form.imagePreview ? (
                    <div>
                      <img src={form.imagePreview} alt="Preview" style={{ maxHeight: 200, borderRadius: 8, marginBottom: 12 }} />
                      <div style={{ fontSize: 13, color: 'var(--success)' }}>✅ Image uploaded successfully</div>
                    </div>
                  ) : (
                    <>
                      <div style={{ fontSize: 48, marginBottom: 12 }}>📷</div>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>Tap to upload photo</div>
                      <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>JPG, PNG (max 5MB)</div>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Description */}
            {step === 3 && (
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Tell CIVIORA what happened</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 20 }}>Add a short description of the issue and any nearby details.</p>

                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 220 }}>
                    <label htmlFor="issue-description" className="form-label">Description</label>
                    <textarea
                      id="issue-description"
                      className="form-input form-textarea"
                      placeholder="There is a large pothole near my college gate and bikes are falling."
                      value={form.description}
                      onChange={e => update('description', e.target.value)}
                      rows={5}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center', minWidth: 120 }}>
                    <button type="button" className="btn btn-outline btn-sm" aria-label="Use speech input">🎙️ Mic</button>
                    <label className="btn btn-outline btn-sm" htmlFor="report-image-upload" style={{ margin: 0, cursor: 'pointer', width: '100%', justifyContent: 'center' }}>
                      🖼️ Photo
                    </label>
                    <input id="report-image-upload" type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                  </div>
                </div>

                {form.description && (
                  <div className="alert alert-info" style={{ marginBottom: 12 }}>
                    <div>
                      <strong>AI-assisted draft — review before submitting</strong><br />
                      Issue type: {draftSummary.issueType} · Severity: {draftSummary.severity} · Department: {draftSummary.department}
                    </div>
                  </div>
                )}

                {errors.description && <p className="form-error">{errors.description}</p>}
              </div>
            )}

            {/* Step 4: Location */}
            {step === 4 && (
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Choose a location</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 20 }}>Select the place where the issue happened.</p>

                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input
                    className="form-input"
                    value={form.location.area}
                    onChange={e => update('location', { ...form.location, area: e.target.value })}
                    placeholder="Search area or landmark"
                  />
                </div>

                {/* Mock Map */}
                <div style={{
                  height: 200,
                  background: 'linear-gradient(135deg, #e0f2fe, #bae6fd)',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                  border: '1px solid #7dd3fc',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 40 }}>📍</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary)', marginTop: 6 }}>
                      {form.location.area}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      {form.location.lat}°N, {form.location.lng}°E
                    </div>
                  </div>
                  {/* Decorative grid lines */}
                  <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Area / Locality</label>
                    <input className="form-input" value={form.location.area} onChange={e => update('location', { ...form.location, area: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nearby Landmark</label>
                    <input className="form-input" value={form.location.landmark} onChange={e => update('location', { ...form.location, landmark: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Latitude</label>
                    <input className="form-input" value={form.location.lat} readOnly />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Longitude</label>
                    <input className="form-input" value={form.location.lng} readOnly />
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Review & Submit */}
            {step === 5 && (
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Review & Submit</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 20 }}>Check your report before submitting.</p>

                <div className="card" style={{ background: '#f8fafc', border: '1px solid #dbeafe', marginBottom: 20 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {[
                      { label: 'Issue Type', value: draftSummary.issueType },
                      { label: 'Location', value: form.location.area },
                      { label: 'Severity', value: draftSummary.severity },
                      { label: 'Safety Risk', value: draftSummary.risk },
                      { label: 'Possible Cause', value: draftSummary.cause },
                      { label: 'Affected People', value: draftSummary.affected.join(', ') },
                      { label: 'Recommended Department', value: draftSummary.department },
                    ].map(item => (
                      <div key={item.label} style={{ padding: '12px 14px', background: 'white', border: '1px solid #e2e8f0', borderRadius: 10 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 5 }}>{item.label}</div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="alert alert-warning" style={{ marginBottom: 16 }}>
                  ⚠️ By submitting, you confirm this is a genuine civic issue in your area.
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, gap: 12 }}>
              <button
                className="btn btn-outline"
                onClick={step === 1 ? () => navigate('/citizen/dashboard') : prevStep}
              >
                ← {step === 1 ? 'Cancel' : 'Back'}
              </button>

              {step < 5 ? (
                <button className="btn btn-primary" onClick={nextStep}>
                  Next: {stepLabels[step]} →
                </button>
              ) : (
                <button className="btn btn-success" onClick={handleSubmit}>
                  ✅ Submit Report
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="report-result-card">
            <AIAnalysisResult formData={form} />
          </div>
        )}
      </div>
    </div>
  );
}
