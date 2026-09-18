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
    const response = await fetch('/api/assistant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        context,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return {
        reply: data.reply || 'MediBot has processed your request.',
        mode: data.mode || 'AI',
      };
    }
  } catch {
    // Graceful offline clinical assistant fallback
  }

  // Client-side rule-based fallback
  const q = (message || '').toLowerCase();
  let reply = '';

  if (q.includes('today') || q.includes('summary') || q.includes('how much waste') || q.includes('collected')) {
    reply = `**Hospital Waste Summary for Today:**
- **Total Waste Collected:** ${(context.totalWasteKg ?? 0).toFixed(1)} kg
- **Completed Pickup Tasks:** ${context.todayCollections ?? 0} rounds
- **Active Mobile Units:** ${context.activeUnitsCount ?? 0} units in corridors
- **Pending Collection Requests:** ${context.pendingRequestsCount ?? 0} awaiting transit
- **Containers at Alert Threshold:** ${context.fullContainersCount ?? 0} requiring immediate transfer`;
  } else if (q.includes('container') || q.includes('full') || q.includes('capacity')) {
    const list = (context.containers || [])
      .map(
        (c) =>
          `• **${c.name} (${c.label})**: ${c.capacityPercent ?? 0}% (${(c.currentWeightKg ?? 0).toFixed(1)} / ${c.capacityKg ?? 50} kg) — Status: **${c.status || 'NORMAL'}**`
      )
      .join('\n');
    reply = `**Virtual Container Status Report:**\n${list}\n\n*Note: Containers reaching 80% emit amber warnings; 95% triggers emergency dispatch lockouts.*`;
  } else if (q.includes('urgent') || q.includes('pending') || q.includes('request')) {
    reply = `**Pending & Urgent Requests:**
Currently **${context.pendingRequestsCount ?? 0}** requests logged in the queue.
- Emergency Dept: CR-1024 (URGENT, Sharps disposal)
- Operation Theatre: CR-1026 (URGENT, 9.0 kg surgical softs)
- ICU: CR-1028 (HIGH, 7.5 kg biological suction liners)`;
  } else if (q.includes('medi-02') || q.includes('unit 2') || q.includes('unit status')) {
    reply = `**Mobile Unit Status (MEDI-02):**
- **Status:** COLLECTING
- **Assigned Request:** CR-1025 (Ward B, 6.2 kg)
- **Simulated Battery:** 72%
- **Progress:** 45% of transit completed
- **Current Department:** Ward B Corridor 3`;
  } else if (q.includes('department') || q.includes('most waste')) {
    reply = `**Highest Waste Generating Department:**
**${context.topDepartment || 'Emergency'}** generated the highest volume today (approx. ${((context.totalWasteKg ?? 0) * 0.38).toFixed(1)} kg), followed by **ICU** and **Operation Theatre**.`;
  } else if (q.includes('review') || q.includes('confidence') || q.includes('human review')) {
    reply = `**AI Classification Review Protocol:**
- System threshold is set to **80%**.
- Any classification confidence below 80% or labeled UNKNOWN halts automated container segregation and requires manual Waste Manager sign-off.
- Current human-review rate is **7.2%**, well within clinical safety audit tolerances.`;
  } else {
    reply = `Hello! I am **MediBot**, the clinical assistant for MEDI-SORT.
I monitor hospital medical waste collection, virtual containers, and mobile collection units.

You can ask me questions like:
- *"How much waste was collected today?"*
- *"Which container is almost full?"*
- *"Show pending urgent requests"*
- *"What is the status of MEDI-02?"*
- *"Which department generated the most waste?"*`;
  }

  return {
    reply,
    mode: 'DEMO',
  };
}
