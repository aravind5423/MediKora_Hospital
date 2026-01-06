import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { HospitalDataProvider } from "@/contexts/HospitalDataContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import HospitalDetails from "./pages/HospitalDetails";
import Dashboard from "./pages/Dashboard";
import Doctors from "./pages/Doctors";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <HospitalDataProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/hospital-details" element={<HospitalDetails />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/doctors" element={<Doctors />} />
              <Route path="/dashboard/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </HospitalDataProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
