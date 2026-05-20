import { motion } from 'framer-motion';
import { Download, Share2, ArrowRight } from 'lucide-react';

interface DashboardProps {
  prediction: number;
  data: any;
}

export default function Dashboard({ prediction, data }: DashboardProps) {
  // Extract a few stats to show as a breakdown
  const stats = [
    { label: "Logic", value: data.Logical_Reasoning_Score, max: 10 },
    { label: "Communication", value: data.Communication_Fluency_Score, max: 10 },
    { label: "Software", value: data.Basic_Software_Proficiency, max: 10 },
    { label: "AI Familiarity", value: data.Generative_AI_Familiarity, max: 10 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="wizard-container items-center"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-8"
      >
        <h2 className="text-muted text-xl uppercase tracking-widest mb-4">Estimated Market Value</h2>
        <div className="flex items-end justify-center gap-2">
          <span className="text-6xl font-black glowing-text text-gradient">₹{prediction}</span>
          <span className="text-2xl text-muted mb-2 font-bold">LPA</span>
        </div>
      </motion.div>

      <motion.div 
        className="glass w-full p-8 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-lg font-bold mb-6 text-center">Skill Synergy Breakdown</h3>
        <div className="flex flex-col gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="w-full">
              <div className="flex justify-between mb-1 text-sm text-muted">
                <span>{stat.label}</span>
                <span>{stat.value} / {stat.max}</span>
              </div>
              <div className="w-full h-2 bg-[var(--bg-color)] rounded-full overflow-hidden border border-[var(--card-border)]">
                <motion.div 
                  className="h-full bg-gradient-to-r from-[var(--secondary)] to-[var(--primary)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${(stat.value / stat.max) * 100}%` }}
                  transition={{ delay: 0.6 + (idx * 0.1), duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div 
        className="flex gap-4 w-full justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <button className="glass p-3 rounded-full hover:bg-[rgba(255,255,255,0.1)] transition-colors">
          <Share2 size={20} />
        </button>
        <button className="glass p-3 rounded-full hover:bg-[rgba(255,255,255,0.1)] transition-colors">
          <Download size={20} />
        </button>
        <button 
          onClick={() => window.location.reload()}
          className="btn-primary ml-auto flex items-center gap-2 px-6"
        >
          Retake <ArrowRight size={18} />
        </button>
      </motion.div>
    </motion.div>
  );
}
