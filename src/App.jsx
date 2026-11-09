import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import CartProvider from '@/components/CartProvider';
import { LanguageProvider } from '@/lib/i18n';
import { ThemeProvider } from '@/lib/theme';
import Landing from '@/pages/Landing';
import Access from '@/pages/Access';
import Dashboard from '@/pages/Dashboard';
import MyPalms from '@/pages/MyPalms';
import PalmProfile from '@/pages/PalmProfile';
import PalmHealth from '@/pages/PalmHealth';
import PalmAnalysis from '@/pages/PalmAnalysis';
import Weevil from '@/pages/Weevil';
import SmartMap from '@/pages/SmartMap';
import Waste from '@/pages/Waste';
import Collection from '@/pages/Collection';
import Circular from '@/pages/Circular';
import Store from '@/pages/Store';
import Impact from '@/pages/Impact';
import Alerts from '@/pages/Alerts';
import Facility from '@/pages/Facility';
import Community from '@/pages/Community';
import Lands from '@/pages/Lands';
import Methodology from '@/pages/Methodology';
import Legal from '@/pages/Legal';
import Admin from '@/pages/Admin';
import Tour from '@/pages/Tour';
import AppShell from '@/components/AppShell';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
// Add page imports here

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      {/* Add your page Route elements here */}
      <Route path="/" element={<Landing />} />
      <Route path="/access" element={<Access />} />
      <Route path="/tour" element={<Tour />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route element={<AppShell />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/palms" element={<MyPalms />} />
        <Route path="/palms/:id" element={<PalmProfile />} />
        <Route path="/health" element={<PalmHealth />} />
        <Route path="/analysis" element={<PalmAnalysis />} />
        <Route path="/weevil" element={<Weevil />} />
        <Route path="/map" element={<SmartMap />} />
        <Route path="/waste" element={<Waste />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/circular" element={<Circular />} />
        <Route path="/store" element={<Store />} />
        <Route path="/impact" element={<Impact />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/lands" element={<Lands />} />
        <Route path="/community" element={<Community />} />
        <Route path="/facility" element={<Facility />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/methodology" element={<Methodology />} />
        <Route path="/privacy" element={<Legal />} />
        <Route path="/terms" element={<Legal />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <ThemeProvider>
          <LanguageProvider>
            <Router>
              <CartProvider>
                <ScrollToTop />
                <AuthenticatedApp />
              </CartProvider>
            </Router>
          </LanguageProvider>
        </ThemeProvider>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App