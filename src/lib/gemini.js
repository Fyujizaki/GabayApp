const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
    console.warn("Missing VITE_GEMINI_API_KEY in .env file. AI features will be in demo mode.");
}

export async function generateGeminiContent(prompt, systemInstruction) {
    if (!apiKey) { await new Promise(r => setTimeout(r, 1000)); return "(Demo Mode) This is simulated text. Add API Key to enable real AI."; }
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }], systemInstruction: { parts: [{ text: systemInstruction }] } })
        });
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "Connection issue.";
    } catch (error) { return "Error connecting to AI."; }
}

export async function callChatAI(prompt, history, userProfile, streak) {
    if (!apiKey) { await new Promise(r => setTimeout(r, 1500)); return `(Demo Mode) Hello ${userProfile.name}, this is a simulated response.`; }

    const systemPrompt = `You are Gabay, a compassionate, professional psychologist and rehabilitation guide based in Metro Manila. 
        User Profile: ${userProfile.name}, ${userProfile.age} years old, ${userProfile.sex}.
        Current Recovery Streak: ${streak} days.

        Persona: Professional yet warm.
        Language: Speak naturally in Taglish (mix of English and Tagalog) as a local Filipino would.
        CRITICAL: Do NOT provide translations in parentheses. Do NOT use asterisks or special formatting for Tagalog words. Just speak seamlessly in a natural conversational flow.
        Keep responses chat-friendly (max 3-4 sentences).`;

    const contents = [...history.map(msg => ({ role: msg.sender === 'user' ? 'user' : 'model', parts: [{ text: msg.text }] })), { role: 'user', parts: [{ text: prompt }] }];
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents, systemInstruction: { parts: [{ text: systemPrompt }] } })
        });
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "Connection error.";
    } catch (e) { return "I apologize, I'm having trouble connecting."; }
}
