# Alti.Assistant Frontend

A premium, enterprise-grade Next.js client dashboard powering autonomous agent
interactions, multi-tenant workspace isolation, dynamic workflows, and custom
Swarm agent configurations.

---

## 🌟 Key Architecture & Features

### 1. Unified Multitenancy & Workspaces

- **Secure Isolation**: Implements strict data boundaries for Personal
  workspaces and Tenant (Organization) environments.
- **Tenant Context**: Smooth, Vercel-style tenant toggle controls situated
  directly in the sidebar with live state synchronization.
- **RBAC Member Management**: A streamlined member invitation page featuring an
  interactive team list with three distinct roles (Owner, Admin, User), secure
  sign-up link generation, and real-time search.

### 2. Premium Navigation & Sidebar Console

- **Premium Sliding Menu**: A consolidated five-tab icon-track navbar featuring:
  - **AI**: Standard multi-turn conversions and grounding.
  - **Projects (Agents)**: Dynamic listings and project creation workflows.
  - **Models**: Management of custom enterprise neural models.
  - **Apps**: Direct Composio integration exposing over 893 connectable web
    applications.
  - **Workflows**: Visual prompt-automation trigger chains.
- **Layout-Responsive Control**: Flexible drawer menus for mobile viewports
  alongside a collapsible sidebar for optimized workspace estate on desktop.

### 3. iOS-Style Premium UI Components

- **Chat Memory sliding segment control**: Replaces boring radio buttons with a
  fluid, high-fidelity iOS-style sliding track to choose chat retention (Off, 1
  Month, 3 Months, 6 Months, 12 Months) with direct `localStorage` state
  persistence.
- **iOS-style Invite Sent success modal**: Widened with dynamic layout
  adjustments to present long email addresses on a clean second line with
  balanced vertical spacing.
- **iOS-style delete confirmation popups**: Intercepts delete triggers for
  system instructions and safety guardrails, offering a premium 380px blur/dim
  layout to confirm removals.
- **Zero-Banners Guardrail Updates**: Instantaneous instruction updates listing
  rules directly under the search bar with zero annoying popup toasts.
- **Chat vs Studio Spaces Page Toggle**: Situates a premium sliding selector for
  switching between "Chat" and "Studio" sub-modes inside individual Spaces. It
  dynamically updates the child category tracks: **Chat** displays Chat
  (default), Research, Write, Review; **Studio** displays Code (default), Image,
  Video, Audio. Features high-fidelity micro-interactions with even 24px
  vertical alignment spacing.

### 4. Interactive Swarm & Research Panels

- **Telemetry Console**: Live streaming token logs, latency trackers, and
  evaluation scores.
- **Deep Research UI**: Supports multi-turn adversarial critique graphs,
  crawling telemetry consoles, and high-fidelity McKinsey-style report
  compilation.

---

## 🛠️ Technology Stack

- **Core Framework**: React 19 (React Server Components), Next.js 15 (App Router
  with dynamic pre-render cache control).
- **Styling**: Vanilla CSS combined with TailwindCSS for fluid utility design.
- **State Management**: Zustand store (`useConversationsStore`, `useBotsStore`,
  `useSidebarStore`).
- **Authentication**: NextAuth.js (Auth.js v5) with secure OAuth callback flows.
- **Icons**: Lucide React.
- **API Client**: Hardened JSON client with base-path routing and authorization
  header bindings.

---

## 🚀 Local Development

### 1. Environment Setup

Create a `.env.local` file in the root of the project with the following
properties:

```env
# NextAuth Configuration
AUTH_SECRET=your_auth_secret_key
AUTH_TRUST_HOST=true
AUTH_URL=http://localhost:3000

# Backend Connection
NEXT_PUBLIC_API_URL=http://localhost:5100/api/v1
```

### 2. Run the Server

Install dependencies and launch the Next.js development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the client
dashboard.

### 3. Run Dev Over HTTPS (secure, recommended for payment flows)

The quickest way to make your local site use HTTPS (so Chrome won't show the
payment infobar) is to expose it through ngrok. This does not require code
changes.

1. Install ngrok globally or via npm:

```bash
# global
brew install ngrok/ngrok/ngrok  # macOS (or download from ngrok.com)
# or via npm
npm install -g ngrok
```

2. Start your dev server and ngrok in parallel (we added a helper):

```bash
pnpm install
pnpm run dev:secure
```

3. Open the generated `https://...` ngrok URL in Chrome — the page will be
   served over HTTPS.

Alternative: Use `mkcert` for trusted localhost certificates and run Next.js
over HTTPS locally. If you want this, I can add an automated
`scripts/dev-https.js` helper that uses `mkcert` certs and starts Next with
HTTPS. If you prefer a local HTTPS endpoint without a tunnel (recommended for
consistent testing), follow these steps to use `mkcert` with the included HTTPS
proxy helper:

1. Install `mkcert` for your OS (see https://github.com/FiloSottile/mkcert).
2. Create a `certs/` folder in the project root and generate certs:

```bash
mkcert -install
mkdir -p certs
mkcert -cert-file ./certs/localhost.pem -key-file ./certs/localhost-key.pem localhost 127.0.0.1 ::1
```

3. Run the secure dev proxy (starts Next dev on port 3000 and a local HTTPS
   proxy on 3443):

```bash
pnpm install
pnpm run dev:mkcert
```

4. Open `https://localhost:3443` in your browser. The site will be served over
   HTTPS and Chrome should stop showing the payment infobar.

If you'd like, I can also automate mkcert installation detection and certificate
generation inside a Node helper. Would you like me to add that automation?

---

## 🌐 Production VM & Nginx Deployment

For deploying this frontend directly to a GCP VM instance using PM2 and Nginx:

1. **Production Variables**: Ensure the following env properties are declared in
   the PM2 startup script:
   - `AUTH_TRUST_HOST=true` (crucial for reverse proxy SSL handshakes)
   - `AUTH_URL=https://insosearch.com` (forces absolute redirect URLs)
   - `NEXT_PUBLIC_API_URL=https://api.altihq.com/api/v1`
2. **Nginx Reverse Proxy**: Configure your Nginx block to forward `/api/v1` to
   the backend and root requests to Next.js on port `3000`:

   ```nginx
   server {
       server_name insosearch.com www.insosearch.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }

       location /api/v1 {
           proxy_pass http://localhost:5100;
           proxy_http_version 1.1;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

---

## 🔒 Verification & Type Safety

Ensure the build compiles cleanly with Zero TypeScript errors:

```bash
npx tsc --noEmit
```

All pull requests must pass compilation verification before automated Cloud Run
deployment.
