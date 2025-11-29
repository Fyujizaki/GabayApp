import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { callChatAI } from '@/lib/gemini';
import { Icons, Toast } from './components/ui/SharedComponents';

// Views
import LoginView from './components/views/LoginView';
import HomeView from './components/views/HomeView';
import ChatView from './components/views/ChatView';
import JobsView from './components/views/JobsView';
import RewardsView from './components/views/RewardsView';
import MapView from './components/views/MapView';

// Data
const JOB_LISTINGS = [
    { id: 1, title: "Vocational Welding Course", organization: "Metro Manila Skills Hub", location: "Quezon City", type: "Training", duration: "3 Months", badge: "Certification" },
    { id: 2, title: "Community Garden Assistant", organization: "Green City Project", location: "Marikina", type: "Part-time", duration: "Ongoing", badge: "Allowance Provided" },
    { id: 3, title: "Basic IT & Data Entry", organization: "Digital Tesda Program", location: "Taguig (Online Option)", type: "Education", duration: "6 Weeks", badge: "Job Placement" }
];

const RESOURCES = [
    { 
        title: "DREAM Center", 
        desc: "Residential rehab & vocational training.", 
        type: "Partner",
        details: [
            { label: "Landline", value: "(02) 8123-4567", link: "tel:0281234567" },
            { label: "Mobile", value: "0917-123-4567", link: "tel:09171234567" }
        ]
    },
    { 
        title: "Katarungan Program", 
        desc: "Community-based support groups.", 
        type: "Community",
        details: [
            { label: "Coordinator", value: "0918-987-6543", link: "tel:09189876543" },
            { label: "Schedule", value: "Mon-Fri, 8AM-5PM", link: null }
        ]
    },
    { 
        title: "Metro Health Line", 
        desc: "24/7 Emergency mental health support.", 
        type: "Emergency", 
        details: [
            { label: "Hotline 1", value: "1553", link: "tel:1553" },
            { label: "Hotline 2", value: "0917-899-USAP", link: "tel:09178998727" }
        ]
    }
];

function App() {
    // REFACTORED: Using useLocalStorage hook with v2 keys to reset state
    const [isLoggedIn, setIsLoggedIn] = useLocalStorage('gabay_isLoggedIn_v2', false);
    const [isDarkMode, setIsDarkMode] = useLocalStorage('gabay_isDarkMode_v2', false);
    const [userProfile, setUserProfile] = useLocalStorage('gabay_userProfile_v2', { name: '', age: '', sex: '' });
    const [userPoints, setUserPoints] = useLocalStorage('gabay_userPoints_v2', 0); // Reset to 0
    const [streak, setStreak] = useLocalStorage('gabay_streak_v2', 0); // Reset to 0
    const [appliedJobs, setAppliedJobs] = useLocalStorage('gabay_appliedJobs_v2', []);
    const [messages, setMessages] = useLocalStorage('gabay_messages_v2', []);
    const [inventory, setInventory] = useLocalStorage('gabay_inventory_v2', []);
    const [lastCheckInDate, setLastCheckInDate] = useLocalStorage('gabay_lastCheckInDate_v2', '');

    const [activeTab, setActiveTab] = useState('home');
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [toast, setToast] = useState(null);
    const [showCrisisModal, setShowCrisisModal] = useState(false);

    const chatEndRef = useRef(null);

    // Derived state for check-in
    const today = new Date().toISOString().split('T')[0];
    const canCheckIn = lastCheckInDate !== today;

    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping]);

    // RED FLAG PROTOCOL - Moved outside or memoized
    const detectCrisis = useCallback((text) => {
        const crisisKeywords = [/suicide/i, /kill myself/i, /want to die/i, /overdose/i, /hurt myself/i, /end it all/i];
        return crisisKeywords.some(regex => regex.test(text));
    }, []);

    // Initial Greeting if empty
    useEffect(() => {
        if (isLoggedIn && messages.length === 0) {
            setMessages([{ id: 1, sender: 'ai', text: `Kamusta ${userProfile.name}? I'm Gabay. How are you feeling today?` }]);
        }
    }, [isLoggedIn, messages.length, userProfile.name, setMessages]);

    // Dark Mode Effect
    useEffect(() => {
        if (isDarkMode) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
    }, [isDarkMode]);

    const showToast = (msg, type = 'success') => setToast({ msg, type });

    const handleLogin = useCallback(() => {
        if (userProfile.name && userProfile.age) {
            setIsLoggedIn(true);
            showToast(`Welcome, ${userProfile.name}!`);
        }
    }, [userProfile.name, userProfile.age, setIsLoggedIn]);

    const handleLogout = useCallback(() => {
        if (confirm("Are you sure you want to log out?")) {
            setIsLoggedIn(false);
            setActiveTab('home');
            showToast("Logged out successfully");
        }
    }, [setIsLoggedIn]);

    const handleCheckIn = useCallback(() => {
        if (!canCheckIn) return;

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (lastCheckInDate === yesterdayStr) {
            setStreak(s => s + 1);
        } else {
            setStreak(1); // Reset if missed a day or first time
        }

        setLastCheckInDate(today);
        setUserPoints(p => p + 20);
        showToast("Daily Check-in Complete! +20 Pts");
    }, [canCheckIn, lastCheckInDate, today, setStreak, setLastCheckInDate, setUserPoints]);

    const handleSend = useCallback(async () => {
        if (!inputText.trim()) return;
        
        const userMsg = { id: Date.now(), sender: 'user', text: inputText };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');

        // RED FLAG CHECK
        if (detectCrisis(userMsg.text)) {
            setShowCrisisModal(true);
            const crisisMsg = { 
                id: Date.now() + 1, 
                sender: 'ai', 
                text: "**I'm concerned about you.** \n\nIt sounds like you're going through a very difficult time. Please know that you are not alone and there is help available.\n\n**Emergency Hotlines:**\n*   **NCMH Crisis Hotline:** 1553 (Luzon-wide landline toll-free)\n*   **Globe/TM:** 0966-351-4518\n*   **Smart/Sun/TNT:** 0908-639-2672\n\nPlease reach out to them immediately." 
            };
            setMessages(prev => [...prev, crisisMsg]);
            return; // Stop AI generation
        }

        setIsTyping(true);
        try {
            const aiText = await callChatAI(userMsg.text, messages, userProfile, streak);
            setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: aiText }]);
        } catch (e) {
            setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: "Connection error." }]);
            showToast("Failed to connect to AI", "error");
        }
        setIsTyping(false);
    }, [inputText, detectCrisis, messages, userProfile, streak, setMessages]);

    const clearChat = useCallback(() => {
        if (confirm("Clear chat history?")) {
            // UPDATED: Warmer greeting after clear
            setMessages([{ id: Date.now(), sender: 'ai', text: "Kamusta ka? Nandito lang ako para makinig." }]);
            showToast("Chat history cleared");
        }
    }, [setMessages]);

    const handleJobApply = useCallback((jobId) => {
        setAppliedJobs(prev => [...prev, jobId]);
        showToast("Application Sent!", "success");
    }, [setAppliedJobs]);

    const handleRedeem = useCallback((reward) => {
        if (userPoints >= reward.cost) {
            setUserPoints(prev => prev - reward.cost);
            setInventory(prev => [...prev, reward.id]);
            showToast(`Redeemed: ${reward.name}!`);
        } else {
            showToast("Not enough points", "error");
        }
    }, [userPoints, setUserPoints, setInventory]);

    if (!isLoggedIn) return (
        <>
            <LoginView userProfile={userProfile} setUserProfile={setUserProfile} handleLogin={handleLogin} />
            {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
        </>
    );

    return (
        <div className="flex flex-col h-[100dvh] bg-barong-beige dark:bg-slate-900 text-barong-navy dark:text-slate-200 font-sans overflow-hidden relative transition-colors duration-300">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-barong-gold/10 rounded-full blur-3xl animate-blob"></div>
                <div className="absolute top-40 -left-20 w-72 h-72 bg-barong-pink/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
            </div>

            {/* Top Navigation */}
            <nav className="flex-shrink-0 p-4 flex justify-between items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-barong-navy/5 z-30 relative">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-barong-navy rounded-lg flex items-center justify-center text-barong-gold"><Icons.Sun size={18} /></div>
                    <span className="font-bold text-xl font-serif tracking-tight">Gabay</span>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">{isDarkMode ? <Icons.Sun size={20} /> : <Icons.Moon size={20} />}</button>
                    <button onClick={handleLogout} className="p-2 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"><Icons.LogOut size={20} /></button>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="flex-1 overflow-hidden relative z-10">
                {activeTab === 'home' && <HomeView userProfile={userProfile} streak={streak} userPoints={userPoints} canCheckIn={canCheckIn} handleCheckIn={handleCheckIn} setActiveTab={setActiveTab} RESOURCES={RESOURCES} />}
                {activeTab === 'chat' && <ChatView messages={messages} isTyping={isTyping} chatEndRef={chatEndRef} inputText={inputText} setInputText={setInputText} handleSend={handleSend} clearChat={clearChat} />}
                {activeTab === 'jobs' && <JobsView JOB_LISTINGS={JOB_LISTINGS} appliedJobs={appliedJobs} handleJobApply={handleJobApply} showToast={showToast} />}
                {activeTab === 'rewards' && <RewardsView userPoints={userPoints} inventory={inventory} handleRedeem={handleRedeem} />}
                {activeTab === 'map' && <MapView />}
            </main>

            {/* Bottom Navigation */}
            <div className="flex-shrink-0 bg-white dark:bg-slate-900 border-t border-barong-navy/5 pb-safe z-30 relative">
                <div className="flex justify-around p-2">
                    {[
                        { id: 'home', icon: Icons.Heart, label: 'Home' },
                        { id: 'chat', icon: Icons.MessageSquare, label: 'Chat' },
                        { id: 'map', icon: Icons.Map, label: 'Map' },
                        { id: 'jobs', icon: Icons.Briefcase, label: 'Jobs' },
                        { id: 'rewards', icon: Icons.Gift, label: 'Rewards' }
                    ].map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex flex-col items-center p-2 rounded-xl transition-all w-16 ${activeTab === tab.id ? 'text-barong-navy dark:text-barong-gold bg-barong-gold/10 scale-105' : 'text-slate-400 hover:text-barong-navy dark:hover:text-slate-200'}`}>
                            <tab.icon size={24} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
                            <span className="text-[10px] font-bold mt-1">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Toast Notification */}
            {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}

export default App;
