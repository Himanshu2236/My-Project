import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Upload, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Thermometer, 
  Sparkles,
  Info
} from 'lucide-react';
import { analyzeFreshness } from '../services/api';

export default function FreshnessDetector({ 
  currentFreshness, 
  setCurrentFreshness, 
  samples 
}) {
  const [selectedSample, setSelectedSample] = useState(samples?.[0]?.id || 'fresh_avocado');
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(
    'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800&auto=format&fit=crop&q=80'
  );

  const handleSelectPreset = async (sample) => {
    setSelectedSample(sample.id);
    setPreviewImage(sample.image_url);
    setIsLoading(true);
    try {
      const res = await analyzeFreshness({ presetKey: sample.id });
      setCurrentFreshness(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreviewImage(URL.createObjectURL(file));
    setIsLoading(true);
    try {
      const res = await analyzeFreshness({ imageFile: file, itemName: file.name });
      setCurrentFreshness(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const freshness = currentFreshness || {
    item_name: "Peak Fresh Hass Avocado",
    freshness_status: "Fresh",
    confidence: 0.97,
    shelf_life_remaining_hours: 96,
    visual_metrics: {
      browning_index: 8.2,
      surface_texture_variance: 12.4,
      color_saturation_loss: 5.1,
      discoloration_spots_detected: 0,
      moisture_retention_index: 91.5
    },
    safety_verdict: "Safe to Consume (Optimal Peak Flavor)",
    storage_recommendations: [
      "Store at cool room temperature (18-20°C) until ready to slice.",
      "Once cut, brush with lemon juice and seal in an airtight container to block polyphenol oxidase."
    ],
    risk_factors: ["None detected - firm skin and uniform pigment density."],
    actionable_guidance: "Ideal ripeness for raw preparations, guacamole, or artisanal toasts."
  };

  const getStatusBadge = (status) => {
    if (status === 'Fresh') {
      return (
        <span className="badge badge-fresh">
          <CheckCircle size={14} /> Fresh (Optimal)
        </span>
      );
    } else if (status === 'Moderately Fresh') {
      return (
        <span className="badge badge-moderate">
          <AlertTriangle size={14} /> Moderately Fresh
        </span>
      );
    } else {
      return (
        <span className="badge badge-spoiled">
          <XCircle size={14} /> Spoiled (Discard)
        </span>
      );
    }
  };

  return (
    <div className="freshness-container">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={24} style={{ color: '#10b981' }} />
            AI Food Freshness & Spoilage Inspector
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            Analyzes color degradation, surface browning, cellular texture variance, and mold spotting to classify freshness.
          </p>
        </div>

        <label className="btn-primary" style={{ cursor: 'pointer' }}>
          <Upload size={16} />
          <span>Upload Food Sample</span>
          <input 
            type="file" 
            accept="image/*" 
            style={{ display: 'none' }} 
            onChange={handleFileUpload} 
          />
        </label>
      </div>

      {/* Preset Samples */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, marginBottom: '0.5rem' }}>
          Test Scenarios & Calibration Standards:
        </h4>
        <div className="preset-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
          {(samples || []).map((s) => (
            <div
              key={s.id}
              className={`preset-card ${selectedSample === s.id ? 'selected' : ''}`}
              onClick={() => handleSelectPreset(s)}
            >
              <img src={s.image_url} alt={s.name} className="preset-img" />
              <div className="preset-details">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h5>{s.name}</h5>
                  {getStatusBadge(s.status)}
                </div>
                <p>Est Shelf-Life: {s.shelf_life_hours}h • Browning: {s.browning_index}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2-Column Inspector Canvas */}
      <div className="grid-2col">
        {/* Left: Visual Analysis View */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{freshness.item_name}</h4>
            {getStatusBadge(freshness.freshness_status)}
          </div>

          <div className="bounding-image-container" style={{ maxHeight: '340px' }}>
            <img src={previewImage} alt="Inspected produce" className="bounding-image" />
          </div>

          <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>AI Confidence Rating</span>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white' }}>
                {Math.round(freshness.confidence * 100)}%
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Remaining Shelf Life</span>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: freshness.shelf_life_remaining_hours > 24 ? '#10b981' : (freshness.shelf_life_remaining_hours > 0 ? '#f59e0b' : '#f43f5e'), display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                <Clock size={16} />
                <span>{freshness.shelf_life_remaining_hours} Hours</span>
              </div>
            </div>
          </div>

          {/* Safety Verdict Banner */}
          <div style={{
            marginTop: '1.25rem',
            padding: '1rem',
            borderRadius: '8px',
            background: freshness.freshness_status === 'Fresh' ? 'rgba(16, 185, 129, 0.15)' : (freshness.freshness_status === 'Moderately Fresh' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(244, 63, 94, 0.15)'),
            border: `1px solid ${freshness.freshness_status === 'Fresh' ? '#10b981' : (freshness.freshness_status === 'Moderately Fresh' ? '#f59e0b' : '#f43f5e')}`,
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            {freshness.freshness_status === 'Fresh' ? <CheckCircle size={22} color="#10b981" /> : (freshness.freshness_status === 'Moderately Fresh' ? <AlertTriangle size={22} color="#f59e0b" /> : <XCircle size={22} color="#f43f5e" />)}
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'white' }}>
                {freshness.safety_verdict}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '2px' }}>
                {freshness.actionable_guidance}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Detailed Visual Spectrum Metrics */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="#06b6d4" />
            Computer Vision Surface Analysis Metrics
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {/* Browning Index */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: '#cbd5e1' }}>Enzymatic Browning & Oxidation</span>
                <span style={{ fontWeight: 700, color: freshness.visual_metrics.browning_index > 50 ? '#f43f5e' : '#10b981' }}>
                  {freshness.visual_metrics.browning_index}%
                </span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, marginTop: 4 }}>
                <div style={{ 
                  width: `${freshness.visual_metrics.browning_index}%`, 
                  height: '100%', 
                  background: freshness.visual_metrics.browning_index > 50 ? '#f43f5e' : (freshness.visual_metrics.browning_index > 25 ? '#f59e0b' : '#10b981'), 
                  borderRadius: 3 
                }} />
              </div>
            </div>

            {/* Surface Texture Variance */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: '#cbd5e1' }}>Surface Texture Variance / Wrinkling</span>
                <span style={{ fontWeight: 700, color: '#06b6d4' }}>
                  {freshness.visual_metrics.surface_texture_variance}%
                </span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, marginTop: 4 }}>
                <div style={{ width: `${freshness.visual_metrics.surface_texture_variance}%`, height: '100%', background: '#06b6d4', borderRadius: 3 }} />
              </div>
            </div>

            {/* Moisture Retention Index */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: '#cbd5e1' }}>Moisture Retention & Turgor Pressure</span>
                <span style={{ fontWeight: 700, color: '#8b5cf6' }}>
                  {freshness.visual_metrics.moisture_retention_index}%
                </span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, marginTop: 4 }}>
                <div style={{ width: `${freshness.visual_metrics.moisture_retention_index}%`, height: '100%', background: '#8b5cf6', borderRadius: 3 }} />
              </div>
            </div>

            {/* Discoloration Spots */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(10, 15, 29, 0.5)', padding: '0.75rem 1rem', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Discoloration / Mold Spots Detected</span>
              <span style={{ 
                fontSize: '1.1rem', 
                fontWeight: 800, 
                color: freshness.visual_metrics.discoloration_spots_detected > 0 ? '#f43f5e' : '#10b981' 
              }}>
                {freshness.visual_metrics.discoloration_spots_detected} Spots
              </span>
            </div>
          </div>

          {/* Storage Recommendations */}
          <div style={{ marginTop: '1.5rem', background: 'rgba(10, 15, 29, 0.6)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h5 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <Thermometer size={16} />
              Recommended Storage Conditions
            </h5>
            <ul style={{ paddingLeft: '1.2rem', fontSize: '0.8rem', color: '#cbd5e1', lineHeight: '1.5' }}>
              {freshness.storage_recommendations?.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>

          {/* Risk Factors */}
          <div style={{ marginTop: '1rem', background: 'rgba(244, 63, 94, 0.08)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
            <h5 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#f43f5e', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <AlertTriangle size={16} />
              Pathogen & Microbial Risk Factors
            </h5>
            <ul style={{ paddingLeft: '1.2rem', fontSize: '0.8rem', color: '#fecdd3', lineHeight: '1.5' }}>
              {freshness.risk_factors?.map((risk, i) => (
                <li key={i}>{risk}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
