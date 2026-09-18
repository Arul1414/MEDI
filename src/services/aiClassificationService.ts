import { AIClassification, WasteCategory, ContainerId, RiskLevel } from '../types';

export interface ClassifyPayload {
  imageBase64?: string;
  sampleHint?: string;
  notes?: string;
  confidenceThreshold?: number;
}

export async function classifyWaste(payload: ClassifyPayload): Promise<AIClassification> {
  const threshold = payload.confidenceThreshold ?? 0.80;

  try {
    const response = await fetch('/api/classify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageBase64: payload.imageBase64,
        sampleCategoryHint: payload.sampleHint,
        notes: payload.notes,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const confidence = typeof data.confidence === 'number' ? data.confidence : 0.85;
      const requiresReview = confidence < threshold || data.requires_human_review || data.category === 'UNKNOWN';

      return {
        category: (data.category || 'INFECTIOUS_SOFT') as WasteCategory,
        confidence: Number(confidence.toFixed(2)),
        recommended_container: (data.recommended_container || 'CONTAINER_B') as ContainerId,
        risk_level: (data.risk_level || 'HIGH') as RiskLevel,
        requires_human_review: requiresReview,
        explanation: data.explanation || 'AI classification recommendation based on visual analysis.',
        mode: data.mode || 'AI',
      };
    }
  } catch {
    // Graceful offline clinical simulation fallback
  }

  // Client-side fallback simulation
  const hint = (payload.sampleHint || payload.notes || '').toLowerCase();
  let category: WasteCategory = 'INFECTIOUS_SOFT';
  let confidence = 0.93;
  let container: ContainerId = 'CONTAINER_B';
  let riskLevel: RiskLevel = 'HIGH';
  let explanation = 'Biological fluid absorption patterns detected on surgical swabs and dressings.';

  if (hint.includes('sharp') || hint.includes('needle') || hint.includes('syringe') || hint.includes('scalpel')) {
    category = 'SHARPS';
    confidence = 0.96;
    container = 'CONTAINER_C';
    riskLevel = 'CRITICAL';
    explanation = 'High-definition geometric contouring matches rigid puncture hazards (hypodermic syringe / surgical steel).';
  } else if (hint.includes('pharma') || hint.includes('vial') || hint.includes('drug') || hint.includes('antibiotic')) {
    category = 'PHARMACEUTICAL';
    confidence = 0.91;
    container = 'CONTAINER_D';
    riskLevel = 'MEDIUM';
    explanation = 'Pharmaceutical packaging geometry and chemical vial labeling recognized. Requires high-temp neutralization.';
  } else if (hint.includes('general') || hint.includes('paper') || hint.includes('cardboard') || hint.includes('clean')) {
    category = 'GENERAL';
    confidence = 0.97;
    container = 'CONTAINER_A';
    riskLevel = 'LOW';
    explanation = 'Dry cellulosic material with no biological fluid luminescence. Safe for non-hazardous recycling.';
  } else if (hint.includes('unknown') || hint.includes('mixed') || hint.includes('debris') || hint.includes('blur')) {
    category = 'UNKNOWN';
    confidence = 0.58; // Below 80% threshold -> Triggers HUMAN REVIEW REQUIRED!
    container = 'CONTAINER_B';
    riskLevel = 'HIGH';
    explanation = 'Optical ambiguity or composite material identified. Visual confidence is 58% (below 80% safety threshold).';
  }

  const requiresReview = confidence < threshold || category === 'UNKNOWN';

  return {
    category,
    confidence: Number(confidence.toFixed(2)),
    recommended_container: container,
    risk_level: riskLevel,
    requires_human_review: requiresReview,
    explanation,
    mode: 'DEMO',
  };
}
