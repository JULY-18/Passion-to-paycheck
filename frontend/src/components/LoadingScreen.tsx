import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const loadingPhrases = [
  "Analyzing Market Trends...",
  "Calculating Skill Synergy...",
  "Finalizing Valuation..."
];

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    // Total 3 seconds. Change phrase every 1 second.
    const interval = setInterval(() => {
      setPhraseIndex(prev => {
        if (prev < loadingPhrases.length - 1) return prev + 1;
        return prev;
      });
    }, 1000);

    const timeout = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="loading-container"
    >
      <div className="spinner-wrapper">
        {/* Outer spinning ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="spinner-outer"
        />
        {/* Inner spinning ring (reverse) */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="spinner-inner"
        />
      </div>
      
      <motion.h2 
        key={phraseIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="text-xl font-medium tracking-wide text-center"
      >
        {loadingPhrases[phraseIndex]}
      </motion.h2>
    </motion.div>
  );
}
