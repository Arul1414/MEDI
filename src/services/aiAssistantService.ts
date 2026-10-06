export interface AssistantContext {
  totalWasteKg: number;
  todayCollections: number;
  pendingRequestsCount: number;
  activeUnitsCount: number;
  fullContainersCount: number;
  aiClassificationsCount: number;
  containers: Array<{
    name: string;
    label: string;
    capacityPercent: number;
    currentWeightKg: number;
    capacityKg: number;
    status: string;
  }>;
  urgentRequests: Array<{
    id: string;
    department: string;
    priority: string;
    category?: string;
  }>;
  topDepartment: string;
}

export interface AssistantResponse {
  reply: string;
  mode: 'AI' | 'DEMO';
}

export async function askMediBot(message: string, context: AssistantContext): Promise<AssistantResponse> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    const response = await fetch('/api/assistant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        message,
        context,
      }),
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data?.reply) {
        return {
          reply: data.reply,
          mode: data.mode || 'AI',
        };
      }
    }
  } catch {
    // Graceful offline clinical assistant fallback
  }

  // Client-side rule-based fallback
  const q = (message || '').toLowerCase();
  let reply = '';

  if (q.includes('today') || q.includes('summary') || q.includes('how much waste') || q.includes('collected') || q.includes('total waste')) {
    reply = `**Hospital Waste Summary for Today:**
- **Total Waste Collected:** ${(context.totalWasteKg ?? 0).toFixed(1)} kg
- **Completed Pickup Tasks:** ${context.todayCollections ?? 0} rounds
- **Active Mobile Units:** ${context.activeUnitsCount ?? 0} units operating in corridors
- **Pending Collection Requests:** ${context.pendingRequestsCount ?? 0} awaiting transit
- **Containers at Alert Threshold:** ${context.fullContainersCount ?? 0} requiring immediate decanting`;
  } else if (q.includes('container') || q.includes('full') || q.includes('capacity') || q.includes('vault') || q.includes('canister')) {
    const list = (context.containers || [])
      .map(
        (c) =>
          `• **${c.name} (${c.label})**: ${c.capacityPercent ?? 0}% (${(c.currentWeightKg ?? 0).toFixed(1)} / ${c.capacityKg ?? 50} kg) — Status: **${c.status || 'NORMAL'}**`
      )
      .join('\n');
    reply = `**Virtual Container Status Report:**\n${list}\n\n*Note: Containers reaching 80% emit amber warnings; 95% triggers emergency dispatch lockouts.*`;
  } else if (q.includes('empty') || q.includes('reset') || q.includes('decant')) {
    reply = `**Container Decanting & Reset Instructions:**
To empty and reset containers:
1. Navigate to the **Segregation Center** page from the sidebar.
2. Under each container card (General, Infectious Soft, Sharps, Pharmaceutical), click the **Empty & Reset** button.
3. The container will instantaneously decant to **0.0 kg (0% capacity)** and log an immutable biohazard disposal manifest in the compliance audit trail.
4. You can also use the **Reset All Vaults** button in the lower simulation console to decant all 4 chambers simultaneously.`;
  } else if (q.includes('recall') || q.includes('storage') || q.includes('dock') || q.includes('base station')) {
    reply = `**Mobile Unit Fleet Recall Protocol:**
To recall autonomous units to the Central Storage Dock:
1. Navigate to the **Mobile Units** page.
2. Select any active unit on the interactive hospital SVG map or fleet grid.
3. Click the **Recall to Storage** button.
4. The unit will immediately cancel active corridor navigation, transition to **AVAILABLE**, and dock at Central Storage Base Station coordinates (50%, 50%).
5. Any in-transit collection task assigned to that unit is safely reverted to **PENDING** for reassignment.`;
  } else if (q.includes('urgent') || q.includes('pending') || q.includes('request') || q.includes('tickets')) {
    reply = `**Pending & Urgent Requests:**
Currently **${context.pendingRequestsCount ?? 0}** requests logged in the queue.
- Emergency Dept: CR-1024 (URGENT, Sharps disposal)
- Operation Theatre: CR-1026 (URGENT, 9.0 kg surgical softs)
- ICU: CR-1028 (HIGH, 7.5 kg biological suction liners)`;
  } else if (q.includes('medi-02') || q.includes('unit 2') || q.includes('unit status') || q.includes('mobile unit') || q.includes('fleet')) {
    reply = `**Mobile Fleet Overview:**
- **Active Operational Fleet:** ${context.activeUnitsCount ?? 4} units online.
- **Base Docking Station:** Central Storage (x: 50%, y: 50%).
- **MEDI-01:** Docked & fully charged (100%), available for rapid dispatch.
- **MEDI-02:** Tracking Ward B corridor route (Battery: 78%).
- **MEDI-03:** Servicing ICU complex pickup (Battery: 65%).
- **MEDI-04:** Returning to Central Storage with 6.8 kg pharmaceutical payload.`;
  } else if (q.includes('department') || q.includes('most waste') || q.includes('ward')) {
    reply = `**Departmental Waste Generation Analysis:**
**${context.topDepartment || 'Emergency'}** generated the highest volume today (approx. ${((context.totalWasteKg ?? 0) * 0.38).toFixed(1)} kg), followed closely by **ICU** (${((context.totalWasteKg ?? 0) * 0.28).toFixed(1)} kg) and **Operation Theatre** (${((context.totalWasteKg ?? 0) * 0.22).toFixed(1)} kg).`;
  } else if (q.includes('sharps') || q.includes('needle') || q.includes('infectious') || q.includes('category') || q.includes('color')) {
    reply = `**Biomedical Waste Segregation Protocols (Color-Coded Streams):**
- **Yellow / Container B (Infectious Soft):** Soiled dressings, blood-soaked swabs, biological liners, anatomical waste. Treated via high-temperature incineration/autoclaving.
- **Red / Container C (Sharps Hazard):** Needles, scalpels, surgical blades, broken vials, lancets. Rigid puncture-proof containment.
- **Blue-White / Container D (Pharmaceutical & Chemical):** Expired pharmaceuticals, chemotherapy ampoules, antibiotic vials.
- **Black / Container A (General Refuse):** Non-contaminated packaging, food wrappers, clean paper waste. Municipal stream.`;
  } else if (q.includes('review') || q.includes('confidence') || q.includes('human review') || q.includes('safety threshold')) {
    reply = `**AI Classification Review Protocol:**
- Operational safety threshold is strictly configured to **80%**.
- Any classification confidence below 80% or labeled UNKNOWN automatically halts automated container segregation and mandates clinician / waste manager human sign-off.
- Current human-review rate is **7.2%**, well within clinical safety audit tolerances.`;
  } else if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('help')) {
    reply = `Hello! I am **MediBot**, the clinical operations assistant for MEDI-SORT.
I monitor hospital medical waste collection, virtual containers, and mobile collection units in real time.

You can ask me questions like:
- *"How much waste was collected today?"*
- *"Which container is almost full?"*
- *"How do I empty and reset a container?"*
- *"How do I recall mobile units to storage?"*
- *"Show pending urgent requests"*
- *"What is the status of the mobile fleet?"*
- *"Explain the color-coded waste streams"*`;
  } else {
    reply = `I am **MediBot**, the clinical waste intelligence assistant. Based on current system metrics:
- Hospital waste collection is **OPERATIONAL**
- **${context.activeUnitsCount ?? 4}** mobile collection units are currently tracking hospital routes
- Virtual vault volume: **${(context.totalWasteKg ?? 0).toFixed(1)} kg** total collected
- System has processed **${context.aiClassificationsCount ?? 186}** classifications with safety verification protocols active.

You can ask about container capacities, urgent requests, mobile unit statuses, decanting, or daily totals!`;
  }

  return {
    reply,
    mode: 'DEMO',
  };
}
