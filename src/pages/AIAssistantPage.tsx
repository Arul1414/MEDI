import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { askMediBot } from '../services/aiAssistantService';
import {
  Bot,
  Send,
  Sparkles,
  HelpCircle,
  Clock,
  User,
  RefreshCw,
  Boxes,
  Truck,
  AlertTriangle,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  mode?: 'AI' | 'DEMO';
}

export const AIAssistantPage: React.FC = () => {
  const {
    wasteRecords,
    collectionRequests,
    mobileUnits,
    containers,
    alerts,
    currentUser,
  } = useApp();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-0',
      sender: 'bot',
      text: `Hello ${currentUser.name}! I am **MediBot**, the intelligent clinical assistant for the MEDI-SORT platform.\n\nI have real-time visibility into all hospital waste collections, container capacities, mobile unit dispatch states, and biohazard alerts.\n\nHow may I assist you today?`,
      timestamp: 'Just now',
      mode: 'AI',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const suggestedQuestions = [
    'How much waste was collected today?',
    'Which container is almost full?',
    'How do I empty and reset a container?',
    'How do I recall mobile units to storage?',
    'Show pending urgent requests',
    'What is the status of MEDI-02?',
    'Explain the color-coded waste streams',
    'Explain the AI classification review protocol',
  ];

  const renderFormattedText = (content: string, isUser: boolean) => {
    return content.split('\n').map((line, lineIdx) => {
      const parts = line.split(/(\*\*.*?\*\*|\*.*?\*)/g);
      return (
        <div key={lineIdx} className={line.trim() === '' ? 'h-2' : 'min-h-[1.25rem]'}>
          {parts.map((part, partIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={partIdx} className={isUser ? 'font-bold text-white' : 'font-bold text-slate-900'}>
                  {part.slice(2, -2)}
                </strong>
              );
            }
            if (part.startsWith('*') && part.endsWith('*')) {
              return (
                <em key={partIdx} className={isUser ? 'italic text-sky-100' : 'italic text-slate-600'}>
                  {part.slice(1, -1)}
                </em>
              );
            }
            return <span key={partIdx}>{part}</span>;
          })}
        </div>
      );
    });
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Context payload
    const totalWasteKg = wasteRecords.reduce((a, b) => a + b.weightKg, 0);
    const topDept = 'Emergency';
    const context = {
      totalWasteKg,
      todayCollections: wasteRecords.length + 22,
      pendingRequestsCount: collectionRequests.filter((r) => r.status === 'PENDING').length,
      activeUnitsCount: mobileUnits.filter((u) => u.status === 'COLLECTING' || u.status === 'ASSIGNED').length,
      fullContainersCount: containers.filter((c) => c.capacityPercent >= 80).length,
      aiClassificationsCount: wasteRecords.length + 166,
      containers: containers.map((c) => ({
        name: c.name,
        label: c.label,
        capacityPercent: c.capacityPercent,
        currentWeightKg: c.currentWeightKg,
        capacityKg: c.capacityKg,
        status: c.status,
      })),
      urgentRequests: collectionRequests
        .filter((r) => r.priority === 'URGENT' || r.priority === 'HIGH')
        .map((r) => ({
          id: r.id,
          department: r.department,
          priority: r.priority,
          category: r.category,
        })),
      topDepartment: topDept,
    };

    try {
      const response = await askMediBot(query, context);
      const botMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'bot',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: response.mode,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'bot',
        text: 'I encountered an error retrieving live system telemetry. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: 'DEMO',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 flex flex-col h-[calc(100vh-140px)] text-slate-800">
      {/* Header with Multi Gradient Module Identity */}
      <div className="bg-gradient-to-r from-sky-50 via-indigo-50/50 to-purple-50 border border-purple-200 rounded-2xl p-5 shadow-xs flex items-center justify-between gap-4 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-purple-800">
              Conversational Core • Multi Gradient Module
            </span>
            <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-200 text-[10px] font-mono font-semibold">
              Gemini 2.5 / Failover Online
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Bot className="w-6 h-6 text-purple-600" />
            MediBot Clinical AI Assistant
          </h1>
          <p className="text-slate-600 text-xs mt-0.5">
            Natural language hospital operations agent answering questions on collection telemetry, container status, and biohazard alerts.
          </p>
        </div>

        <span className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-purple-200 text-purple-800 text-xs font-mono font-bold shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Powered by Gemini / Telemetry Core
        </span>
      </div>

      {/* Main Chat Box */}
      <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-2xs flex flex-col overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${
                msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs ${
                  msg.sender === 'user'
                    ? 'bg-purple-600'
                    : 'bg-gradient-to-br from-sky-500 via-indigo-500 to-purple-600 shadow-sky-500/20'
                }`}
              >
                {msg.sender === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`rounded-2xl p-4 text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-sky-600 text-white rounded-tr-xs shadow-2xs'
                    : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-xs shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-2 text-xs text-slate-500 font-mono">
                  <span className={msg.sender === 'user' ? 'text-sky-100 font-semibold' : 'text-slate-700 font-semibold'}>
                    {msg.sender === 'user' ? currentUser.name : 'MediBot Assistant'}
                  </span>
                  <div className="flex items-center gap-2">
                    {msg.mode && (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        msg.sender === 'user' ? 'bg-sky-700 text-sky-100' : 'bg-slate-200 text-sky-900'
                      }`}>
                        {msg.mode} MODE
                      </span>
                    )}
                    <span className={msg.sender === 'user' ? 'text-sky-200' : 'text-slate-400'}>
                      {msg.timestamp}
                    </span>
                  </div>
                </div>

                <div className="text-sm font-sans space-y-1">
                  {renderFormattedText(msg.text, msg.sender === 'user')}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 max-w-xl">
              <div className="w-8 h-8 rounded-xl bg-sky-600 flex items-center justify-center text-white shrink-0 animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-xs p-4 text-sm text-slate-600 flex items-center gap-2 shadow-2xs">
                <RefreshCw className="w-4 h-4 animate-spin text-sky-600" />
                <span>MediBot is analyzing hospital telemetry records...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Chips Bar */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
            Suggestions:
          </span>
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="px-3 py-1.5 rounded-full bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-700 border border-slate-200 text-xs whitespace-nowrap transition-colors cursor-pointer shadow-2xs font-medium"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              placeholder="Ask MediBot about collection status, container levels, urgent tickets..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white text-sm font-semibold flex items-center gap-2 shadow-md shadow-sky-600/20 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Ask MediBot</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
