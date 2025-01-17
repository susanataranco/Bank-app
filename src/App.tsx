import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  SignIn,
  SignOutButton,
  UserButton,
} from "@clerk/clerk-react";
import LoadingBar from "./components/LoadingBar";
import { Toaster } from "./components/ui/toaster";
import Home from "./pages/Home";

const App: React.FC = () => {
  return (
    <Router>
      <div className="relative">
        {/* Loading Bar */}
        <LoadingBar />

        {/* Toaster */}
        <Toaster />

        {/* Header */}
        <header className="sticky top-0 flex items-center justify-between w-full p-4 bg-main">
          <Link to="/" className="text-lg font-bold text-white">
            <div className="flex items-center">
              <svg className="w-20 text-white c-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 116 50">
                <path fill="currentColor" fill-rule="evenodd" d="M53 10.78 59.72 9v7.09l7.45-1.88v5.25l-7.45 2.23v9.22c0 1.44.15 2.03.68 2.54.65.62 1.35.78 2.39.78a9.09 9.09 0 0 0 3.29-.94l1.02-.42v5.05A11.83 11.83 0 0 1 60.83 40c-2.9 0-4.63-.63-5.96-1.91-1.42-1.37-1.88-3.38-1.88-6.35V10.78Zm-8.9 8.76 6.8-1.8v-6.41l-6.8 1.79v6.42Zm0 19.71h6.8V19.76l-6.8 1.8v17.7ZM99.34 20.2l-7.06 1.51 1.23 4.32 6.87-2.18-2.17 6.64 4.5 1.13 1.47-6.82 4.9 5.13 3.26-3.18-5.4-4.64L114 20.6l-1.23-4.31-6.88 2.17 2.17-6.64-4.5-1.13-1.47 6.82-4.9-5.13-3.26 3.18 5.4 4.64Zm-65.09.43.24-.07c.7-3.02 2.61-4.6 4.78-5.83a12.4 12.4 0 0 1 2.81-1.1v6.46l-1.73.45c-3.5.92-5.98 2.96-5.98 9.7v9.01h-6.73V17.47l6.61-1.76v4.92Zm-15.09 1.66a6.49 6.49 0 0 0 3.95-5.9c.24-4.26-3.56-6.8-10.56-6.63-1.33.03-2.9.15-4.4.29-3.18.31-6.14.72-6.14.72V39.3s4.37.6 12.25-.17c7.82-.78 12.1-4.85 11.53-10.55-.4-4.14-3.2-5.47-6.63-6.28ZM8.58 15.05s.92-.2 3.63-.57c2.9-.4 4.28.83 4.32 2.54.06 2.43-1.28 3.15-2.5 3.67a34.83 34.83 0 0 1-5.45 1.62v-7.26Zm5.02 18.7c-3.07.58-5.02.36-5.02.36v-6.47s1.34-.69 5.01-1.5c2.84-.63 5.18.4 5.22 2.58.04 2.71-2.17 4.47-5.2 5.04Zm54.26-4.9c-.55-8.85 5.62-13.57 12.31-13.37 7.42.23 10.82 5.69 11 11.56l-16.3 4.18c.58 2.2 3.1 4 6.38 3.65 2.8-.3 3.61-1.56 4.22-2.86l5.8-1.48c-.32 5.3-5.02 9.86-11.68 9.44-7.63-.47-11.4-5.78-11.73-11.11Zm7.8-6.47a5.32 5.32 0 0 0-1.45 3.72l10.02-2.6c-.43-1.72-1.95-3.2-4.87-2.9a5.74 5.74 0 0 0-3.7 1.78Z" clip-rule="evenodd"></path>
              </svg>
              <span className="pl-2 italic">Fun test!</span>
            </div>
          </Link>
          <div className="flex align-middle">
            <SignedIn>
              <UserButton/>
              <SignOutButton>
                <button className="px-3 py-1 ml-4 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600">
                  Sign Out
                </button>
              </SignOutButton>
            </SignedIn>
          </div>
        </header>

        {/* Content */}
        <div>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/sign-in"
              element={
                <SignedOut>
                  <SignIn />
                </SignedOut>
              }
            />

            {/* Home Route */}
            <Route
              path="/"
              element={
                <>
                  <SignedIn>
                    <Home />
                  </SignedIn>
                  <SignedOut>
                    <SignIn />
                  </SignedOut>
                </>
              }
            />

            {/* Route for Non-authenticated Users */}
            <Route
              path="*"
              element={<RedirectToSignIn redirectUrl="/sign-in" />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
