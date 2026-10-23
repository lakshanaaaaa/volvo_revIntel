import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
});

// ── Records ───────────────────────────────────────────────────
export const getRecords = (params = {}) =>
  api.get('/records', { params }).then(r => r.data);

export const getStats = () =>
  api.get('/records/stats').then(r => r.data);

export const getRecord = (id) =>
  api.get(`/records/${id}`).then(r => r.data);

export const updateRoute = (id, routes) =>
  api.patch(`/records/${id}/route`, { routes }).then(r => r.data);

export const clearRoute = (id) =>
  api.patch(`/records/${id}/route/clear`).then(r => r.data);

// ── Import ────────────────────────────────────────────────────
export const importBatch = (batch) =>
  api.post('/import/batch', batch).then(r => r.data);

export const importFile = (file) => {
  const form = new FormData();
  form.append('file', file);
  return api.post('/import/batch', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(r => r.data);
};

// ── Exports ───────────────────────────────────────────────────
export const getManifest = () =>
  api.get('/exports/manifest').then(r => r.data);

export const downloadManifestJson = () =>
  api.get('/exports/manifest.json', { responseType: 'blob' }).then(r => r.data);

export const downloadManifestCsv = () =>
  api.get('/exports/manifest.csv', { responseType: 'blob' }).then(r => r.data);

export const downloadZip = () =>
  api.get('/exports/zip', { responseType: 'blob' }).then(r => r.data);

// ── Health ────────────────────────────────────────────────────
export const getHealth = () =>
  api.get('/health').then(r => r.data);
