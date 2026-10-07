import express from 'express';
import { CIVIC_ALERTS } from '../src/data/civicAlerts.js';
import { CIVIC_SERVICES } from '../src/data/civicServices.js';

const app = express();
const PORT = process.env.PORT || 3001;
const urgentHazards = [];

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'CIVIORA backend', time: new Date().toISOString() });
});

app.get('/api/civic-alerts', (req, res) => {
  res.json({ alerts: CIVIC_ALERTS });
});

app.get('/api/civic-services', (req, res) => {
  res.json({ services: CIVIC_SERVICES });
});

app.get('/api/civic-services/:id', (req, res) => {
  const service = CIVIC_SERVICES.find(item => item.id === req.params.id);
  if (!service) {
    return res.status(404).json({ error: 'Service not found' });
  }
  res.json({ service });
});

app.get('/api/reports/:id', (req, res) => {
  const { id } = req.params;
  const report = {
    id,
    title: 'Large pothole near college gate',
    status: 'reported',
    department: 'Roads & Infrastructure',
    location: 'MG Road, Guntur',
    description: 'Large pothole causing traffic and rider instability near the college gate.'
  };

  res.json({ report });
});

app.post('/api/reports', (req, res) => {
  const { description, location, category } = req.body || {};

  if (!description || !location) {
    return res.status(400).json({ error: 'Description and location are required.' });
  }

  const createdReport = {
    id: `CP-${Date.now()}`,
    category: category || 'road',
    description,
    location,
    status: 'reported',
    department: 'Roads & Infrastructure',
    priority: 82,
    createdAt: new Date().toISOString(),
  };

  res.status(201).json({ report: createdReport });
});

app.post('/api/urgent-hazards', (req, res) => {
  const { hazardType, location, description, department } = req.body || {};

  if (!hazardType || !location) {
    return res.status(400).json({ error: 'Hazard type and location are required.' });
  }

  const record = {
    id: `HAZ-${Date.now()}`,
    hazardType,
    location,
    description: description || 'No additional details provided.',
    department: department || 'Municipal Corporation',
    priority: 'critical',
    createdAt: new Date().toISOString(),
  };

  urgentHazards.push(record);
  res.status(201).json({ hazard: record, message: 'Urgent civic hazard record created successfully.' });
});

app.get('/api/help', (req, res) => {
  res.json({ options: [
    'Report a Problem',
    'Track My Report',
    'Find Nearby Civic Alerts',
    'Find a Safer Route',
    'Accessibility Assistance',
    'Find Civic Services',
    'Report an Urgent Hazard'
  ]});
});

app.listen(PORT, () => {
  console.log(`CIVIORA mock backend running on http://localhost:${PORT}`);
});
