# MX Security Check

A modern mobile app built with **React Native** and **Expo** that analyzes email security configurations for any domain.

## Features

- **MX Record Analysis** — Discover mail servers and identify email providers
- **SPF Validation** — Check Sender Policy Framework configuration and qualifier strength
- **DKIM Probing** — Scan 25+ common DKIM selectors to verify email signing
- **DMARC Policy Check** — Analyze domain-based message authentication policies
- **Security Vendor Detection** — Identify 40+ email security gateways (Proofpoint, Mimecast, Barracuda, Cisco, etc.)
- **SMTP Gateway Identification** — Detect the primary email hosting provider
- **Security Score** — Comprehensive A+ to F grading based on all findings
- **Modern Dark UI** — Beautiful dark theme with gradient accents, animated loading, and expandable result cards

## How It Works

The app uses **DNS-over-HTTPS** (Cloudflare's `1.1.1.1` JSON API) to perform all DNS lookups directly from the device — no backend server required. It queries:

1. **MX records** to find mail servers
2. **TXT records** at the domain for SPF
3. **TXT records** at `_dmarc.{domain}` for DMARC
4. **TXT records** at `{selector}._domainkey.{domain}` for DKIM (tries 25+ selectors)

Results are cross-referenced against a database of 80+ vendor patterns covering security gateways, email hosts, SMTP relays, and SaaS email services.

## Getting Started

### Prerequisites

- **Node.js** 18+ installed
- **Expo Go** app on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

### Installation

```bash
# Navigate to the project directory
cd "MX Security check"

# Install dependencies
npm install

# Start the Expo development server
npx expo start
```

### Running the App

After running `npx expo start`:

- **On your phone:** Scan the QR code with Expo Go (Android) or the Camera app (iOS)
- **iOS Simulator:** Press `i` in the terminal
- **Android Emulator:** Press `a` in the terminal
- **Web browser:** Press `w` in the terminal

## Project Structure

```
MX Security check/
├── App.tsx                          # Entry point
├── app.json                         # Expo configuration
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config
├── babel.config.js                  # Babel config
├── staticwebapp.config.json         # Azure SWA config (routing, headers)
├── .github/
│   └── workflows/
│       └── azure-static-web-apps.yml # CI/CD pipeline
└── src/
    ├── theme/
    │   └── colors.ts                # Color palette & shadows
    ├── types/
    │   └── index.ts                 # TypeScript interfaces
    ├── services/
    │   └── dnsService.ts            # DNS-over-HTTPS queries & parsing
    ├── utils/
    │   ├── vendorDatabase.ts        # 80+ vendor identification patterns
    │   └── securityAnalyzer.ts      # Security score calculation & scan orchestration
    ├── components/
    │   ├── DomainInput.tsx           # Domain entry field with scan button
    │   ├── SecurityScore.tsx         # Circular SVG score gauge
    │   ├── ResultCard.tsx            # Expandable result card
    │   ├── VendorBadge.tsx           # Vendor info badges & list
    │   └── LoadingOverlay.tsx        # Animated loading state
    └── screens/
        └── HomeScreen.tsx            # Main application screen
```

## Detected Vendors (Partial List)

### Security Gateways
Proofpoint, Mimecast, Barracuda, Cisco Secure Email, Trellix (FireEye), Forcepoint, Sophos, Trend Micro, Broadcom (Symantec), Hornetsecurity, Abnormal Security, Avanan (Check Point), IronScales, Cloudflare Area 1, Tessian, Darktrace, Perception Point, SpamTitan, and more.

### Email Hosting
Microsoft 365, Google Workspace, Yahoo Mail, Zoho Mail, Rackspace, GoDaddy, Cloudflare, Apple iCloud, Fastmail, Proton Mail, Tutanota, OVH, IONOS, and more.

### SMTP Relays
Amazon SES, SendGrid, Mailgun, Postmark, SparkPost, Mandrill, Mailjet, SMTP2GO, Brevo, and more.

### Email Services (via SPF)
Mailchimp, HubSpot, Salesforce, Marketo, Zendesk, Freshdesk, Help Scout, Intercom, Constant Contact, Campaign Monitor, and more.

## Security Score Methodology

| Category          | Max Points | Criteria                                          |
|-------------------|:----------:|---------------------------------------------------|
| MX Records        | 15         | Present (10) + Redundancy (15)                    |
| SPF Record        | 20         | Present (10) + Hard fail `-all` (20)              |
| DKIM Signing      | 20         | 1 selector (15) + 2+ selectors (20)               |
| DMARC Policy      | 30         | Present (10) + `reject` (25) + Reporting (30)      |
| Security Gateway  | 15         | Dedicated security gateway detected               |
| **Total**         | **100**    |                                                   |

### Grades
- **A+** (90-100) — Excellent
- **A** (80-89) — Very Good
- **B** (70-79) — Good
- **C** (60-69) — Fair
- **D** (50-59) — Poor
- **F** (Below 50) — Critical

## Tech Stack

- **React Native** + **Expo** (SDK 51)
- **TypeScript** for type safety
- **react-native-svg** for the score gauge
- **expo-linear-gradient** for UI gradients
- **Cloudflare DNS-over-HTTPS** for DNS resolution

## Deploy to Azure Static Web Apps

This project is ready for continuous deployment from GitHub to **Azure Static Web Apps**.

### Quick Setup

1. **Push this repo to GitHub**
2. **Create an Azure Static Web App** in the [Azure Portal](https://portal.azure.com):
   - Go to **Create a resource** → **Static Web App**
   - Select your GitHub repo and branch (`main`)
   - Under build details, choose **Custom** and leave the fields empty (the workflow handles everything)
   - Click **Create** — Azure will generate a deployment token
3. **Add the deployment token** as a GitHub secret:
   - Go to your repo → **Settings** → **Secrets and variables** → **Actions**
   - Create a new secret named `AZURE_STATIC_WEB_APPS_API_TOKEN`
   - Paste the token from the Azure portal
4. **Push or merge to `main`** — The GitHub Actions workflow at `.github/workflows/azure-static-web-apps.yml` will automatically build and deploy the app

### Build Locally

```bash
# Build the static web app
npm run build:web

# Output is in the dist/ folder
```

### What's Included

| File | Purpose |
|------|---------|
| `.github/workflows/azure-static-web-apps.yml` | CI/CD pipeline for Azure SWA |
| `staticwebapp.config.json` | SPA routing, security headers, MIME types |
| `build:web` script | Builds the Expo app for static web hosting |
