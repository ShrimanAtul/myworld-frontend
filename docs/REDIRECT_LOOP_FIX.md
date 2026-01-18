# Redirect Loop Fix - Login/Dashboard

## Problem Description

The `/login` and `/dashboard` pages were stuck in an infinite redirect loop.

### Root Cause

The issue was caused by **stale authentication state** persisted in localStorage via Zustand:

1. User logs in successfully → Auth state saved to localStorage (user + accessToken)
2. User makes API calls → Token expires or becomes invalid
3. API returns 401 → Client redirects to `/login`
4. **BUT**: Zustand still has `user` in localStorage
5. LoginPage `useEffect` checks for `user` → Redirects to `/dashboard`
6. Dashboard loads → Makes API call → 401 → Redirects to `/login`
7. **LOOP CONTINUES** ♾️

## Changes Made

### 1. **LoginPage.tsx** - Check for Both User AND Token
```typescript
// Before: Only checked for user
if (user) {
  navigate('/dashboard', { replace: true });
}

// After: Check for BOTH user and accessToken
if (user && accessToken && !hasRedirected.current && !isLoading) {
  console.log('[LoginPage] User already authenticated with valid token, redirecting...');
  hasRedirected.current = true;
  navigate('/dashboard', { replace: true });
} else if (user && !accessToken) {
  console.log('[LoginPage] Stale auth state detected (user without token), staying on login');
}
```

**Why this helps**: If the user exists but token is missing/invalid, we don't redirect. This prevents the loop when auth is partially cleared.

### 2. **Router.tsx** - ProtectedRoute Checks Token Too
```typescript
// Before: Only checked user
const { user } = useAuthStore();
return user ? <>{children}</> : <Navigate to="/login" replace />;

// After: Check BOTH user and accessToken
const { user, accessToken } = useAuthStore();

if (!user || !accessToken) {
  console.log('[ProtectedRoute] No user or token, redirecting to login');
  return <Navigate to="/login" replace />;
}

return <>{children}</>;
```

**Why this helps**: Ensures that protected routes require a valid token, not just a user object.

### 3. **client.ts** - Properly Clear Auth on 401
```typescript
// Before: Just redirected
if (apiError.status === 401) {
  setAccessToken(null);
  window.location.href = '/login';
}

// After: Clear auth state BEFORE redirecting, with safeguards
if (apiError.status === 401) {
  console.log('[API Client] 401 error, clearing auth and redirecting');
  setAccessToken(null);
  
  // Only redirect if not already on login/register page
  if (!window.location.pathname.startsWith('/login') && 
      !window.location.pathname.startsWith('/register')) {
    // Clear Zustand auth state
    import('@shared/hooks/useAuth').then(({ useAuthStore }) => {
      useAuthStore.getState().clearAuth();
      // Wait for localStorage to update
      setTimeout(() => {
        window.location.href = '/login';
      }, 100);
    });
  }
}
```

**Why this helps**: 
- Prevents redirect loop if already on login page
- Clears BOTH in-memory token AND Zustand persisted state
- Waits for localStorage to flush before redirecting

### 4. **useAuth.ts** - Added Logging
```typescript
clearAuth: () => {
  console.log('[AuthStore] clearAuth called');
  setApiAccessToken(null);
  set({ user: null, accessToken: null, isAuthenticated: false });
  console.log('[AuthStore] Auth cleared successfully');
},
```

**Why this helps**: Makes debugging easier to see when auth is cleared.

## How to Test

### Test 1: Normal Login Flow
1. Clear localStorage: `localStorage.clear()`
2. Go to `http://localhost:3000/login`
3. Enter valid credentials and login
4. ✅ Should redirect to `/dashboard` once
5. ✅ Should stay on dashboard (no loop)

### Test 2: Already Logged In
1. Log in successfully (from Test 1)
2. Navigate to `http://localhost:3000/login` manually
3. ✅ Should immediately redirect to `/dashboard`
4. ✅ Console should show: `[LoginPage] User already authenticated with valid token, redirecting...`

### Test 3: Expired Token Scenario
1. Log in successfully
2. Open DevTools → Application → Local Storage
3. Find `auth-storage` key
4. Manually delete the `accessToken` field (keep `user`)
5. Reload the page
6. Try to access `http://localhost:3000/dashboard`
7. ✅ Should redirect to `/login` (no loop)
8. ✅ Console should show: `[LoginPage] Stale auth state detected (user without token), staying on login`

### Test 4: 401 Error Handling
1. Log in successfully
2. Open DevTools → Network tab
3. Simulate a 401 by invalidating your token in the backend (or wait for expiration)
4. Navigate around the app to trigger an API call
5. ✅ Should redirect to `/login` once
6. ✅ Should NOT loop back to dashboard
7. ✅ Console should show: `[API Client] 401 error, clearing auth and redirecting`

### Test 5: Direct Dashboard Access (Not Logged In)
1. Clear localStorage: `localStorage.clear()`
2. Go directly to `http://localhost:3000/dashboard`
3. ✅ Should redirect to `/login`
4. ✅ Should stay on login page (no loop)
5. ✅ Console should show: `[ProtectedRoute] No user or token, redirecting to login`

## Console Logs to Watch For

If everything is working correctly, you should see:

**On Login Page (not authenticated):**
```
[ProtectedRoute] Checking auth: { hasUser: false, hasToken: false }
```

**On Login Page (with stale user but no token):**
```
[LoginPage] Stale auth state detected (user without token), staying on login
```

**On Successful Login:**
```
[LoginPage] Starting login for: user@example.com
[authApi] login called with: user@example.com
[API Request] POST /auth/login
[API Response] POST /auth/login
[LoginPage] Login response received
[AuthStore] setAuth called with: { user: {...}, accessToken: '...' }
[AuthStore] State updated successfully
[LoginPage] setAuth completed, navigating to dashboard...
[ProtectedRoute] Checking auth: { hasUser: true, hasToken: true }
[ProtectedRoute] User authenticated, rendering protected content
```

**On 401 Error:**
```
[API Error] { correlationId: '...', status: 401, ... }
[API Client] 401 error, clearing auth and redirecting
[AuthStore] clearAuth called
[AuthStore] Auth cleared successfully
(then redirects to /login)
```

## What If It Still Loops?

If you still see a redirect loop after these changes:

1. **Clear All Local Storage**
   ```javascript
   // In browser console
   localStorage.clear();
   sessionStorage.clear();
   ```

2. **Check for Multiple Auth State Managers**
   - Search codebase for other state management that might store user data
   - `grep -r "useState.*user" myworld-frontend/src`

3. **Check Backend Token Validation**
   - The backend might be rejecting valid tokens
   - Check backend logs for 401 responses

4. **Disable React Strict Mode Temporarily**
   - In development, React.StrictMode causes double-renders
   - This can trigger effects multiple times
   - Check `main.tsx` or `App.tsx` for `<React.StrictMode>`

5. **Add More Logging**
   - Add console.log to track the exact flow
   - Use React DevTools to monitor state changes

## Files Modified

- ✅ `myworld-frontend/src/modules/auth/pages/LoginPage.tsx`
- ✅ `myworld-frontend/src/app/Router.tsx`
- ✅ `myworld-frontend/src/shared/api/client.ts`
- ✅ `myworld-frontend/src/shared/hooks/useAuth.ts`

## Related Concepts

### Zustand Persistence
Zustand's `persist` middleware automatically saves state to localStorage. This is great for keeping users logged in across page refreshes, but can cause issues if not properly cleared on auth errors.

### React Router's replace
Using `replace: true` in navigation prevents the redirect from being added to browser history, which helps avoid back-button issues.

### useRef for One-Time Actions
`hasRedirected.current` prevents multiple redirects during React's rendering lifecycle.

---

**Last Updated**: 2024
**Status**: ✅ Fixed
