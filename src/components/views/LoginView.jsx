import React from 'react';
import { Icons, Button } from '../ui/SharedComponents';

const LoginView = ({ userProfile, setUserProfile, handleLogin }) => (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center relative z-10">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-10 w-32 h-32 bg-barong-gold/20 rounded-full blur-3xl animate-blob"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-barong-pink/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        </div>
        <div className="w-24 h-24 bg-barong-navy rounded-2xl flex items-center justify-center mb-6 shadow-xl border-2 border-barong-gold rotate-3 hover:rotate-0 transition-transform duration-500"><Icons.Sun size={48} className="text-barong-gold animate-pulse-slow" /></div>
        <h1 className="text-4xl font-bold text-barong-navy mb-2 font-serif tracking-tight">Gabay</h1>
        <p className="text-slate-500 mb-8 font-light">Your AI Companion for Recovery</p>
        <div className="w-full max-w-xs space-y-4 backdrop-blur-sm bg-white/30 p-6 rounded-2xl border border-white/50 shadow-sm">
            <input type="text" aria-label="Your Name" placeholder="Your Name" value={userProfile.name} onChange={e => setUserProfile({ ...userProfile, name: e.target.value })} className="w-full p-4 rounded-xl bg-barong-cream border border-barong-navy/20 outline-none focus:border-barong-gold focus:ring-2 focus:ring-barong-gold/20 transition-all text-barong-navy placeholder-barong-navy/40 text-base" />
            <input type="number" aria-label="Age" placeholder="Age" value={userProfile.age} onChange={e => setUserProfile({ ...userProfile, age: e.target.value })} className="w-full p-4 rounded-xl bg-barong-cream border border-barong-navy/20 outline-none focus:border-barong-gold focus:ring-2 focus:ring-barong-gold/20 transition-all text-barong-navy placeholder-barong-navy/40 text-base" />
            <div className="flex gap-2">
                {['Male', 'Female'].map(s => (
                    <button key={s} onClick={() => setUserProfile({ ...userProfile, sex: s })} className={`flex-1 p-3 rounded-xl border transition-all font-medium ${userProfile.sex === s ? 'bg-barong-navy text-barong-gold border-barong-navy shadow-md' : 'bg-transparent border-barong-navy/20 text-slate-500 hover:bg-barong-navy/5'}`}>{s}</button>
                ))}
            </div>
            <Button onClick={handleLogin} disabled={!userProfile.name || !userProfile.age || !userProfile.sex} className="w-full py-4 text-lg font-bold shadow-lg mt-2 bg-barong-navy text-barong-gold border border-barong-gold hover:scale-[1.02] active:scale-[0.98] transition-all">Begin Journey</Button>
        </div>
    </div>
);

export default LoginView;
