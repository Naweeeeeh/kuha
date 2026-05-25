<div align="center">
  <img src="./src/assets/kuha-logo.png" alt="KUHA Portal Logo" width="120" />

  <h1>KUHA Portal</h1>

  <p>
    A Barangay Tuyom document request DApp with Supabase-backed records,
    PDF certificate generation, and Cardano Preview transaction logging.
  </p>

  <p>
    <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=0B1F2A" alt="React" />
    <img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/Supabase-Backend-3FCF8E?style=for-the-badge&logo=supabase&logoColor=0B1F2A" alt="Supabase" />
    <img src="https://img.shields.io/badge/Cardano-Preview-0033AD?style=for-the-badge&logo=cardano&logoColor=white" alt="Cardano Preview" />
  </p>
</div>

---

## What the DApp Does

KUHA Portal digitizes barangay certificate requests for residents of Barangay Tuyom, Carcar City, Cebu. Residents can verify their email, submit document details, upload a required 2x2 ID picture, and receive either a downloadable PDF certificate or instructions for onsite pickup.

For barangay staff, the DApp provides a protected admin workspace where requests can be reviewed, certificates can be previewed, and verified records can be logged to the Cardano Preview testnet. Once a record is pushed on-chain, the public transaction ledger displays the Cardano transaction hash for transparency.

## Core Features

| Feature | Description |
| --- | --- |
| Resident request flow | Email OTP verification, certificate form submission, ID picture upload, and digital or physical fulfillment options. |
| Certificate PDF generation | Generates barangay certificates using `@react-pdf/renderer`. |
| Admin records dashboard | Lets authorized staff view requests, preview printable certificates, and refresh submitted records. |
| Cardano wallet connection | Uses Mesh SDK to connect supported browser wallets from the admin page. |
| On-chain record logging | Stores request metadata in a Cardano Preview transaction with metadata label `674`. |
| Public ledger | Shows anonymized request records and links completed transactions to CardanoScan Preview. |

## Tech Stack

| Layer | Tools |
| --- | --- |
| Frontend | React, Vite, React Router |
| Styling and motion | Tailwind CSS, Lucide React, Framer Motion |
| Backend services | Supabase Auth, Supabase Database, Supabase Storage |
| PDF documents | `@react-pdf/renderer` |
| Blockchain | Mesh SDK, Cardano browser wallets, Cardano Preview testnet |

## Run Locally

### 1. Clone and install

```bash
git clone <your-repository-url>
cd kuha
npm install
```

### 2. Create environment variables

Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_TUYOMPASSWORD=your_admin_access_password
```

### 3. Start the development server

```bash
npm run dev
```

Open the local URL printed by Vite, usually:

```text
http://localhost:5173
```

### 4. Optional production check

```bash
npm run build
npm run preview
```

## Supabase Setup

The DApp expects Supabase to provide authentication, database records, and image storage.

Required Supabase configuration:

- Enable email OTP authentication.
- Create a `requests` table for submitted certificate requests.
- Create an `id_pictures` storage bucket for uploaded 2x2 photos.
- Make sure the app can insert and read the request fields used by the frontend.

Recommended `requests` fields:

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

## Wallet and Network Setup

The blockchain feature runs on the Cardano Preview testnet, not mainnet.

To use the admin on-chain logging flow:

1. Install a Cardano browser wallet supported by Mesh SDK, such as Lace, Nami, or Eternl.
2. Switch the wallet to the Cardano Preview testnet.
3. Fund the wallet with Preview test ADA.
4. Run the app locally and open `/admin`.
5. Unlock admin access using `VITE_TUYOMPASSWORD`.
6. Click `Connect Wallet` and approve the wallet connection.
7. Choose a verified request and click `Push to Ledger`.

When a request is pushed to the ledger, the app builds a transaction that sends `1.5 ADA` worth of lovelace back to the connected wallet address and attaches request metadata. After the wallet signs and submits the transaction, the resulting hash is saved to Supabase and shown in the public ledger.

Completed records link to:

```text
https://preview.cardanoscan.io/transaction/<tx_hash>
```

## Useful Routes

| Route | Description |
| --- | --- |
| `/` | Barangay Tuyom home page |
| `/request` | Resident certificate request flow |
| `/transactions` | Public ledger with Cardano transaction hashes |
| `/admin` | Protected admin document logs and wallet actions |
| `/Heritage` | Barangay heritage information |
| `/VisionMission` | Vision and mission page |
| `/EmergencyLines` | Emergency contact page |

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Build the app for production. |
| `npm run preview` | Preview the production build locally. |
| `npm run lint` | Run ESLint. |

## Deployment Notes

This is a Vite single-page application and can be deployed to static hosting providers such as Vercel, Netlify, or GitHub Pages. Configure the same environment variables in your hosting provider before deploying.

Because the admin password is exposed to the frontend as a `VITE_` variable, this setup is best suited for a school project, demo, or controlled prototype. For production use, move admin authentication and authorization to a secure backend.

## Team

Built for a CSIT360 project to support digital barangay services, document accessibility, and transparent public records for Barangay Tuyom.


## Contributors
- [x] Noeh Arbee Boiser
- [x] Karol Vincent Bebedor
- [x] Aldrin Suse
- [x] Julian Ramil Andales
- [x] Ignis Frostburn
- [ ] Jude Mikael Valencia 
