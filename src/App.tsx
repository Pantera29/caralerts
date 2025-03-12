import { useState } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { Toaster } from "sonner";
import { LandingPage } from "@/components/LandingPage";

function App() {
  const [showAlertForm, setShowAlertForm] = useState(false);

  return (
    <ThemeProvider defaultTheme="light" storageKey="car-alerts-theme">
      <div className="min-h-screen bg-background font-sans antialiased">
        <Header onCreateAlert={() => setShowAlertForm(true)} />
        <LandingPage showFormInitially={showAlertForm} onFormVisibilityChange={setShowAlertForm} />
        <Toaster richColors position="top-right" />
      </div>
    </ThemeProvider>
  );
}

export default App;
