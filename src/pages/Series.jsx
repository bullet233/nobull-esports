import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import CountdownClock from '../components/CountdownClock';
import RegistrationModal from '../components/RegistrationModal';

export const SERIES_CONFIG = {
  'core': {
    title: 'Core Superspeedway',
    color: '#f97316', // Orange 
    bgImage: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=2070&auto=format&fit=crop',
    tagline: 'High-speed drafting and tactical oval racing on massive circuits.',
    logo: '/core-v2.png',
    specs: {
      cars: 'NASCAR Trucks, Gen 6 & Next Gen',
      tracks: 'Daytona & Talladega',
      day: 'Monday Nights',
      greenFlag: '9:00 PM EST',
      format: 'Fixed Setups | 1 Fast Repair | 2 GWC | 100% Fuel'
    }
  },
  'challenger': {
    title: 'Challenger Series',
    color: '#3b82f6', // Blue
    bgImage: 'https://images.unsplash.com/photo-1541443131876-44b03de101c5?q=80&w=2068&auto=format&fit=crop',
    tagline: 'Action-packed regional battles engineered for up-and-coming talent.'
  },
  'premiere': {
    title: 'Premiere Series',
    color: '#ef4444', // Red
    bgImage: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1964&auto=format&fit=crop',
    tagline: 'The pinnacle of NoBull Esports. Elite drivers, extreme stakes.'
  },
  'showdown': {
    title: 'Tuesday Night Showdown',
    color: '#10b981', // Emerald / Money
    bgImage: 'https://images.unsplash.com/photo-1611821064430-0d402209d784?q=80&w=2070&auto=format&fit=crop',
    tagline: 'High-intensity prize money events under the Tuesday night lights.',
    logo: '/showdown-logo-v2.png',
    specs: {
      cars: 'Premium GTs & Touring Cars',
      tracks: 'High-Stakes Global Circuits',
      day: 'Tuesday Nights',
      greenFlag: '8:30 PM EST',
      format: 'Prize Pool | Fixed Setups | Heavy Damage'
    }
  }
};

const RACE_RESULTS_DB = {
  'core': [
    { 
      id: 1, 
      name: 'Race 1: Daytona', 
      date: 'Oct 02, 2024', 
      status: 'OFFICIAL', 
      results: [
        { pos: 1, startPos: 3, name: 'DANIEL FAULKINGHAM', team: 'Hendrick Motorsports', laps: 100, inc: 0, status: 'Running' },
        { pos: 2, startPos: 1, name: 'L. HAMILTON', team: 'Mercedes-AMG', laps: 100, inc: 4, status: 'Running' },
        { pos: 3, startPos: 5, name: 'M. VERSTAPPEN', team: 'Red Bull Racing', laps: 100, inc: 2, status: 'Running' },
        { pos: 4, startPos: 2, name: 'C. LECLERC', team: 'Scuderia Ferrari', laps: 100, inc: 8, status: 'Running' },
        { pos: 5, startPos: 8, name: 'L. NORRIS', team: 'McLaren', laps: 100, inc: 0, status: 'Running' },
        { pos: 6, startPos: 4, name: 'G. RUSSELL', team: 'Mercedes-AMG', laps: 100, inc: 4, status: 'Running' },
        { pos: 7, startPos: 10, name: 'T. GIBBS', team: 'Front Row Motorsports', laps: 99, inc: 0, status: '+1 Lap' },
        { pos: 8, startPos: 6, name: 'C. ELLIOTT', team: 'Hendrick Motorsports', laps: 84, inc: 12, status: 'Accident' },
      ]
    },
    { 
      id: 2, 
      name: 'Race 2: Talladega Superspeedway', 
      date: '3/24/2026, 8:30:05 PM', 
      weather: '78°F 45% RH 2 mph',
      status: 'OFFICIAL', 
      results: [
        { pos: 1, startPos: 13, name: 'Wyatt A Gray', id: '1035326', laps: 32, led: 23, inc: 15, bonusPts: 1, bonusTags: 'Most Laps Led', penalty: 4, status: 'Leader' },
        { pos: 2, startPos: 14, name: 'Nathan Harper6', id: '760023', laps: 32, led: 0, inc: 24, bonusPts: 3, bonusTags: 'Clean Race', penalty: 0, status: '-0.055s' },
        { pos: 3, startPos: 18, name: 'Trevor Aswarnauth', id: '64038', laps: 32, led: 0, inc: 24, bonusPts: 3, bonusTags: 'Clean Race', penalty: 0, status: '-0.157s' },
        { pos: 4, startPos: 15, name: 'Ethan Eckert', id: '629480', laps: 32, led: 0, inc: 20, bonusPts: 3, bonusTags: 'Clean Race', penalty: 0, status: '-0.265s' },
        { pos: 5, startPos: 1, name: 'Kyler Wynn', id: '429796', laps: 32, led: 1, inc: 14, bonusPts: 4, bonusTags: 'Pole | Clean Race', penalty: 0, status: '-0.720s' },
        { pos: 6, startPos: 22, name: 'Cameron Craighead2', id: '939974', laps: 32, led: 0, inc: 24, bonusPts: 3, bonusTags: 'Clean Race', penalty: 0, status: '-0.730s' },
        { pos: 7, startPos: 6, name: 'Hunter Hasting', id: '1052584', laps: 32, led: 0, inc: 28, bonusPts: 3, bonusTags: 'Clean Race', penalty: 0, status: '-0.771s' },
        { pos: 8, startPos: 4, name: 'Carson Freeman', id: '458122', laps: 32, led: 1, inc: 28, bonusPts: 3, bonusTags: 'Clean Race', penalty: 0, status: '-3.715s' },
        { pos: 9, startPos: 12, name: 'Casee Sprinkle', id: '990761', laps: 32, led: 0, inc: 27, bonusPts: 3, bonusTags: 'Clean Race', penalty: 0, status: '-3.774s' },
        { pos: 10, startPos: 11, name: 'Malik Ray', id: '62419', laps: 32, led: 0, inc: 17, bonusPts: 3, bonusTags: 'Clean Race', penalty: 0, status: '-4.130s' },
        { pos: 11, startPos: 25, name: 'Mark Vondell', id: '681917', laps: 32, led: 0, inc: 12, bonusPts: 3, bonusTags: 'Clean Race', penalty: 0, status: '-10.130s' },
        { pos: 12, startPos: 23, name: 'Matthew Patton2', id: '863411', laps: 32, led: 0, inc: 20, bonusPts: 3, bonusTags: 'Clean Race', penalty: 0, status: '-10.234s' },
        { pos: 13, startPos: 10, name: 'Dustin Cowan', id: '1123183', laps: 32, led: 0, inc: 18, bonusPts: 3, bonusTags: 'Clean Race', penalty: 0, status: '-15.620s' },
        { pos: 14, startPos: 9, name: 'Miles Bagley', id: '473811', laps: 32, led: 0, inc: 12, bonusPts: 3, bonusTags: 'Clean Race', penalty: 0, status: '-1:10.558' },
        { pos: 15, startPos: 24, name: 'Tucker Mcclendon', id: '874986', laps: 32, led: 0, inc: 24, bonusPts: 3, bonusTags: 'Clean Race', penalty: 0, status: '-1:15.266' },
        { pos: 16, startPos: 19, name: 'Justin Melichar', id: '420037', laps: 32, led: 0, inc: 31, bonusPts: 3, bonusTags: 'Clean Race', penalty: 0, status: '-1:20.729' },
        { pos: 17, startPos: 2, name: 'Kody Neagles', id: '594762', laps: 31, led: 6, inc: 12, bonusPts: 3, bonusTags: 'Clean Race', penalty: 0, status: '-1 Lap' },
        { pos: 18, startPos: 21, name: 'Joshua McCullough', id: '144857', laps: 31, led: 0, inc: 30, bonusPts: 3, bonusTags: 'Clean Race', penalty: 0, status: '-1 Lap' },
        { pos: 19, startPos: 16, name: 'Freddy Basanez', id: '385571', laps: 30, led: 1, inc: 16, bonusPts: 3, bonusTags: 'Clean Race', penalty: 0, status: '-2 Laps' },
        { pos: 20, startPos: 17, name: 'Dylan C Jones', id: '103293', laps: 30, led: 0, inc: 16, bonusPts: 3, bonusTags: 'Clean Race', penalty: 0, status: '-2 Laps' },
        { pos: 21, startPos: 3, name: 'Jeff D Merck', id: '288695', laps: 30, led: 0, inc: 16, bonusPts: 3, bonusTags: 'Clean Race', penalty: 0, status: '-2 Laps' },
        { pos: 22, startPos: 5, name: 'Shawn Corbett', id: '88260', laps: 30, led: 0, inc: 12, bonusPts: 3, bonusTags: 'Clean Race', penalty: 0, status: '-2 Laps' },
        { pos: 23, startPos: 7, name: 'James Waring', id: '1047735', laps: 30, led: 0, inc: 36, bonusPts: 3, bonusTags: 'Clean Race', penalty: 0, status: '-2 Laps' },
        { pos: 24, startPos: 8, name: 'Ricky Stewart3', id: '1125207', laps: 26, led: 0, inc: 12, bonusPts: 3, bonusTags: 'Clean Race', penalty: 0, status: '-6 Laps' },
      ]
    }
  ],
  'challenger': [],
  'premiere': [],
  'showdown': [
    { 
      id: 1, 
      name: 'Race 1: Nordschleife', 
      date: 'March 17, 2026', 
      status: 'OFFICIAL', 
      results: [
        { pos: 1, startPos: 2, name: 'S. VAN DIJK', id: '1035326', laps: 8, led: 5, inc: 0, bonusPts: 1, bonusTags: 'Clean Race', penalty: 0, status: 'Winner' },
        { pos: 2, startPos: 1, name: 'M. ROSSI', id: '760023', laps: 8, led: 3, inc: 2, bonusPts: 0, bonusTags: 'Pole', penalty: 0, status: '-1.420s' },
        { pos: 3, startPos: 5, name: 'J. ANDERSON', id: '64038', laps: 8, led: 0, inc: 4, bonusPts: 0, bonusTags: '', penalty: 0, status: '-5.122s' },
        { pos: 4, startPos: 3, name: 'K. TAKAHASHI', id: '629480', laps: 8, led: 0, inc: 0, bonusPts: 1, bonusTags: 'Clean Race', penalty: 0, status: '-12.050s' },
        { pos: 5, startPos: 8, name: 'A. DUPONT', id: '429796', laps: 8, led: 0, inc: 8, bonusPts: 0, bonusTags: '', penalty: 0, status: '-18.771s' },
        { pos: 6, startPos: 4, name: 'T. HAWK', id: '85942', laps: 8, led: 0, inc: 12, bonusPts: 0, bonusTags: '', penalty: 0, status: '-22.40s' },
        { pos: 7, startPos: 10, name: 'D. MULLER', id: '124432', laps: 8, led: 0, inc: 4, bonusPts: 0, bonusTags: '', penalty: 0, status: '-31.10s' },
        { pos: 8, startPos: 6, name: 'C. WRIGHT', id: '95821', laps: 7, led: 0, inc: 16, bonusPts: 0, bonusTags: '', penalty: 0, status: '-1 Lap' },
      ]
    },
    { 
      id: 2, 
      name: 'Race 2: Spa-Francorchamps', 
      date: 'March 24, 2026', 
      weather: '60°F 85% RH 10 mph',
      status: 'OFFICIAL', 
      results: [
        { pos: 1, startPos: 4, name: 'M. ROSSI', id: '760023', laps: 20, led: 12, inc: 4, bonusPts: 2, bonusTags: 'Most Laps Led', penalty: 0, status: 'Winner' },
        { pos: 2, startPos: 1, name: 'J. ANDERSON', id: '64038', laps: 20, led: 8, inc: 0, bonusPts: 3, bonusTags: 'Pole | Clean Race', penalty: 0, status: '-0.850s' },
        { pos: 3, startPos: 2, name: 'S. VAN DIJK', id: '1035326', laps: 20, led: 0, inc: 8, bonusPts: 0, bonusTags: '', penalty: 0, status: '-4.300s' },
        { pos: 4, startPos: 7, name: 'A. DUPONT', id: '429796', laps: 20, led: 0, inc: 2, bonusPts: 0, bonusTags: '', penalty: 0, status: '-11.220s' },
        { pos: 5, startPos: 5, name: 'K. TAKAHASHI', id: '629480', laps: 20, led: 0, inc: 12, bonusPts: 0, bonusTags: '', penalty: 0, status: '-14.900s' },
      ]
    }
  ]
};

export const SCHEDULE_DB = {
  'core': [
    { round: 1, track: 'Daytona International Speedway', car: 'NASCAR Trucks', date: '3/16/26', time: '9:00 PM EST', laps: '60 Laps', weather: '78°F, Clear', fuel: '100%' },
    { round: 2, track: 'Talladega Superspeedway', car: 'NASCAR Next Gen', date: '3/23/26', time: '9:00 PM EST', laps: '50 Laps', weather: '78°F, Clear', fuel: '100%' },
    { round: 3, track: 'Daytona International Speedway', car: 'NASCAR Gen 6', date: '4/06/26', time: '9:00 PM EST', laps: '50 Laps', weather: '78°F, Clear', fuel: '100%' },
    { round: 4, track: 'Talladega Superspeedway', car: 'NASCAR Trucks', date: '4/13/26', time: '9:00 PM EST', laps: '40 Laps', weather: '78°F, Clear', fuel: '100%' },
    { round: 5, track: 'Daytona International Speedway', car: 'NASCAR Next Gen', date: '4/20/26', time: '9:00 PM EST', laps: '40 Laps', weather: '78°F, Clear', fuel: '100%' },
    { round: 6, track: 'Talladega Superspeedway', car: 'NASCAR Gen 6', date: '5/04/26', time: '9:00 PM EST', laps: '60 Laps', weather: '78°F, Clear', fuel: '100%' }
  ],
  'challenger': [],
  'premiere': [],
  'showdown': [
    { round: 1, track: 'Nürburgring Nordschleife', car: 'Porsche 911 GT3', date: '3/17/26', time: '8:30 PM EST', laps: '8 Laps', weather: '65°F, Overcast', fuel: '100%' },
    { round: 2, track: 'Circuit de Spa-Francorchamps', car: 'Mercedes-AMG GT3', date: '3/24/26', time: '8:30 PM EST', laps: '20 Laps', weather: '60°F, Rain', fuel: '100%' },
    { round: 3, track: 'Mount Panorama Circuit', car: 'Ferrari 296 GT3', date: '4/07/26', time: '8:30 PM EST', laps: '25 Laps', weather: '70°F, Clear', fuel: '100%' },
    { round: 4, track: 'Suzuka International Racing Circuit', car: 'Porsche 911 GT3', date: '4/14/26', time: '8:30 PM EST', laps: '20 Laps', weather: '75°F, Humid', fuel: '100%' }
  ]
};

const STANDINGS_DB = {
  'core': [
    {
      roundId: 1,
      roundName: 'Race 1: Daytona',
      standings: [
        { pos: 1, prevPos: 1, name: 'DANIEL FAULKINGHAM', team: 'Hendrick Motorsports', points: 45, starts: 1, wins: 1 },
        { pos: 2, prevPos: 2, name: 'L. HAMILTON', team: 'Mercedes-AMG', points: 38, starts: 1, wins: 0 },
        { pos: 3, prevPos: 3, name: 'M. VERSTAPPEN', team: 'Red Bull Racing', points: 32, starts: 1, wins: 0 },
        { pos: 4, prevPos: 4, name: 'C. LECLERC', team: 'Scuderia Ferrari', points: 28, starts: 1, wins: 0 },
        { pos: 5, prevPos: 5, name: 'L. NORRIS', team: 'McLaren', points: 24, starts: 1, wins: 0 },
        { pos: 6, prevPos: 6, name: 'G. RUSSELL', team: 'Mercedes-AMG', points: 20, starts: 1, wins: 0 },
      ]
    },
    {
      roundId: 2,
      roundName: 'Race 2: Talladega',
      standings: [
        { pos: 1, prevPos: 2, name: 'L. HAMILTON', team: 'Mercedes-AMG', points: 83, starts: 2, wins: 1 },
        { pos: 2, prevPos: 1, name: 'DANIEL FAULKINGHAM', team: 'Hendrick Motorsports', points: 75, starts: 2, wins: 1 },
        { pos: 3, prevPos: 4, name: 'C. LECLERC', team: 'Scuderia Ferrari', points: 60, starts: 2, wins: 0 },
        { pos: 4, prevPos: 3, name: 'M. VERSTAPPEN', team: 'Red Bull Racing', points: 55, starts: 2, wins: 0 },
        { pos: 5, prevPos: 6, name: 'G. RUSSELL', team: 'Mercedes-AMG', points: 48, starts: 2, wins: 0 },
        { pos: 6, prevPos: 5, name: 'L. NORRIS', team: 'McLaren', points: 44, starts: 2, wins: 0 },
      ]
    }
  ],
  'challenger': [],
  'premiere': [],
  'showdown': [
    {
      roundId: 1,
      roundName: 'Race 1: Nordschleife',
      standings: [
        { pos: 1, prevPos: 1, name: 'S. VAN DIJK', team: 'VRS Esports', points: 45, starts: 1, wins: 1 },
        { pos: 2, prevPos: 2, name: 'M. ROSSI', team: 'Scuderia Ferrari Esports', points: 38, starts: 1, wins: 0 },
        { pos: 3, prevPos: 3, name: 'J. ANDERSON', team: 'Williams Esports', points: 32, starts: 1, wins: 0 },
        { pos: 4, prevPos: 4, name: 'K. TAKAHASHI', team: 'Red Bull Racing Esports', points: 28, starts: 1, wins: 0 },
        { pos: 5, prevPos: 5, name: 'A. DUPONT', team: 'Team Redline', points: 24, starts: 1, wins: 0 },
      ]
    },
    {
      roundId: 2,
      roundName: 'Race 2: Spa-Francorchamps',
      standings: [
        { pos: 1, prevPos: 2, name: 'M. ROSSI', team: 'Scuderia Ferrari Esports', points: 83, starts: 2, wins: 1 },
        { pos: 2, prevPos: 1, name: 'S. VAN DIJK', team: 'VRS Esports', points: 75, starts: 2, wins: 1 },
        { pos: 3, prevPos: 3, name: 'J. ANDERSON', team: 'Williams Esports', points: 64, starts: 2, wins: 0 },
        { pos: 4, prevPos: 4, name: 'K. TAKAHASHI', team: 'Red Bull Racing Esports', points: 52, starts: 2, wins: 0 },
        { pos: 5, prevPos: 5, name: 'A. DUPONT', team: 'Team Redline', points: 48, starts: 2, wins: 0 },
      ]
    }
  ]
};

export default function Series() {
  const { seriesId } = useParams();
  const [activeTab, setActiveTab] = useState('info');
  const [selectedRound, setSelectedRound] = useState(null);
  const [selectedStandingsRound, setSelectedStandingsRound] = useState(null);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

  // Reset tab and selected round when series changes
  React.useEffect(() => {
    setActiveTab('schedule');
    setSelectedRound(null);
    setSelectedStandingsRound(null);
  }, [seriesId]);
  
  const config = SERIES_CONFIG[seriesId] || SERIES_CONFIG['challenger'];

  if (!config) {
    return <Navigate to="/" />;
  }

  // We use a CSS variable to dynamically theme the Tailwind classes for this specific series
  const themeStyle = { '--series-accent': config.color };

  return (
    <div style={themeStyle} className="min-h-screen bg-background pb-24 transition-colors duration-500">
      {/* Series Header */}
      <section className="relative pt-4 pb-8 sm:pt-6 sm:pb-10 w-full overflow-hidden bg-slate-950">
        {config.bgImage && (
          <div 
            className="absolute inset-0 opacity-20 mix-blend-overlay transition-opacity duration-1000 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${config.bgImage})` }}
          ></div>
        )}
        <div 
          className="absolute inset-0 opacity-40 transition-colors duration-1000 mix-blend-screen"
          style={{ 
            background: `radial-gradient(circle at top left, ${config.color}, transparent 60%)` 
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent z-10"></div>
        
        {/* Absolute 'Back' Button placed elegantly in top-left */}
        <Link to="/" className="absolute top-4 left-4 sm:left-8 z-30 inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors font-label text-[10px] tracking-widest uppercase font-bold backdrop-blur-sm bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Hub
        </Link>
        
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-8 pt-10 sm:pt-6 pb-2 lg:pb-0 flex flex-col lg:flex-row lg:items-center justify-start gap-8 lg:gap-16">
          {/* Logo / Brand Name */}
          <div className="shrink-0 flex items-end">
            {config.logo ? (
              <div className="relative group inline-block">
                <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full scale-[2.0] animate-pulse transition-all group-hover:bg-primary/40"></div>
                <img src={config.logo} alt="Series Logo" className="relative z-10 h-32 sm:h-48 md:h-64 lg:h-[280px] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-transform duration-700 ease-out group-hover:scale-105" />
              </div>
            ) : (
              <h1 className="font-headline text-4xl sm:text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white drop-shadow-lg leading-none mb-2">
                {config.title}
              </h1>
            )}
          </div>

          {/* Telecom HUD / Specs */}
          {config.specs && (
            <div className="flex flex-col items-start justify-center w-full lg:w-auto relative z-30 lg:mt-6">
              <div className="flex flex-col gap-3 lg:gap-4 mb-4 sm:mb-8 w-full max-w-3xl">
                <div className="flex flex-wrap gap-x-12 gap-y-6">
                  {/* Top Row: Dominant Schedule Block */}
                  <div className="flex flex-wrap items-end gap-x-8 gap-y-4 w-full sm:-mb-2">
                    <div className="flex flex-col items-start gap-1 font-label uppercase tracking-widest leading-none">
                      <span className="font-black text-[var(--series-accent)] text-[10px] sm:text-[11px] drop-shadow-[0_0_10px_var(--series-accent)] mb-1">Race Day</span>
                      <span className="font-headline font-black italic text-white/95 text-2xl sm:text-3xl md:text-5xl drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] leading-none">{config.specs.day}</span>
                    </div>
                    <div className="flex flex-col items-start gap-1 font-label uppercase tracking-widest leading-none">
                      <span className="font-black text-white/50 text-[10px] sm:text-[11px] drop-shadow-sm mb-1">Green Flag</span>
                      <span className="font-headline font-black italic text-[var(--series-accent)] text-2xl sm:text-3xl md:text-5xl drop-shadow-[0_0_20px_var(--series-accent)] leading-none">{config.specs.greenFlag}</span>
                    </div>
                  </div>

                  {/* Secondary Row: Setup Specs */}
                  <div className="flex flex-col items-start gap-1.5 font-label uppercase tracking-widest leading-none">
                    <span className="font-black text-white/50 text-[10px] drop-shadow-sm">Cars</span>
                    <span className="font-black text-white/95 text-xs sm:text-sm drop-shadow-md">{config.specs.cars}</span>
                  </div>
                  <div className="flex flex-col items-start gap-1.5 font-label uppercase tracking-widest leading-none">
                    <span className="font-black text-white/50 text-[10px] drop-shadow-sm">Tracks</span>
                    <span className="font-black text-white/95 text-xs sm:text-sm drop-shadow-md">{config.specs.tracks}</span>
                  </div>
                  <div className="flex flex-col items-start gap-1.5 font-label uppercase tracking-widest leading-none w-full">
                    <span className="font-black text-white/50 text-[10px] drop-shadow-sm">Format</span>
                    <span className="font-black text-white/95 text-xs sm:text-sm drop-shadow-md">{config.specs.format}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row w-full mt-2 gap-3 sm:gap-4 lg:w-fit">
                {seriesId !== 'showdown' && (
                  <button
                    onClick={() => setIsRegistrationOpen(true)}
                    className="group relative flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl font-headline font-black italic text-lg sm:text-base text-white uppercase tracking-widest transition-all duration-300 hover:-translate-y-1 w-full sm:w-auto cursor-pointer hover:brightness-110 shrink-0"
                    style={{ backgroundColor: config.color, boxShadow: `0 0 30px ${config.color}50`, borderBottom: '4px solid rgba(0,0,0,0.2)' }}
                  >
                    <span className="relative z-10 transition-transform group-hover:-translate-x-1 drop-shadow-md">Join Series</span>
                    <span className="material-symbols-outlined text-[24px] relative z-10 transition-transform group-hover:translate-x-1 group-hover:scale-110 drop-shadow-md">sports_motorsports</span>
                  </button>
                )}

                <a
                  href="https://discord.gg/UsPzvBZpw7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl font-headline font-black italic text-lg sm:text-base text-white uppercase tracking-widest transition-all duration-300 hover:-translate-y-1 w-full sm:w-auto bg-[#5865F2] hover:bg-[#4752c4] shadow-lg shadow-[#5865F2]/30 shrink-0"
                  style={{ borderBottom: '4px solid rgba(0,0,0,0.2)' }}
                >
                  <span className="material-symbols-outlined text-[24px] transition-transform group-hover:-rotate-12 drop-shadow-md">forum</span>
                  <span className="drop-shadow-md">{seriesId === 'showdown' ? 'Join Discord for Series Info' : 'Join Discord'}</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 relative z-30 -mt-6 sm:-mt-8">
        
        {/* Series Navigation Tabs */}
        <div className="flex items-center overflow-x-auto bg-white rounded-t-3xl shadow-sm border-b border-slate-100 px-4 sm:px-8 pt-2 scrollbar-hide">
          {['info', 'results', 'standings', 'schedule', 'drivers'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 sm:px-8 py-5 font-label font-bold text-xs uppercase tracking-widest border-b-[3px] transition-all whitespace-nowrap ${
                activeTab === tab 
                  ? 'text-[var(--series-accent)]' 
                  : 'border-transparent text-secondary hover:text-slate-800'
              }`}
              style={{ borderBottomColor: activeTab === tab ? 'var(--series-accent)' : 'transparent' }}
            >
              {tab === 'info' ? 'Series Info' : tab}
            </button>
          ))}
        </div>
        
        {/* Tab Content Box */}
        <div className="bg-white rounded-b-3xl px-4 sm:px-10 md:px-12 pt-6 sm:pt-8 md:pt-8 pb-12 sm:pb-20 border border-slate-100 border-t-0 flex flex-col items-center min-h-[500px] shadow-sm">
          
          {activeTab === 'standings' ? (
            <div className="w-full max-w-5xl flex flex-col items-center animate-fadeIn">
              <div className="mb-4 w-full flex flex-col items-center">
                <h2 className="font-headline text-3xl font-bold uppercase italic text-on-surface text-center">
                  Official Championship Standings
                </h2>

                {/* Historical Toggle Controls */}
                {(() => {
                  const currentStandingsRounds = STANDINGS_DB[seriesId] || [];
                  if (currentStandingsRounds.length === 0) return null;
                  
                  const activeStandingsRoundId = selectedStandingsRound || currentStandingsRounds[currentStandingsRounds.length - 1].roundId;
                  const activeRoundIndex = currentStandingsRounds.findIndex(r => r.roundId === activeStandingsRoundId);
                  
                  return (
                    <div className="flex items-center gap-1 sm:gap-4 mt-4 w-full md:w-fit max-w-full mb-4 bg-white border-2 border-slate-100 rounded-xl shadow-sm p-1.5 overflow-hidden transition-all duration-300">
                      <button 
                        disabled={activeRoundIndex <= 0}
                        onClick={() => setSelectedStandingsRound(currentStandingsRounds[activeRoundIndex - 1].roundId)}
                        className="p-2 sm:p-3 rounded-lg text-secondary hover:text-primary hover:bg-slate-50 transition-all disabled:opacity-30 disabled:pointer-events-none group shrink-0"
                      >
                        <span className="material-symbols-outlined block group-hover:-translate-x-0.5 transition-transform text-sm sm:text-base">chevron_left</span>
                      </button>
                      
                      <div className="flex-1 flex justify-center items-center px-4 sm:px-8 overflow-hidden h-full">
                        <span className="text-on-surface font-label font-black text-xs sm:text-sm md:text-base uppercase tracking-widest text-center leading-tight line-clamp-2">
                          {(() => {
                            const name = currentStandingsRounds[activeRoundIndex]?.roundName;
                            if (!name) return 'Select Race';
                            return name.replace(/Round/i, 'Race');
                          })()}
                        </span>
                      </div>

                      <button 
                        disabled={activeRoundIndex >= currentStandingsRounds.length - 1}
                        onClick={() => setSelectedStandingsRound(currentStandingsRounds[activeRoundIndex + 1].roundId)}
                        className="p-2 sm:p-3 rounded-lg text-secondary hover:text-primary hover:bg-slate-50 transition-all disabled:opacity-30 disabled:pointer-events-none group shrink-0"
                      >
                        <span className="material-symbols-outlined block group-hover:translate-x-0.5 transition-transform text-sm sm:text-base">chevron_right</span>
                      </button>
                    </div>
                  );
                })()}
              </div>

              {STANDINGS_DB[seriesId]?.length > 0 ? (() => {
                const currentStandingsRounds = STANDINGS_DB[seriesId];
                const activeStandingsRoundId = selectedStandingsRound || currentStandingsRounds[currentStandingsRounds.length - 1].roundId;
                const activeRoundIndex = currentStandingsRounds.findIndex(r => r.roundId === activeStandingsRoundId);
                const activeStandingsData = activeRoundIndex !== -1 ? currentStandingsRounds[activeRoundIndex].standings : [];

                return (
                  <div className="w-full bg-white border-2 border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                  {/* Header Row */}
                  <div className="flex bg-slate-50 border-b-2 border-slate-100 p-4 lg:p-6 items-center">
                    <div className="w-12 sm:w-16 text-center shrink-0 font-label text-[10px] font-black uppercase tracking-widest text-slate-500">POS</div>
                    <div className="w-10 sm:w-14 text-center shrink-0 font-label text-[10px] font-black uppercase tracking-widest text-slate-500">+/-</div>
                    <div className="flex-1 ml-4 font-label text-[10px] font-black uppercase tracking-widest text-slate-500">Driver</div>
                    <div className="w-16 text-center hidden md:block shrink-0 font-label text-[10px] font-black uppercase tracking-widest text-slate-500">Starts</div>
                    <div className="w-16 text-center hidden md:block shrink-0 font-label text-[10px] font-black uppercase tracking-widest text-slate-500">Wins</div>
                    <div 
                      className="w-20 sm:w-24 text-right pr-2 sm:pr-4 shrink-0 font-label text-[10px] font-black uppercase tracking-widest"
                      style={{ color: config.color }}
                    >
                      Points
                    </div>
                  </div>

                  {/* Drivers List */}
                  <div className="flex flex-col">
                    {activeStandingsData.map((driver, idx) => {
                      const posChange = driver.prevPos - driver.pos;
                      return (
                        <div key={driver.pos} className={`flex p-4 lg:p-6 items-center border-b border-slate-100 hover:bg-black/5 transition-colors ${idx < 3 ? 'bg-slate-50' : ''}`}>
                          <div className={`w-12 sm:w-16 text-center shrink-0 font-headline text-xl sm:text-2xl font-black ${idx === 0 ? 'text-[#f59e0b]' : idx === 1 ? 'text-slate-400' : idx === 2 ? 'text-[#b45309]' : 'text-slate-300'}`}>
                            {driver.pos}
                          </div>
                          
                          <div className="w-10 sm:w-14 text-center shrink-0 flex items-center justify-center">
                            {posChange > 0 ? (
                              <div className="flex flex-col items-center leading-none bg-green-50/80 p-1.5 px-2.5 rounded-lg border border-green-200 shadow-sm shadow-green-100/50">
                                <span className="material-symbols-outlined text-green-500 text-[20px] font-black">arrow_drop_up</span>
                                <span className="font-label text-[11px] font-black text-green-700">+{posChange}</span>
                              </div>
                            ) : posChange < 0 ? (
                              <div className="flex flex-col items-center leading-none bg-red-50/80 p-1.5 px-2.5 rounded-lg border border-red-200 shadow-sm shadow-red-100/50">
                                <span className="material-symbols-outlined text-red-500 text-[20px] font-black">arrow_drop_down</span>
                                <span className="font-label text-[11px] font-black text-red-700">{posChange}</span>
                              </div>
                            ) : (
                              <span className="material-symbols-outlined text-slate-300 text-sm font-bold">remove</span>
                            )}
                          </div>
                          
                          <div className="flex-1 ml-4 flex flex-col justify-center py-1 overflow-hidden">
                            <span className="font-headline text-base sm:text-xl font-bold uppercase tracking-tight text-on-surface leading-none truncate">
                              {driver.name}
                            </span>
                          </div>
                          
                          <div className="w-16 text-center hidden md:block shrink-0 font-body text-sm font-semibold text-secondary">{driver.starts}</div>
                          <div className="w-16 text-center hidden md:block shrink-0 font-body text-sm font-semibold text-secondary">{driver.wins}</div>
                          
                          <div 
                            className="w-20 sm:w-24 text-right pr-2 sm:pr-4 shrink-0 font-headline text-2xl sm:text-3xl font-black tracking-tighter"
                            style={{ color: config.color }}
                          >
                            {driver.points}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              );
              })() : (
                <div className="w-full max-w-2xl text-center py-20 px-8 text-secondary font-body bg-slate-50 rounded-3xl border-2 border-slate-100 border-dashed mt-8">
                  <span className="material-symbols-outlined text-5xl text-slate-300 mb-4 block">leaderboard</span>
                  Championship standings have not been tabulated yet for the {config.title}.
                </div>
              )}
            </div>
          ) : activeTab === 'schedule' ? (
            <div className="w-full max-w-6xl flex flex-col items-center animate-fadeIn">
              <h2 className="font-headline text-3xl font-bold uppercase italic text-on-surface mb-6 text-center">
                Official Season Schedule
              </h2>
              
              {SCHEDULE_DB[seriesId]?.length > 0 ? (() => {
                const now = new Date();
                let foundNext = false;
                
                return (
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 pb-4 px-2">
                  {SCHEDULE_DB[seriesId].map((event) => {
                    const eventDateStr = event.date;
                    const eventDate = new Date(`${eventDateStr} 23:59:59`);
                    
                    let status = 'future';
                    if (!isNaN(eventDate) && eventDate < now) {
                      status = 'completed';
                    } else if (!foundNext) {
                      status = 'next';
                      foundNext = true;
                    }
                    
                    const isCompleted = status === 'completed';
                    const isNext = status === 'next';
                    const isFuture = status === 'future';

                    return (
                      <div 
                        key={event.round} 
                        className={`group bg-white rounded-3xl overflow-hidden border-2 transition-all duration-300 flex flex-col relative w-full
                          ${isNext ? 'border-[var(--series-accent)] ring-4 ring-inset ring-[var(--series-accent)]/20 shadow-xl shadow-[var(--series-accent)]/20 scale-[1.03] z-10' : 
                            isCompleted ? 'border-slate-100 opacity-60 hover:opacity-100' : 
                            'border-slate-100 hover:border-slate-200 hover:shadow-xl hover:-translate-y-1'
                          }
                        `}
                      >
                        {/* Status Badges & Watermarks */}
                        {isNext && (
                          <div className="absolute top-0 right-0 z-50">
                            <div className="bg-[var(--series-accent)] text-white text-[10px] font-black tracking-widest uppercase px-4 py-1.5 rounded-bl-2xl shadow-md flex items-center gap-1.5 animate-pulse">
                              <span className="w-2 h-2 bg-white rounded-full animate-ping absolute"></span>
                              <span className="w-2 h-2 bg-white rounded-full relative"></span>
                              Next Up
                            </div>
                          </div>
                        )}
                        {/* Official Watermark Removed for Embedded Podium */}

                        {/* Top Banner Accent */}
                        <div className="h-2 w-full absolute top-0 left-0" style={{ backgroundColor: isCompleted ? '#cbd5e1' : config.color }}></div>
                        
                        {/* Card Header (Track/Round/Date) */}
                        <div className={`p-6 pb-4 border-b border-slate-100 flex flex-col relative overflow-hidden ${isNext ? 'bg-gradient-to-b from-[var(--series-accent)]/5 to-transparent' : 'bg-slate-50/50'}`}>
                          {!isCompleted && (
                            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-10 transition-opacity" style={{ backgroundColor: config.color }}></div>
                          )}
                          
                          <div className="flex justify-between items-start mb-4 relative z-10 w-full">
                            <div 
                              className={`px-3 py-1 font-headline font-black text-xs uppercase tracking-widest rounded shadow-sm inline-block ${isCompleted ? 'bg-slate-300 text-slate-600' : 'text-white'}`}
                              style={isCompleted ? {} : { backgroundColor: config.color }}
                            >
                              Race {event.round}
                            </div>
                            
                            <div 
                              className={`px-4 py-2 rounded-xl flex items-center gap-3 border-2 ${
                                isNext ? 'bg-white shadow-[0_4px_15px_-3px_rgba(0,0,0,0.1)]' : 
                                isCompleted ? 'bg-slate-100 border-slate-200' : 
                                'bg-white border-slate-200 shadow-sm'
                              }`}
                              style={isNext ? { borderColor: config.color } : {}}
                            >
                              <div className="flex flex-col items-center justify-center border-r-2 pr-3" style={isNext ? { borderColor: `${config.color}30` } : { borderColor: '#e2e8f0' }}>
                                <span className="material-symbols-outlined text-[20px] mb-0.5" style={isNext ? { color: config.color } : isCompleted ? { color: '#94a3b8' } : { color: '#64748b' }}>event</span>
                              </div>
                              <div className="flex flex-col items-start justify-center">
                                <span className={`font-headline font-black text-sm md:text-base uppercase tracking-tighter leading-none ${isCompleted ? 'text-slate-500' : 'text-slate-900'}`}>{event.date}</span>
                                <span className={`font-label text-[10px] md:text-xs uppercase font-black tracking-widest leading-none mt-1 ${isNext ? 'text-slate-700' : isCompleted ? 'text-slate-400' : 'text-slate-500'}`}>{event.time}</span>
                              </div>
                            </div>
                          </div>
                          
                          <h3 className={`font-headline text-xl font-black uppercase italic leading-tight relative z-10 mt-2 ${isCompleted ? 'text-slate-500' : 'text-on-surface'}`}>{event.track}</h3>
                          
                          {isNext && (() => {
                            const timeStr = event.time ? event.time.replace(/EST|EDT/gi, '').trim() : '';
                            const preciseDate = new Date(`${event.date} ${timeStr}`);
                            return <CountdownClock targetDate={!isNaN(preciseDate.getTime()) ? preciseDate : eventDate} accentColor={config.color} />;
                          })()}
                        </div>

                        {/* Card Body (Race Specs Grid or Results) */}
                        <div className={`p-6 flex-1 flex flex-col justify-start bg-white relative z-10 ${isCompleted ? 'group-hover:bg-slate-50/50 transition-colors duration-500' : ''}`}>
                          {isCompleted ? (() => {
                            const raceData = RACE_RESULTS_DB[seriesId]?.find(r => r.id === event.round);
                            if (raceData && raceData.results && raceData.results.length > 0) {
                              const podium = raceData.results.slice(0, 3);
                              return (
                                <div className="flex flex-col gap-3 w-full h-full justify-center relative z-20">
                                  <p className="font-label text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1 border-b border-slate-100 pb-2">Podium Finishers</p>
                                  {podium.map((driver, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                      <span className={`font-headline text-2xl font-black w-6 text-center ${idx === 0 ? 'text-[#f59e0b]' : idx === 1 ? 'text-slate-400' : 'text-[#b45309]'}`}>
                                        {driver.pos}
                                      </span>
                                      <span className="font-headline font-bold text-base uppercase text-slate-800 truncate leading-none pt-1">
                                        {driver.name}
                                      </span>
                                    </div>
                                  ))}
                                  <button 
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setSelectedRound(event.round);
                                      setActiveTab('results');
                                      window.scrollTo({ top: 380, behavior: 'smooth' });
                                    }}
                                    className="mt-auto w-full py-3 rounded-lg border border-slate-200 text-xs font-bold uppercase tracking-widest text-slate-600 hover:bg-[var(--series-accent)] hover:text-white hover:border-[var(--series-accent)] transition-all duration-300 mt-6 shadow-sm hover:shadow-md flex items-center justify-center gap-2 hover:-translate-y-0.5 group/btn"
                                  >
                                    Full Race Data <span className="material-symbols-outlined text-[16px] group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                                  </button>
                                </div>
                              );
                            }
                            return (
                              <div className="flex flex-col items-center justify-center h-full text-center opacity-60">
                                <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">pending</span>
                                <span className="font-label text-[10px] uppercase tracking-widest text-slate-400 font-bold">Awaiting Results Validation</span>
                              </div>
                            );
                          })() : (
                            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                              
                              {/* Car Config */}
                              <div className="flex items-start gap-3">
                                <span className={`material-symbols-outlined text-[20px] mt-0.5 ${isNext ? 'text-[var(--series-accent)]/80 drop-shadow-sm' : 'text-slate-300'}`}>directions_car</span>
                                <div className="flex flex-col">
                                  <span className={`font-label text-[9px] uppercase font-black tracking-widest mb-0.5 ${isNext ? 'text-[var(--series-accent)]' : 'text-slate-400'}`}>Car Class</span>
                                  <span className="font-body text-sm font-bold text-on-surface leading-tight">{event.car}</span>
                                </div>
                              </div>

                              {/* Laps Config */}
                              <div className="flex items-start gap-3">
                                <span className={`material-symbols-outlined text-[20px] mt-0.5 ${isNext ? 'text-[var(--series-accent)]/80 drop-shadow-sm' : 'text-slate-300'}`}>sports_score</span>
                                <div className="flex flex-col">
                                  <span className={`font-label text-[9px] uppercase font-black tracking-widest mb-0.5 ${isNext ? 'text-[var(--series-accent)]' : 'text-slate-400'}`}>Distance</span>
                                  <span className="font-body text-sm font-bold text-on-surface leading-tight">{event.laps}</span>
                                </div>
                              </div>

                              {/* Weather Config */}
                              <div className="flex items-start gap-3">
                                <span className={`material-symbols-outlined text-[20px] mt-0.5 ${isNext ? 'text-[var(--series-accent)]/80 drop-shadow-sm' : 'text-slate-300'}`}>partly_cloudy_day</span>
                                <div className="flex flex-col">
                                  <span className={`font-label text-[9px] uppercase font-black tracking-widest mb-0.5 ${isNext ? 'text-[var(--series-accent)]' : 'text-slate-400'}`}>Weather</span>
                                  <span className="font-body text-sm font-bold text-on-surface leading-tight">{event.weather}</span>
                                </div>
                              </div>

                              {/* Fuel Config */}
                              <div className="flex items-start gap-3">
                                <span className={`material-symbols-outlined text-[20px] mt-0.5 ${isNext ? 'text-[var(--series-accent)]/80 drop-shadow-sm' : 'text-slate-300'}`}>local_gas_station</span>
                                <div className="flex flex-col">
                                  <span className={`font-label text-[9px] uppercase font-black tracking-widest mb-0.5 ${isNext ? 'text-[var(--series-accent)]' : 'text-slate-400'}`}>Fuel Limit</span>
                                  <span className="font-body text-sm font-bold text-on-surface leading-tight">{event.fuel}</span>
                                </div>
                              </div>

                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                );
              })() : (
                <div className="w-full max-w-2xl text-center py-20 px-8 text-secondary font-body bg-slate-50 rounded-3xl border-2 border-slate-100 border-dashed">
                  <span className="material-symbols-outlined text-5xl text-slate-300 mb-4 block">event_busy</span>
                  The official schedule for the {config.title} is currently being finalized. Stay tuned!
                </div>
              )}
            </div>
          ) : activeTab === 'results' ? (
            <div className="w-full max-w-5xl flex flex-col items-center animate-fadeIn">
              <div className="mb-4 w-full flex flex-col items-center">
                <h2 className="font-headline text-3xl font-bold uppercase italic text-on-surface text-center">
                  Race Results Archive
                </h2>

                {/* Historical Toggle Controls */}
                {(() => {
                  const currentRaces = RACE_RESULTS_DB[seriesId] || [];
                  if (currentRaces.length === 0) return null;
                  
                  const activeRaceId = selectedRound || currentRaces[currentRaces.length - 1].id;
                  const activeRaceIndex = currentRaces.findIndex(r => r.id === activeRaceId);
                  
                  return (
                    <div className="flex items-center gap-1 sm:gap-4 mt-4 w-full md:w-fit max-w-full mb-4 bg-white border-2 border-slate-100 rounded-xl shadow-sm p-1.5 overflow-hidden transition-all duration-300">
                      <button 
                        disabled={activeRaceIndex <= 0}
                        onClick={() => setSelectedRound(currentRaces[activeRaceIndex - 1].id)}
                        className="p-2 sm:p-3 rounded-lg text-secondary hover:text-primary hover:bg-slate-50 transition-all disabled:opacity-30 disabled:pointer-events-none group shrink-0"
                      >
                        <span className="material-symbols-outlined block group-hover:-translate-x-0.5 transition-transform text-sm sm:text-base">chevron_left</span>
                      </button>
                      
                      <div className="flex-1 flex justify-center items-center px-4 sm:px-8 overflow-hidden h-full">
                        <span className="text-on-surface font-label font-black text-xs sm:text-sm md:text-base uppercase tracking-widest text-center leading-tight line-clamp-2">
                          {(() => {
                            const name = currentRaces[activeRaceIndex]?.name;
                            if (!name) return 'Select Race';
                            return name.replace(/Round/i, 'Race');
                          })()}
                        </span>
                      </div>

                      <button 
                        disabled={activeRaceIndex >= currentRaces.length - 1}
                        onClick={() => setSelectedRound(currentRaces[activeRaceIndex + 1].id)}
                        className="p-2 sm:p-3 rounded-lg text-secondary hover:text-primary hover:bg-slate-50 transition-all disabled:opacity-30 disabled:pointer-events-none group shrink-0"
                      >
                        <span className="material-symbols-outlined block group-hover:translate-x-0.5 transition-transform text-sm sm:text-base">chevron_right</span>
                      </button>
                    </div>
                  );
                })()}
              </div>

              {RACE_RESULTS_DB[seriesId]?.length > 0 ? (() => {
                const currentRaces = RACE_RESULTS_DB[seriesId];
                const activeRaceId = selectedRound || currentRaces[currentRaces.length - 1].id;
                const race = currentRaces.find(r => r.id === activeRaceId);
                if (!race) return null;

                return (
                  <div className="w-full bg-white border-2 border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                    {/* Race Header Info */}
                    <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-50 border-b border-slate-100 p-6 lg:px-8">
                      <div className="text-center sm:text-left mb-4 sm:mb-0">
                        <h3 className="font-headline text-2xl font-bold text-on-surface uppercase italic text-[var(--series-accent)]">{race.name}</h3>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 mt-2.5">
                          <p className="text-[10px] sm:text-xs font-label text-secondary tracking-widest uppercase flex items-center justify-center sm:justify-start gap-1.5 font-bold">
                            <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                            {race.date}
                          </p>
                          {race.weather && (
                            <p className="text-[10px] sm:text-xs font-label text-secondary tracking-widest uppercase flex items-center justify-center sm:justify-start gap-1.5 font-bold border-l-0 sm:border-l-2 border-slate-200 sm:pl-6">
                              <span className="material-symbols-outlined text-[14px]">partly_cloudy_day</span>
                              {race.weather}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="bg-white px-5 py-2 text-xs font-black text-secondary uppercase rounded-xl tracking-widest border-2 border-slate-200 shadow-sm shrink-0">
                        {race.status}
                      </span>
                    </div>

                    {/* Table Header Row */}
                    <div className="flex bg-white border-b-2 border-slate-100 p-4 lg:p-6 items-center gap-2 sm:gap-4 lg:gap-6">
                      <div className="w-10 sm:w-12 text-center shrink-0 font-label text-[10px] font-black uppercase tracking-widest text-slate-900">POS</div>
                      <div className="w-10 sm:w-12 text-center shrink-0 font-label text-[10px] font-black uppercase tracking-widest text-slate-900">STR</div>
                      <div className="flex-1 font-label text-[10px] font-black uppercase tracking-widest text-slate-900">Driver</div>
                      <div className="w-12 sm:w-14 text-center hidden md:block shrink-0 font-label text-[10px] font-black uppercase tracking-widest text-slate-900">Laps</div>
                      <div className="w-10 sm:w-12 text-center hidden lg:block shrink-0 font-label text-[10px] font-black uppercase tracking-widest text-amber-600">BP</div>
                      <div className="w-10 sm:w-12 text-center hidden lg:block shrink-0 font-label text-[10px] font-black uppercase tracking-widest text-red-600">SP</div>
                      <div className="w-10 sm:w-12 text-center hidden sm:block shrink-0 font-label text-[10px] font-black uppercase tracking-widest text-slate-900">INC</div>
                      <div className="w-20 sm:w-28 text-right shrink-0 font-label text-[10px] font-black uppercase tracking-widest text-slate-900">Status</div>
                    </div>

                    {/* Drivers List */}
                    <div className="flex flex-col">
                      {race.results.map((driver, idx) => {
                        const isPodium = idx < 3;
                        const startDiff = driver.startPos - driver.pos; // Positive means gained spots
                        
                        return (
                          <div key={driver.pos} className={`flex p-4 lg:py-5 lg:px-6 items-center border-b border-slate-100 hover:bg-black/5 transition-colors gap-2 sm:gap-4 lg:gap-6 ${isPodium ? 'bg-slate-50' : 'bg-white'}`}>
                            <div className={`w-10 sm:w-12 text-center shrink-0 font-headline text-xl sm:text-2xl font-black ${idx === 0 ? 'text-[#f59e0b]' : idx === 1 ? 'text-slate-600' : idx === 2 ? 'text-[#b45309]' : 'text-slate-800'}`}>
                              {driver.pos}
                            </div>
                            
                            <div className="w-10 sm:w-12 text-center shrink-0 flex flex-col items-center justify-center">
                              <span className="font-headline text-lg sm:text-lg font-bold text-slate-900 leading-none">
                                {driver.startPos}
                              </span>
                              {startDiff > 0 ? (
                                <div className="flex items-center leading-none mt-1 bg-green-50 px-1.5 py-0.5 rounded shadow-sm border border-green-200">
                                  <span className="material-symbols-outlined text-green-500 text-[16px] font-black -ml-0.5 -mr-0.5">arrow_drop_up</span>
                                  <span className="font-label text-[10px] font-black text-green-700">+{startDiff}</span>
                                </div>
                              ) : startDiff < 0 ? (
                                <div className="flex items-center leading-none mt-1 bg-red-50 px-1.5 py-0.5 rounded shadow-sm border border-red-200">
                                  <span className="material-symbols-outlined text-red-500 text-[16px] font-black -ml-0.5 -mr-0.5">arrow_drop_down</span>
                                  <span className="font-label text-[10px] font-black text-red-700">{startDiff}</span>
                                </div>
                              ) : (
                                <div className="flex items-center leading-none mt-1">
                                  <span className="font-label text-[14px] font-bold text-slate-600">-</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex-1 flex flex-col py-2 overflow-hidden">
                              <div className="flex items-baseline gap-2">
                                <span className="font-headline text-base sm:text-xl font-bold uppercase tracking-tight text-on-surface leading-none truncate">
                                  {driver.name}
                                </span>
                                {driver.id && (
                                  <span className="font-label text-[8px] sm:text-[9px] uppercase tracking-widest font-black text-slate-600">
                                    ID: {driver.id}
                                  </span>
                                )}
                              </div>
                              
                              <div className="flex flex-wrap items-center gap-1.5 mt-1.5 overflow-hidden">
                                {driver.bonusTags && driver.bonusTags.split('|').map((tag, i) => (
                                  <span key={i} className="font-label text-[8px] sm:text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-sm uppercase tracking-widest whitespace-nowrap leading-none">
                                    {tag.trim()}
                                  </span>
                                ))}
                              </div>
                            </div>
                            
                            <div className="w-12 sm:w-14 text-center hidden md:flex flex-col shrink-0 items-center justify-center">
                              <span className="font-body text-sm font-bold text-slate-900 leading-none">{driver.laps}</span>
                              {driver.led > 0 && (
                                <span 
                                  className="font-label text-[9px] font-bold uppercase tracking-widest mt-1 leading-none bg-slate-100 px-1 py-0.5 rounded text-slate-800"
                                >
                                  {driver.led} Led
                                </span>
                              )}
                            </div>
                            <div className="w-10 sm:w-12 text-center hidden lg:flex flex-col shrink-0 items-center justify-center">
                              {driver.bonusPts > 0 ? (
                                <span className="font-body text-sm font-bold text-amber-600">+{driver.bonusPts}</span>
                              ) : (
                                <span className="font-body text-sm font-bold text-slate-600">-</span>
                              )}
                            </div>
                            <div className="w-10 sm:w-12 text-center hidden lg:flex flex-col shrink-0 items-center justify-center">
                              {driver.penalty > 0 ? (
                                <span className="font-body text-sm font-bold text-red-600">-{driver.penalty}</span>
                              ) : (
                                <span className="font-body text-sm font-bold text-slate-600">-</span>
                              )}
                            </div>
                            <div className="w-10 sm:w-12 text-center hidden sm:flex flex-col shrink-0 items-center justify-center">
                              <span className="bg-red-50 text-red-600 font-label text-xs tracking-widest px-2 py-1 rounded-md border border-red-100 leading-none">{driver.inc}x</span>
                            </div>
                            
                            <div 
                              className="w-20 sm:w-28 text-right shrink-0 font-label text-[10px] sm:text-xs font-black uppercase tracking-widest flex flex-col justify-center items-end"
                              style={{ color: driver.status === 'Running' || driver.status === 'Leader' ? config.color : '#1e293b' }}
                            >
                              {driver.status}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                );
              })() : (
                <div className="w-full max-w-2xl text-center py-20 px-8 text-secondary font-body bg-slate-50 rounded-3xl border-2 border-slate-100 border-dashed mt-8">
                  <span className="material-symbols-outlined text-5xl text-slate-300 mb-4 block">fact_check</span>
                  Race results have not been tabulated yet for the {config.title}.
                </div>
              )}
            </div>
          ) : activeTab === 'info' ? (
            <div className="w-full max-w-6xl animate-fadeIn">
              <div className="mb-12 w-full flex flex-col items-center">
                <h2 className="font-headline text-3xl md:text-5xl font-black uppercase italic text-on-surface text-center mb-4 tracking-tight">
                  <span className="text-slate-300 mr-2">/</span>Official Series Info
                </h2>
                <p className="font-body text-secondary text-center max-w-2xl text-base md:text-lg mx-4">
                  Everything you need to know about competing in the {config.title}. 
                  Review the session timeline, vehicle specifications, and server configurations below.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 w-full mt-4">
                
                {/* Broadcast & Timeline */}
                <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 lg:p-8 flex flex-col shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="material-symbols-outlined text-3xl text-rose-500 drop-shadow-sm">sensors</span>
                    <h3 className="font-headline text-2xl font-black uppercase italic text-slate-800 tracking-tight">Session Timeline</h3>
                  </div>
                  <div className="flex flex-col gap-3 flex-1">
                    <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex items-center justify-between group hover:border-[var(--series-accent)] transition-colors">
                      <span className="font-headline font-bold text-slate-400 uppercase tracking-widest text-[10px] md:text-xs">Broadcast day</span>
                      <span className="font-body font-bold text-slate-900 text-right opacity-90">Monday Nights</span>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex items-center justify-between group hover:border-[var(--series-accent)] transition-colors">
                      <span className="font-headline font-bold text-slate-400 uppercase tracking-widest text-[10px] md:text-xs">Lobby Opens</span>
                      <span className="font-body font-bold text-slate-900 text-right opacity-90">8:30 PM EST</span>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex items-center justify-between group hover:border-[var(--series-accent)] transition-colors">
                      <span className="font-headline font-bold text-slate-400 uppercase tracking-widest text-[10px] md:text-xs">Qualifying</span>
                      <span className="font-headline font-bold italic text-slate-900 text-right opacity-90">8:55 PM EST</span>
                    </div>
                    <div className="bg-white rounded-xl p-4 border shadow-sm flex items-center justify-between relative overflow-hidden group mt-1" style={{ borderColor: `${config.color}40` }}>
                      <div className="absolute inset-0 opacity-10" style={{ backgroundColor: config.color }}></div>
                      <span className="font-headline font-black uppercase tracking-widest text-[10px] md:text-xs relative z-10" style={{ color: config.color }}>Green Flag Race</span>
                      <span className="font-headline text-xl italic font-black text-slate-900 text-right relative z-10">9:00 PM EST</span>
                    </div>
                  </div>
                </div>

                {/* Event Configuration */}
                <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 lg:p-8 flex flex-col shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="material-symbols-outlined text-3xl text-sky-500 drop-shadow-sm">build</span>
                    <h3 className="font-headline text-2xl font-black uppercase italic text-slate-800 tracking-tight">Server Config</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3 flex-1">
                    <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex flex-col items-start gap-1 hover:-translate-y-1 transition-transform cursor-default">
                      <span className="material-symbols-outlined text-slate-400 text-xl mb-1">tune</span>
                      <p className="font-label text-[9px] uppercase tracking-widest font-black text-slate-400">Setups</p>
                      <p className="font-body font-bold text-slate-800 leading-tight text-sm">iRacing Fixed</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex flex-col items-start gap-1 hover:-translate-y-1 transition-transform cursor-default">
                      <span className="material-symbols-outlined text-slate-400 text-xl mb-1">partly_cloudy_day</span>
                      <p className="font-label text-[9px] uppercase tracking-widest font-black text-slate-400">Weather</p>
                      <p className="font-body font-bold text-slate-800 leading-tight text-sm">Default (Afternoon)</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex flex-col items-start gap-1 hover:-translate-y-1 transition-transform cursor-default">
                      <span className="material-symbols-outlined text-slate-400 text-xl mb-1">build_circle</span>
                      <p className="font-label text-[9px] uppercase tracking-widest font-black text-slate-400">Repairs</p>
                      <p className="font-body font-bold text-slate-800 leading-tight text-sm">1 Fast Repair</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex flex-col items-start gap-1 hover:-translate-y-1 transition-transform cursor-default">
                      <span className="material-symbols-outlined text-slate-400 text-xl mb-1">local_gas_station</span>
                      <p className="font-label text-[9px] uppercase tracking-widest font-black text-slate-400">Fuel Mix</p>
                      <p className="font-body font-bold text-slate-800 leading-tight text-sm">100% Tank</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex flex-col items-start gap-1 hover:-translate-y-1 transition-transform col-span-2 cursor-default justify-center">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="material-symbols-outlined text-slate-400 text-lg">flag</span>
                        <p className="font-label text-[9px] uppercase tracking-widest font-black text-slate-400">Overtime Rules</p>
                      </div>
                      <p className="font-body font-bold text-slate-800 text-sm">Max 2 Green-White-Checkered (GWC)</p>
                    </div>
                  </div>
                </div>

                {/* Entry & Competition Structure */}
                <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 lg:p-8 flex flex-col shadow-sm lg:col-span-1 md:col-span-2">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="material-symbols-outlined text-3xl text-emerald-500 drop-shadow-sm">emoji_events</span>
                    <h3 className="font-headline text-2xl font-black uppercase italic text-slate-800 tracking-tight">Competition Base</h3>
                  </div>
                  
                  <div className="flex flex-col gap-4 flex-1">
                    <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:border-[var(--series-accent)]/30 transition-colors">
                      <p className="font-label text-[10px] uppercase tracking-widest font-black mb-3 flex items-center gap-1.5" style={{ color: config.color }}>
                        <span className="material-symbols-outlined text-[16px]">directions_car</span>
                        Rotating Chassis Fleet
                      </p>
                      <div className="flex flex-wrap gap-2.5">
                        <span className="bg-slate-50 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">Trucks</span>
                        <span className="bg-slate-50 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">Next Gen</span>
                        <span className="bg-slate-50 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">Gen 6</span>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:border-[var(--series-accent)]/30 transition-colors">
                      <p className="font-label text-[10px] uppercase tracking-widest font-black mb-3 flex items-center gap-1.5" style={{ color: config.color }}>
                        <span className="material-symbols-outlined text-[16px]">map</span>
                        Superspeedway Rotation
                      </p>
                      <div className="flex flex-wrap gap-2.5">
                        <span className="bg-slate-50 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">Daytona</span>
                        <span className="bg-slate-50 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">Talladega</span>
                      </div>
                    </div>

                    <div className="mt-auto grid grid-cols-2 gap-4">
                      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm hover:-translate-y-1 transition-transform">
                        <span className="font-headline text-4xl font-black text-emerald-600 leading-none mb-1 shadow-sm">$10</span>
                        <span className="font-label text-[9px] font-black uppercase tracking-widest text-emerald-800">Season Entry</span>
                      </div>
                      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm hover:-translate-y-1 transition-transform">
                        <span className="material-symbols-outlined text-4xl text-amber-500 mb-1 leading-none drop-shadow-sm">workspace_premium</span>
                        <span className="font-label text-[9px] font-black uppercase tracking-widest text-amber-800">Top 3 Prizes</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          ) : (
            <>
              <div 
                className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl flex items-center justify-center mb-4 shadow-xl text-white outline outline-4 outline-slate-50"
                style={{ backgroundColor: config.color }}
              >
                {activeTab === 'standings' && <span className="material-symbols-outlined text-4xl sm:text-5xl">sports_score</span>}
                {activeTab === 'drivers' && <span className="material-symbols-outlined text-4xl sm:text-5xl">groups</span>}
              </div>
              
              <h2 className="font-headline text-2xl sm:text-4xl font-black uppercase italic text-on-surface tracking-tight">
                {activeTab} Data
              </h2>
              <p className="font-body text-secondary mt-3 text-center max-w-md leading-relaxed text-sm sm:text-base">
                The structured data payload for the {activeTab} statistics will officially populate here once the app connects to the NoBull platform database.
              </p>
            </>
          )}
        </div>
      </main>

      {/* Registration Modal Overlay */}
      <RegistrationModal 
        isOpen={isRegistrationOpen} 
        onClose={() => setIsRegistrationOpen(false)} 
        config={config}
        seriesId={seriesId}
      />
    </div>
  );
}
