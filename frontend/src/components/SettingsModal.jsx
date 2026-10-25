import React, { useState } from 'react';
import { Settings, X, Key, Cpu, ShieldCheck, Check } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose, customKey, setCustomKey }) {
  const [apiKey, setApiKey] = useState(customKey || '');
  const [visionMode, setVisionMode] = useState('hybrid');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setCustomKey(apiKey);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Settings size={20} color="#10b981" />
            <h3>FoodVerse AI Engine Configuration</h3>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <Key size={16} color="#06b6d4" />
              Google Gemini API Key (Optional)
            </label>
            <input
              type="password"
              className="search-input"
              placeholder="Enter AIzaSy... or leave empty to use built-in neural vision"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px', display: 'block' }}>
              Enables cloud Gemini 2.5 Multimodal reasoning. If blank, FoodVerse uses high-performance offline Edge Vision & Heuristics.
            </span>
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <Cpu size={16} color="#10b981" />
              Multimodal Processing Architecture
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div 
                onClick={() => setVisionMode('hybrid')}
                style={{
                  border: `1px solid ${visionMode === 'hybrid' ? '#10b981' : 'rgba(255,255,255,0.1)'}`,
                  background: visionMode === 'hybrid' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(10, 15, 29, 0.5)',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                <strong style={{ fontSize: '0.85rem', color: 'white', display: 'block' }}>Hybrid Cloud + Edge</strong>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Gemini with edge fallback</span>
              </div>

              <div 
                onClick={() => setVisionMode('local')}
                style={{
                  border: `1px solid ${visionMode === 'local' ? '#10b981' : 'rgba(255,255,255,0.1)'}`,
                  background: visionMode === 'local' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(10, 15, 29, 0.5)',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                <strong style={{ fontSize: '0.85rem', color: 'white', display: 'block' }}>Offline Edge Neural</strong>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Zero latency, zero network cost</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button className="btn-tool" onClick={onClose}>
              Cancel
            </button>
            <button className="btn-primary" onClick={handleSave}>
              {savedSuccess ? <Check size={16} /> : <ShieldCheck size={16} />}
              <span>{savedSuccess ? 'Saved!' : 'Save Configuration'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
