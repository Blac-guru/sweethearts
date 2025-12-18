import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient.js";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster.jsx";
import { TooltipProvider } from "@/components/ui/tooltip.jsx";
import Homepage from "@/pages/homepage.jsx";
import ProfilePage from "@/pages/profile.jsx";
import RegistrationPage from "@/pages/registration.jsx";
import NotFound from "@/pages/not-found.jsx";
import ContactPage from "./pages/contact.jsx";
import SetupAccountPage from "./pages/setup-account.jsx";
import PaystackCallback from "./pages/paystack-callback.jsx";
import TermsAndConditionsPage from "./pages/terms.jsx";
import AgeConsentPage from "./pages/age-consent.jsx";
import PrivacyPolicyPage from "./pages/privacy.jsx";
import CookiePolicyPage from "./pages/cookies.jsx";
import ParentalControlsPage from "./pages/parental-controls.jsx";
import CookieConsent from "./components/cookie-consent.jsx";
import SearchPage from "./pages/search.jsx";
import ChatsPage from "./pages/chats.jsx";
import { HelmetProvider } from "react-helmet-async";

function Router() {
  const [location, setLocation] = useLocation();

  useEffect(() => {
    const consent = localStorage.getItem("ageConsent");
    // If user has not agreed and is not already on /age-consent → redirect
    if (consent !== "true" && location !== "/age-consent") {
      setLocation("/age-consent");
    }
  }, [location, setLocation]);

  return (
    <Switch>
      <Route path="/age-consent" component={AgeConsentPage} />
      <Route path="/" component={Homepage} />
      <Route path="/search" component={SearchPage} />
      <Route path="/profile/:id" component={ProfilePage} />
      <Route path="/chats" component={ChatsPage} />
      <Route path="/register" component={SetupAccountPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/register/details" component={RegistrationPage} />
      <Route path="/paystack-callback" component={PaystackCallback} />
      <Route path="/terms" component={TermsAndConditionsPage} />
      <Route path="/privacy" component={PrivacyPolicyPage} />
      <Route path="/cookie-policy" component={CookiePolicyPage} />
      <Route path="/parental" component={ParentalControlsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          {/* cookie consent modal (shows automatically if user hasn't picked) */}
          {/* Pass showOnlyOn="/" if you only want it on the homepage */}
          <CookieConsent showOnlyOn="/" />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
