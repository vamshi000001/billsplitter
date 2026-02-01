import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Loader2, Sparkles } from 'lucide-react';
import { sendMessage } from '../services/aiService';
import ReactMarkdown from 'react-markdown';

const AIHelper = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'model',
            text: "Hi! I'm Chintu, your friendly SplitApp guide! 👋 I can help you manage your rooms, split bills with ease, and much more. How can I assist you today?"
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [pos, setPos] = useState({ x: 24, y: 24 }); // Bottom/Right offsets
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0, initialX: 0, initialY: 0 });
    const [hasMoved, setHasMoved] = useState(false);

    const chatEndRef = useRef(null);

    const suggestedQuestions = [
        "How do I add an expense?",
        "How is the bill split?",
        "How do I create a room?",
        "Can I edit an expense?"
    ];

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    useEffect(() => {
        const sessionOnboarded = sessionStorage.getItem('chintu_onboarded');
        if (!sessionOnboarded) {
            const timer = setTimeout(() => {
                setIsOpen(true);
                sessionStorage.setItem('chintu_onboarded', 'true');
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setHasMoved(false);
        setDragStart({
            x: e.clientX,
            y: e.clientY,
            initialX: pos.x,
            initialY: pos.y
        });
    };

    const handleTouchStart = (e) => {
        setIsDragging(true);
        setHasMoved(false);
        const touch = e.touches[0];
        setDragStart({
            x: touch.clientX,
            y: touch.clientY,
            initialX: pos.x,
            initialY: pos.y
        });
    };

    useEffect(() => {
        const handleMove = (clientX, clientY) => {
            if (!isDragging) return;

            const deltaX = dragStart.x - clientX;
            const deltaY = dragStart.y - clientY;

            if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
                setHasMoved(true);
            }

            setPos({
                x: Math.max(0, Math.min(window.innerWidth - 64, dragStart.initialX + deltaX)),
                y: Math.max(0, Math.min(window.innerHeight - 64, dragStart.initialY + deltaY))
            });
        };

        const handleMouseMove = (e) => handleMove(e.clientX, e.clientY);
        const handleTouchMove = (e) => {
            if (isDragging) {
                handleMove(e.touches[0].clientX, e.touches[0].clientY);
            }
        };

        const handleEnd = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleEnd);
            window.addEventListener('touchmove', handleTouchMove, { passive: false });
            window.addEventListener('touchend', handleEnd);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleEnd);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleEnd);
        };
    }, [isDragging, dragStart]);

    const handleToggle = () => {
        if (!hasMoved) {
            setIsOpen(!isOpen);
        }
    };

    const handleSendMessage = async (e, customMessage = null) => {
        if (e) e.preventDefault();
        const messageToSend = customMessage || input.trim();

        if (!messageToSend || isLoading) return;

        setMessages(prev => [...prev, { role: 'user', text: messageToSend }]);
        setInput('');
        setIsLoading(true);

        try {
            const responseText = await sendMessage(messageToSend, messages);
            setMessages(prev => [...prev, { role: 'model', text: responseText }]);
        } catch (error) {
            console.error("Chintu API Error:", error);
            setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting right now. Please try again later! 🔌" }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 z-[9999] w-[320px] md:w-[360px] glass-morphism rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-all duration-500 animate-scale-up border-none font-inter bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-500 p-5 flex justify-between items-center text-white shadow-lg">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center border border-white/40 shadow-inner">
                                    <img src="/assets/ai-logo.png" alt="Chintu" className="w-10 h-10 object-contain drop-shadow-md" />
                                </div>
                                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full"></span>
                            </div>
                            <div>
                                <h3 className="font-bold text-xl tracking-tight flex items-center gap-2">
                                    Chintu <Sparkles size={16} className="text-yellow-300 animate-pulse" />
                                </h3>
                                <p className="text-xs text-blue-100 font-medium italic">Online & Helpful</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-all active:scale-95"
                            title="Close Chat"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="h-[400px] overflow-y-auto p-5 space-y-4 bg-transparent scrollbar-hide">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-[14px] leading-relaxed shadow-sm transition-all hover:shadow-md ${msg.role === 'user' ? 'bg-gradient-to-br from-indigo-600 to-blue-700 text-white rounded-br-none' : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-bl-none'}`}>
                                    {msg.role === 'model' ? (
                                        <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-none">
                                            {msg.text || ''}
                                        </ReactMarkdown>
                                    ) : (
                                        msg.text
                                    )}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white dark:bg-slate-800 px-4 py-3 rounded-2xl rounded-bl-none border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-3">
                                    <div className="flex gap-1.5">
                                        <div className="w-2 h-2 bg-blue-50 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    </div>
                                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Chintu is thinking...</span>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Suggested Questions */}
                    {messages.length < 3 && !isLoading && (
                        <div className="px-5 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
                            {suggestedQuestions.map((q, i) => (
                                <button key={i} onClick={() => handleSendMessage(null, q)} className="whitespace-nowrap px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 text-xs font-bold rounded-full border border-blue-100 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                                    {q}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input Area */}
                    <form onSubmit={handleSendMessage} className="p-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-t border-gray-100 dark:border-gray-800 flex gap-3">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask Chintu anything..."
                            className="flex-1 px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm shadow-inner"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="p-3 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white hover:shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <Send size={22} />
                        </button>
                    </form>
                </div>
            )}

            {/* Toggle Button */}
            {!isOpen && (
                <div
                    className={`fixed z-[9999] select-none touch-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab px-4'}`}
                    style={{
                        right: `${pos.x}px`,
                        bottom: `${pos.y}px`,
                        transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleTouchStart}
                >
                    <div className="absolute inset-x-2 inset-y-0 rounded-full bg-blue-500/30 animate-ripple"></div>
                    <div className="absolute inset-x-2 inset-y-0 rounded-full bg-blue-500/20 animate-ripple [animation-delay:0.7s]"></div>
                    <button
                        onClick={handleToggle}
                        className="group relative flex items-center justify-center w-16 h-16 rounded-full shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 pointer-events-auto bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 text-white"
                        aria-label="Toggle Chat"
                    >
                        <div className="relative">
                            <img src="/assets/ai-logo.png" alt="Chintu" className="w-12 h-12 object-contain drop-shadow-xl" />
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse flex items-center justify-center">
                                <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                            </div>
                        </div>
                    </button>
                </div>
            )}
        </>
    );
};

export default AIHelper;
