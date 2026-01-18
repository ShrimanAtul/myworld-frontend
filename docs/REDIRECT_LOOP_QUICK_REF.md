# Redirect Loop - Quick Reference Card

## 🚨 Problem
Login and Dashboard pages redirect to each other infinitely

## ✅ Solution Summary
Check for **BOTH** `user` AND `accessToken` before redirecting

## 🔧 Key Changes

| File | Change | Why |
|------|--------|-----|
| `LoginPage.tsx` | Check `user && accessToken` | Prevents redirect with stale user |
| `Router.tsx` | Validate token in ProtectedRoute | Ensures valid auth |
| `client.ts` | Clear auth before 401 redirect | Removes stale state |
| `useAuth.ts` | Added logging | Easier debugging |

## 🧪 Quick Test

```javascript
// In browser console
localStorage.clear()
// Then try to access /dashboard
// Should redirect to /login ONCE (not loop)
```

## 🐛 Still Looping?

```javascript
// Emergency fix - clear everything
localStorage.clear();
sessionStorage.clear();
// Then refresh page
```

## 📊 Good vs Bad Console Logs

### ✅ Good (No Loop)
```
[LoginPage] Starting login for: user@example.com
[AuthStore] setAuth called with: ...
[ProtectedRoute] Checking auth: { hasUser: true, hasToken: true }
[ProtectedRoute] User authenticated, rendering protected content
```

### ❌ Bad (Loop Detected)
```
[LoginPage] User already authenticated, redirecting...
[ProtectedRoute] No user or token, redirecting to login
[LoginPage] User already authenticated, redirecting...
[ProtectedRoute] No user or token, redirecting to login
... (repeats forever)
```

## 🔍 Debug Commands

```javascript
// View current auth state
JSON.parse(localStorage.getItem('auth-storage'))

// Check what's in store
const state = useAuthStore.getState();
console.log({ user: state.user, token: state.accessToken });

// Manually clear auth
useAuthStore.getState().clearAuth();
```

## 📖 Full Documentation
See `docs/REDIRECT_LOOP_FIX.md` for complete details

## 🎯 The Core Issue
**Zustand persistence** kept user in localStorage even after token expired/invalidated.

## 💡 The Fix
Always validate **both pieces** of auth data:
- `user` object (who you are)
- `accessToken` (proof you're allowed)

Missing either = not authenticated = stay on login page
