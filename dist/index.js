import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import './index.css';
import App from './App';
import { LoadingProvider } from './contexts/LoadingContext';
const PUBLISHABLE_KEY = process.env.CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
    throw new Error("Missing Clerk Publishable Key");
}
console.log("Publishable Key:", process.env.CLERK_PUBLISHABLE_KEY);
console.log("✅ React App Loaded!");
const rootElement = document.getElementById('root');
if (!rootElement) {
    console.error("❌ No root element found!");
}
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(_jsx(React.StrictMode, { children: _jsx(ClerkProvider, { publishableKey: PUBLISHABLE_KEY, afterSignOutUrl: "/sign-in", children: _jsx(LoadingProvider, { children: _jsx(App, {}) }) }) }));
}
else {
    console.error("Root element not found.");
}
