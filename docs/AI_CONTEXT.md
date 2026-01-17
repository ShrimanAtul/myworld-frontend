# AI_CONTEXT.md

## Session: Prompt 21 – Frontend Architecture & Folder Structure

### Completed Tasks
1. ✅ Created complete folder structure for myworld-frontend
2. ✅ Configured package.json with all dependencies (React, TypeScript, Capacitor, React Query, Zustand, Axios, Tailwind CSS)
3. ✅ Configured TypeScript with strict mode and path aliases
4. ✅ Configured ESLint and Prettier
5. ✅ Configured Tailwind CSS with custom theme
6. ✅ Configured Capacitor for iOS and Android platforms
7. ✅ Created PWA manifest and service worker
8. ✅ Implemented API client with interceptors:
   - Correlation ID generation and injection
   - JWT token handling (memory only, NOT localStorage)
   - Error handling with correlation ID extraction
   - Request/response logging
9. ✅ Implemented base components: Button, Input, Modal, Spinner
10. ✅ Set up state management with Zustand for auth
11. ✅ Created React Query configuration
12. ✅ Created App structure with Router and AppShell
13. ✅ Created example auth module with LoginPage
14. ✅ Created example task module with DashboardPage

### Project Structure
```
myworld-frontend/
├── src/
│   ├── modules/
│   │   ├── auth/pages/LoginPage.tsx
│   │   ├── task/pages/DashboardPage.tsx
│   │   ├── ai/
│   │   ├── payment/
│   │   ├── feedback/
│   │   └── admin/
│   ├── shared/
│   │   ├── components/ (Button, Input, Modal, Spinner)
│   │   ├── hooks/ (useAuth)
│   │   ├── api/ (client, authApi)
│   │   ├── utils/ (correlationId)
│   │   ├── types/ (auth, api)
│   │   └── constants/ (config)
│   ├── app/
│   │   ├── App.tsx
│   │   ├── Router.tsx
│   │   └── AppShell.tsx
│   ├── assets/
│   └── styles/index.css
├── android/
├── ios/
├── public/
│   ├── manifest.json
│   └── service-worker.js
├── package.json
├── tsconfig.json
├── capacitor.config.ts
├── tailwind.config.js
├── .eslintrc.json
└── .prettierrc.json
```

### Key Implementation Details

#### API Client (src/shared/api/client.ts)
- Axios instance with base URL from environment
- Request interceptor: adds correlation ID and JWT token
- Response interceptor: logs and extracts correlation ID from errors
- Token storage: memory only (accessToken variable, NOT localStorage)
- 401 handling: clears token and redirects to login

#### Auth State Management (src/shared/hooks/useAuth.ts)
- Zustand store for auth state
- Stores user, accessToken, isAuthenticated
- setAuth: updates store and sets token in API client
- clearAuth: clears store and removes token from API client

#### Components
- Button: variants (primary, secondary, danger), sizes, loading state
- Input: label, error, helper text
- Modal: sizes, overlay, close button
- Spinner: sizes, loading indicator

#### Configuration
- TypeScript: strict mode, path aliases (@shared/*, @modules/*, @app/*)
- Tailwind: custom primary color palette
- Capacitor: configured for iOS and Android with push notifications plugin
- PWA: manifest with theme colors, basic service worker

### Security Compliance
✅ JWT tokens stored in memory only (NOT localStorage)
✅ Refresh token handled via HttpOnly cookies (withCredentials: true)
✅ Correlation ID in all requests
✅ Backend is authoritative (frontend only shows UI)

### Installation Status
✅ Dependencies installed successfully (749 packages, 0 vulnerabilities)
✅ TypeScript downgraded to 4.9.5 for react-scripts compatibility

### Next Steps


1. Initialize Capacitor platforms: `npm run cap:sync`
3. Add platform-specific assets (icons, splash screens)
4. Expand modules (task CRUD, AI features, payments)
5. Add more API endpoints as needed
6. Configure environment-specific .env files

### Architecture Alignment
- ✅ Single codebase for Web, Android, iOS (Capacitor)
- ✅ TypeScript strict mode enabled
- ✅ NO localStorage for tokens (memory only)
- ✅ NO Redux (using React Query + Zustand)
- ✅ Clean separation: modules, shared, app
- ✅ Correlation ID strategy implemented
- ✅ API client with proper interceptors
