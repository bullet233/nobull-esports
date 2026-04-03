import { supabase } from './supabase';

const KEYS = {
  REGISTRATIONS: 'nobull_registrations',
  DRIVERS: 'nobull_drivers',
  SCHEDULE: 'nobull_schedule',
  SERIES_CONFIG_OVERRIDES: 'nobull_series_config',
  ANNOUNCEMENT: 'nobull_announcement',
  RACE_RESULTS: 'nobull_race_results',
};

let memoryCache = {};

export async function initStorage() {
  // 1. Instantly restore from localStorage
  Object.values(KEYS).forEach(key => {
    try {
      const local = window.localStorage.getItem(key);
      if (local) memoryCache[key] = JSON.parse(local);
    } catch (e) { console.error("localStorage parse error:", e); }
  });

  // 2. Background sync from Supabase
  const { data, error } = await supabase.from('app_state').select('*');
  if (!error && data) {
    data.forEach(row => {
      memoryCache[row.key] = row.value;
      window.localStorage.setItem(row.key, JSON.stringify(row.value));
    });
  } else if (error) {
    console.error("Supabase load error:", error);
  }
}

function read(key, fallback) {
  if (memoryCache[key] !== undefined) {
    return memoryCache[key];
  }
  return fallback;
}

function write(key, value) {
  memoryCache[key] = value; // Update cache immediately for UI
  
  // Instantly persist to localStorage so data survives refreshes without DB connection
  try { window.localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}

  // Sync to Supabase in the background
  supabase.from('app_state').upsert({ key, value }, { onConflict: 'key' })
    .then(({error}) => { if (error) console.error("Supabase save error:", error) });
}

// ── Registrations ─────────────────────────────────────────
export function getRegistrations() {
  return read(KEYS.REGISTRATIONS, []);
}
export function setRegistrations(data) {
  write(KEYS.REGISTRATIONS, data);
}
export function addRegistration(entry) {
  setRegistrations([...getRegistrations(), entry]);
}

// ── Driver Roster ─────────────────────────────────────────
const DEFAULT_DRIVERS = { core: [], challenger: [], premiere: [], showdown: [] };
export function getDrivers() {
  return read(KEYS.DRIVERS, DEFAULT_DRIVERS);
}
export function setDrivers(data) {
  write(KEYS.DRIVERS, data);
}

// ── Schedule (seeded from inline defaults — no import needed) ──
const DEFAULT_SCHEDULE = {
  core: [
    { round: 1, track: 'Daytona International Speedway', car: 'NASCAR Trucks', date: '3/16/26', time: '9:00 PM EST', laps: '60 Laps', weather: '78°F, Clear', fuel: '100%' },
    { round: 2, track: 'Talladega Superspeedway', car: 'NASCAR Next Gen', date: '3/23/26', time: '9:00 PM EST', laps: '50 Laps', weather: '78°F, Clear', fuel: '100%' },
    { round: 3, track: 'Daytona International Speedway', car: 'NASCAR Gen 6', date: '4/06/26', time: '9:00 PM EST', laps: '50 Laps', weather: '78°F, Clear', fuel: '100%' },
    { round: 4, track: 'Talladega Superspeedway', car: 'NASCAR Trucks', date: '4/13/26', time: '9:00 PM EST', laps: '40 Laps', weather: '78°F, Clear', fuel: '100%' },
    { round: 5, track: 'Daytona International Speedway', car: 'NASCAR Next Gen', date: '4/20/26', time: '9:00 PM EST', laps: '40 Laps', weather: '78°F, Clear', fuel: '100%' },
    { round: 6, track: 'Talladega Superspeedway', car: 'NASCAR Gen 6', date: '5/04/26', time: '9:00 PM EST', laps: '60 Laps', weather: '78°F, Clear', fuel: '100%' },
  ],
  challenger: [],
  premiere: [],
  showdown: [
    { round: 1, track: 'Nürburgring Nordschleife', car: 'Porsche 911 GT3', date: '3/17/26', time: '8:30 PM EST', laps: '8 Laps', weather: '65°F, Overcast', fuel: '100%' },
    { round: 2, track: 'Circuit de Spa-Francorchamps', car: 'Mercedes-AMG GT3', date: '3/24/26', time: '8:30 PM EST', laps: '20 Laps', weather: '60°F, Rain', fuel: '100%' },
    { round: 3, track: 'Mount Panorama Circuit', car: 'Ferrari 296 GT3', date: '4/07/26', time: '8:30 PM EST', laps: '25 Laps', weather: '70°F, Clear', fuel: '100%' },
    { round: 4, track: 'Suzuka International Racing Circuit', car: 'Porsche 911 GT3', date: '4/14/26', time: '8:30 PM EST', laps: '20 Laps', weather: '75°F, Humid', fuel: '100%' },
  ],
};
export function getSchedule() {
  return read(KEYS.SCHEDULE, DEFAULT_SCHEDULE);
}
export function setSchedule(data) {
  write(KEYS.SCHEDULE, data);
}

// ── Series Config Overrides ───────────────────────────────
export function getSeriesConfigOverrides() {
  return read(KEYS.SERIES_CONFIG_OVERRIDES, null);
}
export function setSeriesConfigOverrides(data) {
  write(KEYS.SERIES_CONFIG_OVERRIDES, data);
}

// ── Announcement ──────────────────────────────────────────
export function getAnnouncement() {
  return read(KEYS.ANNOUNCEMENT, { text: '', active: false });
}
export function setAnnouncement(data) {
  write(KEYS.ANNOUNCEMENT, data);
}

// ── Race Results ──────────────────────────────────────────
export function getRaceResults() {
  return read(KEYS.RACE_RESULTS, {});
}
export function setRaceResults(data) {
  write(KEYS.RACE_RESULTS, data);
}

// ── Media Config ──────────────────────────────────────────
const DEFAULT_MEDIA_CONFIG = {
  featured: {
    title: "Core Series: Talladega 500",
    url: "https://www.youtube.com/embed/mZWzmziN0tM?start=4147"
  },
  vods: [
    {
      id: 1,
      title: "Core Series - Round 2: Talladega",
      date: "March 23, 2026",
      views: "1.2K",
      series: "CORE",
      url: "https://www.youtube.com/watch?v=mZWzmziN0tM"
    },
    {
      id: 2,
      title: "Showdown Series - Spa-Francorchamps",
      date: "March 24, 2026",
      views: "850",
      series: "SHOWDOWN",
      url: "https://www.youtube.com/watch?v=mZWzmziN0tM"
    },
    {
      id: 3,
      title: "Core Series - Round 1: Daytona",
      date: "March 16, 2026",
      views: "2.1K",
      series: "CORE",
      url: "https://www.youtube.com/watch?v=mZWzmziN0tM"
    }
  ]
};
export function getMediaConfig() {
  return read('nobull_media', DEFAULT_MEDIA_CONFIG);
}
export function setMediaConfig(data) {
  write('nobull_media', data);
}
