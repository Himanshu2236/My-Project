import React, { useState } from 'react';
import { 
  CalendarRange, 
  User, 
  Sparkles, 
  ShoppingCart, 
  Activity, 
  Flame, 
  Check, 
  CheckSquare, 
  Square,
  Clock,
  Heart
} from 'lucide-react';
import { generateMealPlan } from '../services/api';

export default function MealPlanner({ initialPlan }) {
  const [profile, setProfile] = useState({
    name: "Alex Morgan",
    age: 28,
    gender: "Non-binary",
    weight_kg: 68.0,
    height_cm: 175.0,
    activity_level: "Moderately Active",
    goal: "Maintenance & Vitality",
    diet_type: "Balanced Mediterranean",
    target_calories: 2100,
    allergies: []
  });

  const [mealPlan, setMealPlan] = useState(initialPlan || null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});

  const handleGenerate = async (e) => {
    e?.preventDefault();
    setIsLoading(true);
    try {
      const res = await generateMealPlan(profile);
      setMealPlan(res);
      setSelectedDayIndex(0);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCheck = (item) => {
    setCheckedItems((prev) => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  const currentDay = mealPlan?.weekly_plan?.[selectedDayIndex] || null;

  return (
    <div className="meal-planner-container">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CalendarRange size={24} style={{ color: '#10b981' }} />
            Personalized Adaptive Meal Planner & Grocery Engine
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            BMR & TDEE calculated nutrition architecture adapted to your personal goals, diet types, and bio-energetics.
          </p>
        </div>

        <button 
          className="btn-primary"
          onClick={handleGenerate}
          disabled={isLoading}
        >
          <Sparkles size={16} />
          <span>{isLoading ? 'Optimizing Plan...' : 'Generate Adaptive 7-Day Plan'}</span>
        </button>
      </div>

      {/* User Profile Form Bar */}
      <form onSubmit={handleGenerate} className="glass-card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1rem' }}>
          <User size={16} />
          User Biometric & Dietary Parameters
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Name</label>
            <input 
              type="text" 
              className="search-input" 
              value={profile.name} 
              onChange={(e) => setProfile({ ...profile, name: e.target.value })} 
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Goal</label>
            <select 
              className="search-input" 
              value={profile.goal}
              onChange={(e) => setProfile({ ...profile, goal: e.target.value })}
            >
              <option value="Weight Loss">Weight Loss (Caloric Deficit)</option>
              <option value="Muscle Gain">Muscle Gain (Hypertrophy)</option>
              <option value="Maintenance & Vitality">Maintenance & Vitality</option>
              <option value="Endurance">Endurance & Athletic Recovery</option>
              <option value="Longevity">Longevity & Heart Health</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Diet Type</label>
            <select 
              className="search-input" 
              value={profile.diet_type}
              onChange={(e) => setProfile({ ...profile, diet_type: e.target.value })}
            >
              <option value="Balanced Mediterranean">Balanced Mediterranean</option>
              <option value="High Protein">High Protein</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Vegan">Vegan (Plant-Based)</option>
              <option value="Keto">Keto (Ketogenic)</option>
              <option value="Low Carb">Low Carb</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Activity Level</label>
            <select 
              className="search-input" 
              value={profile.activity_level}
              onChange={(e) => setProfile({ ...profile, activity_level: e.target.value })}
            >
              <option value="Sedentary">Sedentary (Desk work)</option>
              <option value="Light">Light (1-2x/week)</option>
              <option value="Moderately Active">Moderately Active (3-5x/week)</option>
              <option value="Very Active">Very Active (6-7x/week)</option>
              <option value="Athlete">Elite Athlete / Heavy training</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Weight & Height</label>
            <div style={{ display: 'flex', gap: '6px' }}>
              <input 
                type="number" 
                className="search-input" 
                placeholder="Weight kg"
                value={profile.weight_kg} 
                onChange={(e) => setProfile({ ...profile, weight_kg: parseFloat(e.target.value) || 68 })} 
              />
              <input 
                type="number" 
                className="search-input" 
                placeholder="Height cm"
                value={profile.height_cm} 
                onChange={(e) => setProfile({ ...profile, height_cm: parseFloat(e.target.value) || 175 })} 
              />
            </div>
          </div>
        </div>
      </form>

      {/* Calculated Energetics Banner */}
      {mealPlan && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.15))',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '12px',
          padding: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#cbd5e1', textTransform: 'uppercase', fontWeight: 700 }}>
              Bioenergetic Target
            </span>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'white' }}>
              {mealPlan.calculated_tdee} <span style={{ fontSize: '0.9rem', color: '#10b981' }}>kcal / day</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Basal Metabolic Rate: {mealPlan.calculated_bmr} kcal • Goal: {profile.goal}
            </div>
          </div>

          <p style={{ maxWidth: '650px', fontSize: '0.82rem', color: '#e2e8f0', lineHeight: '1.45' }}>
            {mealPlan.nutritionist_summary}
          </p>
        </div>
      )}

      {/* Day Selector Pills */}
      {mealPlan && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem', overflowX: 'auto', paddingBottom: '4px' }}>
          {mealPlan.weekly_plan?.map((day, idx) => (
            <button
              key={day.day}
              onClick={() => setSelectedDayIndex(idx)}
              style={{
                background: selectedDayIndex === idx ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255,255,255,0.06)',
                border: `1px solid ${selectedDayIndex === idx ? '#10b981' : 'rgba(255,255,255,0.1)'}`,
                color: selectedDayIndex === idx ? 'white' : '#cbd5e1',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {day.day} ({day.total_calories} kcal)
            </button>
          ))}
        </div>
      )}

      {/* 2-Column: Day's Meals & Grocery List */}
      <div className="grid-2col">
        {/* Left: 4 Meals of Selected Day */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
              {currentDay?.day} Nutritional Schedule
            </h3>
            <span style={{ fontSize: '0.85rem', color: '#06b6d4', fontWeight: 700 }}>
              {currentDay?.total_calories} kcal | {currentDay?.total_protein}g Protein
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {currentDay?.meals?.map((m, i) => (
              <div 
                key={i}
                style={{
                  background: 'rgba(10, 15, 29, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '1rem',
                  borderRadius: '10px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    fontWeight: 800,
                    color: m.meal_type === 'Breakfast' ? '#f59e0b' : (m.meal_type === 'Lunch' ? '#10b981' : (m.meal_type === 'Dinner' ? '#06b6d4' : '#8b5cf6')),
                    background: 'rgba(255,255,255,0.06)',
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}>
                    {m.meal_type}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} />
                    {m.prep_time_minutes} min prep
                  </span>
                </div>

                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'white', marginTop: '6px' }}>
                  {m.dish_name}
                </h4>

                <div style={{ display: 'flex', gap: '12px', fontSize: '0.78rem', color: '#cbd5e1', marginTop: '6px' }}>
                  <span><strong>{m.calories}</strong> kcal</span>
                  <span><strong>{m.protein_g}g</strong> Protein</span>
                  <span><strong>{m.carbs_g}g</strong> Carbs</span>
                  <span><strong>{m.fat_g}g</strong> Fat</span>
                </div>

                <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' }}>
                  {m.health_benefit}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Smart Grocery Shopping List */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingCart size={20} color="#06b6d4" />
              Weekly Smart Grocery Checklist
            </h3>
            <span className="badge badge-fresh">Auto-Generated</span>
          </div>

          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1rem' }}>
            Interactive checklist categorized by aisle. Tap items to check them off as you shop.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {mealPlan?.grocery_shopping_list && Object.entries(mealPlan.grocery_shopping_list).map(([category, items]) => (
              <div key={category} style={{ background: 'rgba(10, 15, 29, 0.4)', padding: '0.9rem', borderRadius: '8px' }}>
                <h5 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#10b981', fontWeight: 800, marginBottom: '6px' }}>
                  {category}
                </h5>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {items.map((item, idx) => {
                    const isChecked = checkedItems[item];
                    return (
                      <div 
                        key={idx}
                        onClick={() => toggleCheck(item)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '0.82rem',
                          color: isChecked ? '#64748b' : '#e2e8f0',
                          textDecoration: isChecked ? 'line-through' : 'none',
                          cursor: 'pointer'
                        }}
                      >
                        {isChecked ? (
                          <CheckSquare size={16} color="#10b981" />
                        ) : (
                          <Square size={16} color="#94a3b8" />
                        )}
                        <span>{item}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
