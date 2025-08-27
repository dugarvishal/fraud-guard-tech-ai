import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Submit from "./pages/Submit";
import Analytics from "./pages/Analytics";
import Education from "./pages/Education";
import Assistant from "./pages/Assistant";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Cookies from "./pages/Cookies";
import Blog from "./pages/Blog";
import API from "./pages/API";
import Intelligence from "./pages/Intelligence";
import Help from "./pages/Help";
import About from "./pages/About";
import Contact from "./pages/Contact";
import History from "./pages/History";
import Documentation from "./pages/Documentation";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/submit" element={<Submit />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/education" element={<Education />} />
            <Route path="/assistant" element={<Assistant />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/api" element={<API />} />
            <Route path="/intelligence" element={<Intelligence />} />
            <Route path="/help" element={<Help />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/history" element={<History />} />
            <Route path="/documentation" element={<Documentation />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/cookies" element={<Cookies />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
