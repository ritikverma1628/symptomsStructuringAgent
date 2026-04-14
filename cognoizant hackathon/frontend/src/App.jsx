import React, { useState } from 'react';
import axios from 'axios';
import { Activity, AlertCircle, Clock, FileText, Loader2, Send, Stethoscope } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cx(...args) {
  return twMerge(clsx(args));
}

function App() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const [history, setHistory] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError('Please describe your symptoms first.');
      return;
    }
    
    setError('');
    setLoading(true);
    setResult(null);

    // Ensure we handle URL relative to where it runs or use localhost during dev
    const endpoint = import.meta.env.VITE_API_URL 
      ? `${import.meta.env.VITE_API_URL}/api/analyze` 
      : 'http://localhost:5000/api/analyze';

    try {
      const response = await axios.post(endpoint, { text });
      if (response.data.success) {
        const data = response.data.data;
        setResult(data);
        setHistory(prev => [{ text, result: data, date: new Date().toISOString() }, ...prev]);
        setText('');
      } else {
        setError(response.data.message || 'An error occurred');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Could not connect to the server');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'low': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'high': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 p-4 md:p-8 flex flex-col items-center">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <header className="mb-10 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm mb-4 border border-slate-100">
            <Activity className="w-8 h-8 text-indigo-600 mr-2" />
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              AI Symptom Summarizer
            </h1>
          </div>
          <p className="text-slate-500 max-w-lg mx-auto">
            Describe your symptoms naturally, and our AI will extract structured clinical insights for faster triage.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Input Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 transition-all duration-300 hover:shadow-md">
              <form onSubmit={handleSubmit}>
                <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="symptoms">
                  Describe symptoms
                </label>
                <div className="relative">
                  <textarea
                    id="symptoms"
                    rows="5"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all resize-none text-slate-800 placeholder-slate-400"
                    placeholder="e.g. I've had a headache and mild fever for the last 3 days..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    maxLength={1000}
                  ></textarea>
                  <div className="absolute bottom-3 right-3 text-xs text-slate-400 font-medium">
                    {text.length}/1000
                  </div>
                </div>
                
                {error && (
                  <div className="mt-4 p-4 bg-rose-50 text-rose-700 rounded-2xl flex items-start border border-rose-100 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="w-5 h-5 mr-2 shrink-0 mt-0.5" />
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                )}

                <div className="mt-6 flex items-center justify-between">
                  <p className="text-xs text-slate-500 flex items-center max-w-[60%]">
                    <AlertCircle className="w-3.5 h-3.5 mr-1" />
                    <span className="font-semibold mr-1">Disclaimer:</span> This is not medical advice.
                  </p>
                  <button
                    type="submit"
                    disabled={loading || !text.trim()}
                    className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:hover:bg-indigo-600 text-white font-medium rounded-xl transition-colors shadow-sm focus:ring-4 focus:ring-indigo-100"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Analyzing
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Analyze
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Results Section */}
            {result && (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-50 rounded-xl">
                      <FileText className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-800">Clinical Summary</h2>
                      <p className="text-sm text-slate-500">Extracted structured data</p>
                    </div>
                  </div>
                  <div className={cx("px-4 py-1.5 rounded-full border shadow-sm text-sm font-bold uppercase tracking-wide inline-flex items-center justify-center", getSeverityColor(result.severity))}>
                    Severity: {result.severity}
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Key Symptoms</h3>
                    <div className="flex flex-wrap gap-2">
                      {result.symptoms?.map((sym, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium border border-slate-200">
                          {sym}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-2 text-slate-500 mb-1.5">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Duration</span>
                      </div>
                      <p className="font-medium text-slate-800">{result.duration || 'Not specified'}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-2 text-slate-500 mb-1.5">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Priority</span>
                      </div>
                      <p className="font-medium text-slate-800 capitalize">{result.priority || 'Unknown'}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Stethoscope className="w-4 h-4" />
                      Possible Conditions
                    </h3>
                    <ul className="list-disc pl-5 space-y-1 text-slate-700 font-medium">
                      {result.possible_conditions?.map((cond, idx) => (
                        <li key={idx}>{cond}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100">
                    <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Summary Note</h3>
                    <p className="text-indigo-900 font-medium leading-relaxed">{result.summary}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* History Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sticky top-8">
              <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-slate-400" />
                History
              </h2>
              {history.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm font-medium border-2 border-dashed border-slate-100 rounded-2xl">
                  No previous records
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {history.map((record, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-300 transition-colors cursor-pointer group">
                      <p className="text-sm text-slate-600 line-clamp-2 mb-3 group-hover:text-slate-900 transition-colors">
                        "{record.text}"
                      </p>
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span className="text-slate-400">
                          {new Date(record.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className={cx("px-2 py-0.5 rounded-md", getSeverityColor(record.result.severity).replace('border', 'bg-opacity-50'))}>
                          {record.result.severity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
