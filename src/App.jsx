import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";

// CRITICAL: Import Login and Signup directly (NO lazy loading for auth pages)
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Other pages can use regular imports
import {
  Home,
  Profile,
  Schemes,
  Jobs,
  Search,
  // Chat, // Temporarily disabled for debugging
  Admin,
  SchemeDetail,
  Analytics,
  TestPage,
} from "./pages";

// import Header from "./components/header";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import "./App.css";

export default function App() {
  const { isLoading } = useAuth();

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 font-sans">
      <SocketProvider>
        <Router>
          <div className="w-full min-h-screen">
            {/* <Header /> */}
            <main className="min-h-screen">
            <Routes>
              {/* Public routes - NO LAZY LOADING for auth pages */}
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/signup" 
                element={
                  <PublicRoute>
                    <Signup />
                  </PublicRoute>
                } 
              />
              
              {/* Protected routes */}
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/schemes" 
                element={
                  <ProtectedRoute>
                    <Schemes />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/schemes/:id" 
                element={
                  <ProtectedRoute>
                    <SchemeDetail />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/jobs" 
                element={
                  <ProtectedRoute>
                    <Jobs />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/search" 
                element={
                  <ProtectedRoute>
                    <Search />
                  </ProtectedRoute>
                } 
              />
              {/* <Route 
                path="/chat" 
                element={
                  <ProtectedRoute>
                    <Chat />
                  </ProtectedRoute>
                } 
              /> */}
              
              {/* Employer routes */}
              <Route 
                path="/employer-dashboard" 
                element={
                  <ProtectedRoute roles={['employer']}>
                    <Home />
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin-only routes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute roles={['admin']}>
                    <Admin />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/analytics" 
                element={
                  <ProtectedRoute roles={['admin']}>
                    <Analytics />
                  </ProtectedRoute>
                } 
              />
              
              {/* Test page - accessible to all authenticated users */}
              <Route 
                path="/test" 
                element={
                  <ProtectedRoute>
                    <TestPage />
                  </ProtectedRoute>
                } 
              />
              
             
            </Routes>
          </main>
                  </div>
        </Router>
      </SocketProvider>
    </div>
  );
}
