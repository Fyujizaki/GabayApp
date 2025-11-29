import React, { useState } from 'react';
import { Icons, Button, Card, MarkdownBlock } from '../ui/SharedComponents';
import { generateGeminiContent } from '@/lib/gemini';

const ResourceItem = ({ resource }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="rounded-xl bg-barong-beige/50 border border-barong-navy/5 overflow-hidden transition-all">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full p-3 flex items-center justify-between text-left hover:bg-barong-gold/10">
                <div>
                    <div className="font-bold text-barong-navy flex items-center gap-2">{resource.title} {resource.type === 'Emergency' && <Icons.ShieldCheck size={14} className="text-red-500" />}</div>
                    <div className="text-xs text-slate-600">{resource.desc}</div>
                </div>
                <div className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}><Icons.Menu size={16} /></div>
            </button>
            {isOpen && (
                <div className="p-3 pt-0 space-y-2 bg-white/50">
                    <div className="h-px bg-barong-navy/10 mb-2"></div>
                    {resource.details.map((d, j) => (
                        <div key={j} className="flex justify-between text-sm">
                            <span className="text-slate-500">{d.label}:</span>
                            {d.link ? (
                                <a href={d.link} className="font-bold text-barong-navy hover:text-barong-gold underline decoration-dotted">{d.value}</a>
                            ) : (
                                <span className="font-bold text-barong-navy">{d.value}</span>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const HomeView = ({ userProfile, streak, userPoints, canCheckIn, handleCheckIn, setActiveTab, RESOURCES }) => {
    const [motivation, setMotivation] = useState(null);
    const [loading, setLoading] = useState(false);
    const getWisdom = async () => {
        setLoading(true);
        const txt = await generateGeminiContent(`User: ${userProfile.name}, Streak: ${streak}. Motivational quote.`, "Recovery coach.");
        setMotivation(txt);
        setLoading(false);
    };
    return (
        <div className="space-y-6 p-6 pb-24 overflow-y-auto h-full">
            <div className="glass-panel stitch-border rounded-3xl p-6 text-barong-cream bg-barong-navy relative overflow-hidden border-0 shadow-xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-barong-gold/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                <h1 className="text-3xl font-bold relative z-10 flex items-center gap-2 font-serif">Kamusta, {userProfile.name} <Icons.Sparkles className="text-barong-gold" /></h1>
                <p className="relative z-10 opacity-90 mt-2 font-light italic">"Ang pagbangon ay isang proseso."</p>
                <div className="flex gap-3 mt-6 relative z-10">
                    <div className="bg-white/10 rounded-xl p-3 flex-1 border border-white/10"><div className="text-xs font-bold opacity-75 uppercase tracking-wider">Streak</div><div className="text-2xl font-bold font-serif">{streak} Araw</div></div>
                    <div className="bg-white/10 rounded-xl p-3 flex-1 border border-white/10"><div className="text-xs font-bold opacity-75 uppercase tracking-wider">Tokens</div><div className="text-2xl font-bold flex gap-1 font-serif">{userPoints} <Icons.Award className="text-barong-gold" /></div></div>
                </div>
                <Button onClick={handleCheckIn} disabled={!canCheckIn} className={`w-full mt-4 ${!canCheckIn ? 'opacity-80 bg-slate-300 text-slate-600 border-slate-400 cursor-not-allowed' : 'bg-barong-gold text-barong-navy border-none hover:bg-white'}`}>
                    {canCheckIn ? "Daily Check-in (+20 Pts)" : "Checked In Today"}
                </Button>
            </div>
            <Card>
                <div className="flex justify-between items-center mb-2"><h3 className="font-bold text-xl text-barong-navy dark:text-barong-cream flex gap-2 font-serif"><Icons.Lightbulb className="text-barong-gold" /> Daily Wisdom</h3><Button variant="outline" onClick={getWisdom} disabled={loading} className="py-1 text-xs">{loading ? "..." : "Get Insight"}</Button></div>
                {motivation && <div className="bg-barong-beige/50 p-4 rounded-lg text-sm italic text-barong-navy border-l-4 border-barong-gold animate-fade-in"><MarkdownBlock content={motivation} /></div>}
            </Card>
            <Card>
                <h3 className="font-bold text-xl text-barong-navy dark:text-barong-cream mb-3 font-serif">Resources</h3>
                <div className="space-y-2">
                    {RESOURCES.map((r, i) => (
                        <ResourceItem key={i} resource={r} />
                    ))}
                </div>
            </Card>
            <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setActiveTab('chat')} className="glass-panel stitch-border p-6 rounded-2xl flex flex-col items-center text-center gap-3 hover:scale-[1.02] transition-transform group"><div className="w-14 h-14 bg-barong-navy rounded-full flex items-center justify-center text-barong-gold group-hover:bg-barong-gold group-hover:text-barong-navy transition-colors shadow-md"><Icons.MessageSquare /></div><span className="font-bold text-barong-navy dark:text-barong-cream">Kausapin si Gabay</span></button>
                <button onClick={() => setActiveTab('jobs')} className="glass-panel stitch-border p-6 rounded-2xl flex flex-col items-center text-center gap-3 hover:scale-[1.02] transition-transform group"><div className="w-14 h-14 bg-barong-pink/50 rounded-full flex items-center justify-center text-barong-navy group-hover:bg-barong-pink group-hover:text-white transition-colors shadow-md"><Icons.Briefcase /></div><span className="font-bold text-barong-navy dark:text-barong-cream">Hanapbuhay</span></button>
            </div>
        </div>
    );
};

export default HomeView;
