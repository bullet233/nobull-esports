import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SERIES_CONFIG, SCHEDULE_DB } from './Series';
import CountdownClock from '../components/CountdownClock';
import * as storage from '../utils/storage';

export default function Home() {
  const [announcement, setAnnouncement] = useState(null);
  const [annDismissed, setAnnDismissed] = useState(false);

  useEffect(() => {
    const ann = storage.getAnnouncement();
    if (ann?.active && ann?.text) setAnnouncement(ann.text);
  }, []);

  return (
    <main className="bg-background min-h-screen pb-24">
      {/* Static Hero Section */}
      <section className="relative h-[600px] w-full overflow-hidden bg-on-surface flex items-center justify-center">
        <div className="absolute inset-0 bg-slate-900/60 z-10"></div>
        <img className="absolute inset-0 w-full h-full object-cover scale-105" src="/hero-home.jpg" alt="NoBull Motorsports" />
        <div className="relative z-20 text-center flex flex-col items-center px-4 max-w-4xl pt-16">
          <span className="bg-primary text-white px-4 py-1.5 font-headline font-black text-xs rounded-full shadow-lg mb-6 tracking-widest uppercase">
            EST. 2024
          </span>
          <h1 className="font-headline text-6xl md:text-8xl font-black text-white leading-tight uppercase italic drop-shadow-2xl">
            NOBULL <span className="text-primary">ESPORTS</span>
          </h1>
          <p className="mt-6 text-xl text-white/90 font-body max-w-2xl font-light">
            Kinetic precision and elite sim racing. Join our leagues and compete against the very best.
          </p>
          
          {/* Hero Call to Action */}
          <div className="mt-10 sm:mt-12 flex items-center justify-center animate-fadeIn relative z-30">
            <a 
              href="https://discord.gg/UsPzvBZpw7" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#5865F2] text-white px-8 py-4 md:px-10 md:py-5 rounded-2xl font-headline font-black italic text-lg md:text-xl uppercase tracking-widest hover:bg-white hover:text-[#5865F2] hover:-translate-y-1 transition-all duration-300 shadow-[0_15px_30px_-5px_rgba(88,101,242,0.4)] hover:shadow-[0_20px_40px_-5px_rgba(255,255,255,0.4)] group overflow-hidden relative"
            >
               <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></span>
               <span className="material-symbols-outlined text-[24px] md:text-[28px] group-hover:-rotate-12 transition-transform relative z-10">forum</span>
               <span className="relative z-10">Join The Discord</span>
            </a>
          </div>
        </div>
      </section>

      {/* Announcement Banner */}
      {announcement && !annDismissed && (
        <div className="bg-primary px-6 py-3.5 flex items-center gap-3 relative z-20">
          <span className="material-symbols-outlined text-white text-[20px] shrink-0">campaign</span>
          <p className="font-body text-sm text-white flex-1">{announcement}</p>
          <button onClick={() => setAnnDismissed(true)} className="text-white/70 hover:text-white transition-colors shrink-0">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
      )}

      {/* Upcoming Race Banner */}
      {(() => {
        const now = new Date();
        let nextRace = null;
        let nextDate = null;
        let nextSeriesConfig = null;
        let nextSeriesId = null;

        const rawSchedules = storage.getSchedules() || {};
        const allSchedules = {};
        
        Object.keys(SERIES_CONFIG).forEach(seriesId => {
          allSchedules[seriesId] = rawSchedules[seriesId] && rawSchedules[seriesId].length > 0 
            ? rawSchedules[seriesId] 
            : (SCHEDULE_DB[seriesId] || []);
        });

        Object.keys(allSchedules).forEach(seriesId => {
          allSchedules[seriesId].forEach(event => {
            const timeStr = event.time ? event.time.replace(/EST|EDT/gi, '').trim() : '';
            const eventDateStr = event.date;
            // Since timeStr isn't perfect, build a robust date or fallback
            const eventDate = new Date(`${eventDateStr} ${timeStr}`);
            
            if (!isNaN(eventDate) && eventDate > now) {
              if (!nextDate || eventDate < nextDate) {
                nextDate = eventDate;
                nextRace = event;
                nextSeriesId = seriesId;
                nextSeriesConfig = SERIES_CONFIG[seriesId];
              }
            }
          });
        });

        // Use a stylized empty state or hide if no future races exist
        if (!nextRace) return null;

        return (
          <section className="max-w-7xl mx-auto px-4 -mt-10 relative z-30 animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 md:p-8 flex flex-col xl:flex-row items-center justify-between shadow-2xl shadow-slate-900/10 border border-slate-100 relative overflow-hidden group">
              {/* Dynamic Series Glow Overlay */}
              <div 
                className="absolute inset-0 opacity-5"
                style={{ background: `linear-gradient(135deg, ${nextSeriesConfig.color}, transparent)` }}
              ></div>
              <div 
                className="absolute -right-32 -top-32 w-64 h-64 rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none" 
                style={{ backgroundColor: nextSeriesConfig.color }}
              ></div>
              
              <div className="flex flex-col md:flex-row items-center lg:items-center gap-6 md:gap-8 relative z-10 w-full xl:w-auto">
                {/* Series Icon / Logo Box */}
                <div 
                  className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl flex items-center justify-center shrink-0 shadow-lg border-2 border-slate-50 overflow-hidden relative"
                  style={{ backgroundColor: `${nextSeriesConfig.color}15` }}
                >
                  <div className="absolute inset-0 opacity-20" style={{ backgroundColor: nextSeriesConfig.color }}></div>
                  {nextSeriesConfig.logo ? (
                    <img src={nextSeriesConfig.logo} alt="Series Logo" className="w-[80%] h-[80%] object-contain drop-shadow-md relative z-10" />
                  ) : (
                    <span className="material-symbols-outlined text-4xl" style={{ color: nextSeriesConfig.color }}>sports_motorsports</span>
                  )}
                </div>
                
                {/* Event Details */}
                <div className="text-center md:text-left flex flex-col items-center md:items-start max-w-lg">
                  <div className="flex items-center gap-2 mb-1.5 align-middle">
                    <span className="animate-pulse w-2 h-2 rounded-full shadow-md" style={{ backgroundColor: nextSeriesConfig.color, boxShadow: `0 0 10px ${nextSeriesConfig.color}` }}></span>
                    <p className="font-label text-[10px] tracking-widest font-black uppercase" style={{ color: nextSeriesConfig.color }}>
                      Next Official Race
                    </p>
                    <span className="font-label text-[9px] tracking-widest font-bold uppercase text-slate-500 border border-slate-200 px-1.5 py-0.5 rounded bg-slate-50 ml-1 leading-none shadow-sm">
                      {nextSeriesConfig.title}
                    </span>
                  </div>
                  <h2 className="text-slate-800 font-headline text-3xl sm:text-4xl md:text-5xl font-black italic uppercase tracking-tight leading-none mb-3">
                    {nextRace.track}
                  </h2>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4 mt-0.5">
                    <p className="text-slate-500 font-body text-xs sm:text-sm font-semibold flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                      <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                      {nextRace.date} • {nextRace.time}
                    </p>
                    <p className="text-slate-500 font-body text-xs sm:text-sm font-semibold flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                      <span className="material-symbols-outlined text-[14px]">sports_score</span>
                      Race {nextRace.round}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 xl:mt-0 flex flex-col sm:flex-row items-center gap-6 w-full xl:w-auto relative z-10 shrink-0">
                {/* Inline Universal Countdown Clock */}
                <div className="w-full sm:w-auto">
                  <CountdownClock targetDate={nextDate} accentColor={nextSeriesConfig.color} />
                </div>
                
                {/* Series Hub Button */}
                <Link 
                  to={`/series/${nextSeriesId}`}
                  className="w-full sm:w-auto flex items-center justify-center h-full min-h-[56px] gap-2 text-white font-headline font-black px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl group/btn shrink-0 uppercase tracking-widest text-sm"
                  style={{ backgroundColor: nextSeriesConfig.color, boxShadow: `0 10px 25px -5px ${nextSeriesConfig.color}60` }}
                >
                  <span className="relative z-10">Series Hub</span>
                  <span className="material-symbols-outlined text-[18px] group-hover/btn:translate-x-1 transition-transform relative z-10">arrow_forward</span>
                </Link>
              </div>
            </div>
          </section>
        );
      })()}

      {/* Series Cards */}
      <section className="max-w-7xl mx-auto px-4 mt-24">
        <div className="text-center mb-16">
          <h2 className="font-headline text-4xl font-black text-on-surface uppercase italic mb-4">Competiton <span className="text-primary">Series</span></h2>
          <p className="text-secondary font-body max-w-2xl mx-auto">Explore our active leagues and find the perfect racing series to showcase your precision and skill.</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-10">
          {/* Core Superspeedway */}
          <Link to="/series/core" className="group bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 hover:-translate-y-2 relative overflow-hidden flex flex-col w-full md:w-[calc(50%-1.25rem)] lg:max-w-md">
            <div className="absolute -right-12 -top-12 bg-primary-container w-40 h-40 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            <img src="/core-v2.png" alt="Core Series Logo" className="h-32 md:h-40 w-auto object-contain mb-6 relative z-10 drop-shadow-sm transition-transform duration-300 group-hover:scale-110" />
            <h3 className="font-headline text-2xl font-black text-on-surface uppercase italic mb-3 relative z-10">Core Superspeedway</h3>
            <p className="font-body text-secondary mb-8 flex-1 relative z-10 text-sm">High-speed drafting and tactical oval racing on massive circuits.</p>
            <div className="flex items-center gap-2 text-primary font-bold font-label uppercase tracking-widest text-sm relative z-10 mt-auto">
              View Series <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
          </Link>

          {/* Tuesday Night Showdown */}
          <Link to="/series/showdown" className="group bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-emerald-100/60 transition-all duration-300 hover:-translate-y-2 relative overflow-hidden flex flex-col w-full md:w-[calc(50%-1.25rem)] lg:max-w-md">
            <div className="absolute -right-12 -bottom-12 bg-emerald-100 w-48 h-48 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute -left-12 -top-12 bg-lime-50 w-40 h-40 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-500"></div>
            <img src="/showdown-logo-v2.png" alt="Showdown Series Logo" className="h-32 md:h-40 w-auto object-contain mb-6 relative z-10 drop-shadow-sm transition-transform duration-300 group-hover:scale-110" />
            <h3 className="font-headline text-2xl font-black text-on-surface uppercase italic mb-3 relative z-10">Tuesday Showdown</h3>
            <p className="font-body text-secondary mb-8 flex-1 relative z-10 text-sm">High-intensity prize money events under the Tuesday night lights.</p>
            <div className="flex items-center gap-2 text-emerald-500 font-bold font-label uppercase tracking-widest text-sm relative z-10 mt-auto">
              View Series <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
          </Link>
        </div>
      </section>

      {/* Discord Footer Community Banner */}
      <section className="relative mt-32 w-full bg-slate-900 overflow-hidden border-t-4 border-[#5865F2]">
        {/* Abstract Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-[#5865F2] to-slate-900 mix-blend-color-burn"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#5865F2] rounded-full blur-[120px] opacity-30"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#5865F2] rounded-full blur-[120px] opacity-20"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 md:py-24 flex flex-col md:flex-row items-center justify-between gap-10 md:gap-16 lg:px-8">
          <div className="flex flex-col max-w-2xl text-center md:text-left items-center md:items-start w-full">
            <h2 className="font-headline text-4xl md:text-5xl lg:text-6xl font-black text-white italic uppercase tracking-tight mb-4 drop-shadow-2xl leading-none">
              The Action Happens <br className="hidden lg:block" />
              <span className="text-[#5865F2]">In The Paddock</span>
            </h2>
            <p className="font-body text-slate-300 text-lg sm:text-xl font-light max-w-xl leading-relaxed">
              Join hundreds of elite sim racers in the official NoBull Esports Discord. Get schedule updates, talk setups, and find your next team.
            </p>
          </div>
          
          <div className="shrink-0 relative w-full sm:w-auto">
            {/* Glow backing */}
            <div className="absolute inset-0 bg-[#5865F2] blur-3xl opacity-40 scale-110 rounded-full animate-pulse"></div>
            <a 
              href="https://discord.gg/UsPzvBZpw7" 
              target="_blank" 
              rel="noopener noreferrer"
              className="relative z-10 w-full sm:w-auto flex items-center justify-center gap-3 bg-[#5865F2] text-white px-8 py-5 md:px-12 md:py-6 rounded-2xl font-headline font-black italic text-xl md:text-2xl uppercase tracking-widest hover:bg-white hover:text-[#5865F2] hover:-translate-y-2 transition-all duration-300 shadow-2xl group border-[3px] border-transparent hover:border-[#5865F2]"
            >
              <span className="material-symbols-outlined text-[28px] md:text-[32px] group-hover:scale-110 transition-transform">rocket_launch</span>
              Join Community
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
