import React from 'react';
import { 
  FileText, 
  X, 
  Printer, 
  Download, 
  ShieldCheck, 
  Activity, 
  Clock, 
  AlertTriangle,
  CheckCircle2,
  UtensilsCrossed
} from 'lucide-react';

export default function ExecutiveReportModal({ isOpen, onClose, report }) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const dish = report?.dish_recognition;
  const freshness = report?.freshness_assessment;
  const hygiene = report?.hygiene_assessment;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '820px', background: '#0e1628', border: '1px solid rgba(16, 185, 129, 0.4)' }}
      >
        {/* Modal Top Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={22} color="#10b981" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>FoodVerse Executive Intelligence Report</h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button className="btn-tool" onClick={handlePrint} title="Print or Save PDF">
              <Printer size={16} />
              <span>Print / Export PDF</span>
            </button>
            <button className="btn-icon" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Report Document */}
        <div className="report-document" style={{ color: '#e2e8f0', lineHeight: '1.5' }}>
          {/* Header Metadata */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '1.1rem', color: '#10b981' }}>
                <UtensilsCrossed size={18} />
                <span>FOODVERSE AI INTELLIGENCE PLATFORM</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Session Ref: {report?.session_id || 'fv-audit-2026'}</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Report Generated:</span>
              <strong style={{ fontSize: '0.85rem', color: 'white' }}>{report?.timestamp || new Date().toLocaleString()}</strong>
            </div>
          </div>

          {/* Section 1: Food Recognition & Precision Nutrition */}
          {dish && (
            <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1.25rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#06b6d4', textTransform: 'uppercase', marginBottom: '8px' }}>
                1. Computer Vision Food Identification & Nutrition
              </h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(10,15,29,0.5)', padding: '0.85rem', borderRadius: '8px' }}>
                <div>
                  <h5 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'white' }}>{dish.dish_name}</h5>
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{dish.cuisine_type} • Engine: {dish.ai_engine_used}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#10b981' }}>{dish.nutrition.health_score}</span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}> / 100 Health Score (Nutri-Score {dish.nutrition.nutri_score_grade})</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginTop: '8px', textAlign: 'center', fontSize: '0.8rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.04)', padding: '6px', borderRadius: '4px' }}>
                  <strong>{dish.nutrition.macros.calories}</strong> kcal
                </div>
                <div style={{ background: 'rgba(255,255,255,0.04)', padding: '6px', borderRadius: '4px' }}>
                  <strong>{dish.nutrition.macros.protein}g</strong> Protein
                </div>
                <div style={{ background: 'rgba(255,255,255,0.04)', padding: '6px', borderRadius: '4px' }}>
                  <strong>{dish.nutrition.macros.carbohydrates}g</strong> Carbs
                </div>
                <div style={{ background: 'rgba(255,255,255,0.04)', padding: '6px', borderRadius: '4px' }}>
                  <strong>{dish.nutrition.macros.fat}g</strong> Fat
                </div>
              </div>

              <p style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '8px' }}>
                <strong>Dietitian Assessment:</strong> {dish.nutrition.actionable_dietitian_tip}
              </p>
            </div>
          )}

          {/* Section 2: Freshness & Spoilage Classification */}
          {freshness && (
            <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1.25rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', marginBottom: '8px' }}>
                2. Spoilage & Freshness Classification
              </h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white' }}>{freshness.item_name}</span>
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{freshness.safety_verdict}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ 
                    fontSize: '0.85rem', 
                    fontWeight: 800, 
                    color: freshness.freshness_status === 'Fresh' ? '#10b981' : (freshness.freshness_status === 'Moderately Fresh' ? '#f59e0b' : '#f43f5e'),
                    background: 'rgba(255,255,255,0.06)',
                    padding: '4px 10px',
                    borderRadius: '12px'
                  }}>
                    {freshness.freshness_status} ({freshness.shelf_life_remaining_hours}h Remaining)
                  </span>
                </div>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '6px' }}>
                <strong>Storage Protocol:</strong> {freshness.storage_recommendations?.[0]}
              </p>
            </div>
          )}

          {/* Section 3: Kitchen Hygiene & HACCP Compliance */}
          {hygiene && (
            <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1.25rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#8b5cf6', textTransform: 'uppercase', marginBottom: '8px' }}>
                3. Commercial Kitchen Hygiene & HACCP Compliance Audit
              </h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: hygiene.compliance_score >= 80 ? '#10b981' : '#f43f5e' }}>
                    Grade {hygiene.safety_grade} ({hygiene.compliance_score}% Overall Score)
                  </span>
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                    Glove Compliance: {hygiene.glove_compliance_pct}% • Hair Containment: {hygiene.hair_cap_compliance_pct}% • Cross-Contamination: {hygiene.cross_contamination_risk}
                  </p>
                </div>
                <span className={hygiene.haccp_compliant ? 'badge badge-fresh' : 'badge badge-spoiled'}>
                  {hygiene.haccp_compliant ? 'HACCP Compliant' : 'HACCP Non-Compliant'}
                </span>
              </div>
            </div>
          )}

          {/* Section 4: Actionable AI Executive Takeaways */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', marginBottom: '8px' }}>
              4. Actionable AI Recommendations & Safety Mandates
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {report?.actionable_ai_takeaways?.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.82rem', color: '#e2e8f0' }}>
                  <CheckCircle2 size={14} color="#10b981" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
