import { BrandSelectorExample } from "@/components/BrandSelectorExample";

export default function BrandSelectorPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Ejemplo de Selector de Marcas
        </h1>
        <BrandSelectorExample />
      </div>
    </div>
  );
} 