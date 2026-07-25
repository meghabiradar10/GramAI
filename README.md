# 🌱 GramAI — Smart Village Hub

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-v11-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-animated-purple?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)

> **Smart Farming, Smarter Villages.** An AI-powered rural empowerment platform built for farmers and agricultural service providers across Maharashtra.

---

## 🌾 Why GramAI?

Rural farming communities face major bottlenecks in accessing modern technology, diagnosing crop damage, and discovering local markets. **GramAI** bridges this gap as a modern, unified hub specifically designed for the rural ecosystem:

* 🗣️ **Localized Support:** User interface optimized for English, Marathi (मराठी), and Hindi (हिंदी).
* 🎛️ **Dual-Role Portals:** Separate, tailormade workflows for both **Farmers** and **Service Providers**.
* 📡 **Connectivity Optimized:** Fast page load speeds and glassmorphic micro-components designed to work seamlessly under low-bandwidth rural conditions.
* 🩺 **Localized Crop AI:** Diagnostics tailored to regional Indian crop varieties.

---

## ✨ Project Highlights

* 🎨 **Premium Glassmorphic UI:** Modern and responsive interface styled with glassmorphism, responsive grid layouts, and custom theme tokens.
* 📈 **Interactive Financial Analytics:** Dynamic charts tracking user expenses and income, fully responsive and implemented using Recharts SVG library.
* 💬 **Smart Conversational Flow:** A client-side simulated AI chat assistant featuring suggested prompts and typing indicators.
* 🔄 **Flexible Role Switching:** Dynamic profile context allowing users to toggle between Farmer and Service Provider accounts smoothly.
* 🧱 **Clean Component Design:** Modularized page structure with reusable layouts, navigation bar, and footer.

---

## 🔍 The Problem & Solution

### The Problem
Smallholder farmers are often disconnected from tools that can improve crop yield and financial efficiency. They suffer from:
1. **Delayed Diagnostics:** Crop diseases are detected too late, causing severe yield loss.
2. **Access Barriers:** Complex government schemes eligibility requirements remain obscure due to language and administrative barriers.
3. **Fragmented Marketplace:** Retailers and middlemen markup prices on essential seeds, fertilizers, and tools.
4. **Machinery Underutilization:** Farm equipment (tractors, harvesters) is expensive to own, but finding local rentals or repair technicians is difficult.

### The Solution
**GramAI** aggregates these services into a single web application:
* Instant AI diagnostics for crop leaves.
* An interactive multi-lingual scheme chatbot buddy.
* A direct peer-to-peer agricultural marketplace.
* An on-demand booking platform for farming machinery and services.

---

## 🚀 Key Features & Modules

### 1. 🩺 AI Crop Doctor
* **Leaf Scan Diagnostics:** Farmers can take or upload photos of infected crop leaves.
* **Instant Analysis:** Features a simulated AI diagnostic tool that identifies common diseases (e.g., *Tomato Late Blight*), matching confidence metrics, pathogen details, treatment protocols, and crop rotation prevention guides.

### 2. 🤖 Govt Scheme Buddy
* **Conversational AI:** A natural-language assistant replying to scheme eligibility queries in English, Marathi, and Hindi.
* **Database & Subsidies:** Quickly lookup requirements for *PM Kisan Samman Nidhi*, *MahaDBT Tractor Subsidy*, *PM Fasal Bima Yojana*, and *Kisan Credit Card*.

### 3. 🛒 Agri Marketplace
* **Direct B2B Trade:** Access seeds, tools, pesticides, and fertilizers directly from verified sellers.
* **Feature Rich:** Search filtering by product categories (Seeds, Fertilizers, Pesticides, Tools), wholesales pricing, ratings, and shopping cart operations.

### 4. 🚜 Machinery Rental & Expert Hiring
* **On-Demand Rentals:** Find nearby tractors, combine harvesters, spraying drones, and repair experts.
* **Verified Listings:** Displays distance from the village, provider verification tags, pricing, and reservation logs.

### 5. 📊 Custom Dashboards
* **Farmer Portal:** Track farm finances with interactive income/expense charts (visualized via Recharts), active orders, and upcoming machinery booking logs.
* **Service Provider Portal:** Manage listing inventory, track completed earnings, review customer requests, and accept or decline active machinery booking requests.

---

## 🛠️ Tech Stack & Dependencies

* **Frontend Framework:** Next.js 16.2 (Turbopack) with React 19
* **Language:** TypeScript
* **Styling:** Tailwind CSS (v4) with CSS variables & customized glassmorphism
* **Database/Auth Integration:** Firebase v11 (Auth & Firestore integration ready)
* **Animation:** Framer Motion (for smooth springs, staggers, and hover transformations)
* **Charts & Analytics:** Recharts
* **Icons:** Lucide React

---

## 📂 Project Structure & Architecture

```text
GramAI/
├── src/
│   ├── app/                      # Next.js App Router Pages
│   │   ├── ai-scan/              # AI Crop Doctor Leaf Scanner page
│   │   ├── auth/                 # Multi-step OTP and role selection portal
│   │   ├── dashboard/            # Dynamic Dashboards
│   │   │   ├── farmer/           # Farmer portal (finance tracker + order logs)
│   │   │   └── provider/         # Provider portal (bookings + listing manager)
│   │   ├── govt-buddy/           # Conversational Government Assistant page
│   │   ├── marketplace/          # B2B agricultural store page
│   │   ├── services/             # Tractor & equipment hire service page
│   │   ├── globals.css           # Tailwind configuration & global styles
│   │   ├── layout.tsx            # Global state context and layout wrappers
│   │   └── page.tsx              # Homepage and marketing index
│   ├── components/               # Shareable Layout Components
│   │   └── layout/
│   │       ├── Footer.tsx        # Responsive Footer
│   │       └── Navbar.tsx        # Navigation with multi-lingual switcher
│   ├── contexts/                 # React Context providers
│   │   └── AuthContext.tsx       # Auth provider for role routing
│   └── lib/                      # Core Utilities & Configurations
│       └── firebase.ts           # Firebase SDK Initialization
├── public/                       # Static Assets & Icons
├── next.config.ts                # Next.js configuration
├── tsconfig.json                 # TypeScript compiler choices
└── package.json                  # Script shortcuts & framework configurations
```

---

## 💻 Installation & Setup

Follow these steps to run GramAI locally:

### 1. Prerequisites
Ensure you have Node.js (v18.x or higher) and npm installed.

### 2. Clone the Repository
```bash
git clone https://github.com/meghabiradar10/GramAI.git
cd GramAI
```

### 3. Install Dependencies
> [!IMPORTANT]
> To support custom UI charts, animations, and the database, you must install the runtime dependencies alongside the project core:
```bash
npm install
npm install firebase framer-motion lucide-react recharts
```

### 4. Set Up Environment Variables
Create a `.env.local` file in the root directory and add your Firebase credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
```
*(Note: A local mock fallback configuration in `src/lib/firebase.ts` allows the project to start even without custom credentials).*

### 5. Launch the Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser to interact with the application.

### 6. Build production bundle
```bash
npm run build
```

---

## 📸 Screenshots

*(Add your high-definition dashboard screenshots here to showcase the glassmorphism design)*

| Home Page | AI Crop Doctor |
| :---: | :---: |
| *[Screenshot Placeholder]* | *[Screenshot Placeholder]* |

| Govt Scheme Buddy | Farmer Dashboard |
| :---: | :---: |
| *[Screenshot Placeholder]* | *[Screenshot Placeholder]* |

---

## 🔮 Future Enhancements

* **Gemini Pro API Integration:** Connect the "Govt Buddy" directly to Live Google Gemini models using custom system prompts for hyper-accurate local scheme eligibility parsing.
* **Edge TensorFlow Disease Model:** Deploy a lightweight image recognition model on the client edge to classify crop leaf disease offline.
* **SMS Gateway Integration:** Allow farmers to query the Govt Buddy and book service providers via basic SMS/USSD protocols if internet access goes down.

---

## 🤝 Contribution Guidelines

We welcome contributions to make GramAI better! 
1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'feat: add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
