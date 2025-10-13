import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Homepage from "@/pages/homepage";
import ProfilePage from "@/pages/profile";
import RegistrationPage from "@/pages/registration";
import NotFound from "@/pages/not-found";
import SetupAccountPage from "./pages/setup-account";
import PrivacyPolicyPage from "./pages/privacy";
import ParentalControlsPage from "./pages/parental-controls";
import CookiePolicyPage from "./pages/cookies";
import TermsAndConditionsPage from "./pages/terms";
import ContactPage from "./pages/contact";
import CookieConsent from "./components/cookie-consent";
import AgeConsentPage from "./pages/age-consent";
import VerificationPage from "./pages/verification";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Homepage} />
      <Route path="/profile/:id" component={ProfilePage} />
      <Route path="/register" component={SetupAccountPage} />
      <Route path="/register/details" component={RegistrationPage} />
      <Route path="/privacy" component={PrivacyPolicyPage} />
      <Route path="/parental" component={ParentalControlsPage} />
      <Route path="cookies" component={CookiePolicyPage} />
      <Route path="/terms" component={TermsAndConditionsPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/verify/:id" component={VerificationPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const consent = localStorage.getItem("ageConsent");

  if (consent !== "true") {
    return <AgeConsentPage />;
  }
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        {/* cookie consent modal (shows automatically if user hasn't picked) */}
+       {/* Pass showOnlyOn="/" if you only want it on the homepage */}
+       <CookieConsent showOnlyOn="/" />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
