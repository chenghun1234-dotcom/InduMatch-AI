# 🏗️ InduMatch AI (Industrial Matching API)

**InduMatch AI** is a circular economy B2B solution that uses Edge AI to analyze surplus industrial components and match them with manufacturing demand.

## 🌟 Key Features

- **Edge AI Vision Analysis**: Analyzes component images directly in the browser using WebAssembly (Wasm) and TensorFlow.js. Zero server-side GPU costs.
- **Specification Extraction**: Automatically detects component types, materials, and technical specs (e.g., AWG, Pin count, RoHS status).
- **Global Matching Engine**: 
  - Matches parts with HS Codes for international trade.
  - Recommends target industry sectors (Automotive, Electronics, Construction, etc.).
  - Connects with potential B2B buyers based on historical supply chain demand.
- **Globalization Ready**: Automatic unit conversion (AWG ↔ mm²) and multi-language technical taxonomy.

## 🛠️ Technology Stack

- **Frontend**: Vite, Vanilla JS, TensorFlow.js (Wasm-based MobileNet)
- **Backend**: Cloudflare Workers (Serverless API)
- **Database**: Cloudflare D1 (SQL) / KV
- **Deployment**: RapidAPI ready for monetization

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Cloudflare Wrangler CLI (for backend deployment)

### Installation
1. Clone the repository:
   ```bash
   git clone git@github.com:chenghun1234-dotcom/InduMatch-AI.git
   cd InduMatch-AI
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

### Backend Deployment
To deploy the matching API to Cloudflare:
```bash
cd worker
npx wrangler deploy
```

## 📊 RapidAPI Strategy
This project is designed to operate at **$0 infrastructure cost**:
- **Client-side inference** avoids expensive Vision API calls.
- **Cloudflare Free Tier** handles API routing and database lookups.
- Perfect for high-margin B2B API monetization.

## 📄 License
MIT License - Copyright (c) 2026 InduMatch AI
