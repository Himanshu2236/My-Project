import React, { useState, useEffect } from 'react';
import { 
  ChefHat, 
  Mic, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  Thermometer, 
  Sparkles, 
  Lightbulb, 
  HelpCircle,
  Clock,
  Send,
  PlusCircle,
  Utensils
} from 'lucide-react';
import { queryCookingAssistant } from '../services/api';

export default function CookingAssistant({ recipes }) {
  const [recipeList, setRecipeList] = useState(recipes || []);
  const [selectedRecipe, setSelectedRecipe] = useState(recipes?.[0] || null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [chatQuery, setChatQuery] = useState('');
  const [chatAnswer, setChatAnswer] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoadingChat, setIsLoadingChat] = useState(false);

  useEffect(() => {
    if (recipes && recipes.length > 0) {
      setRecipeList(recipes);
      if (!selectedRecipe) setSelectedRecipe(recipes[0]);
    }
  }, [recipes]);

  // Sync step timer
  useEffect(() => {
    if (selectedRecipe && selectedRecipe.steps[activeStepIndex]) {
      setTimerSeconds(selectedRecipe.steps[activeStepIndex].timer_seconds || 60);
      setIsTimerRunning(false);
    }
  }, [selectedRecipe, activeStepIndex]);

  // Timer countdown
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.value = 650;
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);
        setTimeout(() => osc.stop(), 800);
      } catch (e) {}
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const handleSendQuery = async (queryText) => {
    const text = queryText || chatQuery;
    if (!text) return;
    setIsLoadingChat(true);
    try {
      const res = await queryCookingAssistant({
        query: text,
        current_recipe_id: selectedRecipe?.recipe_id,
        current_step: activeStepIndex + 1
      });
      setChatAnswer(res);

      // If a custom recipe was generated, add it to recipes and activate it
      if (res.matched_recipe && res.matched_recipe.recipe_id.startsWith('custom_')) {
        setRecipeList((prev) => [res.matched_recipe, ...prev.filter(r => r.recipe_id !== res.matched_recipe.recipe_id)]);
        setSelectedRecipe(res.matched_recipe);
        setActiveStepIndex(0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingChat(false);
    }
  };

  const handleVoiceNote = () => {
    if (!isRecording) {
      setIsRecording(true);
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
        const rec = new SpeechRec();
        rec.continuous = false;
        rec.onresult = (e) => {
          const transcript = e.results[0][0].transcript;
          setChatQuery(transcript);
          setIsRecording(false);
          handleSendQuery(transcript);
        };
        rec.onerror = () => setIsRecording(false);
        rec.start();
      } else {
        setTimeout(() => {
          const sample = "I have chicken breast, broccoli, and soy sauce. What recipe can I make?";
          setChatQuery(sample);
          setIsRecording(false);
          handleSendQuery(sample);
        }, 1500);
      }
    } else {
      setIsRecording(false);
    }
  };

  const currentStep = selectedRecipe?.steps[activeStepIndex];
  const formatTimer = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const samplePrompts = [
    "🥘 Make recipe with chicken, garlic & peppers",
    "🥛 Substitute for buttermilk",
    "🌡️ Salmon & steak doneness temps",
    "🥑 Keto low carb alternative for toast"
  ];

  return (
    <div className="cooking-assistant-container">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ChefHat size={24} style={{ color: '#8b5cf6' }} />
            AI Chef Copilot & Custom Culinary Generator
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            Accepts ANY custom question, ingredients from your fridge, or cooking instructions to generate step-by-step guided meals.
          </p>
        </div>

        {/* Recipe Switcher Buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {recipeList?.map((r) => (
            <button
              key={r.recipe_id}
              onClick={() => {
                setSelectedRecipe(r);
                setActiveStepIndex(0);
              }}
              style={{
                background: selectedRecipe?.recipe_id === r.recipe_id ? 'rgba(139, 92, 246, 0.25)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${selectedRecipe?.recipe_id === r.recipe_id ? '#8b5cf6' : 'rgba(255,255,255,0.1)'}`,
                color: selectedRecipe?.recipe_id === r.recipe_id ? '#c4b5fd' : '#cbd5e1',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {r.title}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Prompt Helper Pills */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, alignSelf: 'center' }}>Try Asking:</span>
        {samplePrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => {
              setChatQuery(p.replace(/^[^\s]+\s/, ''));
              handleSendQuery(p.replace(/^[^\s]+\s/, ''));
            }}
            style={{
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.25)',
              color: '#c4b5fd',
              padding: '4px 10px',
              borderRadius: '16px',
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {selectedRecipe && (
        <div className="grid-2col">
          {/* Left: Active Interactive Step & Timer */}
          <div className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span className="badge badge-fresh">
                Step {activeStepIndex + 1} of {selectedRecipe.steps.length}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                {selectedRecipe.cuisine} • {selectedRecipe.difficulty}
              </span>
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'white', marginBottom: '4px' }}>
              {currentStep?.title}
            </h3>
            <p style={{ fontSize: '0.95rem', color: '#cbd5e1', lineHeight: '1.6', margin: '1rem 0' }}>
              {currentStep?.instruction}
            </p>

            {/* Step Timer & Temp Gauge */}
            <div style={{
              background: 'rgba(10, 15, 29, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              margin: '1.5rem 0'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                  Active Step Timer
                </span>
                <div style={{ fontSize: '2.4rem', fontWeight: 900, fontFamily: 'monospace', color: timerSeconds > 0 ? '#10b981' : '#f43f5e' }}>
                  {formatTimer(timerSeconds)}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn-primary"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  style={{ padding: '0.6rem 1.2rem' }}
                >
                  {isTimerRunning ? <Pause size={16} /> : <Play size={16} />}
                  <span>{isTimerRunning ? 'Pause' : 'Start Timer'}</span>
                </button>

                <button
                  className="btn-icon"
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimerSeconds(currentStep?.timer_seconds || 60);
                  }}
                  title="Reset Timer"
                >
                  <RotateCcw size={16} />
                </button>
              </div>
            </div>

            {/* Target Temperature Warning if applicable */}
            {currentStep?.target_temperature_f && (
              <div style={{
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid #f59e0b',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '1rem'
              }}>
                <Thermometer size={20} color="#f59e0b" />
                <span style={{ fontSize: '0.85rem', color: '#fef3c7' }}>
                  Target Internal Doneness: <strong>{currentStep.target_temperature_f}°F</strong> ({Math.round((currentStep.target_temperature_f - 32) * 5/9)}°C)
                </span>
              </div>
            )}

            {/* Chef Pro Tip */}
            {currentStep?.chef_pro_tip && (
              <div style={{
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                padding: '0.85rem 1rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                marginBottom: '1.5rem'
              }}>
                <Lightbulb size={20} color="#8b5cf6" style={{ marginTop: '2px' }} />
                <div>
                  <strong style={{ fontSize: '0.82rem', color: '#c4b5fd', display: 'block' }}>Chef's Secret Technique</strong>
                  <p style={{ fontSize: '0.8rem', color: '#e2e8f0', marginTop: '2px' }}>
                    {currentStep.chef_pro_tip}
                  </p>
                </div>
              </div>
            )}

            {/* Step Navigation Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                className="btn-tool"
                disabled={activeStepIndex === 0}
                onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
              >
                <ArrowLeft size={16} />
                <span>Previous Step</span>
              </button>

              <button
                className="btn-primary"
                disabled={activeStepIndex === selectedRecipe.steps.length - 1}
                onClick={() => setActiveStepIndex((prev) => Math.min(selectedRecipe.steps.length - 1, prev + 1))}
              >
                <span>Next Step</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Right: Ingredients, Substitutions & Voice Chef AI */}
          <div className="glass-card">
            {/* Ask Chef Copilot */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
                <Sparkles size={18} color="#8b5cf6" />
                Ask Any Culinary Question or Enter Ingredients
              </h4>

              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  className="search-input"
                  placeholder={isRecording ? "Listening to custom cooking question..." : "Type ANY custom query: 'Make recipe with chicken & rice', 'Substitute heavy cream'..."}
                  value={chatQuery}
                  onChange={(e) => setChatQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendQuery()}
                />

                <button
                  type="button"
                  className={`btn-tool ${isRecording ? 'recording' : ''}`}
                  onClick={handleVoiceNote}
                  title="Voice dictation"
                >
                  <Mic size={16} />
                </button>

                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => handleSendQuery()}
                  disabled={isLoadingChat}
                >
                  <Send size={16} />
                </button>
              </div>

              {/* Chat Answer Box */}
              {chatAnswer && (
                <div style={{
                  marginTop: '1rem',
                  background: 'rgba(10, 15, 29, 0.8)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  padding: '1rem',
                  borderRadius: '8px'
                }}>
                  <div style={{ fontSize: '0.85rem', color: '#e2e8f0', lineHeight: '1.5', whiteSpace: 'pre-line' }} dangerouslySetInnerHTML={{ __html: chatAnswer.answer.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                  <div style={{ marginTop: '8px', fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Lightbulb size={14} />
                    <span>{chatAnswer.culinary_tip}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Ingredients & Quantities */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'white' }}>
                  Ingredients ({selectedRecipe.servings} Servings):
                </h4>
                <span style={{ fontSize: '0.75rem', color: '#06b6d4' }}>
                  {selectedRecipe.estimated_nutrition.calories} kcal • {selectedRecipe.estimated_nutrition.protein}g Protein
                </span>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {selectedRecipe.ingredients?.map((ing, i) => (
                  <li 
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.82rem',
                      color: '#cbd5e1',
                      background: 'rgba(10, 15, 29, 0.4)',
                      padding: '6px 10px',
                      borderRadius: '6px'
                    }}
                  >
                    <CheckCircle size={14} color="#10b981" />
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Built-in Substitutions */}
            {selectedRecipe.substitutions && Object.keys(selectedRecipe.substitutions).length > 0 && (
              <div style={{ marginTop: '1.5rem', background: 'rgba(16, 185, 129, 0.08)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <h5 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#10b981', fontWeight: 700, marginBottom: '6px' }}>
                  Smart Dietary Substitutions Available:
                </h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.78rem' }}>
                  {Object.entries(selectedRecipe.substitutions).map(([orig, rep], idx) => (
                    <div key={idx} style={{ color: '#cbd5e1' }}>
                      <strong style={{ color: 'white' }}>{orig}:</strong> {rep}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
