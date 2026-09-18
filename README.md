# 🏥 MEDI-SORT

### ⚡ Smart Mobile Medical Waste Collection & Segregation System

<div align="center">

### 🤖 AI • ♻️ Smart Segregation • 🚚 Mobile Simulation • 📊 Analytics

**A next-generation software prototype for intelligent medical-waste management.**

<br>

🔗 **LIVE DEMO**
👉 `YOUR_LIVE_URL_HERE`

<br>

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge\&logo=react\&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge\&logo=typescript\&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge\&logo=vite\&logoColor=white)](https://vite.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge\&logo=tailwindcss\&logoColor=white)](https://tailwindcss.com/)
[![Node](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge\&logo=node.js\&logoColor=white)](https://nodejs.org/)
[![Gemini](https://img.shields.io/badge/Gemini-AI-4285F4?style=for-the-badge\&logo=google\&logoColor=white)](https://ai.google.dev/)

</div>

---

## 🧠 What is MEDI-SORT?

**MEDI-SORT** is a full-stack, AI-powered medical-waste management platform that digitally connects:

```text
👨‍⚕️ Hospital Staff
       ↓
📋 Collection Request
       ↓
🚚 Mobile Unit Assignment
       ↓
📸 Waste Image
       ↓
🤖 AI Classification
       ↓
🔍 Confidence Check
       ↓
♻️ Virtual Segregation
       ↓
🗑️ Container Monitoring
       ↓
📊 Analytics
       ↓
🔐 Audit Trail
```

> 🎓 **Academic Software Prototype** — designed for simulation and demonstration.
> ⚠️ AI classifications are recommendations and must not replace trained personnel, applicable regulations, or certified disposal procedures.

---

# ✨ Core Features

| 🚀 Module                  | ⚙️ Capability                             |
| -------------------------- | ----------------------------------------- |
| 📊 **Dashboard**           | Live KPIs, charts, alerts & system status |
| 📋 **Collection Requests** | Create, assign & track waste collection   |
| 🤖 **AI Classification**   | Image-based waste classification          |
| ♻️ **Segregation Center**  | Virtual category-based segregation        |
| 🚚 **Mobile Units**        | Simulated hospital waste-collection units |
| 📦 **Waste Inventory**     | Search, filter & monitor waste records    |
| 🚨 **Alerts**              | Capacity, battery, priority & AI alerts   |
| 📈 **Analytics**           | Trends, categories, departments & reports |
| 📝 **Audit Logs**          | Chronological activity tracking           |
| 💬 **MediBot**             | AI assistant for system data              |
| 🔎 **Global Search**       | Search across system entities             |
| 👥 **Role Management**     | Admin, Manager & Staff interfaces         |
| ⚙️ **Settings**            | Thresholds, notifications & preferences   |

---

# 🤖 AI Intelligence

### 🧪 AI Waste Classification

Supports:

```text
🟢 GENERAL
🔴 INFECTIOUS_SOFT
🟡 SHARPS
🟣 PHARMACEUTICAL
⚪ UNKNOWN
```

### 🎯 Confidence-Based Decision Flow

```text
             📸 IMAGE
                │
                ▼
          🤖 GEMINI AI
                │
                ▼
        📊 CONFIDENCE CHECK
          ┌─────┴─────┐
          │           │
       ≥ 80%        < 80%
          │           │
          ▼           ▼
    ✅ AI VERIFIED  👨‍⚕️ HUMAN
                    REVIEW
```

Structured AI output:

```json
{
  "category": "INFECTIOUS_SOFT",
  "confidence": 0.94,
  "recommended_container": "CONTAINER_B",
  "risk_level": "HIGH",
  "requires_human_review": false
}
```

---

# ♻️ Smart Segregation

```text
┌───────────────┬────────────────────────┐
│ 🟢 CONTAINER A│ General Waste          │
├───────────────┼────────────────────────┤
│ 🔴 CONTAINER B│ Infectious Soft Waste  │
├───────────────┼────────────────────────┤
│ 🟡 CONTAINER C│ Sharps                 │
├───────────────┼────────────────────────┤
│ 🟣 CONTAINER D│ Pharmaceutical Waste   │
└───────────────┴────────────────────────┘
```

### 📡 Capacity Monitoring

```text
< 80%   → 🟢 NORMAL
80–94%  → 🟡 WARNING
≥ 95%   → 🔴 CRITICAL
```

---

# 🚚 Mobile Unit Simulation

> 🖥️ **100% Software Simulation — No Physical Robots Required**

```text
🤖 MEDI-01   🟢 AVAILABLE
🤖 MEDI-02   🔵 COLLECTING
🤖 MEDI-03   🟡 RETURNING
🤖 MEDI-04   ⚫ OFFLINE
```

Simulated locations:

`🏥 Reception → Ward A → Ward B → 🧪 Laboratory → 💊 Pharmacy → 🚑 Emergency → 📦 Storage`

---

# 🧩 Technology Stack

### 🎨 Frontend

```text
⚛️ React 19
🔷 TypeScript 5.8
⚡ Vite 6
🎨 Tailwind CSS 4
✨ Motion
🔹 Lucide React
```

### 🖥️ Backend

```text
🟢 Node.js
🚀 Express 4
⚙️ tsx
📦 esbuild
🔐 dotenv
```

### 🧠 AI

```text
🤖 Google GenAI SDK
💫 Gemini Multimodal Models
📋 Structured JSON Responses
🔄 Model Failover
🛡️ Deterministic Fallback
```

### 💾 State & Browser

```text
⚛️ React Context API
💾 LocalStorage
📄 Blob API
🌐 Fullscreen API
```

---

# 🏗️ Architecture

```text
                 🏥 MEDI-SORT
                      │
        ┌─────────────┴─────────────┐
        │                           │
   🎨 FRONTEND                  🖥️ BACKEND
        │                           │
   React + TS                  Node + Express
        │                           │
        └─────────────┬─────────────┘
                      │
                 🤖 AI SERVICES
                      │
              ┌───────┴───────┐
              │               │
       🧪 Classification   💬 MediBot
              │               │
              └───────┬───────┘
                      │
                ♻️ SIMULATION
                      │
       ┌──────────────┼──────────────┐
       ↓              ↓              ↓
    🚚 Units      🗑️ Containers   🚨 Alerts
       │              │              │
       └──────────────┼──────────────┘
                      ↓
                 📊 Analytics
                      ↓
                 🔐 Audit Log
```

---

# 🎬 Demo Workflow

```text
1️⃣ Create Request
        ↓
2️⃣ Assign MEDI-01
        ↓
3️⃣ Start Collection
        ↓
4️⃣ Upload Waste Image
        ↓
5️⃣ Run AI Classification
        ↓
6️⃣ Check Confidence
        ↓
7️⃣ Approve / Human Review
        ↓
8️⃣ Virtual Segregation
        ↓
9️⃣ Update Container
        ↓
🔟 Generate Alert
        ↓
1️⃣1️⃣ Complete Collection
        ↓
1️⃣2️⃣ Update Analytics
        ↓
1️⃣3️⃣ Create Audit Record
```

---

# 👥 User Roles

```text
👑 ADMIN
   ├── Users
   ├── Mobile Units
   ├── Analytics
   ├── Audit Logs
   └── Settings

🧑‍💼 WASTE MANAGER
   ├── Requests
   ├── Assignments
   ├── AI Review
   ├── Alerts
   └── Reports

👨‍⚕️ STAFF
   ├── Create Request
   ├── Upload Image
   ├── View AI Result
   └── Track Collection
```

---

# ⚡ Quick Start

```bash
# 📥 Clone
git clone YOUR_GITHUB_REPOSITORY_URL

# 📂 Enter project
cd medi-sort

# 📦 Install dependencies
npm install

# 🚀 Start development
npm run dev
```

### 🔐 Environment Variables

Create `.env`:

```env
GEMINI_API_KEY=your_api_key_here
```

> 🔒 Never commit your API key to GitHub.

---

# 📊 Project Highlights

```text
⚛️ React 19
🔷 TypeScript
🤖 Gemini AI
♻️ Smart Segregation
🚚 Mobile Simulation
📊 Real-time Dashboard
🚨 Intelligent Alerts
🔐 Audit Trail
💬 AI Assistant
📱 Responsive UI
🌙 Dark / Light Theme
⚡ Demo Mode
```

---

# 🌟 Why MEDI-SORT?

```text
          🤖 AI
           +
       🏥 Healthcare
           +
        ♻️ Waste
           +
       🚚 Automation
           +
        📊 Analytics
           =
      🚀 MEDI-SORT
```

A single platform demonstrating the complete digital lifecycle of medical-waste collection and segregation.

---

<div align="center">

## 🏥 MEDI-SORT

### **Smart • AI-Powered • Simulated • Data-Driven**

⭐ If you find this project interesting, consider giving it a star!

<br>

**🔗 Live Demo:** `YOUR_LIVE_URL_HERE`

**💻 Built with ❤️ using React + TypeScript + Gemini AI**

</div>
