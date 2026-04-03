import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export default function Layout() {
  return (
    <>
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-100 transition-all">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-black text-on-surface italic font-['Space_Grotesk'] tracking-tighter uppercase relative group">
            NOBULL <span className="text-primary">ESPORTS</span>
          </Link>
          <nav className="hidden md:flex gap-6 items-center">
            <Link className="font-['Space_Grotesk'] tracking-tighter uppercase font-bold text-on-surface hover:text-[#f97316] transition-all duration-150" to="/series/core">CORE SERIES</Link>
            <Link className="font-['Space_Grotesk'] tracking-tighter uppercase font-bold text-on-surface hover:text-[#10b981] transition-all duration-150" to="/series/showdown">SHOWDOWN SERIES</Link>
            
            <Link className="font-['Space_Grotesk'] tracking-tighter uppercase font-bold text-secondary hover:text-primary transition-all duration-150 ml-2 pl-6 border-l-2 border-slate-200" to="/media">MEDIA</Link>
          </nav>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <a href="https://discord.gg/UsPzvBZpw7" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[#5865F2] text-white h-8 w-8 md:w-auto md:h-auto md:px-4 md:py-1.5 rounded-lg shadow-sm hover:bg-[#4752c4] hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#5865F2]/30 transition-all active:scale-95 text-sm font-bold tracking-tight group">
            <span className="material-symbols-outlined text-[18px] group-hover:-rotate-12 transition-transform">forum</span>
            <span className="hidden md:inline">DISCORD</span>
          </a>
          <Link to="/admin" className="material-symbols-outlined text-secondary cursor-pointer hover:text-primary transition-colors pr-2">settings</Link>
        </div>
      </header>

      <Outlet />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 w-full mt-24">
        <div className="w-full py-12 px-8 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto gap-y-12">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link to="/" className="font-['Space_Grotesk'] font-bold text-on-surface text-xl tracking-tighter uppercase italic">NOBULL <span className="text-primary">ESPORTS</span></Link>
            <div className="font-['Inter'] text-[10px] tracking-widest uppercase text-secondary opacity-60">© 2024 NOBULL ESPORTS LEAGUE. PRECISION ENGINEERED.</div>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <a className="font-['Inter'] text-xs tracking-widest uppercase text-secondary hover:text-primary transition-colors" href="#">PRIVACY POLICY</a>
            <a className="font-['Inter'] text-xs tracking-widest uppercase text-secondary hover:text-primary transition-colors" href="#">TERMS OF SERVICE</a>
            <a className="font-['Inter'] text-xs tracking-widest uppercase text-secondary hover:text-primary transition-colors" href="#">CONTACT</a>
            <a className="font-['Inter'] text-xs tracking-widest uppercase text-on-surface font-bold hover:text-primary transition-colors" href="#">SPONSORS</a>
          </div>
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-secondary cursor-pointer hover:text-primary">sports_esports</span>
            <span className="material-symbols-outlined text-secondary cursor-pointer hover:text-primary">podium</span>
            <span className="material-symbols-outlined text-secondary cursor-pointer hover:text-primary">public</span>
          </div>
        </div>
      </footer>

      {/* Floating Discord Persistent Widget */}
      <a 
        href="https://discord.gg/UsPzvBZpw7" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-[#5865F2] text-white rounded-full shadow-2xl hover:bg-[#4752c4] hover:scale-110 hover:-translate-y-1 transition-all group duration-300"
        style={{ boxShadow: '0 10px 25px -5px rgba(88, 101, 242, 0.6)' }}
      >
        <span className="absolute inset-0 bg-[#5865F2] rounded-full animate-ping opacity-20 hidden md:block"></span>
        <span className="material-symbols-outlined text-3xl md:text-4xl relative z-10 group-hover:-rotate-12 transition-transform">forum</span>
      </a>
    </>
  );
}
