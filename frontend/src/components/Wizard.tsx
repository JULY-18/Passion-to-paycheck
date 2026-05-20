import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check, TrendingUp } from 'lucide-react';
import LoadingScreen from './LoadingScreen';
import Dashboard from './Dashboard';

const STEPS = 4;

export default function Wizard() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [liveLpa, setLiveLpa] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  interface WizardData {
    Age: number;
    Formal_Academic_Score_Normalized: number;
    Months_Formal_Experience: number;
    Months_Gig_Or_Freelance_Experience: number;
    Logical_Reasoning_Score: number;
    Communication_Fluency_Score: number;
    Basic_Software_Proficiency: number;
    Advanced_Software_Proficiency: number;
    Generative_AI_Familiarity: number;
  }

  const [data, setData] = useState<WizardData>({
    Age: 25,
    Formal_Academic_Score_Normalized: 75.0,
    Months_Formal_Experience: 24,
    Months_Gig_Or_Freelance_Experience: 12,
    Logical_Reasoning_Score: 5,
    Communication_Fluency_Score: 5,
    Basic_Software_Proficiency: 5,
    Advanced_Software_Proficiency: 5,
    Generative_AI_Familiarity: 5
  });

  // Fetch prediction on every data change
  useEffect(() => {
    const fetchPrediction = async () => {
      setIsUpdating(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const res = await fetch(`${apiUrl}/predict`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const result = await res.json();
        if (result.predicted_lpa) {
          setLiveLpa(result.predicted_lpa);
        }
      } catch (err) {
        console.error("Live Tracker API Error", err);
      } finally {
        setIsUpdating(false);
      }
    };
    
    // Add a small delay to prevent spamming the API if clicking fast
    const timeoutId = setTimeout(() => fetchPrediction(), 300);
    return () => clearTimeout(timeoutId);
  }, [data]);

  const updateData = (field: keyof WizardData, value: number) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (step < STEPS) {
      setDirection(1);
      setStep(s => s + 1);
    } else {
      setLoading(true);
      // Final submit just sets the prediction to trigger the Dashboard
      setTimeout(() => setPrediction(liveLpa || 8.45), 1000); 
    }
  };

  const prevStep = () => {
    setDirection(-1);
    setStep(s => s - 1);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 30 : -30,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 30 : -30,
      opacity: 0,
    })
  };

  const OptionCard = ({ label, value, current, onChange, description = "" }: any) => {
    const isSelected = current === value;
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onChange(value)}
        className={`p-5 rounded-xl border cursor-pointer transition-all ${
          isSelected 
            ? 'border-[var(--primary)] bg-[rgba(126,34,206,0.15)] shadow-[0_0_15px_var(--primary-glow)]' 
            : 'border-[var(--card-border)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.05)]'
        }`}
      >
        <div className="flex justify-between items-center mb-1">
          <span className={`font-semibold text-lg ${isSelected ? 'text-[var(--primary)]' : 'text-white'}`}>
            {label}
          </span>
          {isSelected && <Check size={20} className="text-[var(--primary)]" />}
        </div>
        {description && <p className="text-sm text-muted">{description}</p>}
      </motion.div>
    );
  };

  if (loading && prediction === null) {
    return <LoadingScreen onComplete={() => {}} />;
  }

  if (prediction !== null) {
    return <Dashboard prediction={prediction} data={data} />;
  }

  return (
    <div className="wizard-container relative w-full pt-16">
      
      {/* Top Progress Bar */}
      <div className="absolute top-8 left-4 right-4 flex gap-2 max-w-[calc(66%-2rem)]">
        {Array.from({ length: STEPS }).map((_, i) => (
          <div 
            key={i} 
            className={`h-1.5 rounded-full transition-all duration-500 ${step >= i + 1 ? 'flex-grow' : 'w-12'}`}
            style={{ backgroundColor: step >= i + 1 ? 'var(--primary)' : 'rgba(255,255,255,0.2)' }}
          />
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-8 w-full h-full items-start">
        
        {/* Left Side: Questions */}
        <div className="w-full md:w-2/3 h-full flex flex-col relative min-h-[60vh]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
              className="w-full"
            >
              {step === 1 && (
                <div>
                  <h2 className="heading-lg mb-2">Basic Details</h2>
                  <p className="text-muted mb-8">Tell us a bit about yourself.</p>
                  
                  <div className="mb-8">
                    <label className="font-medium mb-3 block">What is your age range?</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <OptionCard label="Under 22" value={20} current={data.Age} onChange={(v: number) => updateData('Age', v)} />
                      <OptionCard label="22 - 26" value={24} current={data.Age} onChange={(v: number) => updateData('Age', v)} />
                      <OptionCard label="27 - 32" value={29} current={data.Age} onChange={(v: number) => updateData('Age', v)} />
                      <OptionCard label="33+" value={35} current={data.Age} onChange={(v: number) => updateData('Age', v)} />
                    </div>
                  </div>

                  <div>
                    <label className="font-medium mb-3 block">How was your academic performance?</label>
                    <div className="grid grid-cols-1 gap-4">
                      <OptionCard label="Average" description="Consistent but not top of the class" value={60.0} current={data.Formal_Academic_Score_Normalized} onChange={(v: number) => updateData('Formal_Academic_Score_Normalized', v)} />
                      <OptionCard label="Above Average" description="Strong grades throughout" value={75.0} current={data.Formal_Academic_Score_Normalized} onChange={(v: number) => updateData('Formal_Academic_Score_Normalized', v)} />
                      <OptionCard label="Excellent" description="Top percentile, honors" value={90.0} current={data.Formal_Academic_Score_Normalized} onChange={(v: number) => updateData('Formal_Academic_Score_Normalized', v)} />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="heading-lg mb-2">Your Experience</h2>
                  <p className="text-muted mb-8">How long have you been working?</p>
                  
                  <div className="mb-8">
                    <label className="font-medium mb-3 block">Formal Work Experience</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <OptionCard label="Fresher" value={0} current={data.Months_Formal_Experience} onChange={(v: number) => updateData('Months_Formal_Experience', v)} />
                      <OptionCard label="1-2 Years" value={18} current={data.Months_Formal_Experience} onChange={(v: number) => updateData('Months_Formal_Experience', v)} />
                      <OptionCard label="3-5 Years" value={48} current={data.Months_Formal_Experience} onChange={(v: number) => updateData('Months_Formal_Experience', v)} />
                      <OptionCard label="5+ Years" value={84} current={data.Months_Formal_Experience} onChange={(v: number) => updateData('Months_Formal_Experience', v)} />
                    </div>
                  </div>

                  <div>
                    <label className="font-medium mb-3 block">Freelance / Side Gig Experience</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <OptionCard label="None" value={0} current={data.Months_Gig_Or_Freelance_Experience} onChange={(v: number) => updateData('Months_Gig_Or_Freelance_Experience', v)} />
                      <OptionCard label="Under 1 Year" value={6} current={data.Months_Gig_Or_Freelance_Experience} onChange={(v: number) => updateData('Months_Gig_Or_Freelance_Experience', v)} />
                      <OptionCard label="1-3 Years" value={24} current={data.Months_Gig_Or_Freelance_Experience} onChange={(v: number) => updateData('Months_Gig_Or_Freelance_Experience', v)} />
                      <OptionCard label="3+ Years" value={48} current={data.Months_Gig_Or_Freelance_Experience} onChange={(v: number) => updateData('Months_Gig_Or_Freelance_Experience', v)} />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="heading-lg mb-2">Core Skills</h2>
                  <p className="text-muted mb-8">How would you rate your soft skills?</p>
                  
                  <div className="mb-8">
                    <label className="font-medium mb-3 block">Logical Reasoning & Problem Solving</label>
                    <div className="grid grid-cols-1 gap-3">
                      <OptionCard label="Needs Improvement" value={3} current={data.Logical_Reasoning_Score} onChange={(v: number) => updateData('Logical_Reasoning_Score', v)} />
                      <OptionCard label="Solid" description="Can solve most standard problems" value={6} current={data.Logical_Reasoning_Score} onChange={(v: number) => updateData('Logical_Reasoning_Score', v)} />
                      <OptionCard label="Exceptional" description="Quickly adapts to complex challenges" value={9} current={data.Logical_Reasoning_Score} onChange={(v: number) => updateData('Logical_Reasoning_Score', v)} />
                    </div>
                  </div>

                  <div>
                    <label className="font-medium mb-3 block">Communication Fluency</label>
                    <div className="grid grid-cols-1 gap-3">
                      <OptionCard label="Introverted" value={3} current={data.Communication_Fluency_Score} onChange={(v: number) => updateData('Communication_Fluency_Score', v)} />
                      <OptionCard label="Clear & Concise" value={6} current={data.Communication_Fluency_Score} onChange={(v: number) => updateData('Communication_Fluency_Score', v)} />
                      <OptionCard label="Highly Persuasive" description="Excellent at public speaking and negotiation" value={9} current={data.Communication_Fluency_Score} onChange={(v: number) => updateData('Communication_Fluency_Score', v)} />
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div>
                  <h2 className="heading-lg mb-2">Technical Arsenal</h2>
                  <p className="text-muted mb-8">What is your proficiency with technology?</p>
                  
                  <div className="mb-6">
                    <label className="font-medium mb-3 block">Basic Software (Office, Tools)</label>
                    <div className="grid grid-cols-3 gap-3">
                      <OptionCard label="Basic" value={3} current={data.Basic_Software_Proficiency} onChange={(v: number) => updateData('Basic_Software_Proficiency', v)} />
                      <OptionCard label="Good" value={6} current={data.Basic_Software_Proficiency} onChange={(v: number) => updateData('Basic_Software_Proficiency', v)} />
                      <OptionCard label="Pro" value={9} current={data.Basic_Software_Proficiency} onChange={(v: number) => updateData('Basic_Software_Proficiency', v)} />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="font-medium mb-3 block">Advanced Software (Code, Specialized)</label>
                    <div className="grid grid-cols-3 gap-3">
                      <OptionCard label="Basic" value={3} current={data.Advanced_Software_Proficiency} onChange={(v: number) => updateData('Advanced_Software_Proficiency', v)} />
                      <OptionCard label="Good" value={6} current={data.Advanced_Software_Proficiency} onChange={(v: number) => updateData('Advanced_Software_Proficiency', v)} />
                      <OptionCard label="Pro" value={9} current={data.Advanced_Software_Proficiency} onChange={(v: number) => updateData('Advanced_Software_Proficiency', v)} />
                    </div>
                  </div>

                  <div>
                    <label className="font-medium mb-3 block">Generative AI Familiarity</label>
                    <div className="grid grid-cols-3 gap-3">
                      <OptionCard label="Basic" value={3} current={data.Generative_AI_Familiarity} onChange={(v: number) => updateData('Generative_AI_Familiarity', v)} />
                      <OptionCard label="Good" value={6} current={data.Generative_AI_Familiarity} onChange={(v: number) => updateData('Generative_AI_Familiarity', v)} />
                      <OptionCard label="Pro" value={9} current={data.Generative_AI_Familiarity} onChange={(v: number) => updateData('Generative_AI_Familiarity', v)} />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-auto pt-8 z-10 w-full">
            {step > 1 ? (
              <button 
                onClick={prevStep}
                className="flex items-center gap-2 text-muted hover:text-white transition-colors py-2 px-4 rounded-lg hover:bg-[rgba(255,255,255,0.05)]"
              >
                <ChevronLeft size={20} /> Back
              </button>
            ) : <div />}
            
            <button 
              onClick={nextStep}
              className="btn-primary flex items-center gap-2 px-8"
            >
              {step === STEPS ? 'See Final Breakdown' : 'Continue'} <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Right Side: Live Tracker Panel */}
        <div className="w-full md:w-1/3 mt-8 md:mt-0 sticky top-24">
          <motion.div 
            className="glass p-8 relative overflow-hidden"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Subtle glowing orb inside the card */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary)] rounded-full filter blur-[80px] opacity-20 pointer-events-none" />
            
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="text-[var(--secondary)]" size={24} />
              <h3 className="text-lg font-bold text-white tracking-wide uppercase">Live Tracker</h3>
            </div>
            
            <p className="text-muted text-sm mb-2">Estimated Market Value</p>
            <div className="flex items-end gap-2">
              <span className={`text-5xl font-black transition-all duration-300 ${isUpdating ? 'opacity-50 blur-[2px]' : 'opacity-100 glowing-text text-gradient'}`}>
                {liveLpa ? `₹${liveLpa}` : '...'}
              </span>
              <span className="text-xl text-muted font-bold mb-1">LPA</span>
            </div>

            <div className="mt-8 pt-6 border-t border-[var(--card-border)]">
              <p className="text-sm text-muted leading-relaxed">
                As you answer the questions on the left, our AI model instantly recalculates your worth in real-time.
              </p>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
