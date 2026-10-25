import React, { useState } from 'react';
import { 
  Video, 
  Upload, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ClipboardCheck, 
  Eye, 
  Sparkles,
  Play
} from 'lucide-react';
import { analyzeKitchenHygiene } from '../services/api';

export default function HygieneMonitor({ 
  currentHygiene, 
  setCurrentHygiene, 
  scenarios 
}) {
  const [selectedScenario, setSelectedScenario] = useState(scenarios?.[0]?.id || 'michelin_clean');
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeFrameTime, setActiveFrameTime] = useState(14.2);
  const [previewImage, setPreviewImage] = useState(
    'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=80'
  );

  const handleSelectScenario = async (sc) => {
    setSelectedScenario(sc.id);
    setPreviewImage(sc.preview_url);
    setIsLoading(true);
    try {
      const res = await analyzeKitchenHygiene({ presetScenario: sc.id });
      setCurrentHygiene(res);
      if (res.violations?.length > 0) {
        setActiveFrameTime(res.violations[0].timestamp_sec);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const res = await analyzeKitchenHygiene({ videoFile: file });
      setCurrentHygiene(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const hygiene = currentHygiene || {
    compliance_score: 97,
    safety_grade: "A+",
    glove_compliance_pct: 98.5,
    hair_cap_compliance_pct: 100.0,
    cross_contamination_risk: "None Detected",
    station_cleanliness_index: 96.0,
    violations: [
      {
        timestamp_sec: 14.2,
        type: "Sanitation Station Check",
        severity: "Low",
        description: "Sanitizer bucket test strip replacement recommended within 20 minutes.",
        remediation_step: "Verify chlorine ppm is between 50-100 ppm using test paper."
      }
    ],
    inspected_frames_count: 240,
    haccp_compliant: true,
    manager_actionable_summary: "Exemplary food safety posture. Full personal protective compliance across all 4 line stations.",
    key_recommendations: [
      "Maintain current 30-minute glove replacement schedule.",
      "Log ambient cold-table temperatures in HACCP digital ledger.",
      "Continue strict color-coded cutting board protocol."
    ]
  };

  const getGradeBadge = (grade) => {
    if (grade.startsWith('A')) return <span className="badge badge-grade-a">{grade} Compliance</span>;
    if (grade.startsWith('B')) return <span className="badge badge-grade-b">{grade} Compliance</span>;
    return <span className="badge badge-grade-c">{grade}</span>;
  };

  return (
    <div className="hygiene-container">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Video size={24} style={{ color: '#06b6d4' }} />
            Commercial Kitchen Hygiene & HACCP Video Auditor
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            Continuous computer vision surveillance detecting glove usage, hair containment, cross-contamination, and station cleanliness.
          </p>
        </div>

        <label className="btn-primary" style={{ cursor: 'pointer' }}>
          <Upload size={16} />
          <span>Upload Kitchen Footage</span>
          <input 
            type="file" 
            accept="video/*" 
            style={{ display: 'none' }} 
            onChange={handleVideoUpload} 
          />
        </label>
      </div>

      {/* Preset Scenarios */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, marginBottom: '0.5rem' }}>
          Kitchen Surveillance Station Feeds:
        </h4>
        <div className="preset-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {(scenarios || []).map((sc) => (
            <div
              key={sc.id}
              className={`preset-card ${selectedScenario === sc.id ? 'selected' : ''}`}
              onClick={() => handleSelectScenario(sc)}
            >
              <img src={sc.preview_url} alt={sc.title} className="preset-img" />
              <div className="preset-details">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h5>{sc.title}</h5>
                  {getGradeBadge(sc.grade)}
                </div>
                <p>Gloves: {sc.glove_pct}% • Hair Net: {sc.hair_cap_pct}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2-Column Inspection */}
      <div className="grid-2col">
        {/* Left: Video Feed with HUD Overlays */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 8px #10b981' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0' }}>Live AI Camera Feed (60 FPS)</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              {hygiene.inspected_frames_count} Frames Scanned
            </span>
          </div>

          <div className="bounding-image-container" style={{ position: 'relative', maxHeight: '360px' }}>
            <img src={previewImage} alt="Kitchen camera feed" className="bounding-image" />
            
            {/* Live Camera HUD Overlays */}
            <div className="video-hud-overlay">
              <div className="hud-pill" style={{ color: hygiene.glove_compliance_pct > 85 ? '#10b981' : '#f43f5e' }}>
                <ShieldCheck size={14} />
                <span>Gloves: {hygiene.glove_compliance_pct}%</span>
              </div>

              <div className="hud-pill" style={{ color: hygiene.hair_cap_compliance_pct > 90 ? '#10b981' : '#f43f5e' }}>
                <Eye size={14} />
                <span>Hair Containment: {hygiene.hair_cap_compliance_pct}%</span>
              </div>

              <div className="hud-pill" style={{ color: hygiene.cross_contamination_risk === 'None Detected' ? '#10b981' : '#f43f5e' }}>
                <AlertTriangle size={14} />
                <span>Cross-Risk: {hygiene.cross_contamination_risk}</span>
              </div>
            </div>

            {/* Simulated Live Detection Box */}
            <div style={{
              position: 'absolute',
              bottom: '15%',
              left: '20%',
              width: '45%',
              height: '35%',
              border: hygiene.compliance_score >= 80 ? '2px dashed #10b981' : '2px dashed #f43f5e',
              background: hygiene.compliance_score >= 80 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.15)',
              borderRadius: '4px',
              pointerEvents: 'none',
              padding: '4px'
            }}>
              <span style={{
                background: hygiene.compliance_score >= 80 ? '#10b981' : '#f43f5e',
                color: '#000',
                fontSize: '0.65rem',
                fontWeight: 800,
                padding: '2px 6px',
                borderRadius: '3px'
              }}>
                Prep Line Station • {hygiene.haccp_compliant ? 'HACCP OK' : 'VIOLATION DETECTED'}
              </span>
            </div>
          </div>

          {/* Compliance Score Bar */}
          <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>HACCP Compliance Rating</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                <span style={{ fontSize: '1.6rem', fontWeight: 900, color: hygiene.compliance_score >= 80 ? '#10b981' : '#f43f5e' }}>
                  {hygiene.compliance_score}%
                </span>
                {getGradeBadge(hygiene.safety_grade)}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Station Sanitization</span>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#06b6d4' }}>
                {hygiene.station_cleanliness_index} / 100
              </div>
            </div>
          </div>

          <p style={{ marginTop: '1rem', fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.45', background: 'rgba(10, 15, 29, 0.5)', padding: '0.85rem', borderRadius: '8px' }}>
            {hygiene.manager_actionable_summary}
          </p>
        </div>

        {/* Right: Violation Timeline & Remediation Plan */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ClipboardCheck size={20} color="#10b981" />
              Incident Audit Log & Remediation Actions
            </h3>
            <span className="badge badge-fresh">HACCP 2026.4</span>
          </div>

          {/* Incident Timeline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {hygiene.violations?.map((v, i) => (
              <div 
                key={i}
                style={{
                  background: v.severity === 'Critical' ? 'rgba(244, 63, 94, 0.12)' : 'rgba(10, 15, 29, 0.6)',
                  border: `1px solid ${v.severity === 'Critical' ? '#f43f5e' : 'rgba(255, 255, 255, 0.1)'}`,
                  padding: '0.9rem',
                  borderRadius: '8px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ 
                      background: v.severity === 'Critical' ? '#f43f5e' : (v.severity === 'Medium' ? '#f59e0b' : '#06b6d4'),
                      color: 'white',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      00:{Math.round(v.timestamp_sec).toString().padStart(2, '0')}
                    </span>
                    <strong style={{ fontSize: '0.85rem', color: 'white' }}>{v.type}</strong>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: v.severity === 'Critical' ? '#f43f5e' : '#f59e0b', fontWeight: 700 }}>
                    {v.severity} Risk
                  </span>
                </div>

                <p style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '6px' }}>
                  {v.description}
                </p>

                <div style={{ marginTop: '8px', paddingTop: '6px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.78rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={14} />
                  <span><strong>Corrective Action:</strong> {v.remediation_step}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Manager Action Plan */}
          <div style={{ marginTop: '1.5rem', background: 'rgba(6, 182, 212, 0.1)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(6, 182, 212, 0.25)' }}>
            <h5 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#06b6d4', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <ShieldCheck size={16} />
              Shift Supervisor Corrective Action Checklist
            </h5>
            <ul style={{ paddingLeft: '1.2rem', fontSize: '0.8rem', color: '#e2e8f0', lineHeight: '1.5' }}>
              {hygiene.key_recommendations?.map((rec, idx) => (
                <li key={idx}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
