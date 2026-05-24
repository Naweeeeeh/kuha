<div align="center">
  <img src="./src/assets/kuha-logo.png" alt="KUHA Portal Logo" width="120" />

  <h1>KUHA Portal</h1>

  <p>
    A modern barangay document request and public transparency portal for
    <strong>Barangay Tuyom, Carcar City, Cebu</strong>.
  </p>

  <p>
    <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=0B1F2A" alt="React" />
    <img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/Supabase-Backend-3FCF8E?style=for-the-badge&logo=supabase&logoColor=0B1F2A" alt="Supabase" />
    <img src="https://img.shields.io/badge/Cardano-Preview-0033AD?style=for-the-badge&logo=cardano&logoColor=white" alt="Cardano Preview" />
  </p>
</div>

---

## Overview

KUHA Portal helps residents request barangay certificates online while giving barangay staff a secure workspace for reviewing requests, previewing printable documents, and recording verified transactions on the Cardano Preview testnet.

The app also includes public-facing pages for Barangay Tuyom's heritage, vision and mission, emergency contacts, and an anonymized transaction ledger for transparency.

## Key Features

| Area | What it does |
| --- | --- |
| Resident certificate requests | Residents verify through email OTP, submit certificate details, upload a required 2x2 ID picture, and choose digital PDF or onsite pickup. |
| PDF certificate generation | Generates official-looking barangay documents using `@react-pdf/renderer`. |
| Admin document logs | Barangay staff can view submitted requests, preview certificates, refresh records, and manage pending documents. |
| Cardano ledger integration | Admin users can connect a Cardano browser wallet and push verified request metadata to the Cardano Preview testnet. |
| Public transaction ledger | Displays anonymized document request records and Cardano transaction hashes for transparency. |
| Community pages | Includes heritage, mission and vision, emergency lines, and Barangay Tuyom landing sections. |

## Tech Stack

| Layer | Tools |
| --- | --- |
| Frontend | React, Vite, React Router |
| Styling and UI | Tailwind CSS, Lucide React, Framer Motion |
| Backend services | Supabase Auth, Supabase Database, Supabase Storage |
| Documents | `@react-pdf/renderer` |
| Blockchain | Mesh SDK, Cardano browser wallets, Cardano Preview testnet |

## Project Structure

```text
kuha/
├── src/
│   ├── assets/              # Images, logos, and page media
│   ├── components/
│   │   ├── layout/          # Navbar, footer, and layout shell
│   │   └── pdf/             # Certificate PDF template
│   ├── lib/                 # Supabase client setup
│   ├── pages/               # Public, request, ledger, and admin pages
│   ├── App.jsx              # Routes and admin access modal
│   ├── index.css            # Global styles
│   └── main.jsx             # React entry point
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## Getting Started

### Prerequisites

Install the following before running the project:

- Node.js
- npm
- A Supabase project
- A Cardano browser wallet for admin ledger actions, such as Lace, Nami, or Eternl

### Installation

```bash
git clone <your-repository-url>
cd kuha
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=supabase_project_url
VITE_SUPABASE_ANON_KEY=supabase_anon_key
VITE_TUYOMPASSWORD=admin_access_password
```

### Supabase Requirements

The current app expects:

- A `requests` table for document request records
- An `id_pictures` storage bucket for uploaded 2x2 ID pictures
- Email OTP authentication enabled in Supabase Auth

Recommended `requests` fields include:

```text
id
created_at
document_type
full_name
age
purok
purpose
email
fulfillment_method
id_picture_url
status
verified_at
tx_hash
```

## Available Scripts

```bash
npm run dev
```

Starts the local development server.

```bash
npm run build
```

Builds the app for production.

```bash
npm run preview
```

Serves the production build locally.

```bash
npm run lint
```

Runs ESLint across the project.

## Main Routes

| Route | Description |
| --- | --- |
| `/` | Barangay Tuyom home page |
| `/request` | Resident certificate request flow |
| `/transactions` | Public ledger of requests and Cardano transaction hashes |
| `/heritage` | Heritage landing page |
| `/admin` | Protected secretary/admin document logs |
| `/Heritage` | Barangay heritage information |
| `/VisionMission` | Vision and mission page |
| `/EmergencyLines` | Emergency contact page |

## Admin and Blockchain Flow

1. Open the secretary access modal from the lock button.
2. Enter the configured `VITE_TUYOMPASSWORD`.
3. Review submitted certificate requests in the admin logs.
4. Connect a Cardano browser wallet.
5. Push a verified record to the Cardano Preview testnet.
6. View the transaction hash in the public ledger or CardanoScan preview explorer.

## Deployment Notes

This is a Vite single-page application. It can be deployed to static hosting providers such as Vercel, Netlify, GitHub Pages, or Supabase hosting-compatible workflows.

Before deployment, configure the same environment variables in the hosting provider dashboard.

## Team

Built for a CSIT360 project to support digital barangay services, document accessibility, and transparent public records for Barangay Tuyom.
