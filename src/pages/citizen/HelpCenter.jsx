import { useNavigate } from 'react-router-dom';
import { HELP_OPTIONS } from '../../data/helpOptions';

export default function HelpCenter() {
  const navigate = useNavigate();

  return (
    <div className="page-content fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">How can CIVIORA help?</h1>
          <p className="page-subtitle">Choose what you need and we'll guide you.</p>
        </div>
      </div>

      <div className="help-card-grid">
        {HELP_OPTIONS.map(option => (
          <button
            key={option.id}
            type="button"
            className="help-action-card card"
            aria-label={option.title}
            onClick={() => navigate(option.path)}
          >
            <div className="help-card-badge">{option.badge}</div>
            <div className="help-card-icon" aria-hidden="true">{option.icon}</div>
            <div className="help-card-title">{option.title}</div>
            <div className="help-card-subtitle">{option.subtitle}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
