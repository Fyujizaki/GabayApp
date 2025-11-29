import React, { useState } from 'react';
import { Icons, Button, Card, MarkdownBlock } from '../ui/SharedComponents';
import { generateGeminiContent } from '@/lib/gemini';

const JobsView = ({ JOB_LISTINGS, appliedJobs, handleJobApply, showToast }) => {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [loading, setLoading] = useState(false);

    const generateResume = async () => {
        if (!input.trim()) return;
        setLoading(true);
        const txt = await generateGeminiContent(`Make resume bullets for: ${input}`, "Resume writer.");
        setOutput(txt);
        setLoading(false);
        showToast("Resume polished!", "success");
    }

    const downloadResume = () => {
        const element = document.createElement("a");
        const file = new Blob([output], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = "Gabay_Resume.txt";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        showToast("Resume downloaded", "success");
    }

    return (
        <div className="space-y-5 p-6 pb-24 overflow-y-auto h-full">
            <div className="bg-barong-beige/30 dark:bg-indigo-900/20 rounded-2xl p-5 border border-barong-gold/30 dark:border-indigo-800 stitch-border">
                <h3 className="font-bold text-barong-navy dark:text-indigo-100 mb-2 flex gap-2 font-serif"><Icons.PenTool /> AI Resume Builder</h3>
                <textarea aria-label="Work experience description" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Describe your work experience..." className="w-full p-3 rounded-xl bg-barong-cream/70 dark:bg-slate-800/70 text-base border border-barong-navy/10 outline-none mb-3 h-20 resize-none focus:border-barong-gold" />
                <div className="flex gap-2">
                    <Button onClick={generateResume} disabled={loading || !input} className="flex-1 py-2 text-sm bg-barong-navy text-barong-gold">{loading ? "..." : "Polish with AI"}</Button>
                    {output && <Button onClick={downloadResume} variant="outline" className="py-2 px-3"><Icons.BookOpen size={16} /></Button>}
                </div>
                {output && <div className="mt-3 p-3 bg-white dark:bg-slate-800 rounded-xl text-sm whitespace-pre-wrap border border-barong-navy/10"><MarkdownBlock content={output} /></div>}
            </div>
            {JOB_LISTINGS.map(job => (
                <Card key={job.id}>
                    <div className="flex justify-between mb-2"><h3 className="font-bold dark:text-white font-serif text-lg">{job.title}</h3><span className="bg-barong-gold/20 text-barong-navy text-xs px-2 py-1 rounded-lg border border-barong-gold/30">{job.type}</span></div>
                    <div className="text-xs text-slate-500 mb-4 flex gap-3"><span><Icons.MapPin size={12} /> {job.location}</span><span><Icons.BookOpen size={12} /> {job.duration}</span></div>
                    <Button variant={appliedJobs.includes(job.id) ? "secondary" : "primary"} onClick={() => !appliedJobs.includes(job.id) && handleJobApply(job.id)} className="w-full py-2 text-sm">{appliedJobs.includes(job.id) ? "Applied" : "Apply Now"}</Button>
                </Card>
            ))}
        </div>
    );
};

export default JobsView;
