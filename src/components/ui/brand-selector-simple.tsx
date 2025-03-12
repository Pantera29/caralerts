import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useCarLogos } from '@/hooks/use-car-logos';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

export interface BrandSelectorSimpleProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

// Componente para mostrar iniciales con un color de fondo generado a partir del nombre de la marca
const BrandInitial = ({ brand }: { brand: string }) => {
  const initial = brand.charAt(0).toUpperCase();
  const getBackgroundColor = () => {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    let hash = 0;
    for (let i = 0; i < brand.length; i++) {
      hash = brand.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div 
      className="flex items-center justify-center font-bold text-white rounded-full" 
      style={{ 
        backgroundColor: getBackgroundColor(), 
        width: '24px', 
        height: '24px',
        fontSize: '12px'
      }}
    >
      {initial}
    </div>
  );
};

// Componente para manejar la imagen con fallback
function BrandLogo({ src, alt, width = 24, height = 24 }: { src: string; alt: string; width?: number; height?: number }) {
  const [imgSrc, setImgSrc] = useState<string>(src || '');
  const [error, setError] = useState<boolean>(false);

  // Reset estado de error si cambia la URL de origen
  useEffect(() => {
    if (src) {
      setImgSrc(src);
      setError(false);
    } else {
      setError(true);
    }
  }, [src]);

  const handleError = () => {
    console.log(`Error al cargar la imagen para: ${alt}`);
    setError(true);
  };

  // Si no hay URL o hubo un error al cargar, mostrar iniciales
  if (error || !src) {
    return <BrandInitial brand={alt} />;
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className="object-contain rounded-full"
      width={width}
      height={height}
      onError={handleError}
      style={{ 
        maxWidth: '100%', 
        maxHeight: '100%',
        display: 'block',
        margin: '0 auto'
      }}
      loading="lazy"
    />
  );
}

export function BrandSelectorSimple({
  value,
  onChange,
  placeholder = "Seleccionar marca",
  className,
  disabled = false,
}: BrandSelectorSimpleProps) {
  console.log("BrandSelectorSimple - render con valor:", value);
  
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const { logos, loading, error } = useCarLogos();

  // Manejador para añadir una marca
  const handleAddBrand = (brandName: string) => {
    console.log("BrandSelectorSimple - handleAddBrand:", brandName);
    if (brandName && !value.includes(brandName)) {
      const newValue = [...value, brandName];
      console.log("BrandSelectorSimple - nuevas marcas:", newValue);
      onChange(newValue);
    }
    setSelectedBrand("");
  };

  // Manejador para eliminar una marca
  const handleRemoveBrand = (brandName: string) => {
    console.log("BrandSelectorSimple - handleRemoveBrand:", brandName);
    const newValue = value.filter(brand => brand !== brandName);
    console.log("BrandSelectorSimple - marcas después de eliminar:", newValue);
    onChange(newValue);
  };

  if (loading) {
    return <div className="text-sm text-muted-foreground">Cargando marcas...</div>;
  }

  if (error) {
    console.error("Error cargando marcas:", error);
  }

  return (
    <div className="space-y-3">
      {/* Lista de marcas seleccionadas */}
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map(brand => {
          const brandInfo = logos.find(item => item.name === brand);
          return (
            <div
              key={brand}
              className="inline-flex items-center bg-secondary text-secondary-foreground px-3 py-1 rounded-full transition-colors"
            >
              <div className="mr-2 w-5 h-5 flex items-center justify-center">
                <BrandLogo
                  src={brandInfo?.logo || ''}
                  alt={brand}
                  width={20}
                  height={20}
                />
              </div>
              <span className="text-sm font-medium">{brand}</span>
              <Button 
                type="button" 
                variant="ghost"
                size="icon"
                className="h-5 w-5 p-0 ml-1 hover:bg-secondary-foreground/10 rounded-full"
                onClick={() => handleRemoveBrand(brand)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Eliminar {brand}</span>
              </Button>
            </div>
          );
        })}
      </div>
      
      {/* Selector de marcas */}
      <Select
        value={selectedBrand}
        onValueChange={handleAddBrand}
        disabled={disabled}
      >
        <SelectTrigger className={cn("w-full", className)}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {logos
            .filter(brand => !value.includes(brand.name))
            .map(brand => (
              <SelectItem 
                key={brand.name} 
                value={brand.name}
                className="flex items-center py-2"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                    <BrandLogo
                      src={brand.logo}
                      alt={brand.name}
                      width={20}
                      height={20}
                    />
                  </div>
                  <span className="ml-1">{brand.name}</span>
                </div>
              </SelectItem>
            ))
          }
        </SelectContent>
      </Select>
    </div>
  );
} 