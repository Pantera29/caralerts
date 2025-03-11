import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { AlertForm } from "@/components/AlertForm";
import { Toaster } from "sonner";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="car-alerts-theme">
      <div className="min-h-screen bg-background font-sans antialiased">
        <Header />
        <main className="container py-10">
          <AlertForm />
        </main>
        <Toaster richColors position="top-right" />
      </div>
    </ThemeProvider>
  );
}

export default App;
