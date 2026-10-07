import { useState } from 'react';
import { AlertTriangle, CheckCircle2, CircleHelp, ShieldCheck, X } from 'lucide-react';

export default function AIDecisionExplanation({
  title = 'Decision explanation',
  score,
  factors = [],
  recommendation,
  confidence,
  triggerLabel = 'Explain this decision',
}) {
  const [open, setOpen] = useState(false);
  const positiveFactors = factors.filter((factor) => factor.kind === 'positive');
  const riskFactors = factors.filter((factor) => factor.kind !== 'positive');

  return (
    <>
      <button type="button" className="btn btn-outline btn-sm" onClick={() => setOpen(true)}>
        <CircleHelp size={15} />
        {triggerLabel}
      </button>

      {open && (
        <div className="decision-modal-backdrop" onClick={() => setOpen(false)}>
          <section
            className="decision-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="decision-explanation-title"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="decision-modal-header">
              <div>
                <div className="decision-eyebrow">Transparent factor summary</div>
                <h2 id="decision-explanation-title">{title}</h2>
              </div>
              <button type="button" className="btn btn-ghost btn-sm" aria-label="Close explanation" onClick={() => setOpen(false)}>
                <X size={18} />
              </button>
            </header>

            <div className="decision-score-row">
              <div>
                <div className="decision-score-label">Score</div>
                <div className="decision-score">{score}<span>/100</span></div>
              </div>
              <div className="decision-confidence">
                <ShieldCheck size={18} />
                <span>Mock assessment confidence</span>
                <strong>{confidence}%</strong>
              </div>
            </div>
            <div className="progress-bar decision-score-meter">
              <div className="progress-fill" style={{ width: `${Math.min(100, Math.max(0, score))}%` }} />
            </div>

            <div className="decision-factor-columns">
              <FactorGroup title="Risk factors" icon={<AlertTriangle size={16} />} factors={riskFactors} />
              <FactorGroup title="Supporting factors" icon={<CheckCircle2 size={16} />} factors={positiveFactors} />
            </div>

            {recommendation && (
              <div className="decision-recommendation">
                <strong>Recommended next step</strong>
                <p>{recommendation}</p>
              </div>
            )}

            <p className="decision-disclaimer">
              This explanation lists the mock civic indicators used by this demonstration. It is not hidden model reasoning or a live AI prediction.
            </p>
          </section>
        </div>
      )}
    </>
  );
}

function FactorGroup({ title, icon, factors }) {
  return (
    <div className="decision-factor-group">
      <h3>{icon}{title}</h3>
      {factors.length ? factors.map((factor) => (
        <div className="decision-factor" key={factor.label}>
          <div className="decision-factor-top">
            <strong>{factor.label}</strong>
            <span>+{factor.value}</span>
          </div>
          <div className="decision-factor-meter">
            <div style={{ width: `${Math.min(100, factor.value * 4)}%` }} />
          </div>
          {factor.detail && <p>{factor.detail}</p>}
        </div>
      )) : <p className="decision-empty-factor">No additional factors in this category.</p>}
    </div>
  );
}
