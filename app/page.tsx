'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import trnslate from './components/trnslate.json'
import { 
  User, Phone, Calendar, Stethoscope, 
  Star, MessageSquare, CheckCircle2, 
  ChevronRight, ChevronLeft, Building2,
  AlertCircle, X
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utility: Tailwind Merge ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Confetti Component ---
const Confetti = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-50">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: -20, x: Math.random() * 100 - 50 + "%", opacity: 1 }}
          animate={{ y: "120vh", x: Math.random() * 100 - 50 + "%", rotate: 360 }}
          transition={{ duration: Math.random() * 2 + 2, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-1/2 w-3 h-3 bg-teal-500 rounded-full opacity-0"
          style={{ backgroundColor: ['#2dd4bf', '#3b82f6', '#f472b6', '#fbbf24'][i % 4] }}
        />
      ))}
    </div>
  );
};

// --- Toast Notification Component ---
type ToastType = { message: string; type: 'error' | 'success'; id: number };

const ToastContainer = ({ toasts, removeToast }: { toasts: ToastType[], removeToast: (id: number) => void }) => (
  <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
    <AnimatePresence>
      {toasts.map((toast) => (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          className={cn(
            "pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border backdrop-blur-md min-w-[300px]",
            toast.type === 'error' ? "bg-red-50/90 border-red-200 text-red-700" : "bg-emerald-50/90 border-emerald-200 text-emerald-700"
          )}
        >
          {toast.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
          <p className="text-sm font-medium flex-1">{toast.message}</p>
          <button onClick={() => removeToast(toast.id)} className="hover:bg-black/5 p-1 rounded-full transition-colors">
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

// --- Translations ---
const TRANSLATIONS = trnslate;

type Language = 'en' | 'hi' | 'as';
type FormData = {
  patientName: string;
  age: string;
  gender: string;
  phoneNumber: string;
  department: string;
  ratings: Record<string, number>;
  comments: string;
};

// --- Components ---

const StepLanguage = ({ lang, setLang, onNext, t }: any) => (
  <div className="flex flex-col gap-4 py-8 animate-in fade-in duration-500">
    <h3 className="text-xl font-medium text-center text-slate-600 mb-6">{t.selectLang}</h3>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {[
        { code: 'en', label: 'English', sub: 'English' },
        { code: 'as', label: 'অসমীয়া', sub: 'Assamese' },
        { code: 'hi', label: 'हिन्दी', sub: 'Hindi' }
      ].map((item) => (
        <button
          key={item.code}
          onClick={() => {
            setLang(item.code);
            onNext();
          }}
          className={cn(
            "group relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 active:scale-95",
            lang === item.code 
              ? "border-teal-500 bg-teal-50 text-teal-700 shadow-lg shadow-teal-100" 
              : "border-slate-100 bg-white hover:border-teal-200 text-slate-600 hover:shadow-md"
          )}
        >
          <span className="text-2xl font-bold">{item.label}</span>
          <span className="text-xs text-slate-400 mt-2 uppercase tracking-wider font-semibold">{item.sub}</span>
          {lang === item.code && (
            <div className="absolute top-3 right-3 text-teal-500">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          )}
        </button>
      ))}
    </div>
  </div>
);

const StepInfo = ({ formData, updateField, errors, t }: { formData: FormData, updateField: any, errors: any, t: any }) => {
  const departments = [
    "emergency", "cardiology", "orthopedics", "radiology", 
    "pediatrics", "oncology", "neurology", "general-medicine", 
    "surgery", "obstetrics-gynecology", "other"
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Name */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <User className="w-4 h-4 text-teal-500" /> {t.fields.name} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.patientName}
            onChange={(e) => updateField('patientName', e.target.value)}
            className={cn(
              "w-full p-3.5 rounded-xl border focus:ring-2 focus:border-transparent outline-none transition-all font-medium",
              errors.patientName 
                ? "border-red-300 bg-red-50 focus:ring-red-200 text-red-900" 
                : "border-slate-200 bg-slate-50 focus:bg-white focus:ring-teal-500"
            )}
            placeholder="..."
          />
          {errors.patientName && <p className="text-xs text-red-500 font-medium ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.patientName}</p>}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <Phone className="w-4 h-4 text-teal-500" /> {t.fields.phone} <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => updateField('phoneNumber', e.target.value)}
            className={cn(
              "w-full p-3.5 rounded-xl border focus:ring-2 outline-none transition-all font-medium",
              errors.phoneNumber 
                ? "border-red-300 bg-red-50 focus:ring-red-200 text-red-900" 
                : "border-slate-200 bg-slate-50 focus:bg-white focus:ring-teal-500"
            )}
            placeholder="9876543210"
            maxLength={10}
          />
          {errors.phoneNumber && <p className="text-xs text-red-500 font-medium ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.phoneNumber}</p>}
        </div>

        {/* Age */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-teal-500" /> {t.fields.age}
          </label>
          <input
            type="number"
            min="1" max="120"
            value={formData.age}
            onChange={(e) => updateField('age', e.target.value)}
            className="w-full p-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none transition-all bg-slate-50 focus:bg-white font-medium"
          />
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <User className="w-4 h-4 text-teal-500" /> {t.fields.gender}
          </label>
          <div className="relative">
            <select
              value={formData.gender}
              onChange={(e) => updateField('gender', e.target.value)}
              className="w-full p-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none bg-slate-50 focus:bg-white appearance-none font-medium cursor-pointer"
            >
              <option value="">{t.fields.genderOptions.select}</option>
              <option value="male">{t.fields.genderOptions.male}</option>
              <option value="female">{t.fields.genderOptions.female}</option>
              <option value="other">{t.fields.genderOptions.other}</option>
            </select>
            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Department - Grid Selection */}
      <div className="space-y-3">
        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-teal-500" /> {t.fields.department} <span className="text-red-500">*</span>
        </label>
        
        <div className={cn(
          "bg-slate-50 p-4 rounded-xl border max-h-[180px] overflow-y-auto custom-scrollbar transition-colors",
          errors.department ? "border-red-300 bg-red-50/50" : "border-slate-200"
        )}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {departments.map(dept => (
              <button
                key={dept}
                onClick={() => updateField('department', dept)}
                className={cn(
                  "p-2.5 text-sm font-medium rounded-lg border transition-all text-left truncate capitalize flex items-center justify-between group",
                  formData.department === dept
                    ? "bg-teal-500 text-white border-teal-600 shadow-md ring-2 ring-teal-200"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-white hover:border-teal-300 hover:shadow-sm"
                )}
              >
                {dept.replace('-', ' ')}
                {formData.department === dept && <CheckCircle2 className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>
        {errors.department && <p className="text-xs text-red-500 font-medium ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.department}</p>}
      </div>
    </div>
  );
};

// --- Single Rating Row Component ---
const RatingRow = ({ labelKey, labelText, currentRating, updateRating, t }: any) => {
  const [hoverRating, setHoverRating] = useState(0);

  // Helper to determine color based on rating (1=Red, 5=Green)
  const getColor = (val: number) => {
    if (val === 0) return "text-slate-200";
    if (val <= 2) return "fill-red-400 text-red-400";
    if (val === 3) return "fill-amber-400 text-amber-400";
    return "fill-emerald-400 text-emerald-400";
  };
  
  const getLabelColor = (val: number) => {
    if (val <= 2) return "text-red-600 bg-red-50 border-red-100";
    if (val === 3) return "text-amber-600 bg-amber-50 border-amber-100";
    return "text-emerald-600 bg-emerald-50 border-emerald-100";
  }

  const activeVal = hoverRating || currentRating;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
    >
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <p className="text-sm font-bold text-slate-700">{labelText}</p>
          <AnimatePresence mode='wait'>
            {activeVal > 0 && (
              <motion.span 
                key={activeVal}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={cn(
                  "text-xs font-bold px-2.5 py-1 rounded-full border",
                  getLabelColor(activeVal)
                )}
              >
                {t.ratingLabels[activeVal - 1]}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        
        <div className="flex items-center justify-between sm:justify-start sm:gap-4 bg-slate-50/50 p-2 rounded-xl border border-slate-100/50">
          <div className="flex gap-2" onMouseLeave={() => setHoverRating(0)}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => updateRating(labelKey, star)}
                onMouseEnter={() => setHoverRating(star)}
                className="focus:outline-none transition-transform active:scale-90 relative p-1"
              >
                <Star
                  className={cn(
                    "w-8 h-8 sm:w-9 sm:h-9 transition-all duration-200",
                    star <= (hoverRating || currentRating)
                      ? `${getColor(hoverRating || currentRating)} drop-shadow-sm`
                      : "text-slate-200 hover:text-slate-300"
                  )}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const StepRatings = ({ formData, updateRating, t }: any) => {
  return (
    <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-2 custom-scrollbar pb-4">
      {Object.entries(t.ratings).map(([key, label], idx) => (
        <RatingRow 
          key={key}
          labelKey={key}
          labelText={label}
          currentRating={(formData.ratings as any)[key] || 0}
          updateRating={updateRating}
          t={t}
        />
      ))}
    </div>
  );
};

const StepComments = ({ formData, updateField, t }: any) => (
  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-2xl border border-blue-100 flex gap-4 items-start">
      <div className="bg-white p-2 rounded-full shadow-sm">
        <MessageSquare className="w-6 h-6 text-blue-500" />
      </div>
      <div>
        <h4 className="font-bold text-blue-800 text-sm mb-1">{t.title}</h4>
        <p className="text-blue-600 text-sm leading-relaxed">{t.subtitle}</p>
      </div>
    </div>
    
    <div className="space-y-2">
      <label className="block text-sm font-bold text-slate-700 ml-1">
        {t.comments.label}
      </label>
      <textarea
        rows={6}
        placeholder={t.comments.placeholder}
        value={formData.comments}
        onChange={(e) => updateField('comments', e.target.value)}
        className="w-full p-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none bg-slate-50 focus:bg-white shadow-inner transition-all text-slate-700 font-medium"
      />
    </div>
  </div>
);

const StepSuccess = ({ t }: any) => (
  <div className="text-center py-10 flex flex-col items-center justify-center relative overflow-hidden">
    <Confetti />
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="w-28 h-28 bg-gradient-to-tr from-green-100 to-emerald-200 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-green-100"
    >
      <CheckCircle2 className="w-14 h-14 text-green-600" />
    </motion.div>
    <h2 className="text-3xl font-extrabold text-slate-800 mb-3">{t.success.title}</h2>
    <p className="text-slate-500 max-w-xs mx-auto text-lg leading-relaxed">{t.success.message}</p>
    
    <button 
      onClick={() => window.location.reload()}
      className="mt-10 px-8 py-3 bg-slate-900 text-white rounded-full hover:bg-slate-800 hover:shadow-lg hover:-translate-y-1 transition-all text-sm font-bold tracking-wide"
    >
      Submit Another Response
    </button>
  </div>
);

// --- Main Application Component ---
export default function PatientFeedbackSystem() {
  const [step, setStep] = useState(1);
  const [lang, setLang] = useState<Language>('en');
  const [direction, setDirection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toasts, setToasts] = useState<ToastType[]>([]);
  
  // Validation State
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form State
  const [formData, setFormData] = useState<FormData>({
    patientName: '',
    age: '',
    gender: '',
    phoneNumber: '',
    department: '',
    ratings: {
      overallSatisfaction: 0,
      staffInteraction: 0,
      waitTimes: 0,
      facilityCleanliness: 0,
      treatmentQuality: 0,
      communication: 0,
    },
    comments: ''
  });

  const t = TRANSLATIONS[lang];
  const totalSteps = 5;

  // Toast Helpers
  const addToast = (message: string, type: 'error' | 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { message, type, id }]);
    setTimeout(() => removeToast(id), 3000);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // State Updates
  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const updateRating = (key: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      ratings: { ...prev.ratings, [key]: value }
    }));
  };

  // Validation Logic
  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (currentStep === 2) {
      if (!formData.patientName.trim()) {
        newErrors.patientName = t.errors.nameRequired;
        isValid = false;
      }
      
      if (!formData.phoneNumber.trim()) {
        newErrors.phoneNumber = t.errors.invalidPhone;
        isValid = false;
      } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/[- ]/g, ''))) {
        newErrors.phoneNumber = t.errors.invalidPhone;
        isValid = false;
      }
      
      if (!formData.department) {
        newErrors.department = t.errors.deptRequired;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (!validateStep(step)) {
      addToast(t.errors.fillRequired, 'error');
      return;
    }
    
    // Step 3 Validation (Ratings) - Warn if empty but allow skip? Or enforce?
    // Enforcing at least one rating here for demonstration
    if (step === 3) {
      const hasRating = Object.values(formData.ratings).some(r => r > 0);
      if (!hasRating) {
         addToast("Please provide at least one rating.", 'error');
         return;
      }
    }

    setDirection(1);
    setStep(prev => Math.min(prev + 1, totalSteps));
  };

  const handleBack = () => {
    setDirection(-1);
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
      try {
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        language: lang,
        submittedAt: new Date().toISOString(),
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to submit feedback");
    }

    setDirection(1);
    setStep(5);
    addToast("Feedback submitted successfully!", "success");

  } catch (err) {
    addToast("Something went wrong. Please try again.", "error");
  } finally {
    setIsSubmitting(false);
    }

  };

  // Animation Variants
  const variants = {
    enter: (direction: number) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction < 0 ? 50 : -50, opacity: 0 }),
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center p-4 font-sans selection:bg-teal-100">
      
      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>

      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-white">
        
        {/* Header Section */}
        <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500 rounded-full blur-3xl opacity-20 translate-x-1/3 -translate-y-1/3"></div>
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">{t.title}</h1>
              <p className="text-slate-300 text-sm font-medium opacity-90">{t.subtitle}</p>
            </div>
            {step > 1 && step < 5 && (
              <div className="bg-white/10 border border-white/20 px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-md">
                {step} / 4
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {step < 5 && (
          <div className="h-1.5 bg-slate-100 w-full relative">
            <motion.div 
              className="h-full bg-teal-500 absolute top-0 left-0"
              initial={{ width: 0 }}
              animate={{ width: `${((step - 1) / 3) * 100}%` }}
              transition={{ duration: 0.5, ease: "circOut" }}
            />
          </div>
        )}

        {/* Form Body */}
        <div className="p-6 md:p-10 min-h-[480px] flex flex-col relative">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="flex-grow"
            >
              {step === 1 && <StepLanguage lang={lang} setLang={setLang} onNext={() => {setDirection(1); setStep(2)}} t={t} />}
              {step === 2 && <StepInfo formData={formData} updateField={updateField} errors={errors} t={t} />}
              {step === 3 && <StepRatings formData={formData} updateRating={updateRating} t={t} />}
              {step === 4 && <StepComments formData={formData} updateField={updateField} t={t} />}
              {step === 5 && <StepSuccess t={t} />}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          {step < 5 && (
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-100">
              {step > 1 ? (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold px-4 py-2 rounded-lg hover:bg-slate-50 text-sm"
                >
                  <ChevronLeft className="w-4 h-4" /> {t.back}
                </button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <button
                  onClick={handleNext}
                  className="bg-teal-600 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-teal-500/20 hover:bg-teal-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 text-sm"
                >
                  {t.next} <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-slate-900/20 hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {t.submit} <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}