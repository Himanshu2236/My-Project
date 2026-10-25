import React, { useState } from 'react';
import { 
  Sparkles, 
  Flame, 
  ShieldAlert, 
  Activity, 
  Mic, 
  Upload, 
  Video, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Zap, 
  Info, 
  Check,
  UtensilsCrossed,
  Clock,
  ShieldCheck,
  Tag
} from 'lucide-react';

export default function OverviewDashboard({ 
  onRunSession, 
  latestReport, 
  isLoading,
  setActiveTab
}) {
  const [promptText, setPromptText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedPreset, setSelectedPreset] = useState('avocado_toast');
  const [analysisRanAt, setAnalysisRanAt] = useState(null);

  // Web Speech API voice capture
  const handleToggleVoice = () => {
    if (!isRecording) {
      setIsRecording(true);
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
        const rec = new SpeechRec();
        rec.continuous = false;
        rec.interimResults = false;
        rec.onresult = (e) => {
          const transcript = e.results[0][0].transcript;
          setPromptText(transcript);
          setIsRecording(false);
          // Auto run on voice command
          handleRun(transcript, null);
        };
        rec.onerror = () => setIsRecording(false);
        rec.start();
      } else {
        setTimeout(() => {
          const sample = "Analyze meal with 3 eggs, spinach, and mushrooms";
          setPromptText(sample);
          setIsRecording(false);
          handleRun(sample, null);
        }, 1500);
      }
    } else {
      setIsRecording(false);
    }
  };

  const handleRun = async (customPrompt, presetId) => {
    const textToRun = customPrompt !== undefined ? customPrompt : promptText;
    const isCustomText = Boolean(textToRun && textToRun.trim().length > 0);

    await onRunSession({
      textPrompt: textToRun,
      imageFile: selectedFile,
      videoFile: selectedVideo,
      presetDish: isCustomText ? null : (presetId || selectedPreset)
    });
    setAnalysisRanAt(new Date().toLocaleTimeString());
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    handleRun();
  };

  const handleSelectPreset = (presetId) => {
    setSelectedPreset(presetId);
    setPromptText('');
    handleRun('', presetId);
  };

  const quickPresets = [
    { id: 'avocado_toast', name: 'Avocado Toast & Egg', tag: 'Brunch Scan', icon: '🥑' },
    { id: 'grilled_salmon', name: 'Wild Salmon & Quinoa', tag: 'High Protein', icon: '🐟' },
    { id: 'mediterranean_salad', name: 'Greek Mezze Salad', tag: 'Mediterranean', icon: '🥗' },
    { id: 'chicken_biryani', name: 'Dum Chicken Biryani', tag: 'Energy Balanced', icon: '🍗' },
  ];

  const currentDish = latestReport?.dish_recognition;
  const currentFreshness = latestReport?.freshness_assessment;
  const currentHygiene = latestReport?.hygiene_assessment;

  return (
    <div className="overview-container">
      {/* KPI Metrics */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <Activity size={24} />
          </div>
          <div className="kpi-info">
            <h4>Health Index</h4>
            <div className="kpi-value">
              {currentDish?.nutrition?.health_score || 92}
              <span style={{ fontSize: '0.9rem', color: '#10b981', marginLeft: '6px' }}>/ 100</span>
            </div>
            <div className="kpi-sub">Nutri-Score Grade {currentDish?.nutrition?.nutri_score_grade || 'A'}</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}>
            <Flame size={24} />
          </div>
          <div className="kpi-info">
            <h4>Calories</h4>
            <div className="kpi-value">
              {currentDish?.nutrition?.macros?.calories || 385}
              <span style={{ fontSize: '0.9rem', color: '#94a3b8', marginLeft: '6px' }}>kcal</span>
            </div>
            <div className="kpi-sub">{currentDish?.nutrition?.macros?.protein || 14.5}g Protein • {currentDish?.nutrition?.macros?.carbohydrates || 34}g Carbs</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
            <CheckCircle2 size={24} />
          </div>
          <div className="kpi-info">
            <h4>Produce Freshness</h4>
            <div className="kpi-value" style={{ color: currentFreshness?.freshness_status === 'Fresh' ? '#10b981' : '#f59e0b' }}>
              {currentFreshness?.freshness_status || 'Fresh'}
            </div>
            <div className="kpi-sub">
              {currentFreshness?.shelf_life_remaining_hours || 96} Hours shelf-life remaining
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}>
            <ShieldAlert size={24} />
          </div>
          <div className="kpi-info">
            <h4>Kitchen Hygiene</h4>
            <div className="kpi-value" style={{ color: '#38bdf8' }}>
              Grade {currentHygiene?.safety_grade || 'A+'}
            </div>
            <div className="kpi-sub">
              {currentHygiene?.compliance_score || 97}% HACCP Compliance
            </div>
          </div>
        </div>
      </div>

      {/* Multimodal Command Terminal */}
      <div className="multimodal-action-bar">
        <div className="bar-header">
          <div className="bar-title">
            <Sparkles size={20} style={{ color: '#10b981' }} />
            <span>Multimodal Food Intelligence Engine</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            Enter ANY custom dish/ingredients, speak a voice note, or pick a preset
          </span>
        </div>

        <form onSubmit={handleSubmit} className="bar-inputs">
          <input
            type="text"
            className="search-input"
            placeholder={isRecording ? "Listening to your voice..." : "Type ANY custom food or prompt (e.g., '3 eggs, spinach, mushrooms', 'Salmon with quinoa', 'Chicken rice bowl')..."}
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
          />

          <button
            type="button"
            className={`btn-tool ${isRecording ? 'recording' : ''}`}
            onClick={handleToggleVoice}
            title="Audio voice note or speech input"
          >
            <Mic size={16} />
            <span>{isRecording ? 'Listening...' : 'Voice Note'}</span>
          </button>

          <label className="btn-tool" title="Upload food photo">
            <Upload size={16} />
            <span>{selectedFile ? 'Image Loaded' : 'Upload Image'}</span>
            <input 
              type="file" 
              accept="image/*" 
              style={{ display: 'none' }} 
              onChange={(e) => {
                if (e.target.files[0]) {
                  setSelectedFile(e.target.files[0]);
                }
              }}
            />
          </label>

          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
          >
            <Zap size={16} />
            <span>{isLoading ? 'Analyzing...' : 'Run Analysis'}</span>
          </button>
        </form>

        {/* Quick Presets row */}
        <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Quick Presets:</span>
          {quickPresets.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleSelectPreset(p.id)}
              style={{
                background: selectedPreset === p.id && !promptText ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${selectedPreset === p.id && !promptText ? '#10b981' : 'rgba(255,255,255,0.1)'}`,
                color: selectedPreset === p.id && !promptText ? '#10b981' : '#cbd5e1',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.2s'
              }}
            >
              <span>{p.icon}</span>
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* PROMINENT LIVE ANALYSIS RESULTS CARD */}
      {currentDish && (
        <div className="glass-card" style={{ marginBottom: '2rem', border: '1px solid rgba(16, 185, 129, 0.4)', background: 'linear-gradient(135deg, rgba(23, 33, 56, 0.9), rgba(17, 25, 45, 0.95))' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'linear-gradient(135deg, #10b981, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <UtensilsCrossed size={22} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'white' }}>{currentDish.dish_name}</h3>
                  <span className="badge badge-fresh">Active Analysis</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#06b6d4', marginTop: '2px' }}>
                  {currentDish.cuisine_type} • Engine: {currentDish.ai_engine_used}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#10b981' }}>
                  {currentDish.nutrition?.health_score} <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>/ 100</span>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>Nutri-Score Grade <strong>{currentDish.nutrition?.nutri_score_grade}</strong></span>
              </div>
              <button 
                className="btn-primary"
                style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                onClick={() => setActiveTab('recognition')}
              >
                <span>Full Nutrition View</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Macro Gauges Strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ background: 'rgba(10, 15, 29, 0.7)', padding: '0.85rem', borderRadius: '8px', borderLeft: '3px solid #10b981', textAlign: 'center' }}>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Calories</span>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'white' }}>{currentDish.nutrition?.macros?.calories} <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>kcal</span></div>
            </div>

            <div style={{ background: 'rgba(10, 15, 29, 0.7)', padding: '0.85rem', borderRadius: '8px', borderLeft: '3px solid #06b6d4', textAlign: 'center' }}>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Protein</span>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#06b6d4' }}>{currentDish.nutrition?.macros?.protein}g</div>
            </div>

            <div style={{ background: 'rgba(10, 15, 29, 0.7)', padding: '0.85rem', borderRadius: '8px', borderLeft: '3px solid #f59e0b', textAlign: 'center' }}>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Carbohydrates</span>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#f59e0b' }}>{currentDish.nutrition?.macros?.carbohydrates}g</div>
            </div>

            <div style={{ background: 'rgba(10, 15, 29, 0.7)', padding: '0.85rem', borderRadius: '8px', borderLeft: '3px solid #f43f5e', textAlign: 'center' }}>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Total Fat</span>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#f43f5e' }}>{currentDish.nutrition?.macros?.fat}g</div>
            </div>

            <div style={{ background: 'rgba(10, 15, 29, 0.7)', padding: '0.85rem', borderRadius: '8px', borderLeft: '3px solid #8b5cf6', textAlign: 'center' }}>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Freshness</span>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#10b981' }}>{currentFreshness?.freshness_status || 'Fresh'}</div>
            </div>

            <div style={{ background: 'rgba(10, 15, 29, 0.7)', padding: '0.85rem', borderRadius: '8px', borderLeft: '3px solid #38bdf8', textAlign: 'center' }}>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Kitchen HACCP</span>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#38bdf8' }}>Grade {currentHygiene?.safety_grade || 'A+'}</div>
            </div>
          </div>

          {/* Ingredients & Dietitian Strategy Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', background: 'rgba(10, 15, 29, 0.5)', padding: '1rem', borderRadius: '8px' }}>
            <div>
              <h5 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#10b981', fontWeight: 800, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Tag size={14} />
                Detected Ingredients:
              </h5>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {currentDish.ingredients?.map((ing, i) => (
                  <span 
                    key={i} 
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      padding: '3px 9px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      color: '#e2e8f0',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h5 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#06b6d4', fontWeight: 800, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={14} />
                Dietitian Guidance & Strategy:
              </h5>
              <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: '1.45' }}>
                {currentDish.nutrition?.actionable_dietitian_tip}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Real-time Insights & Platform Highlights */}
      <div className="grid-2col">
        {/* Left: Latest Actionable AI Insights */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={18} style={{ color: '#10b981' }} />
              Actionable AI Insights & Recommendations
            </h3>
            <span className="badge badge-fresh">Live Stream</span>
          </div>

          {latestReport?.health_and_safety_alert && (
            <div style={{
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid #f43f5e',
              padding: '0.85rem 1rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <AlertTriangle size={20} color="#f43f5e" />
              <span style={{ fontSize: '0.85rem', color: '#fecdd3' }}>
                {latestReport.health_and_safety_alert}
              </span>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {latestReport?.actionable_ai_takeaways?.map((takeaway, idx) => (
              <div 
                key={idx}
                style={{
                  background: 'rgba(10, 15, 29, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '0.85rem',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  lineHeight: '1.45',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px'
                }}
              >
                <div style={{ color: '#10b981', marginTop: '2px' }}>
                  <CheckCircle2 size={16} />
                </div>
                <div dangerouslySetInnerHTML={{ __html: takeaway.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
              </div>
            )) || (
              <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                Run an analysis or select a preset to generate personalized actionable guidance.
              </p>
            )}
          </div>

          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Dietary Profile Alignment: {latestReport?.dietary_alignment_note || 'Standard balanced macronutrients.'}
            </span>
            <button 
              className="btn-icon"
              style={{ width: 'auto', padding: '0 12px', fontSize: '0.75rem', gap: '4px' }}
              onClick={() => setActiveTab('recognition')}
            >
              <span>Deep View</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Right: Capability Navigator */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} style={{ color: '#06b6d4' }} />
            Active FoodVerse AI Engines
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.9rem',
                background: 'rgba(10, 15, 29, 0.5)',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.06)',
                cursor: 'pointer'
              }}
              onClick={() => setActiveTab('recognition')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  🥗
                </div>
                <div>
                  <h5 style={{ fontSize: '0.9rem', color: 'white' }}>Computer Vision Food Recognition</h5>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Detects ingredients, dish classification, and bounding regions</p>
                </div>
              </div>
              <ArrowRight size={16} color="#64748b" />
            </div>

            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.9rem',
                background: 'rgba(10, 15, 29, 0.5)',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.06)',
                cursor: 'pointer'
              }}
              onClick={() => setActiveTab('freshness')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  🔬
                </div>
                <div>
                  <h5 style={{ fontSize: '0.9rem', color: 'white' }}>Freshness & Spoilage Classifier</h5>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Browning index, surface texture variance, and mold spotting</p>
                </div>
              </div>
              <ArrowRight size={16} color="#64748b" />
            </div>

            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.9rem',
                background: 'rgba(10, 15, 29, 0.5)',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.06)',
                cursor: 'pointer'
              }}
              onClick={() => setActiveTab('hygiene')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(6, 182, 212, 0.2)', color: '#06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  📹
                </div>
                <div>
                  <h5 style={{ fontSize: '0.9rem', color: 'white' }}>Restaurant Kitchen Video Hygiene</h5>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Glove compliance, hair-caps, cross-contact and HACCP audits</p>
                </div>
              </div>
              <ArrowRight size={16} color="#64748b" />
            </div>

            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.9rem',
                background: 'rgba(10, 15, 29, 0.5)',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.06)',
                cursor: 'pointer'
              }}
              onClick={() => setActiveTab('cooking')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(139, 92, 246, 0.2)', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  👨‍🍳
                </div>
                <div>
                  <h5 style={{ fontSize: '0.9rem', color: 'white' }}>AI Chef & Interactive Sous-Chef</h5>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Guided voice cooking steps, timers, and smart substitution</p>
                </div>
              </div>
              <ArrowRight size={16} color="#64748b" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
