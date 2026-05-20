'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Wizard from '../components/Wizard';
import { ChevronRight } from 'lucide-react';

export default function Home() {
  const [started, setStarted] = useState(false);

  return (
    <main className="main-container">
      {/* Background glowing orbs for subtle aesthetics */}
      <div className="orb orb-purple opacity-60" />
      <div className="orb orb-cyan opacity-60" />

      <AnimatePresence mode="wait">
        {!started ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="container text-center flex flex-col items-center hero-content z-10"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-block px-4 py-1.5 rounded-full border border-[var(--primary)] bg-[rgba(126,34,206,0.1)] text-[var(--primary)] text-sm font-semibold mb-8 tracking-wide uppercase"
            >
              AI-Powered Valuation
            </motion.div>
            
            <motion.h1 
              className="heading-xl text-white mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Know Your <span className="text-gradient">True Worth</span>
            </motion.h1>
            
            <motion.p 
              className="text-muted mb-12 text-lg max-w-md mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Answer a few simple questions about your experience and skills, and our AI model will predict your expected market salary.
            </motion.p>
            
            <motion.button
              onClick={() => setStarted(true)}
              className="btn-primary flex items-center gap-2 mx-auto px-8 py-4 text-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              Start Valuation <ChevronRight size={24} />
            </motion.button>
          </motion.div>
        ) : (
          <Wizard key="wizard" />
        )}
      </AnimatePresence>
    </main>
  );
}
