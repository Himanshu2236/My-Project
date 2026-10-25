import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import OverviewDashboard from './components/OverviewDashboard';
import FoodRecognition from './components/FoodRecognition';
import FreshnessDetector from './components/FreshnessDetector';
import HygieneMonitor from './components/HygieneMonitor';
import CookingAssistant from './components/CookingAssistant';
import MealPlanner from './components/MealPlanner';
import SettingsModal from './components/SettingsModal';
import ExecutiveReportModal from './components/ExecutiveReportModal';
import { 
  fetchSampleData, 
  fetchRecipes, 
  fetchCatalog, 
  processUnifiedSession,
  generateMealPlan 
} from './services/api';
import './styles/app.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sampleData, setSampleData] = useState(null);
  const [catalog, setCatalog] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [currentDish, setCurrentDish] = useState(null);
  const [currentFreshness, setCurrentFreshness] = useState(null);
  const [currentHygiene, setCurrentHygiene] = useState(null);
  const [initialMealPlan, setInitialMealPlan] = useState(null);
  const [latestReport, setLatestReport] = useState(null);
  const [customKey, setCustomKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Initial load
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [sampleRes, catRes, recRes] = await Promise.all([
          fetchSampleData().catch(() => null),
          fetchCatalog().catch(() => null),
          fetchRecipes().catch(() => [])
        ]);

        if (sampleRes) setSampleData(sampleRes);
        if (catRes) setCatalog(catRes);
        if (recRes) setRecipes(recRes);

        // Run default baseline multimodal session
        const initReport = await processUnifiedSession({
          presetDish: 'avocado_toast',
          presetScenario: 'michelin_clean',
          textPrompt: 'Baseline food intelligence inspection'
        });
        setLatestReport(initReport);
        if (initReport.dish_recognition) setCurrentDish(initReport.dish_recognition);
        if (initReport.freshness_assessment) setCurrentFreshness(initReport.freshness_assessment);
        if (initReport.hygiene_assessment) setCurrentHygiene(initReport.hygiene_assessment);

        // Initial meal plan
        const plan = await generateMealPlan({
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
        setInitialMealPlan(plan);
      } catch (err) {
        console.error("Initialization error:", err);
      }
    }
    loadInitialData();
  }, []);

  const handleRunSession = async (params) => {
    setIsLoading(true);
    try {
      const report = await processUnifiedSession({
        ...params,
        customKey
      });
      setLatestReport(report);
      if (report.dish_recognition) setCurrentDish(report.dish_recognition);
      if (report.freshness_assessment) setCurrentFreshness(report.freshness_assessment);
      if (report.hygiene_assessment) setCurrentHygiene(report.hygiene_assessment);
    } catch (err) {
      console.error("Multimodal session error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenReport={() => setIsReportOpen(true)}
      />

      <main className="main-content">
        {activeTab === 'overview' && (
          <OverviewDashboard
            onRunSession={handleRunSession}
            latestReport={latestReport}
            isLoading={isLoading}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'recognition' && (
          <FoodRecognition
            currentDish={currentDish}
            setCurrentDish={setCurrentDish}
            catalog={catalog || { dishes: sampleData?.dishes || [] }}
            customKey={customKey}
          />
        )}

        {activeTab === 'freshness' && (
          <FreshnessDetector
            currentFreshness={currentFreshness}
            setCurrentFreshness={setCurrentFreshness}
            samples={sampleData?.freshness_samples || []}
          />
        )}

        {activeTab === 'hygiene' && (
          <HygieneMonitor
            currentHygiene={currentHygiene}
            setCurrentHygiene={setCurrentHygiene}
            scenarios={sampleData?.hygiene_scenarios || []}
          />
        )}

        {activeTab === 'cooking' && (
          <CookingAssistant
            recipes={recipes}
          />
        )}

        {activeTab === 'mealplan' && (
          <MealPlanner
            initialPlan={initialMealPlan}
          />
        )}
      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        customKey={customKey}
        setCustomKey={setCustomKey}
      />

      <ExecutiveReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        report={latestReport}
      />
    </div>
  );
}
