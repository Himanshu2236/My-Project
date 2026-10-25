import React, { useState } from 'react';
import { 
  Camera, 
  Upload, 
  Layers, 
  Activity, 
  Sparkles, 
  Check, 
  Flame, 
  ShieldCheck, 
  HelpCircle,
  ArrowRightLeft
} from 'lucide-react';
import { recognizeFood } from '../services/api';

export default function FoodRecognition({ 
  currentDish, 
  setCurrentDish, 
  catalog,
  customKey
}) {
  const [selectedPreset, setSelectedPreset] = useState(currentDish?.dish_name || 'avocado_toast');
  const [isLoading, setIsLoading] = useState(false);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);
  const [previewImage, setPreviewImage] = useState(
    'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80'
  );

  const handleSelectPreset = async (preset) => {
    setSelectedPreset(preset.id);
    setPreviewImage(preset.image_url);
    setIsLoading(true);
    try {
      const res = await recognizeFood({ presetDish: preset.id, customKey });
      setCurrentDish(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviewImage(url);
    setIsLoading(true);
    try {
      const res = await recognizeFood({ imageFile: file, customKey });
      setCurrentDish(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const [customFoodInput, setCustomFoodInput] = useState('');

  const handleCustomFoodSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!customFoodInput.trim()) return;
    setIsLoading(true);
    try {
      const res = await recognizeFood({ customPrompt: customFoodInput, customKey });
      setCurrentDish(res);
      setSelectedPreset('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
    dish_name: "Artisanal Sourdough Avocado Toast with Poached Egg",
    cuisine_type: "Modern Brunch / Californian",
    confidence: 0.96,
    food_category: "Meal",
    ai_engine_used: "FoodVerse-HighRes-VisionEngine",
    ingredients: ["Sourdough Bread", "Ripe Haas Avocado", "Pasture-Raised Poached Egg", "Extra Virgin Olive Oil", "Chili Flakes", "Microgreens"],
    detected_items: [
      { x: 0.15, y: 0.20, width: 0.70, height: 0.60, label: "Avocado Toast", confidence: 0.96 },
      { x: 0.35, y: 0.30, width: 0.30, height: 0.28, label: "Poached Egg", confidence: 0.94 }
    ],
    nutrition: {
      macros: { calories: 385, protein: 14.5, carbohydrates: 34.0, fat: 22.0, saturated_fat: 4.2, fiber: 8.5, sugar: 2.5, sodium: 420 },
      micros: { vitamin_a_pct: 15, vitamin_c_pct: 20, calcium_pct: 8, iron_pct: 14, potassium_mg: 580 },
      health_score: 92,
      nutri_score_grade: "A",
      dietary_suitability: ["Heart-Healthy", "High Fiber", "Mediterranean-friendly"],
      allergens_detected: ["Gluten", "Egg"],
      portion_size: "Standard 1 Serving (approx 320g)",
      actionable_dietitian_tip: "Excellent monounsaturated fat profile from avocado. The fiber helps blunt glucose spikes.",
      recommended_swaps: ["Use gluten-free seed loaf for celiac compliance", "Add hemp seeds for an extra 4g protein"]
    }
  };

  const nutriGrade = dish.nutrition?.nutri_score_grade || 'A';

  return (
    <div className="food-recognition-container">
      {/* Header and Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Camera size={24} style={{ color: '#10b981' }} />
            Computer Vision Food Recognition & Nutrition
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            Multi-tier detection engine identifies dishes, salient regions, ingredients, and comprehensive nutrient profiles.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            className="btn-tool"
            onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
            style={{ borderColor: showBoundingBoxes ? '#10b981' : 'var(--border-color)' }}
          >
            <Layers size={16} color={showBoundingBoxes ? '#10b981' : '#94a3b8'} />
            <span>{showBoundingBoxes ? 'Hide Bounding Boxes' : 'Show Bounding Boxes'}</span>
          </button>

          <label className="btn-primary" style={{ cursor: 'pointer' }}>
            <Upload size={16} />
            <span>Upload Food Photo</span>
            <input 
              type="file" 
              accept="image/*" 
              style={{ display: 'none' }} 
              onChange={handleFileUpload} 
            />
          </label>
        </div>
      </div>

      {/* Preset Dishes Scroller */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, marginBottom: '0.5rem' }}>
          Explore Sample Dishes for Instant AI Audit:
        </h4>
        <div className="preset-grid">
          {(catalog?.dishes || []).map((preset) => (
            <div
              key={preset.id}
              className={`preset-card ${selectedPreset === preset.id ? 'selected' : ''}`}
              onClick={() => handleSelectPreset(preset)}
            >
              <img src={preset.image_url} alt={preset.name} className="preset-img" />
              <div className="preset-details">
                <h5>{preset.name}</h5>
                <p>{preset.cuisine} • {preset.calories} kcal</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Meal Input Bar */}
      <form onSubmit={handleCustomFoodSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', background: 'rgba(17, 25, 45, 0.7)', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
        <input
          type="text"
          className="search-input"
          placeholder="Or type ANY custom meal / ingredients (e.g., 'Scrambled eggs, avocado, sourdough toast', 'Grilled ribeye steak and sweet potato')..."
          value={customFoodInput}
          onChange={(e) => setCustomFoodInput(e.target.value)}
        />
        <button
          type="submit"
          className="btn-primary"
          disabled={isLoading || !customFoodInput.trim()}
          style={{ whiteSpace: 'nowrap' }}
        >
          <Sparkles size={16} />
          <span>Analyze Custom Food</span>
        </button>
      </form>

      {/* Main 2-Column Inspection View */}
      <div className="grid-2col">
        {/* Left: Visual Canvas with Bounding Boxes */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span className="badge badge-fresh">{dish.ai_engine_used}</span>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Confidence: {Math.round(dish.confidence * 100)}%</span>
          </div>

          <div className="bounding-image-container">
            <img src={previewImage} alt="Food analysis preview" className="bounding-image" />
            
            {showBoundingBoxes && dish.detected_items?.map((item, idx) => (
              <div
                key={idx}
                className="bounding-box"
                style={{
                  top: `${item.y * 100}%`,
                  left: `${item.x * 100}%`,
                  width: `${item.width * 100}%`,
                  height: `${item.height * 100}%`,
                }}
              >
                <span className="bounding-label">
                  {item.label} ({Math.round(item.confidence * 100)}%)
                </span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{dish.dish_name}</h3>
            <p style={{ fontSize: '0.85rem', color: '#06b6d4', marginTop: '2px' }}>
              {dish.cuisine_type} • {dish.food_category}
            </p>

            <div style={{ marginTop: '1rem' }}>
              <h5 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, marginBottom: '6px' }}>
                Detected Ingredients:
              </h5>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {dish.ingredients?.map((ing, i) => (
                  <span 
                    key={i} 
                    style={{
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      padding: '3px 8px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      color: '#e2e8f0'
                    }}
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Nutrition Analysis & Nutri-Score */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Flame size={20} color="#f59e0b" />
              Nutritional Breakdown & Health Score
            </h3>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#10b981' }}>
                {dish.nutrition?.health_score}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}> / 100 Health Score</span>
            </div>
          </div>

          {/* NutriScore Strip */}
          <div style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8' }}>
              <span>Nutri-Score Rating</span>
              <span style={{ fontWeight: 700, color: 'white' }}>Grade {nutriGrade}</span>
            </div>
            <div className="nutriscore-strip">
              {['A', 'B', 'C', 'D', 'E'].map((letter) => (
                <div 
                  key={letter}
                  className={`nutriscore-block ns-${letter.toLowerCase()} ${nutriGrade === letter ? 'active' : ''}`}
                >
                  {letter}
                </div>
              ))}
            </div>
          </div>

          {/* Macronutrients Grid */}
          <div className="macro-grid">
            <div className="macro-box calories">
              <div className="macro-label">Energy</div>
              <div className="macro-value">{dish.nutrition?.macros?.calories}</div>
              <div className="macro-unit">kcal</div>
            </div>

            <div className="macro-box protein">
              <div className="macro-label">Protein</div>
              <div className="macro-value" style={{ color: '#06b6d4' }}>{dish.nutrition?.macros?.protein}g</div>
              <div className="macro-unit">31% DV</div>
            </div>

            <div className="macro-box carbs">
              <div className="macro-label">Carbs</div>
              <div className="macro-value" style={{ color: '#f59e0b' }}>{dish.nutrition?.macros?.carbohydrates}g</div>
              <div className="macro-unit">Fiber: {dish.nutrition?.macros?.fiber}g</div>
            </div>

            <div className="macro-box fat">
              <div className="macro-label">Total Fat</div>
              <div className="macro-value" style={{ color: '#f43f5e' }}>{dish.nutrition?.macros?.fat}g</div>
              <div className="macro-unit">Sat: {dish.nutrition?.macros?.saturated_fat}g</div>
            </div>
          </div>

          {/* Micronutrient Progress Bars */}
          <div style={{ marginTop: '1.25rem', background: 'rgba(10, 15, 29, 0.5)', padding: '1rem', borderRadius: '8px' }}>
            <h5 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, marginBottom: '0.75rem' }}>
              Essential Micronutrients & Electrolytes
            </h5>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.8rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                  <span>Vitamin A</span>
                  <span>{dish.nutrition?.micros?.vitamin_a_pct}% DV</span>
                </div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, marginTop: 4 }}>
                  <div style={{ width: `${Math.min(100, dish.nutrition?.micros?.vitamin_a_pct || 0)}%`, height: '100%', background: '#10b981', borderRadius: 2 }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                  <span>Vitamin C</span>
                  <span>{dish.nutrition?.micros?.vitamin_c_pct}% DV</span>
                </div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, marginTop: 4 }}>
                  <div style={{ width: `${Math.min(100, dish.nutrition?.micros?.vitamin_c_pct || 0)}%`, height: '100%', background: '#06b6d4', borderRadius: 2 }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                  <span>Iron</span>
                  <span>{dish.nutrition?.micros?.iron_pct}% DV</span>
                </div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, marginTop: 4 }}>
                  <div style={{ width: `${Math.min(100, dish.nutrition?.micros?.iron_pct || 0)}%`, height: '100%', background: '#f59e0b', borderRadius: 2 }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                  <span>Potassium</span>
                  <span>{dish.nutrition?.micros?.potassium_mg} mg</span>
                </div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, marginTop: 4 }}>
                  <div style={{ width: `${Math.min(100, ((dish.nutrition?.micros?.potassium_mg || 0) / 1000) * 100)}%`, height: '100%', background: '#8b5cf6', borderRadius: 2 }} />
                </div>
              </div>
            </div>
          </div>

          {/* Actionable Dietitian Tip */}
          <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: 700, fontSize: '0.85rem' }}>
              <ShieldCheck size={16} />
              <span>Certified Dietitian Guidance</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#e2e8f0', marginTop: '4px', lineHeight: '1.4' }}>
              {dish.nutrition?.actionable_dietitian_tip}
            </p>
          </div>

          {/* Recommended Swaps */}
          {dish.nutrition?.recommended_swaps?.length > 0 && (
            <div style={{ marginTop: '1rem', padding: '0.85rem', background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.25)', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#06b6d4', fontWeight: 700, fontSize: '0.8rem' }}>
                <ArrowRightLeft size={14} />
                <span>Smart Macro Optimization Swaps</span>
              </div>
              <ul style={{ paddingLeft: '1.2rem', marginTop: '4px', fontSize: '0.78rem', color: '#cbd5e1' }}>
                {dish.nutrition.recommended_swaps.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
