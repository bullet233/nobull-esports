import React, { useState, useEffect } from 'react';

export default function CountdownClock({ targetDate, accentColor = '#38bdf8' }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!targetDate || isNaN(targetDate.getTime())) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }
    
    const calc = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return false;
      }
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      });
      return true;
    };
    
    calc();
    const timer = setInterval(() => {
      if (!calc()) clearInterval(timer);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div 
      className="flex items-center gap-2 sm:gap-4 bg-white/60 py-2 sm:py-3 px-3 sm:px-5 rounded-xl shadow-inner backdrop-blur-md relative z-10 overflow-hidden group/clock w-full sm:w-auto"
      style={{ border: `1px solid ${accentColor}40` }}
    >
      <div 
        className="absolute inset-0 opacity-10"
        style={{ background: `linear-gradient(to right, ${accentColor}, transparent)` }}
      ></div>
      <span 
        className="material-symbols-outlined text-2xl sm:text-3xl animate-pulse relative z-10"
        style={{ color: accentColor }}
      >
        timer
      </span>
      <div className="flex items-center gap-1 sm:gap-2 font-headline font-black text-xl sm:text-3xl italic tracking-tighter text-slate-800 relative z-10">
        <div className="flex flex-col items-center w-6 sm:w-8"><span className="leading-none">{String(timeLeft.days).padStart(2, '0')}</span><span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-slate-500 font-label not-italic mt-0.5 sm:mt-1 drop-shadow-sm">Days</span></div>
        <span className="opacity-50 font-normal" style={{ color: accentColor }}>:</span>
        <div className="flex flex-col items-center w-6 sm:w-8"><span className="leading-none">{String(timeLeft.hours).padStart(2, '0')}</span><span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-slate-500 font-label not-italic mt-0.5 sm:mt-1 drop-shadow-sm">Hrs</span></div>
        <span className="opacity-50 font-normal" style={{ color: accentColor }}>:</span>
        <div className="flex flex-col items-center w-6 sm:w-8"><span className="leading-none">{String(timeLeft.minutes).padStart(2, '0')}</span><span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-slate-500 font-label not-italic mt-0.5 sm:mt-1 drop-shadow-sm">Min</span></div>
        <span className="opacity-50 font-normal" style={{ color: accentColor }}>:</span>
        <div className="flex flex-col items-center w-6 sm:w-8"><span className="leading-none">{String(timeLeft.seconds).padStart(2, '0')}</span><span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-slate-500 font-label not-italic mt-0.5 sm:mt-1 drop-shadow-sm">Sec</span></div>
      </div>
    </div>
  );
}
