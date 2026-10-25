import React from 'react';
import { 
  UtensilsCrossed, 
  Sparkles, 
  Camera, 
  ShieldCheck, 
  Video, 
  ChefHat, 
  CalendarRange, 
  FileText, 
  Settings,
  Layers
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenSettings, onOpenReport }) {
  const tabs = [
    { id: 'overview', label: 'Multimodal Hub', icon: Sparkles },
    { id: 'recognition', label: 'Food & Nutrition', icon: Camera },
    { id: 'freshness', label: 'Freshness AI', icon: ShieldCheck },
    { id: 'hygiene', label: 'Kitchen Hygiene', icon: Video },
    { id: 'cooking', label: 'Chef Copilot', icon: ChefHat },
    { id: 'mealplan', label: 'Meal Planner', icon: CalendarRange },
  ];

  return (
    <nav className="navbar">
      <div className="nav-brand" onClick={() => setActiveTab('overview')}>
        <div className="brand-icon">
          <UtensilsCrossed size={20} />
        </div>
        <div>
          <span className="brand-title">FoodVerse</span>
        </div>
        <span className="brand-badge">Multimodal AI 2.0</span>
      </div>

      <div className="nav-links">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="nav-actions">
        <button 
          className="btn-icon" 
          title="Engine Configuration & API Keys"
          onClick={onOpenSettings}
        >
          <Settings size={18} />
        </button>

        <button 
          className="btn-report"
          onClick={onOpenReport}
        >
          <FileText size={16} />
          <span>Executive Report</span>
        </button>
      </div>
    </nav>
  );
}
