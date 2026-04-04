import React, { useState } from 'react';
import { SERIES_CONFIG, SCHEDULE_DB } from './Series';
import * as storage from '../utils/storage';

const ADMIN_HASH = '764d6e08822c75202cae8cf2f2650174f3035e096caf0eaad8aa2c6c047eb241';
const SERIES_IDS = ['core', 'showdown'];

async function hashPassword(pw) {
  const data = new TextEncoder().encode(pw);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// ─────────────────────────────────────────────────────────────
// SHARED UI HELPERS
// ─────────────────────────────────────────────────────────────
function SectionHeader({ icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <div className="bg-primary/10 p-3 rounded-xl shrink-0">
        <span className="material-symbols-outlined text-primary text-2xl block">{icon}</span>
      </div>
      <div>
        <h2 className="font-headline text-2xl font-black uppercase italic text-slate-900">{title}</h2>
        {subtitle && <p className="text-secondary font-body text-sm mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

function SeriesTabs({ active, setActive }) {
  return (
    <div className="flex border-b border-slate-200 mb-6 overflow-x-auto">
      {SERIES_IDS.map(id => (
        <button key={id} onClick={() => setActive(id)}
          className={`px-5 py-3 font-label font-bold text-xs uppercase tracking-widest whitespace-nowrap border-b-2 transition-all ${active === id ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-700'}`}>
          {SERIES_CONFIG[id]?.title || id}
        </button>
      ))}
    </div>
  );
}

function Input({ label, value, onChange, placeholder, type = 'text', required, className = '' }) {
  return (
    <div className={className}>
      {label && <label className="block font-label font-bold text-xs uppercase tracking-widest text-secondary mb-1.5">{label}</label>}
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required={required}
        className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-sm font-body text-slate-800 focus:border-primary outline-none placeholder:text-slate-400 transition-all focus:bg-white" />
    </div>
  );
}

function SaveButton({ onClick, saved, children = 'Save Changes' }) {
  return (
    <div className="flex items-center gap-3">
      {saved && <span className="flex items-center gap-1.5 text-green-600 font-label text-xs font-bold uppercase tracking-widest"><span className="material-symbols-outlined text-[16px]">check_circle</span>Saved!</span>}
      <button onClick={onClick} className="flex items-center gap-2 bg-primary text-white font-label font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-sky-500 transition-all shadow-sm">
        <span className="material-symbols-outlined text-[18px]">save</span>{children}
      </button>
    </div>
  );
}

function EmptyState({ icon, message, sub }) {
  return (
    <div className="text-center py-16 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
      <span className="material-symbols-outlined text-4xl text-slate-300 mb-3 block">{icon}</span>
      <p className="font-body text-secondary">{message}</p>
      {sub && <p className="font-body text-sm text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PASSWORD GATE
// ─────────────────────────────────────────────────────────────
function AdminLogin({ onLogin }) {
  const [pw, setPw] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hashed = await hashPassword(pw);
    if (hashed === ADMIN_HASH) {
      sessionStorage.setItem('adminAuth', 'true');
      onLogin();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setPw('');
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4 pt-16">
      <div className={`w-full max-w-sm bg-white rounded-3xl p-10 shadow-2xl border border-slate-200 ${shake ? 'animate-[wiggle_0.4s_ease-in-out]' : ''}`}
        style={shake ? { animation: 'wiggle 0.4s ease-in-out' } : {}}>
        <style>{`@keyframes wiggle { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-6px)} 80%{transform:translateX(6px)} }`}</style>
        <div className="flex justify-center mb-8">
          <div className="bg-primary/10 p-4 rounded-2xl">
            <span className="material-symbols-outlined text-primary text-4xl block">admin_panel_settings</span>
          </div>
        </div>
        <h1 className="font-headline text-3xl font-black uppercase italic text-center text-slate-900 mb-1">Admin Access</h1>
        <p className="text-center text-secondary font-body text-sm mb-8">NoBull Esports Control Center</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">lock</span>
            <input type="password" placeholder="Enter admin password" value={pw} onChange={e => { setPw(e.target.value); setError(false); }} autoFocus
              className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 font-body text-sm outline-none transition-all ${error ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50 focus:border-primary focus:bg-white'}`} />
          </div>
          {error && <p className="text-red-500 text-xs font-bold text-center -mt-2">Incorrect password. Try again.</p>}
          <button type="submit" className="bg-primary text-white font-headline font-black uppercase tracking-widest text-sm py-4 rounded-xl hover:bg-sky-500 transition-all hover:shadow-lg hover:-translate-y-0.5 active:scale-95">
            Enter Command Center
          </button>
        </form>
      </div>
    </main>
  );
}

// ─────────────────────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────────────────────
const NAV = [
  { id: 'dashboard',     label: 'Dashboard',    icon: 'dashboard' },
  { id: 'results',       label: 'Results',       icon: 'bar_chart' },
  { id: 'standings',     label: 'Standings',     icon: 'leaderboard' },
  { id: 'drivers',       label: 'Drivers',       icon: 'group' },
  { id: 'schedule',      label: 'Schedule',      icon: 'calendar_month' },
  { id: 'config',        label: 'Series Config', icon: 'tune' },
  { id: 'info',          label: 'Info Builder',  icon: 'view_timeline' },
  { id: 'registrations', label: 'Registrations', icon: 'inbox' },
  { id: 'announcements', label: 'Announcements', icon: 'campaign' },
  { id: 'media',         label: 'Media',         icon: 'smart_display' },
];

function Sidebar({ active, setActive, onLogout }) {
  return (
    <aside className="fixed top-16 left-0 bottom-0 w-60 bg-slate-900 flex flex-col z-40 border-r border-slate-800">
      <div className="p-5 border-b border-slate-800 shrink-0">
        <p className="font-label text-[10px] uppercase tracking-widest font-black text-slate-500 mb-0.5">Control Center</p>
        <p className="font-headline font-black italic text-base text-white uppercase tracking-tight">NoBull Admin</p>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV.map(item => (
          <button key={item.id} onClick={() => setActive(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${active === item.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
            <span className="material-symbols-outlined text-[20px] shrink-0">{item.icon}</span>
            <span className="font-label font-bold text-xs uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-3 border-t border-slate-800 shrink-0">
        <button onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span className="font-label font-bold text-xs uppercase tracking-widest">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

// ─────────────────────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────────────────────
function Dashboard({ setSection }) {
  const drivers = storage.getDrivers();
  const regs = storage.getRegistrations();
  const ann = storage.getAnnouncement();
  const totalDrivers = SERIES_IDS.reduce((s, id) => s + (drivers[id]?.length || 0), 0);
  const pendingRegs = regs.filter(r => r.status === 'pending').length;

  const stats = [
    { label: 'Total Drivers', value: totalDrivers,      icon: 'group',        color: '#3b82f6', section: 'drivers' },
    { label: 'Pending Sign-Ups', value: pendingRegs,    icon: 'inbox',        color: '#f97316', section: 'registrations' },
    { label: 'Total Sign-Ups',   value: regs.length,    icon: 'edit_document', color: '#8b5cf6', section: 'registrations' },
    { label: 'Announcement',     value: ann.active ? 'Live' : 'Off', icon: 'campaign', color: '#10b981', section: 'announcements' },
  ];

  return (
    <div>
      <SectionHeader icon="dashboard" title="Dashboard" subtitle="League command center overview." />
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
        {stats.map(s => (
          <button key={s.label} onClick={() => setSection(s.section)}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-left group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl" style={{ backgroundColor: `${s.color}18` }}>
                <span className="material-symbols-outlined text-2xl block" style={{ color: s.color }}>{s.icon}</span>
              </div>
              <span className="material-symbols-outlined text-slate-300 group-hover:text-slate-400 text-sm">arrow_forward</span>
            </div>
            <p className="font-headline text-4xl font-black text-slate-900 mb-1">{s.value}</p>
            <p className="font-label text-[10px] uppercase tracking-widest font-bold text-secondary">{s.label}</p>
          </button>
        ))}
      </div>
      <EmptyState icon="sports_score" message="Ready for action. Use the sidebar to manage your league." />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// RESULTS
// ─────────────────────────────────────────────────────────────
function ResultsSection() {
  const [dragActive, setDragActive] = useState(false);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({ series: '', round: '', p1: '', p2: '', p3: '' });

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 4000); };

  const handleFile = (file) => {
    if (!file.name.endsWith('.json') && file.type !== 'application/json') { alert('Please upload a valid JSON file.'); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        const existing = storage.getRaceResults();
        storage.setRaceResults({ ...existing, _lastImport: { data, importedAt: Date.now() } });
        showToast('JSON imported and saved to local storage.');
      } catch { alert('Invalid JSON format.'); }
    };
    reader.readAsText(file);
  };

  const handleDrag = (e) => { e.preventDefault(); e.stopPropagation(); setDragActive(e.type === 'dragenter' || e.type === 'dragover'); };
  const handleDrop = (e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]); };

  const handleManual = (e) => {
    e.preventDefault();
    const existing = storage.getRaceResults();
    const entry = { series: form.series, round: form.round, podium: [form.p1, form.p2, form.p3], savedAt: Date.now() };
    storage.setRaceResults({ ...existing, [`${form.series}_${Date.now()}`]: entry });
    showToast('Results published to local storage.');
    setForm({ series: '', round: '', p1: '', p2: '', p3: '' });
  };

  return (
    <div>
      <SectionHeader icon="bar_chart" title="Race Results" subtitle="Upload iRacing session exports or manually enter podium results." />
      {toast && (
        <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 border shadow-sm ${toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
          <span className="material-symbols-outlined text-2xl">{toast.type === 'success' ? 'check_circle' : 'error'}</span>
          <p className="font-label font-bold text-sm uppercase tracking-wide">{toast.msg}</p>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* JSON Upload */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-6 pb-5 border-b border-slate-100">
            <div className="bg-primary/10 p-2.5 rounded-xl"><span className="material-symbols-outlined text-primary text-2xl block">data_object</span></div>
            <div><h3 className="font-headline text-xl font-bold uppercase italic text-slate-900">Import JSON</h3><p className="text-secondary font-body text-xs mt-0.5">Best for automated extraction</p></div>
          </div>
          <div className={`flex-1 min-h-[240px] rounded-xl border-[3px] border-dashed flex flex-col items-center justify-center p-8 text-center transition-all cursor-pointer ${dragActive ? 'border-primary bg-primary/5' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300'}`}
            onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
            <span className={`material-symbols-outlined text-6xl mb-4 transition-colors ${dragActive ? 'text-primary' : 'text-slate-300'}`}>cloud_upload</span>
            <p className="font-headline font-bold text-lg text-slate-800 mb-2">Drag & Drop iRacing JSON</p>
            <p className="font-body text-sm text-secondary mb-6 max-w-xs">Auto-parses session podiums, validates driver IDs, tabulates points.</p>
            <label className="bg-white border-2 border-slate-200 text-slate-700 font-label font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-xl cursor-pointer hover:border-primary hover:text-primary transition-all shadow-sm">
              Browse Files
              <input type="file" className="hidden" accept=".json,application/json" onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
            </label>
          </div>
        </div>
        {/* Manual Entry */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-6 pb-5 border-b border-slate-100">
            <div className="bg-slate-100 p-2.5 rounded-xl"><span className="material-symbols-outlined text-secondary text-2xl block">edit_document</span></div>
            <div><h3 className="font-headline text-xl font-bold uppercase italic text-slate-900">Manual Override</h3><p className="text-secondary font-body text-xs mt-0.5">Fallback data entry</p></div>
          </div>
          <form onSubmit={handleManual} className="flex-1 flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-label font-bold text-xs uppercase tracking-widest text-secondary mb-1.5">Series</label>
                <select required className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:border-primary outline-none cursor-pointer" value={form.series} onChange={e => setForm({ ...form, series: e.target.value })}>
                  <option value="" disabled>Select</option>
                  {SERIES_IDS.map(id => <option key={id} value={id}>{SERIES_CONFIG[id]?.title || id}</option>)}
                </select>
              </div>
              <Input label="Race ID" placeholder="Race 3: Monza" value={form.round} onChange={v => setForm({ ...form, round: v })} required />
            </div>
            <div className="flex flex-col gap-3 pt-4 border-t border-slate-100 flex-1">
              {[{ key: 'p1', pos: 1, cls: 'bg-yellow-100 text-yellow-600 border-yellow-200' }, { key: 'p2', pos: 2, cls: 'bg-slate-200 text-slate-500 border-slate-300' }, { key: 'p3', pos: 3, cls: 'bg-orange-100 text-orange-600 border-orange-200' }].map(({ key, pos, cls }) => (
                <div key={key} className="flex items-center gap-3">
                  <div className={`h-11 w-11 rounded-lg border flex items-center justify-center font-headline font-black text-xl shrink-0 ${cls}`}>{pos}</div>
                  <input required type="text" placeholder={`${pos === 1 ? '1st' : pos === 2 ? '2nd' : '3rd'} Place Driver`}
                    className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:border-primary outline-none placeholder:font-normal placeholder:text-slate-400"
                    value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
                </div>
              ))}
            </div>
            <button type="submit" className="mt-auto bg-primary text-white font-headline font-bold uppercase tracking-tight py-4 rounded-xl hover:bg-sky-500 hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-[0.98]">
              Force Publish Results
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// DRIVERS
// ─────────────────────────────────────────────────────────────
function DriversSection() {
  const [series, setSeries] = useState('core');
  const [drivers, setDrivers] = useState(storage.getDrivers());
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const emptyForm = { name: '', iracingId: '', team: '', carNum: '' };
  const [form, setForm] = useState(emptyForm);

  const save = (e) => {
    e.preventDefault();
    const d = { ...drivers };
    if (editId !== null) { d[series] = d[series].map(x => x.id === editId ? { ...x, ...form } : x); }
    else { d[series] = [...(d[series] || []), { ...form, id: Date.now() }]; }
    storage.setDrivers(d); setDrivers(d); setForm(emptyForm); setEditId(null); setShowForm(false);
  };
  const edit = (dr) => { setForm({ name: dr.name, iracingId: dr.iracingId, team: dr.team, carNum: dr.carNum }); setEditId(dr.id); setShowForm(true); };
  const del = (id) => { if (!confirm('Remove this driver?')) return; const d = { ...drivers, [series]: drivers[series].filter(x => x.id !== id) }; storage.setDrivers(d); setDrivers(d); };

  const list = drivers[series] || [];
  const FIELDS = [{ key: 'name', label: 'iRacing Name', placeholder: 'Dylan Jones', required: true }, { key: 'iracingId', label: 'iRacing ID', placeholder: '103293' }, { key: 'team', label: 'Team', placeholder: 'Hendrick Motorsports' }, { key: 'carNum', label: 'Car #', placeholder: '48' }];

  return (
    <div>
      <SectionHeader icon="group" title="Driver Roster" subtitle="Manage per-series driver lists with iRacing IDs and team assignments." />
      <SeriesTabs active={series} setActive={(s) => { setSeries(s); setShowForm(false); setEditId(null); }} />
      <div className="flex justify-end mb-4">
        <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm(emptyForm); }}
          className="flex items-center gap-2 bg-primary text-white font-label font-bold text-xs uppercase tracking-widest px-5 py-2.5 rounded-xl hover:bg-sky-500 transition-all shadow-sm">
          <span className="material-symbols-outlined text-[18px]">{showForm ? 'close' : 'person_add'}</span>
          {showForm ? 'Cancel' : 'Add Driver'}
        </button>
      </div>
      {showForm && (
        <form onSubmit={save} className="bg-white border-2 border-primary/20 rounded-2xl p-6 mb-6 shadow-sm">
          <h4 className="font-headline font-bold text-base uppercase italic text-slate-900 mb-4">{editId ? 'Edit Driver' : 'New Driver'}</h4>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {FIELDS.map(f => <Input key={f.key} label={f.label} placeholder={f.placeholder} required={f.required} value={form[f.key]} onChange={v => setForm({ ...form, [f.key]: v })} />)}
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={() => { setShowForm(false); setEditId(null); }} className="px-5 py-2.5 font-label font-bold text-xs uppercase tracking-widest text-slate-500 hover:bg-slate-100 rounded-xl transition-all">Cancel</button>
            <button type="submit" className="px-6 py-2.5 bg-primary text-white font-label font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-sky-500 transition-all shadow-sm">{editId ? 'Save Changes' : 'Add Driver'}</button>
          </div>
        </form>
      )}
      {list.length === 0 ? <EmptyState icon="person_search" message="No drivers registered for this series yet." sub="Click 'Add Driver' to get started." /> : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="grid grid-cols-[48px_1fr_1fr_72px_96px] bg-slate-50 border-b border-slate-200 px-6 py-3 gap-3">
            {['#', 'Driver', 'Team', 'Car', ''].map((col, i) => <span key={i} className="font-label font-black text-[10px] uppercase tracking-widest text-slate-500">{col}</span>)}
          </div>
          {list.map((dr, idx) => (
            <div key={dr.id} className={`grid grid-cols-[48px_1fr_1fr_72px_96px] px-6 py-4 gap-3 items-center border-b border-slate-100 hover:bg-slate-50 transition-colors ${idx % 2 !== 0 ? 'bg-slate-50/40' : ''}`}>
              <span className="font-headline font-black text-lg text-slate-300">{idx + 1}</span>
              <div><p className="font-body font-bold text-sm text-slate-900 truncate">{dr.name}</p>{dr.iracingId && <p className="font-label text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {dr.iracingId}</p>}</div>
              <p className="font-body text-sm text-secondary truncate">{dr.team || '—'}</p>
              <p className="font-headline font-black text-base text-slate-700 text-center">{dr.carNum ? `#${dr.carNum}` : '—'}</p>
              <div className="flex items-center gap-1">
                <button onClick={() => edit(dr)} className="p-2 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-all"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                <button onClick={() => del(dr.id)} className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"><span className="material-symbols-outlined text-[18px]">delete</span></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SCHEDULE
// ─────────────────────────────────────────────────────────────
function ScheduleSection() {
  const [series, setSeries] = useState('core');
  const [schedule, setSchedule] = useState(storage.getSchedule());
  const [showForm, setShowForm] = useState(false);
  const [editRound, setEditRound] = useState(null);
  const emptyEvent = { track: '', date: '', time: '', car: '', laps: '', weather: '', fuel: '100%' };
  const [form, setForm] = useState(emptyEvent);

  const save = (e) => {
    e.preventDefault();
    const s = { ...schedule };
    if (editRound !== null) { s[series] = s[series].map(ev => ev.round === editRound ? { ...ev, ...form } : ev); }
    else { const next = (s[series]?.[s[series].length - 1]?.round || 0) + 1; s[series] = [...(s[series] || []), { ...form, round: next }]; }
    storage.setSchedule(s); setSchedule(s); setForm(emptyEvent); setEditRound(null); setShowForm(false);
  };
  const startEdit = (ev) => { setForm({ track: ev.track, date: ev.date, time: ev.time, car: ev.car, laps: ev.laps, weather: ev.weather || '', fuel: ev.fuel || '100%' }); setEditRound(ev.round); setShowForm(true); };
  const del = (round) => { if (!confirm('Delete this event?')) return; const s = { ...schedule, [series]: schedule[series].filter(ev => ev.round !== round) }; storage.setSchedule(s); setSchedule(s); };

  const list = schedule[series] || [];
  const FIELDS = [
    { key: 'track', label: 'Track', placeholder: 'Daytona International Speedway', span2: true, req: true },
    { key: 'date', label: 'Date', placeholder: '4/06/26', req: true },
    { key: 'time', label: 'Time', placeholder: '9:00 PM EST', req: true },
    { key: 'car', label: 'Car Class', placeholder: 'NASCAR Next Gen' },
    { key: 'laps', label: 'Laps', placeholder: '50 Laps' },
    { key: 'weather', label: 'Weather', placeholder: '78°F, Clear' },
    { key: 'fuel', label: 'Fuel Limit', placeholder: '100%' },
  ];

  return (
    <div>
      <SectionHeader icon="calendar_month" title="Schedule Editor" subtitle="Add, edit, or remove race events per series." />
      <SeriesTabs active={series} setActive={(s) => { setSeries(s); setShowForm(false); setEditRound(null); }} />
      <div className="flex justify-end mb-4">
        <button onClick={() => { setShowForm(!showForm); setEditRound(null); setForm(emptyEvent); }}
          className="flex items-center gap-2 bg-primary text-white font-label font-bold text-xs uppercase tracking-widest px-5 py-2.5 rounded-xl hover:bg-sky-500 transition-all shadow-sm">
          <span className="material-symbols-outlined text-[18px]">{showForm ? 'close' : 'add_circle'}</span>
          {showForm ? 'Cancel' : 'Add Event'}
        </button>
      </div>
      {showForm && (
        <form onSubmit={save} className="bg-white border-2 border-primary/20 rounded-2xl p-6 mb-6 shadow-sm">
          <h4 className="font-headline font-bold text-base uppercase italic text-slate-900 mb-4">{editRound !== null ? `Edit Race ${editRound}` : 'New Event'}</h4>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {FIELDS.map(f => (
              <div key={f.key} className={f.span2 ? 'col-span-2 lg:col-span-4' : ''}>
                <label className="block font-label font-bold text-xs uppercase tracking-widest text-secondary mb-1.5">{f.label}</label>
                <input type="text" required={f.req} placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-sm font-body text-slate-800 focus:border-primary outline-none placeholder:text-slate-400 transition-all" />
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={() => { setShowForm(false); setEditRound(null); }} className="px-5 py-2.5 font-label font-bold text-xs uppercase tracking-widest text-slate-500 hover:bg-slate-100 rounded-xl">Cancel</button>
            <button type="submit" className="px-6 py-2.5 bg-primary text-white font-label font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-sky-500 transition-all shadow-sm">{editRound !== null ? 'Save Changes' : 'Add Event'}</button>
          </div>
        </form>
      )}
      {list.length === 0 ? <EmptyState icon="event_busy" message="No events scheduled for this series yet." sub="Click 'Add Event' to get started." /> : (
        <div className="flex flex-col gap-3">
          {list.map(ev => (
            <div key={ev.round} className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-primary text-white flex items-center justify-center font-headline font-black text-lg shrink-0">{ev.round}</div>
              <div className="flex-1 min-w-0">
                <p className="font-headline font-bold text-base uppercase italic text-slate-900 truncate">{ev.track}</p>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {[ev.date, ev.time, ev.car, ev.laps].filter(Boolean).map((v, i) => (
                    <span key={i} className="font-label text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">{v}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => startEdit(ev)} className="p-2 rounded-xl text-slate-400 hover:text-primary hover:bg-primary/10 border border-slate-200 transition-all"><span className="material-symbols-outlined text-[18px]">edit_calendar</span></button>
                <button onClick={() => del(ev.round)} className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 border border-slate-200 transition-all"><span className="material-symbols-outlined text-[18px]">delete</span></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SERIES CONFIG
// ─────────────────────────────────────────────────────────────
function SeriesConfigSection() {
  const [series, setSeries] = useState('core');
  const [saved, setSaved] = useState(false);
  const [configs, setConfigs] = useState(() => {
    const stored = storage.getSeriesConfigOverrides();
    return stored || Object.fromEntries(SERIES_IDS.map(id => [id, {
      tagline: SERIES_CONFIG[id]?.tagline || '',
      day: SERIES_CONFIG[id]?.specs?.day || '',
      greenFlag: SERIES_CONFIG[id]?.specs?.greenFlag || '',
      format: SERIES_CONFIG[id]?.specs?.format || '',
      cars: SERIES_CONFIG[id]?.specs?.cars || '',
      tracks: SERIES_CONFIG[id]?.specs?.tracks || '',
    }]));
  });

  const cur = configs[series] || {};
  const set = (key, val) => { setConfigs(p => ({ ...p, [series]: { ...p[series], [key]: val } })); setSaved(false); };
  const handleSave = () => { storage.setSeriesConfigOverrides(configs); setSaved(true); setTimeout(() => setSaved(false), 3000); };

  const FIELDS = [
    { key: 'tagline', label: 'Tagline', placeholder: 'Short series description', wide: true },
    { key: 'day', label: 'Race Day', placeholder: 'e.g. Monday Nights' },
    { key: 'greenFlag', label: 'Green Flag', placeholder: 'e.g. 9:00 PM EST' },
    { key: 'format', label: 'Race Format', placeholder: 'e.g. Fixed Setups | 1 Fast Repair', wide: true },
    { key: 'cars', label: 'Car Class(es)', placeholder: 'e.g. NASCAR Trucks, Gen 6' },
    { key: 'tracks', label: 'Track Rotation', placeholder: 'e.g. Daytona & Talladega' },
  ];

  return (
    <div>
      <SectionHeader icon="tune" title="Series Config" subtitle="Edit per-series schedule details, format specs, and descriptions." />
      <SeriesTabs active={series} setActive={setSeries} />
      <div className="p-4 mb-6 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-3">
        <span className="material-symbols-outlined text-blue-500 shrink-0">info</span>
        <p className="font-body text-sm text-blue-700">Changes are saved to your browser's local storage and update the Series Hub header display.</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {FIELDS.map(f => <Input key={f.key} label={f.label} placeholder={f.placeholder} value={cur[f.key] || ''} onChange={v => set(f.key, v)} className={f.wide ? 'sm:col-span-2' : ''} />)}
        </div>
        <div className="mt-8">
           <label className="block font-label font-bold text-xs uppercase tracking-widest text-secondary mb-3">Module Toggles (Hide Tabs)</label>
           <div className="flex flex-wrap gap-3">
             {['info', 'results', 'standings', 'schedule', 'drivers'].map(tab => {
               const isDisabled = (cur.disabledTabs || []).includes(tab);
               return (
                 <button 
                   key={tab} 
                   onClick={() => {
                     const dt = cur.disabledTabs || [];
                     set('disabledTabs', isDisabled ? dt.filter(t => t !== tab) : [...dt, tab]);
                   }}
                   className={`px-4 py-2.5 rounded-xl font-label text-[10px] font-bold uppercase tracking-widest border border-slate-200 transition-all flex items-center gap-2 shadow-sm ${!isDisabled ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>
                   <span className="material-symbols-outlined text-[16px] flex-shrink-0">{!isDisabled ? 'visibility' : 'visibility_off'}</span>
                   {tab}
                 </button>
               )
             })}
           </div>
        </div>
        <div className="flex justify-end mt-8 pt-6 border-t border-slate-100">
          <SaveButton onClick={handleSave} saved={saved}>Save Config</SaveButton>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// REGISTRATIONS
// ─────────────────────────────────────────────────────────────
const STATUS_CLS = { pending: 'bg-amber-100 text-amber-700 border-amber-200', accepted: 'bg-green-100 text-green-700 border-green-200', rejected: 'bg-red-100 text-red-600 border-red-200' };

function RegistrationsSection() {
  const [regs, setRegs] = useState(storage.getRegistrations());
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSeries, setFilterSeries] = useState('all');

  const updateStatus = (id, status) => { const u = regs.map(r => r.id === id ? { ...r, status } : r); storage.setRegistrations(u); setRegs(u); };
  const del = (id) => { if (!confirm('Delete this registration?')) return; const u = regs.filter(r => r.id !== id); storage.setRegistrations(u); setRegs(u); };

  const filtered = regs.filter(r => (filterStatus === 'all' || r.status === filterStatus) && (filterSeries === 'all' || r.seriesId === filterSeries));

  return (
    <div>
      <SectionHeader icon="inbox" title="Registration Inbox" subtitle="Review and process driver sign-up submissions from the Join Series form." />
      <div className="flex flex-wrap gap-4 mb-6">
        {[{ label: 'Status', state: filterStatus, set: setFilterStatus, opts: [['all', 'All Statuses'], ['pending', 'Pending'], ['accepted', 'Accepted'], ['rejected', 'Rejected']] },
          { label: 'Series', state: filterSeries, set: setFilterSeries, opts: [['all', 'All Series'], ...SERIES_IDS.map(id => [id, SERIES_CONFIG[id]?.title || id])] }].map(f => (
          <div key={f.label}>
            <label className="block font-label font-bold text-[10px] uppercase tracking-widest text-secondary mb-1.5">{f.label}</label>
            <select value={f.state} onChange={e => f.set(e.target.value)} className="bg-white border-2 border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 focus:border-primary outline-none cursor-pointer">
              {f.opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
        ))}
      </div>
      {filtered.length === 0 ? <EmptyState icon="inbox" message="No registrations match your filters." sub="Submissions appear here when drivers complete the 'Join Series' form." /> : (
        <div className="flex flex-col gap-3">
          {filtered.map(reg => (
            <div key={reg.id} className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center gap-4 shadow-sm">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <p className="font-headline font-bold text-base uppercase italic text-slate-900">{reg.name || 'Unknown Driver'}</p>
                  <span className={`font-label font-bold text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-lg border ${STATUS_CLS[reg.status] || STATUS_CLS.pending}`}>{reg.status || 'pending'}</span>
                  <span className="font-label font-bold text-[10px] uppercase tracking-widest text-white px-2.5 py-1 rounded-lg" style={{ backgroundColor: SERIES_CONFIG[reg.seriesId]?.color || '#64748b' }}>{SERIES_CONFIG[reg.seriesId]?.title || reg.seriesId}</span>
                </div>
                <div className="flex flex-wrap gap-4 text-xs font-body text-secondary">
                  {reg.custId && <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">sports_motorsports</span>ID: {reg.custId}</span>}
                  {reg.carChoices?.filter(Boolean).length > 0 && <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">pin</span>Cars: #{reg.carChoices.filter(Boolean).join(', #')}</span>}
                  {reg.submittedAt && <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">schedule</span>{new Date(reg.submittedAt).toLocaleDateString()}</span>}
                </div>
              </div>
              <div className="flex gap-2 shrink-0 flex-wrap">
                <button onClick={() => updateStatus(reg.id, 'accepted')} className="px-3 py-2 text-xs font-label font-bold uppercase tracking-widest bg-green-50 text-green-700 border border-green-200 rounded-xl hover:bg-green-500 hover:text-white transition-all">Accept</button>
                <button onClick={() => updateStatus(reg.id, 'rejected')} className="px-3 py-2 text-xs font-label font-bold uppercase tracking-widest bg-red-50 text-red-600 border border-red-200 rounded-xl hover:bg-red-500 hover:text-white transition-all">Reject</button>
                <button onClick={() => del(reg.id)} className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 border border-slate-200 transition-all"><span className="material-symbols-outlined text-[18px]">delete</span></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ANNOUNCEMENTS
// ─────────────────────────────────────────────────────────────
function AnnouncementsSection() {
  const [ann, setAnn] = useState(storage.getAnnouncement());
  const [draft, setDraft] = useState(ann.text || '');
  const [saved, setSaved] = useState(false);

  const publish = () => { const u = { text: draft, active: true }; storage.setAnnouncement(u); setAnn(u); setSaved(true); setTimeout(() => setSaved(false), 3000); };
  const clear = () => { if (!confirm('Clear the active announcement?')) return; const u = { text: '', active: false }; storage.setAnnouncement(u); setAnn(u); setDraft(''); };

  return (
    <div>
      <SectionHeader icon="campaign" title="Announcements" subtitle="Publish a site-wide banner message visible to all visitors on the Home page." />
      {ann.active && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
          <span className="material-symbols-outlined text-green-600">check_circle</span>
          <p className="font-label font-bold text-xs uppercase tracking-widest text-green-700 flex-1">Announcement is currently LIVE on the Home page.</p>
          <button onClick={clear} className="flex items-center gap-1.5 font-label font-bold text-xs uppercase tracking-widest text-red-500 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 border border-red-200 transition-all">
            <span className="material-symbols-outlined text-[16px]">close</span>Clear
          </button>
        </div>
      )}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <label className="block font-label font-bold text-xs uppercase tracking-widest text-secondary mb-3">Announcement Text</label>
        <textarea value={draft} onChange={e => { setDraft(e.target.value); setSaved(false); }} rows={4} placeholder="e.g. 🏁 Season 2 Registration is now open! Sign up before April 15th to secure your spot."
          className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-4 text-sm font-body text-slate-800 focus:border-primary outline-none placeholder:text-slate-400 resize-none transition-all focus:bg-white" />
        <p className="text-xs text-secondary font-body mt-2 mb-6">{draft.length} characters</p>
        {draft.trim() && (
          <div className="mb-6">
            <p className="font-label font-bold text-[10px] uppercase tracking-widest text-secondary mb-3">Preview</p>
            <div className="bg-primary px-5 py-3.5 rounded-xl flex items-center gap-3 shadow-sm">
              <span className="material-symbols-outlined text-white text-[20px]">campaign</span>
              <p className="font-body text-sm text-white flex-1">{draft}</p>
              <span className="material-symbols-outlined text-white/60 text-[20px]">close</span>
            </div>
          </div>
        )}
        <div className="flex justify-between items-center pt-6 border-t border-slate-100">
          {!ann.active && <span className="text-secondary font-body text-sm">No active announcement.</span>}
          {ann.active && <button onClick={clear} className="px-5 py-2.5 font-label font-bold text-xs uppercase tracking-widest text-red-500 hover:bg-red-50 border border-red-200 rounded-xl transition-all">Clear Announcement</button>}
          <SaveButton onClick={publish} saved={saved}>Publish</SaveButton>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MEDIA & BROADCASTS
// ─────────────────────────────────────────────────────────────
function MediaSection() {
  const [config, setConfig] = useState(storage.getMediaConfig());
  const [saved, setSaved] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const emptyVod = { title: '', url: '' };
  const [vodForm, setVodForm] = useState(emptyVod);

  const saveFeatured = () => {
    storage.setMediaConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const saveVod = (e) => {
    e.preventDefault();
    const c = { ...config };
    if (editId !== null) {
      c.vods = c.vods.map(v => v.id === editId ? { ...v, ...vodForm } : v);
    } else {
      c.vods = [{ ...vodForm, id: Date.now() }, ...(c.vods || [])];
    }
    storage.setMediaConfig(c);
    setConfig(c);
    setVodForm(emptyVod);
    setEditId(null);
    setShowForm(false);
  };

  const edit = (vod) => { setVodForm(vod); setEditId(vod.id); setShowForm(true); };
  const del = (id) => { if (!confirm('Remove this VOD?')) return; const c = { ...config, vods: config.vods.filter(v => v.id !== id) }; storage.setMediaConfig(c); setConfig(c); };

  return (
    <div>
      <SectionHeader icon="smart_display" title="Media & Broadcasts" subtitle="Update the active featured broadcast and manage the VOD archive." />
      
      {/* Featured Video */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-8">
        <h3 className="font-headline text-xl font-bold uppercase italic text-slate-900 mb-4">Featured Broadcast</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Input label="Broadcast Title" placeholder="e.g. Core Series: Talladega 500" value={config.featured?.title || ''} onChange={v => setConfig({...config, featured: {...config.featured, title: v}})} />
          <Input label="YouTube Embed URL" placeholder="e.g. https://www.youtube.com/embed/..." value={config.featured?.url || ''} onChange={v => setConfig({...config, featured: {...config.featured, url: v}})} />
        </div>
        <div className="flex justify-end pt-4 border-t border-slate-100">
          <SaveButton onClick={saveFeatured} saved={saved}>Update Featured Video</SaveButton>
        </div>
      </div>

      {/* VOD Archive */}
      <div className="flex justify-between items-end mb-4">
        <h3 className="font-headline text-xl font-bold uppercase italic text-slate-900">VOD Archive Manager</h3>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); setVodForm(emptyVod); }}
          className="flex items-center gap-2 bg-primary text-white font-label font-bold text-xs uppercase tracking-widest px-5 py-2.5 rounded-xl hover:bg-sky-500 transition-all shadow-sm">
          <span className="material-symbols-outlined text-[18px]">{showForm ? 'close' : 'add_circle'}</span>
          {showForm ? 'Cancel' : 'Add VOD'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={saveVod} className="bg-white border-2 border-primary/20 rounded-2xl p-6 mb-6 shadow-sm">
          <h4 className="font-headline font-bold text-base uppercase italic text-slate-900 mb-4">{editId ? 'Edit VOD' : 'New VOD Archive Entry'}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Video Title" placeholder="Core Series Race" value={vodForm.title} onChange={v => setVodForm({...vodForm, title: v})} required />
            <Input label="YouTube Link" placeholder="https://www.youtube.com/watch?..." value={vodForm.url} onChange={v => setVodForm({...vodForm, url: v})} required />
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 font-label font-bold text-xs uppercase tracking-widest text-slate-500 hover:bg-slate-100 rounded-xl transition-all">Cancel</button>
            <button type="submit" className="px-6 py-2.5 bg-primary text-white font-label font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-sky-500 shadow-sm transition-all">{editId ? 'Save Changes' : 'Add VOD'}</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {config.vods?.length > 0 ? config.vods.map((vod, idx) => (
          <div key={vod.id} className={`flex items-center gap-4 px-6 py-4 border-b border-slate-100 ${idx % 2 !== 0 ? 'bg-slate-50/40' : ''} hover:bg-slate-50 transition-colors`}>
            <img src={vod.thumbnail || (vod.url ? `https://img.youtube.com/vi/${(vod.url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/) || [])[1]}/maxresdefault.jpg` : '')} alt="" className="w-20 h-12 object-cover rounded shadow-sm bg-slate-200" />
            <div className="flex-1 min-w-0">
              <p className="font-headline font-bold text-sm uppercase italic text-slate-900 truncate">{vod.title}</p>
              <div className="flex gap-2">
                {vod.date && <span className="font-label text-[9px] uppercase font-bold text-slate-400">{vod.date}</span>}
                {vod.series && <span className="font-label text-[9px] uppercase font-bold text-primary">{vod.series}</span>}
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => edit(vod)} className="p-2 rounded-lg text-slate-400 hover:text-primary transition-all hover:bg-primary/10"><span className="material-symbols-outlined text-[18px]">edit</span></button>
              <button onClick={() => del(vod.id)} className="p-2 rounded-lg text-slate-400 hover:text-red-500 transition-all hover:bg-red-50"><span className="material-symbols-outlined text-[18px]">delete</span></button>
            </div>
          </div>
        )) : <p className="p-8 text-center font-body text-slate-400">No VODs added yet.</p>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// STANDINGS
// ─────────────────────────────────────────────────────────────
function StandingsSection() {
  const [dragActive, setDragActive] = useState(false);
  const [toast, setToast] = useState(null);
  const [series, setSeries] = useState('core');

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 4000); };

  const handleFile = (file) => {
    if (!file.name.endsWith('.json') && file.type !== 'application/json') { alert('Please upload a valid JSON file.'); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        const existing = storage.getStandings();
        storage.setStandings({ ...existing, [series]: { data, importedAt: Date.now() } });
        showToast(`Standings for ${series} updated successfully.`);
      } catch { alert('Invalid JSON format.'); }
    };
    reader.readAsText(file);
  };

  const handleDrag = (e) => { e.preventDefault(); e.stopPropagation(); setDragActive(e.type === 'dragenter' || e.type === 'dragover'); };
  const handleDrop = (e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]); };

  return (
    <div>
      <SectionHeader icon="leaderboard" title="Championship Standings" subtitle="Upload JSON points permutations to update the central leaderboard." />
      {toast && (
        <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 border shadow-sm ${toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
          <span className="material-symbols-outlined text-2xl">{toast.type === 'success' ? 'check_circle' : 'error'}</span>
          <p className="font-label font-bold text-sm uppercase tracking-wide">{toast.msg}</p>
        </div>
      )}
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col">
        <div className="flex items-center gap-3 mb-6 pb-5 border-b border-slate-100">
          <div className="bg-primary/10 p-2.5 rounded-xl"><span className="material-symbols-outlined text-primary text-2xl block">data_object</span></div>
          <div><h3 className="font-headline text-xl font-bold uppercase italic text-slate-900">Upload JSON</h3><p className="text-secondary font-body text-xs mt-0.5">[&#123;pos, name, points, starts, wins&#125;]</p></div>
        </div>

        <div className="mb-6 flex flex-col gap-2 max-w-xs">
          <label className="font-label text-[10px] font-black uppercase tracking-widest text-slate-500">Target Series</label>
          <select value={series} onChange={e => setSeries(e.target.value)} className="w-full bg-slate-50 px-4 py-3 rounded-xl border-2 border-slate-200 font-label font-bold text-sm uppercase tracking-widest focus:border-primary focus:outline-none transition-colors">
            {SERIES_IDS.map(id => <option key={id} value={id}>{id} Series</option>)}
          </select>
        </div>

        <div className={`w-full min-h-[240px] rounded-xl border-[3px] border-dashed flex flex-col items-center justify-center p-8 text-center transition-all cursor-pointer ${dragActive ? 'border-primary bg-primary/5' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300'}`}
          onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
          <span className={`material-symbols-outlined text-6xl mb-4 transition-colors ${dragActive ? 'text-primary' : 'text-slate-300'}`}>cloud_upload</span>
          <p className="font-headline font-bold text-lg text-slate-800 mb-2">Drop Standings JSON</p>
          <label className="bg-white border-2 border-slate-200 text-slate-700 font-label font-bold text-xs uppercase tracking-widest px-6 py-3 mt-4 rounded-xl cursor-pointer hover:border-primary hover:text-primary transition-all shadow-sm">
            Browse Files
            <input type="file" className="hidden" accept=".json,application/json" onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
          </label>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SERIES INFO BUILDER
// ─────────────────────────────────────────────────────────────
function SeriesInfoSection() {
  const [series, setSeries] = useState('core');
  const [infoForms, setInfoForms] = useState(() => storage.getSeriesInfo());
  const [saved, setSaved] = useState(false);

  const cur = infoForms[series] || storage.DEFAULT_INFO_DATA;

  const setInfo = (updater) => {
    setInfoForms(p => ({ ...p, [series]: updater(p[series] || storage.DEFAULT_INFO_DATA) }));
    setSaved(false);
  };

  const save = () => { storage.setSeriesInfo(infoForms); setSaved(true); setTimeout(() => setSaved(false), 3000); };

  const addTimeline = () => setInfo(d => ({ ...d, timeline: [...d.timeline, { label: '', value: '', highlight: false }] }));
  const updateTimeline = (idx, field, val) => setInfo(d => ({ ...d, timeline: d.timeline.map((t, i) => i === idx ? { ...t, [field]: val } : t) }));
  const delTimeline = (idx) => setInfo(d => ({ ...d, timeline: d.timeline.filter((_, i) => i !== idx) }));

  const addConfig = () => setInfo(d => ({ ...d, serverConfig: [...d.serverConfig, { icon: 'tune', label: '', value: '' }] }));
  const updateConfig = (idx, field, val) => setInfo(d => ({ ...d, serverConfig: d.serverConfig.map((c, i) => i === idx ? { ...c, [field]: val } : c) }));
  const delConfig = (idx) => setInfo(d => ({ ...d, serverConfig: d.serverConfig.filter((_, i) => i !== idx) }));

  const updateCompStr = (field, strVar) => {
    const arr = strVar.split(',').map(s => s.trim()).filter(Boolean);
    setInfo(d => ({ ...d, competition: { ...d.competition, [field]: arr } }));
  };
  const updateCompKey = (field, val) => setInfo(d => ({ ...d, competition: { ...d.competition, [field]: val } }));
  
  const ICONS = ['tune', 'partly_cloudy_day', 'build_circle', 'local_gas_station', 'speed', 'flag', 'sports_motorsports', 'warning', 'sports_score'];

  return (
    <div>
      <SectionHeader icon="view_timeline" title="Info Tab Builder" subtitle="Build layout cards for the 'Series Info' public tab without hardcoding." />
      <SeriesTabs active={series} setActive={setSeries} />

      <div className="flex flex-col gap-6">
        {/* Timeline Editor */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline text-xl font-bold uppercase italic text-slate-900">Session Timeline</h3>
            <button onClick={addTimeline} className="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl font-label font-bold text-[10px] uppercase tracking-widest transition-colors flex items-center gap-1"><span className="material-symbols-outlined text-sm">add</span> Row</button>
          </div>
          <div className="flex flex-col gap-3">
            {cur.timeline?.map((t, i) => (
              <div key={i} className={`flex flex-col sm:flex-row gap-3 p-4 rounded-xl border-2 ${t.highlight ? 'border-primary/50 bg-primary/5' : 'border-slate-100 bg-slate-50'}`}>
                <input value={t.label} onChange={e => updateTimeline(i, 'label', e.target.value)} placeholder="e.g. Lobby Opens" className="flex-1 bg-white px-3 py-2 border border-slate-200 rounded-lg text-sm font-label font-bold uppercase tracking-widest outline-none focus:border-primary" />
                <input value={t.value} onChange={e => updateTimeline(i, 'value', e.target.value)} placeholder="e.g. 8:30 PM" className="flex-1 bg-white px-3 py-2 border border-slate-200 rounded-lg text-sm font-body italic font-bold outline-none focus:border-primary" />
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer grow sm:grow-0 justify-end sm:justify-start">
                    <input type="checkbox" checked={t.highlight} onChange={e => updateTimeline(i, 'highlight', e.target.checked)} className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4" />
                    <span className="font-label text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-0.5">Highlight</span>
                  </label>
                  <button onClick={() => delTimeline(i)} className="text-slate-400 hover:text-red-500"><span className="material-symbols-outlined text-lg block">delete</span></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Server Config Editor */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline text-xl font-bold uppercase italic text-slate-900">Server Configuration</h3>
            <button onClick={addConfig} className="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl font-label font-bold text-[10px] uppercase tracking-widest transition-colors flex items-center gap-1"><span className="material-symbols-outlined text-sm">add</span> Spec</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {cur.serverConfig?.map((c, i) => (
              <div key={i} className="flex gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50 relative group">
                <select value={c.icon} onChange={e => updateConfig(i, 'icon', e.target.value)} className="w-14 shrink-0 bg-white border border-slate-200 rounded-lg text-center outline-none focus:border-primary text-slate-500 material-symbols-outlined" style={{fontFamily: "'Material Symbols Outlined'"}}>
                  {ICONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                </select>
                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                  <input value={c.label} onChange={e => updateConfig(i, 'label', e.target.value)} placeholder="e.g. Setups" className="w-full bg-white px-2 py-1 border border-slate-200 rounded-md text-[10px] font-label font-black uppercase tracking-widest outline-none focus:border-primary" />
                  <input value={c.value} onChange={e => updateConfig(i, 'value', e.target.value)} placeholder="e.g. Fixed" className="w-full bg-white px-2 py-1 border border-slate-200 rounded-md text-sm font-body font-bold outline-none focus:border-primary" />
                </div>
                <button onClick={() => delConfig(i)} className="absolute -top-2 -right-2 bg-white border border-slate-200 rounded-full w-6 h-6 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-200 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"><span className="material-symbols-outlined text-[14px]">close</span></button>
              </div>
            ))}
          </div>
          <div className="pt-6 border-t border-slate-100">
             <label className="block font-label font-bold text-xs uppercase tracking-widest text-secondary mb-2">Overtime Rules</label>
             <input type="text" value={cur.overtimeRules} onChange={e => setInfo(d => ({...d, overtimeRules: e.target.value}))} placeholder="e.g. Max 2 Green-White-Checkered (GWC)" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-sm font-body text-slate-800 focus:border-primary outline-none transition-all" />
          </div>
        </div>

        {/* Competition Base Editor */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <h3 className="font-headline text-xl font-bold uppercase italic text-slate-900 mb-6">Competition Base</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-3">
              <div>
                <label className="block font-label font-bold text-xs uppercase tracking-widest text-secondary mb-1.5">Vehicle Group Name</label>
                <input type="text" value={cur.competition?.vehiclesLabel || 'Rotating Vehicles'} onChange={e => updateCompKey('vehiclesLabel', e.target.value)} placeholder="e.g. Rotating Vehicles" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-label font-bold text-slate-800 focus:border-primary outline-none transition-all" />
              </div>
              <div>
                <label className="block font-label font-bold text-xs uppercase tracking-widest text-secondary mb-1.5">Vehicles List <span className="text-[9px] text-slate-400 normal-case">(comma separated)</span></label>
                <input type="text" value={cur.competition?.vehicles?.join(', ') || ''} onChange={e => updateCompStr('vehicles', e.target.value)} placeholder="e.g. Trucks, Gen 6, Next Gen" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-body text-slate-800 focus:border-primary outline-none transition-all" />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-3">
              <div>
                <label className="block font-label font-bold text-xs uppercase tracking-widest text-secondary mb-1.5">Track Group Name</label>
                <input type="text" value={cur.competition?.tracksLabel || 'Track Rotation'} onChange={e => updateCompKey('tracksLabel', e.target.value)} placeholder="e.g. Superspeedway Rotation" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-label font-bold text-slate-800 focus:border-primary outline-none transition-all" />
              </div>
              <div>
                <label className="block font-label font-bold text-xs uppercase tracking-widest text-secondary mb-1.5">Tracks List <span className="text-[9px] text-slate-400 normal-case">(comma separated)</span></label>
                <input type="text" value={cur.competition?.tracks?.join(', ') || ''} onChange={e => updateCompStr('tracks', e.target.value)} placeholder="e.g. Daytona, Talladega" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-body text-slate-800 focus:border-primary outline-none transition-all" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100 w-full">
            <div className="flex gap-3">
               <div className="w-1/2">
                 <label className="block font-label font-bold text-[10px] uppercase tracking-widest text-secondary mb-2 whitespace-nowrap">Fee Descriptor</label>
                 <input type="text" value={cur.competition?.entryFeeLabel || 'Season Entry'} onChange={e => updateCompKey('entryFeeLabel', e.target.value)} placeholder="e.g. Season Entry" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-sm font-body text-slate-800 focus:border-primary outline-none transition-all" />
               </div>
               <div className="w-1/2">
                 <label className="block font-label font-bold text-[10px] uppercase tracking-widest text-secondary mb-2 whitespace-nowrap">Fee Amount <span className="normal-case">(Blank = Hide)</span></label>
                 <input type="text" value={cur.competition?.entryFee || ''} onChange={e => updateCompKey('entryFee', e.target.value)} placeholder="e.g. $10" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-sm font-body text-slate-800 focus:border-primary outline-none transition-all" />
               </div>
            </div>
            <div>
               <label className="block font-label font-bold text-xs uppercase tracking-widest text-secondary mb-2">Prize Description</label>
               <input type="text" value={cur.competition?.prizeDesc || ''} onChange={e => updateCompKey('prizeDesc', e.target.value)} placeholder="e.g. Top 3 Prizes" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-sm font-body text-slate-800 focus:border-primary outline-none transition-all" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <SaveButton onClick={save} saved={saved}>Publish Series Info</SaveButton>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ROOT ADMIN
// ─────────────────────────────────────────────────────────────
export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('adminAuth') === 'true');
  const [section, setSection] = useState('dashboard');

  const logout = () => { sessionStorage.removeItem('adminAuth'); setAuthed(false); };

  if (!authed) return <AdminLogin onLogin={() => setAuthed(true)} />;

  const SECTIONS = { dashboard: <Dashboard setSection={setSection} />, results: <ResultsSection />, standings: <StandingsSection />, drivers: <DriversSection />, schedule: <ScheduleSection />, config: <SeriesConfigSection />, info: <SeriesInfoSection />, registrations: <RegistrationsSection />, announcements: <AnnouncementsSection />, media: <MediaSection /> };

  return (
    <div className="min-h-screen bg-slate-100 pt-16 flex">
      <Sidebar active={section} setActive={setSection} onLogout={logout} />
      <main className="flex-1 ml-60 p-8 overflow-auto min-h-[calc(100vh-64px)]">
        <div className="max-w-5xl mx-auto">
          {SECTIONS[section] || <Dashboard setSection={setSection} />}
        </div>
      </main>
    </div>
  );
}
