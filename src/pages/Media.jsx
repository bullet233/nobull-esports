import React, { useState } from 'react';
import * as storage from '../utils/storage';

export default function Media() {
  const [media] = useState(() => storage.getMediaConfig());
  const { featured, vods } = media;

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-24 text-white">
      {/* Media Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 pb-12">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-1 w-12 bg-primary rounded-full"></div>
          <p className="font-label text-xs uppercase tracking-widest text-primary font-bold">NoBull Network</p>
        </div>
        <h1 className="font-headline text-5xl md:text-7xl font-black italic uppercase tracking-tighter drop-shadow-lg">
          The <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500">Broadcast</span> Hub
        </h1>
      </section>

      {/* Featured Live/Latest VOD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-16 relative">
        <div className="group relative w-full aspect-video bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
          <iframe 
            width="100%" 
            height="100%" 
            src={featured.url} 
            title={featured.title} 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerPolicy="strict-origin-when-cross-origin" 
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          ></iframe>
        </div>
      </section>

      {/* Recent Full Broadcasts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-20">
        <div className="flex items-end justify-between mb-8 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-3xl text-primary">video_library</span>
            <h2 className="font-headline text-3xl font-black italic uppercase tracking-tighter">VOD Archive</h2>
          </div>
          <button className="text-secondary font-label text-xs font-bold uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1">
            View All <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vods.map((vod) => (
            <a key={vod.id} href={vod.url} target="_blank" rel="noopener noreferrer" className="group flex flex-col cursor-pointer">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-lg mb-4">
                <img src={vod.thumbnail || (vod.url ? `https://img.youtube.com/vi/${(vod.url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/) || [])[1]}/maxresdefault.jpg` : '')} alt={vod.title} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-500" />
                <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-colors"></div>
                
                {/* Series Badge */}
                <span className={`absolute top-3 left-3 px-2 py-1 text-[9px] font-black tracking-widest uppercase rounded shadow-md ${vod.series === 'CORE' ? 'bg-[#f97316] text-white' : 'bg-[#10b981] text-white'}`}>
                  {vod.series}
                </span>

                {/* Hover Play Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/20 backdrop-blur-sm w-12 h-12 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-3xl">play_arrow</span>
                  </div>
                </div>
              </div>
              
              <h3 className="font-headline text-xl font-bold uppercase italic leading-tight group-hover:text-primary transition-colors line-clamp-2">{vod.title}</h3>
              <div className="flex items-center gap-4 mt-2 font-label text-[10px] font-black tracking-widest uppercase text-slate-500">
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">calendar_today</span> {vod.date}</span>
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">visibility</span> {vod.views} Views</span>
              </div>
            </a>
          ))}
        </div>
      </section>


    </div>
  );
}
