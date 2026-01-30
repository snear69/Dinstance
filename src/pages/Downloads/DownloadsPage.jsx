import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, Package, Check, FileArchive, Shield, Key, 
  FileText, Code, Clock, ArrowLeft, Loader2, AlertCircle,
  ExternalLink, Copy, CheckCircle2, Layout, Database, 
  Terminal, Activity, Lock, Globe, Zap, Cpu, Search,
  Settings, ChevronRight, BookOpen, Layers
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const DocumentationPage = () => {
  const navigate = useNavigate();
  const { token, isAuthenticated, user, refreshWallet } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [activePurchase, setActivePurchase] = useState(null);
  const [copied, setCopied] = useState(null);
  const [downloading, setDownloading] = useState(false);

  const fetchPurchases = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/downloads/purchases`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPurchases(data.purchases || []);
        if (data.purchases && data.purchases.length > 0) {
          setActivePurchase(data.purchases[0]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch purchases:', error);
    } finally {
      setLoading(false);
    }
  }, [token, API_URL]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchPurchases();
  }, [isAuthenticated, navigate, fetchPurchases]);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDownload = async () => {
    if (!activePurchase) return;
    setDownloading(true);
    try {
      const res = await fetch(`${API_URL}/downloads/download/${activePurchase.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `oracle_${activePurchase.planName.toLowerCase().replace(/\s+/g, '_')}_bundle.zip`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      }
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-oracle-dark">
        <Loader2 className="w-8 h-8 text-oracle-blue animate-spin" />
      </div>
    );
  }

  if (purchases.length === 0) {
    return (
      <div className="min-h-screen bg-oracle-dark flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-oracle-blue/10 blur-[120px] rounded-full animate-pulse" />
        
        <div className="max-w-md w-full text-center space-y-10 relative z-10">
          <div className="relative mx-auto w-32 h-32">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-4 border-2 border-dashed border-red-500/20 rounded-full"
            />
            <div className="w-full h-full bg-zinc-900 rounded-4xl border border-white/10 flex items-center justify-center shadow-2xl relative">
              <Lock className="w-12 h-12 text-zinc-700" />
              <div className="absolute -top-2 -right-2 bg-red-600 px-2 py-0.5 rounded text-[8px] font-black uppercase">Blocked</div>
            </div>
          </div>

          <div className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl font-black text-white tracking-tighter uppercase italic"
            >
              License Required
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-zinc-500 leading-relaxed font-medium"
            > 
              Your account is currently in <span className="text-red-400">GUEST MODE</span>. To unlock the enterprise documentation and node management terminal, you must have an active license.
            </motion.p>
          </div>

          <div className="flex flex-col gap-4">
            <button 
              onClick={() => {
                setLoading(true);
                refreshWallet();
                fetchPurchases();
              }}
              className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl shadow-xl hover:bg-oracle-blue transition-all group"
            >
              <Activity className="w-5 h-5 group-hover:animate-spin" />
              Verify My Payment
            </button>
            
            <Link 
              to="/#pricing" 
              className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-zinc-900 border border-white/10 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-zinc-800 transition-all"
            >
              <Zap className="w-5 h-5 text-oracle-blue" />
              Acquire New License
            </Link>
          </div>

          <div className="pt-8 border-t border-white/5">
            <Link to="/dashboard" className="text-zinc-600 hover:text-white transition-colors text-sm font-bold flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const sidebarItems = [
    { id: 'overview', label: 'Platform Overview', icon: Layout },
    { id: 'getting-started', label: 'Getting Started', icon: Zap },
    { id: 'api-reference', label: 'API Reference', icon: Code },
    { id: 'sdk', label: 'SDK Usage', icon: Terminal },
    { id: 'endpoints', label: 'Endpoint Management', icon: Globe },
    { id: 'monitoring', label: 'Real-time Monitoring', icon: Activity },
    { id: 'security', label: 'Security & Auth', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-oracle-dark text-white flex flex-col lg:flex-row">
      <aside className="w-full lg:w-80 border-r border-white/5 bg-black/40 backdrop-blur-3xl flex flex-col z-20 sticky top-0 h-screen">
        <div className="p-8 border-b border-white/5">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-oracle-blue/10 flex items-center justify-center border border-oracle-blue/20">
              <Cpu className="text-oracle-blue w-6 h-6" />
            </div>
            <span className="text-xl font-black tracking-tighter group-hover:text-oracle-blue transition-colors">ORACLE <span className="text-oracle-blue">DOCS</span></span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          <p className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-4 mt-4">Infrastructure</p>
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === item.id 
                  ? 'bg-oracle-blue/10 text-oracle-blue border border-oracle-blue/20' 
                  : 'text-zinc-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
              {activeTab === item.id && <motion.div layoutId="sidebar-indicator" className="ml-auto w-1 h-4 bg-oracle-blue rounded-full" />}
            </button>
          ))}

          <p className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-4 mt-8">Deployment Bundle</p>
          <div className="p-4 bg-zinc-900/50 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-oracle-blue/20 flex items-center justify-center">
                <Package className="text-oracle-blue w-4 h-4" />
              </div>
              <div className="truncate">
                <p className="text-xs font-black truncate">{activePurchase?.planName} Tier</p>
                <p className="text-[10px] text-zinc-500 font-mono italic">#{activePurchase?.id?.slice(0, 8)}</p>
              </div>
            </div>
            <button 
              onClick={handleDownload}
              disabled={downloading}
              className="w-full py-2 bg-oracle-blue text-black text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 hover:bg-white transition-all disabled:opacity-50"
            >
              {downloading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
              Update Source
            </button>
          </div>
        </div>

        <div className="p-6 border-t border-white/5 mt-auto">
          <div className="flex items-center gap-3 p-3 bg-zinc-900/50 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-oracle-blue to-blue-600 flex items-center justify-center font-black text-black text-xs">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 truncate">
              <p className="text-xs font-bold truncate">{user?.name}</p>
              <p className="text-[10px] text-zinc-500 truncate lowercase">Enterprise Account</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 relative">
        <div className="max-w-5xl mx-auto p-8 lg:p-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-12"
            >
              {activeTab === 'overview' && (
                <div className="space-y-10">
                  <header className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-oracle-blue/10 border border-oracle-blue/20 text-oracle-blue text-[10px] font-black uppercase tracking-widest">
                      <Layers className="w-3 h-3" /> System Architecture v4.2
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">
                      Infrastructure <br/> <span className="text-oracle-blue">Intelligence.</span>
                    </h1>
                    <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed">
                      Oracle Endpoint is an enterprise-grade execution layer for distributed applications. 
                      Move your logic to the edge with zero cold starts and global state synchronization.
                    </p>
                  </header>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-8 bg-linear-to-br from-zinc-900 to-black rounded-4xl border border-white/5 group hover:border-oracle-blue/20 transition-all">
                      <div className="w-12 h-12 bg-oracle-blue/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Zap className="text-oracle-blue w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold mb-3">Ultra Low Latency</h3>
                      <p className="text-zinc-500 text-sm leading-relaxed">Global execution cores with sub-5ms routing overhead. Your endpoints are deployed as close to users as physically possible.</p>
                    </div>
                    <div className="p-8 bg-linear-to-br from-zinc-900 to-black rounded-4xl border border-white/5 group hover:border-oracle-purple/20 transition-all">
                      <div className="w-12 h-12 bg-oracle-purple/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Shield className="text-oracle-purple w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold mb-3">Immutable Security</h3>
                      <p className="text-zinc-500 text-sm leading-relaxed">Hardware-level encryption for all transit data. Automatic SOC2 compliance inherited by your deployment.</p>
                    </div>
                  </div>

                  <div className="p-10 bg-linear-to-r from-oracle-blue/5 to-transparent border border-oracle-blue/10 rounded-4xl relative overflow-hidden">
                    <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-oracle-blue/5 blur-[100px] rounded-full" />
                    <div className="relative z-10 space-y-6">
                      <h3 className="text-2xl font-black tracking-tight">Enterprise License Active</h3>
                      <p className="text-zinc-400 max-w-lg">You are currently operating under the <strong>{activePurchase?.planName}</strong> protocol. Full access to dedicated hardware clusters and advanced telemetry is now active.</p>
                      <div className="flex gap-4">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">SLA Uptime</span>
                          <span className="text-white font-black text-xl">99.999%</span>
                        </div>
                        <div className="w-px h-10 bg-white/10" />
                        <div className="flex flex-col">
                          <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Nodes Auth</span>
                          <span className="text-white font-black text-xl">Unlimited</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'getting-started' && (
                <div className="space-y-10">
                   <h2 className="text-4xl font-black tracking-tighter uppercase">Initialize Node</h2>
                   
                   <div className="space-y-6">
                     <div className="flex gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center shrink-0 font-black text-oracle-blue">01</div>
                        <div className="space-y-2">
                          <h4 className="text-lg font-bold">Install CLI</h4>
                          <p className="text-zinc-500 text-sm">Download the Oracle binary for your operating system or use npm.</p>
                          <div className="bg-black border border-white/5 rounded-xl p-4 flex items-center justify-between group">
                            <code className="text-oracle-blue text-xs font-mono">npm install -g @oracle-endpoint/cli</code>
                            <button onClick={() => copyToClipboard('npm install -g @oracle-endpoint/cli', 'cli-inst')} className="opacity-0 group-hover:opacity-100 transition-opacity">
                              {copied === 'cli-inst' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                     </div>

                     <div className="flex gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center shrink-0 font-black text-oracle-blue">02</div>
                        <div className="space-y-2">
                          <h4 className="text-lg font-bold">Authenticate Session</h4>
                          <p className="text-zinc-500 text-sm">Link your local environment to your enterprise account.</p>
                          <div className="bg-black border border-white/5 rounded-xl p-4 flex items-center justify-between group">
                            <code className="text-oracle-blue text-xs font-mono">oracle auth login --key oak_live_...</code>
                            <button className="opacity-0 group-hover:opacity-100 transition-opacity"><Copy className="w-4 h-4" /></button>
                          </div>
                        </div>
                     </div>

                     <div className="flex gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center shrink-0 font-black text-oracle-blue">03</div>
                        <div className="space-y-2">
                          <h4 className="text-lg font-bold">Bridge Source Code</h4>
                          <p className="text-zinc-500 text-sm">Synchronize your existing logic with our global distribution network.</p>
                          <div className="bg-black border border-white/5 rounded-xl p-4 flex items-center justify-between group">
                            <code className="text-oracle-blue text-xs font-mono">oracle bridge init</code>
                            <button className="opacity-0 group-hover:opacity-100 transition-opacity"><Copy className="w-4 h-4" /></button>
                          </div>
                        </div>
                     </div>
                   </div>
                </div>
              )}

              {activeTab === 'api-reference' && (
                <div className="space-y-10">
                  <div className="flex items-center justify-between">
                    <h2 className="text-4xl font-black tracking-tighter uppercase">API Reference</h2>
                    <div className="bg-zinc-900 border border-white/10 rounded-lg px-3 py-1 text-[10px] font-mono text-zinc-500">v1.2.0-stable</div>
                  </div>

                  <div className="space-y-8">
                    <section className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black rounded border border-emerald-500/20 uppercase tracking-widest">GET</div>
                        <code className="text-white font-bold text-sm">/v1/telemetry/nodes</code>
                      </div>
                      <p className="text-sm text-zinc-500">Retrieve real-time health data for all active execution nodes in your network.</p>
                      <div className="bg-zinc-900/50 rounded-2xl p-6 border border-white/5 space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 font-mono">Example Payload</p>
                        <pre className="text-xs text-oracle-blue font-mono leading-relaxed">
{`{
  "status": "active",
  "count": 42,
  "nodes": [
    { "id": "node-us-east-1", "load": 0.12, "uptime": "14d 6h" },
    { "id": "node-eu-west-2", "load": 0.45, "uptime": "82d 12h" }
  ]
}`}
                        </pre>
                      </div>
                    </section>
                  </div>
                </div>
              )}

              {activeTab === 'sdk' && (
                <div className="space-y-10">
                   <h2 className="text-4xl font-black tracking-tighter uppercase">SDK Implementation</h2>
                   <p className="text-zinc-500">Our native SDKs use gRPC under the hood for maximum throughput and consistent state management.</p>
                   
                   <div className="bg-black/60 border border-white/5 rounded-3xl overflow-hidden">
                      <div className="bg-zinc-900/80 px-6 py-3 flex items-center justify-between border-b border-white/5">
                        <div className="flex gap-1.5 font-bold text-xs uppercase text-zinc-500">
                          <button className="text-white">Node.js</button>
                          <span className="mx-2 opacity-20">|</span>
                          <button className="hover:text-white transition-colors">Python</button>
                          <span className="mx-2 opacity-20">|</span>
                          <button className="hover:text-white transition-colors">Go</button>
                        </div>
                        <button className="text-zinc-500 hover:text-white transition-colors"><Copy className="w-4 h-4" /></button>
                      </div>
                      <div className="p-8">
                        <pre className="text-sm font-mono leading-relaxed">
                          <code className="text-zinc-400">
<span className="text-oracle-purple">import</span> {'{'} OracleNode {'}'} <span className="text-oracle-purple">from</span> <span className="text-oracle-blue">'@oracle-endpoint/sdk'</span>;<br/><br/>
<span className="text-zinc-600">// Initialize Enterprise Node</span><br/>
<span className="text-oracle-purple">const</span> node = <span className="text-oracle-purple">new</span> OracleNode({'{'}<br/>
{'  '}apiKey: <span className="text-oracle-blue">process.env.ORACLE_KEY</span>,<br/>
{'  '}secureLevel: <span className="text-oracle-blue">'military-grade'</span>,<br/>
{'  '}region: <span className="text-oracle-blue">'auto-optimize'</span><br/>
{'}'});<br/><br/>
<span className="text-zinc-600">// Execute distributed logic</span><br/>
<span className="text-oracle-purple">await</span> node.execute(<span className="text-oracle-purple">async</span> (ctx) ={'>'} {'{'}<br/>
{'  '}ctx.log(<span className="text-oracle-blue">'Scaling sequence initiated...'</span>);<br/>
{'  '}<span className="text-oracle-purple">return</span> <span className="text-oracle-purple">await</span> ctx.db.save({'{'} timestamp: Date.now() {'}'});<br/>
{'}'});
                          </code>
                        </pre>
                      </div>
                   </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <button className="fixed bottom-10 right-10 w-16 h-16 bg-oracle-blue text-black rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50">
          <BookOpen className="w-6 h-6" />
        </button>
      </main>
    </div>
  );
};

export default DocumentationPage;
