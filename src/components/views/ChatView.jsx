import React, { memo } from 'react';
import { Icons, MarkdownBlock } from '../ui/SharedComponents';

const MessageItem = memo(({ msg }) => (
    <div className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
        <div className={`max-w-[85%] p-4 rounded-2xl text-sm shadow-sm ${msg.sender === 'user' ? 'bg-barong-navy text-barong-cream rounded-br-none border border-barong-navy' : 'bg-barong-cream dark:bg-slate-800 border border-barong-gold/30 text-barong-navy dark:text-slate-200 rounded-bl-none'}`}>
            <MarkdownBlock content={msg.text} />
        </div>
    </div>
));

const ChatView = memo(({ messages, isTyping, chatEndRef, inputText, setInputText, handleSend, clearChat }) => (
    <div className="flex flex-col h-full w-full relative overflow-hidden">
        {/* 1. Header (Fixed at Top) */}
        <div className="flex-shrink-0 p-4 bg-barong-cream/90 dark:bg-barong-dark/90 backdrop-blur-md border-b border-barong-gold/20 z-20 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-barong-navy rounded-full flex items-center justify-center text-barong-gold shadow-md border border-barong-gold"><Icons.ShieldCheck /></div>
                <div><h3 className="font-bold text-barong-navy dark:text-barong-cream font-serif">Gabay</h3><p className="text-xs text-barong-blue dark:text-barong-beige font-semibold">AI Psychologist</p></div>
            </div>
            <button onClick={clearChat} className="text-xs text-barong-navy/60 hover:text-red-500 transition-colors font-bold uppercase tracking-wider">Clear</button>
        </div>

        {/* 2. Messages (Scrollable Middle Area) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-transparent z-0 scrollbar-hide">
            {messages.map((msg) => <MessageItem key={msg.id} msg={msg} />)}
            {isTyping && <div className="flex justify-start"><div className="bg-barong-cream dark:bg-slate-800 p-3 rounded-2xl rounded-bl-none shadow-sm border border-barong-gold/30"><div className="flex gap-1"><div className="w-2 h-2 bg-barong-gold rounded-full animate-bounce"></div><div className="w-2 h-2 bg-barong-gold rounded-full animate-bounce delay-75"></div><div className="w-2 h-2 bg-barong-gold rounded-full animate-bounce delay-150"></div></div></div></div>}
            <div ref={chatEndRef} />
        </div>

        {/* 3. Input Area (Flex Item at Bottom) */}
        <div className="flex-shrink-0 w-full p-3 bg-barong-cream/90 dark:bg-barong-dark/90 backdrop-blur-md border-t border-barong-gold/20 z-20">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2 items-end">
                <textarea rows={1} aria-label="Type your message" value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} placeholder="Type here..." className="flex-1 bg-barong-beige/50 dark:bg-slate-800 border border-barong-navy/10 rounded-2xl px-4 py-3 text-base focus:ring-2 focus:ring-barong-gold outline-none resize-none max-h-32 text-barong-navy placeholder-barong-navy/40" />
                <button type="submit" disabled={isTyping} className="w-11 h-11 bg-barong-navy text-barong-gold border border-barong-gold rounded-full flex items-center justify-center shadow hover:scale-105 active:scale-95 transition-transform flex-shrink-0 disabled:opacity-50"><Icons.Send size={18} /></button>
            </form>
        </div>
    </div>
));

export default ChatView;
