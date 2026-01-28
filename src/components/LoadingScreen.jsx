import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu } from 'lucide-react';

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsVisible(false), 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 150);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-oracle-dark flex flex-col items-center justify-center"
        >
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-oracle-blue/10 blur-[120px] rounded-full" />
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative z-10 flex flex-col items-center"
          >
            <div className="relative mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-4 border-2 border-dashed border-oracle-blue/20 rounded-full"
              />
              <div className="w-20 h-20 glass rounded-3xl flex items-center justify-center border-oracle-blue/30 shadow-[0_0_30px_rgba(0,186,255,0.2)]">
                <Cpu className="text-oracle-blue w-10 h-10 animate-pulse" />
              </div>
            </div>

            <h2 className="text-2xl font-bold tracking-tighter mb-2">
              ORACLE <span className="text-oracle-blue">ENDPOINT</span>
            </h2>
            
            <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden mt-4">
              <motion.div
                className="h-full bg-oracle-blue shadow-[0_0_10px_#00baff]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
            
            <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 mt-4 font-bold">
              Initializing Infrastructure... {Math.round(progress)}%
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
