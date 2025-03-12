import { Car } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onCreateAlert: () => void;
}

export function Header({ onCreateAlert }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <a className="flex items-center space-x-2" href="/">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-blue-600 p-1.5">
              <Car className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">CarAlerts</span>
          </div>
        </a>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm"
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
            onClick={onCreateAlert}
          >
            Crear alerta
          </Button>
        </div>
      </div>
    </header>
  );
} 