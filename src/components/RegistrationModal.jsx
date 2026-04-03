import React, { useState } from 'react';
import { addRegistration } from '../utils/storage';

export default function RegistrationModal({ isOpen, onClose, config, seriesId }) {
  const [form, setForm] = useState({ name: '', email: '', car1: '', car2: '', car3: '' });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    addRegistration({
      id: Date.now(),
      name: form.name,
      email: form.email,
      seriesId: seriesId || 'unknown',
      carChoices: [form.car1, form.car2, form.car3],
      status: 'pending',
      submittedAt: new Date().toISOString(),
    });
    setSubmitted(true);
  };

  const handleClose = () => { setSubmitted(false); setForm({ name: '', email: '', car1: '', car2: '', car3: '' }); onClose(); };

  const focusBorder = (e) => { e.target.style.boxShadow = `inset 0 0 0 2px ${config.color}`; };
  const blurBorder = (e) => { e.target.style.boxShadow = 'inset 0 0 0 0 transparent'; };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 drop-shadow-2xl">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={handleClose}></div>

      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fadeIn border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 relative overflow-hidden shrink-0" style={{ backgroundColor: `${config.color}15` }}>
          <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent"></div>
          <button onClick={handleClose} className="absolute z-20 top-4 right-4 h-8 w-8 bg-white/50 hover:bg-white rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors shadow-sm group">
            <span className="material-symbols-outlined text-[20px] group-hover:rotate-90 transition-transform duration-300">close</span>
          </button>
          <div className="flex items-center gap-4 relative z-10">
            {config.logo ? (
              <img src={config.logo} alt={config.title} className="h-36 w-auto object-contain drop-shadow-lg shrink-0" />
            ) : (
              <span className="material-symbols-outlined text-4xl shrink-0" style={{ color: config.color }}>edit_document</span>
            )}
            <div>
              <h2 className="font-headline text-2xl md:text-3xl font-black italic uppercase tracking-tight text-slate-900 leading-none mb-1">Official Registration</h2>
              <p className="font-label text-xs uppercase tracking-widest font-bold" style={{ color: config.color }}>{config.title}</p>
            </div>
          </div>
        </div>

        {/* Submitted State */}
        {submitted ? (
          <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-xl" style={{ backgroundColor: `${config.color}20` }}>
              <span className="material-symbols-outlined text-5xl" style={{ color: config.color }}>check_circle</span>
            </div>
            <h3 className="font-headline text-2xl font-black uppercase italic text-slate-900 mb-2">Application Received!</h3>
            <p className="font-body text-secondary max-w-sm mb-8">
              Your registration for <span className="font-bold" style={{ color: config.color }}>{config.title}</span> is in. The next step is joining our Discord — that's where race announcements, lineup confirmations, and all league comms happen.
            </p>
            <a
              href="https://discord.gg/nobull"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full max-w-xs flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-headline font-black italic uppercase tracking-widest text-white text-lg shadow-xl hover:scale-105 hover:shadow-2xl transition-all bg-[#5865F2] hover:bg-[#4752c4]"
              style={{ borderBottom: '4px solid rgba(0,0,0,0.2)' }}
            >
              <span className="material-symbols-outlined text-[26px]">forum</span>
              Join the Discord
            </a>
            <button onClick={handleClose} className="mt-4 px-6 py-2.5 font-label font-bold text-xs uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">
              I'll do this later
            </button>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto scrollbar-hide">
            <div className="p-6 md:p-8 space-y-8">
              {/* Driver Identity */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-slate-400">badge</span>
                  <h3 className="font-headline text-lg md:text-xl font-bold uppercase italic tracking-tight text-slate-800">Driver Identity</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label text-[10px] uppercase font-black tracking-widest text-slate-500 ml-1">iRacing Name <span className="text-red-400">*</span></label>
                    <input required type="text" placeholder="e.g. Dale Earnhardt" value={form.name} onChange={e => set('name', e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-body text-slate-800 focus:outline-none placeholder:text-slate-300 focus:bg-white shadow-sm transition-all"
                      onFocus={focusBorder} onBlur={blurBorder} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label text-[10px] uppercase font-black tracking-widest text-slate-500 ml-1">Email Address <span className="text-red-400">*</span></label>
                    <input required type="email" placeholder="driver@example.com" value={form.email} onChange={e => set('email', e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-body text-slate-800 focus:outline-none placeholder:text-slate-300 focus:bg-white shadow-sm transition-all"
                      onFocus={focusBorder} onBlur={blurBorder} />
                  </div>
                </div>
              </section>

              {/* Car Number Preferences */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-slate-400">pin</span>
                  <h3 className="font-headline text-lg md:text-xl font-bold uppercase italic tracking-tight text-slate-800">Car Number Preferences</h3>
                </div>
                <p className="text-xs text-secondary font-body mb-5 -mt-2 ml-8">Provide 3 choices in case your primary number is already secured by a veteran driver.</p>
                <div className="grid grid-cols-3 gap-3 md:gap-4">
                  {[{ key: 'car1', label: 'First Choice' }, { key: 'car2', label: 'Second' }, { key: 'car3', label: 'Third' }].map(f => (
                    <div key={f.key} className="flex flex-col gap-1.5">
                      <label className="font-label text-[10px] uppercase font-black tracking-widest text-slate-500 ml-1 text-center">{f.label}</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-headline font-black text-slate-300 italic text-lg">#</span>
                        <input type="text" maxLength="3" value={form[f.key]} onChange={e => set(f.key, e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-3 font-headline font-black italic text-xl text-slate-800 focus:outline-none focus:bg-white text-center shadow-sm transition-all"
                          onFocus={focusBorder} onBlur={blurBorder} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>


            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 shrink-0 flex justify-end gap-3">
              <button type="button" onClick={handleClose} className="px-6 py-3 rounded-xl font-headline font-bold uppercase tracking-widest text-sm text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors">Cancel</button>
              <button type="submit" className="px-8 py-3 rounded-xl font-headline font-black uppercase tracking-widest text-sm text-white shadow-lg transition-all hover:scale-105 flex items-center gap-2" style={{ backgroundColor: config.color, boxShadow: `0 10px 25px -5px ${config.color}60` }}>
                Submit Registration <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
