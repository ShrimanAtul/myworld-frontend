#!/bin/bash

# Test Script for Redirect Loop Fix
# This script helps verify that the login/dashboard redirect loop is fixed

echo "=================================================="
echo "  Redirect Loop Fix - Manual Testing Guide"
echo "=================================================="
echo ""

echo "Prerequisites:"
echo "  ✓ Backend server running on http://localhost:8080"
echo "  ✓ Frontend server running on http://localhost:3000"
echo ""

echo "Test Scenarios:"
echo ""

echo "1️⃣  Test: Normal Login Flow"
echo "   - Open browser console (F12)"
echo "   - Run: localStorage.clear()"
echo "   - Go to: http://localhost:3000/login"
echo "   - Enter valid credentials"
echo "   - Expected: Redirect to /dashboard ONCE (no loop)"
echo "   - Expected console: '[LoginPage] setAuth completed, navigating to dashboard...'"
echo ""

echo "2️⃣  Test: Already Logged In"
echo "   - After logging in from Test 1"
echo "   - Go to: http://localhost:3000/login"
echo "   - Expected: Immediate redirect to /dashboard"
echo "   - Expected console: '[LoginPage] User already authenticated with valid token, redirecting...'"
echo ""

echo "3️⃣  Test: Stale Auth State (User without Token)"
echo "   - Open DevTools → Application → Local Storage"
echo "   - Find 'auth-storage' key"
echo "   - Edit JSON: remove 'accessToken' field (keep 'user')"
echo "   - Reload page"
echo "   - Go to: http://localhost:3000/dashboard"
echo "   - Expected: Redirect to /login (no loop)"
echo "   - Expected console: '[LoginPage] Stale auth state detected (user without token), staying on login'"
echo ""

echo "4️⃣  Test: Protected Route Access (Not Logged In)"
echo "   - Run: localStorage.clear()"
echo "   - Go to: http://localhost:3000/dashboard"
echo "   - Expected: Redirect to /login (no loop)"
echo "   - Expected console: '[ProtectedRoute] No user or token, redirecting to login'"
echo ""

echo "5️⃣  Test: 401 Error Handling"
echo "   - Log in successfully"
echo "   - Wait for token to expire (or invalidate manually)"
echo "   - Navigate around the app"
echo "   - Expected: Redirect to /login once"
echo "   - Expected console: '[API Client] 401 error, clearing auth and redirecting'"
echo ""

echo "=================================================="
echo "Automated Checks:"
echo "=================================================="
echo ""

# Check if servers are running
echo -n "Checking backend server... "
if curl -s http://localhost:8080/actuator/health > /dev/null 2>&1; then
    echo "✅ RUNNING"
else
    echo "❌ NOT RUNNING - Start with: cd myworld-backend && ./mvnw spring-boot:run"
fi

echo -n "Checking frontend server... "
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ RUNNING"
else
    echo "❌ NOT RUNNING - Start with: cd myworld-frontend && npm run dev"
fi

echo ""
echo "=================================================="
echo "Code Changes Made:"
echo "=================================================="
echo ""
echo "✅ LoginPage.tsx    - Check for both user AND accessToken"
echo "✅ Router.tsx       - ProtectedRoute validates token"
echo "✅ client.ts        - Clear auth on 401 before redirect"
echo "✅ useAuth.ts       - Added clearAuth logging"
echo ""

echo "=================================================="
echo "Console Logs to Watch:"
echo "=================================================="
echo ""
echo "Good signs (no loop):"
echo "  - '[LoginPage] User already authenticated with valid token, redirecting...'"
echo "  - '[ProtectedRoute] Checking auth: { hasUser: true, hasToken: true }'"
echo "  - '[AuthStore] setAuth called with: ...'"
echo ""
echo "Loop detection (bad):"
echo "  - Repeated '[LoginPage]' and '[ProtectedRoute]' logs"
echo "  - URL oscillating between /login and /dashboard"
echo "  - Browser becomes unresponsive"
echo ""

echo "=================================================="
echo "Quick Fix Commands:"
echo "=================================================="
echo ""
echo "Clear localStorage (in browser console):"
echo "  localStorage.clear(); sessionStorage.clear();"
echo ""
echo "View auth state (in browser console):"
echo "  JSON.parse(localStorage.getItem('auth-storage'))"
echo ""
echo "Manually clear auth (in browser console):"
echo "  localStorage.removeItem('auth-storage')"
echo ""

echo "=================================================="
echo "Need Help?"
echo "=================================================="
echo ""
echo "See: docs/REDIRECT_LOOP_FIX.md for detailed explanation"
echo ""

read -p "Press Enter to open browser to http://localhost:3000/login..."

# Try to open browser (works on macOS, Linux, WSL)
if command -v open > /dev/null; then
    open "http://localhost:3000/login"
elif command -v xdg-open > /dev/null; then
    xdg-open "http://localhost:3000/login"
elif command -v start > /dev/null; then
    start "http://localhost:3000/login"
else
    echo "Could not auto-open browser. Please navigate to: http://localhost:3000/login"
fi

echo ""
echo "Happy testing! 🚀"
