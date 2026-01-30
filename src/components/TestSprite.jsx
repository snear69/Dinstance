import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const TestSprite = () => {
  const { user, token, isAuthenticated } = useAuth();
  const [showDetails, setShowDetails] = useState(false);
  
  const API_URL = import.meta.env.VITE_API_URL || 'https://oracle-backend-zy42.onrender.com/api';

  const handleForceUnlock = () => {
    localStorage.setItem('force_unlock_docs', 'true');
    alert('✅ Force unlock enabled! Go to /downloads and refresh the page.');
  };

  const handleClearUnlock = () => {
    localStorage.removeItem('force_unlock_docs');
    alert('🔒 Force unlock disabled.');
  };

  const isForceUnlocked = localStorage.getItem('force_unlock_docs') === 'true';

  return (
    <div className="fixed top-24 left-6 z-[99999]">
      <div 
        onClick={() => setShowDetails(!showDetails)}
        className="bg-red-600 text-white px-4 py-2 rounded-full font-black animate-pulse shadow-2xl cursor-pointer hover:scale-110 transition-transform flex items-center gap-2"
      >
        <div className="w-2 h-2 bg-white rounded-full animate-ping" />
        RENDER DEBUG {showDetails ? '▲' : '▼'}
      </div>

      {showDetails && (
        <div className="mt-4 bg-zinc-900/95 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl w-80 text-xs font-mono space-y-4">
          <div>
            <p className="text-zinc-500 uppercase font-black mb-1">API Endpoint</p>
            <p className="text-oracle-blue truncate">{API_URL}</p>
          </div>
          
          <div>
            <p className="text-zinc-500 uppercase font-black mb-1">Auth Status</p>
            <p className={isAuthenticated ? 'text-green-400' : 'text-red-400'}>
              {isAuthenticated ? 'AUTHENTICATED' : 'NOT LOGGED IN'}
            </p>
          </div>

          {user && (
            <div>
              <p className="text-zinc-500 uppercase font-black mb-1">User Context</p>
              <p className="text-white">Name: {user.name}</p>
              <p className="text-white truncate">Email: {user.email}</p>
            </div>
          )}

          <div>
            <p className="text-zinc-500 uppercase font-black mb-1">Token</p>
            <p className="text-zinc-400 break-all">
              {token ? `${token.substring(0, 20)}...` : 'MISSING'}
            </p>
          </div>

          <div className="pt-2 border-t border-white/5 space-y-2">
            <p className="text-zinc-500 uppercase font-black mb-2">Force Unlock</p>
            <p className={`text-xs mb-2 ${isForceUnlocked ? 'text-green-400' : 'text-zinc-600'}`}>
              Status: {isForceUnlocked ? '✅ UNLOCKED' : '🔒 LOCKED'}
            </p>
            <button
              onClick={handleForceUnlock}
              className="w-full py-2 bg-green-500 hover:bg-green-600 text-black font-bold rounded-lg transition-all text-xs"
            >
              🔓 FORCE UNLOCK DOCS
            </button>
            <button
              onClick={handleClearUnlock}
              className="w-full py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-all text-xs"
            >
              🔒 CLEAR UNLOCK
            </button>
          </div>

          <div className="pt-2 border-t border-white/5">
            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Debug Mode Active</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestSprite;
