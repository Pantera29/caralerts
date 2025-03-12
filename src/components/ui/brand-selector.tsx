import React, { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useCarLogos, CarLogo } from '@/hooks/use-car-logos';

export interface BrandSelectorProps {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  preloadedData?: CarLogo[];
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
interface BrandLogoProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

function BrandLogo({ src, alt, className, width = 32, height = 32 }: BrandLogoProps) {
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

  if (error || !src) {
    return <BrandInitial brand={alt} />;
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={cn("object-contain rounded-full", className)}
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

export function BrandSelector({
  value,
  onChange,
  multiple = false,
  preloadedData,
  placeholder = "Selecciona una marca",
  className,
  disabled = false,
}: BrandSelectorProps) {
  console.log("BrandSelector - Render con valor:", value, "multiple:", multiple);
  
  const [open, setOpen] = useState(false);
  const { logos, loading, error } = useCarLogos(preloadedData);
  const [selected, setSelected] = useState<string[]>(
    Array.isArray(value) ? value : value ? [value] : []
  );

  // Actualizar el estado local cuando cambia el valor de la prop
  useEffect(() => {
    console.log("BrandSelector - useEffect - value cambió:", value);
    setSelected(Array.isArray(value) ? value : value ? [value] : []);
  }, [value]);

  useEffect(() => {
    console.log("BrandSelector - Logos cargados:", logos.length);
  }, [logos]);

  // Manejar la selección de un item
  const handleSelect = (currentValue: string) => {
    console.log("BrandSelector - handleSelect:", currentValue);
    let newSelected: string[];
    
    if (multiple) {
      newSelected = selected.includes(currentValue)
        ? selected.filter((item) => item !== currentValue)
        : [...selected, currentValue];
    } else {
      newSelected = [currentValue];
    }
    
    console.log("BrandSelector - nuevos valores seleccionados:", newSelected);
    setSelected(newSelected);
    onChange(multiple ? newSelected : newSelected[0] || '');
    
    if (!multiple) {
      setOpen(false);
    }
  };

  // Determinar el texto a mostrar en el botón
  const displayValue = () => {
    if (selected.length === 0) return placeholder;
    
    if (selected.length === 1) {
      const selectedLogo = logos.find((logo) => logo.name === selected[0]);
      return selectedLogo ? selectedLogo.name : selected[0];
    }
    
    return `${selected.length} marcas seleccionadas`;
  };

  // Renderizar el contenido del selector
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Cargando marcas...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center py-6 text-destructive">
          <span>Error al cargar los logos: {error.message}</span>
        </div>
      );
    }

    if (logos.length === 0) {
      return (
        <CommandEmpty>No se encontraron marcas</CommandEmpty>
      );
    }

    console.log("BrandSelector - Renderizando lista de", logos.length, "marcas");

    return (
      <>
        <CommandInput placeholder="Buscar marca..." />
        <CommandEmpty>No se encontraron marcas</CommandEmpty>
        <CommandGroup className="max-h-[300px] overflow-auto">
          {logos.map((logo) => (
            <CommandItem
              key={logo.id || logo.name}
              value={logo.name}
              onSelect={() => handleSelect(logo.name)}
              className="flex items-center"
            >
              <div className="flex items-center flex-1">
                <div className="mr-2 flex-shrink-0 w-6 h-6 flex items-center justify-center">
                  <BrandLogo
                    src={logo.logo}
                    alt={logo.name}
                    width={20}
                    height={20}
                  />
                </div>
                <span>{logo.name}</span>
              </div>
              <Check
                className={cn(
                  "ml-auto h-4 w-4",
                  selected.includes(logo.name) ? "opacity-100" : "opacity-0"
                )}
              />
            </CommandItem>
          ))}
        </CommandGroup>
      </>
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
          onClick={() => console.log("BrandSelector - Botón clickeado")}
        >
          <div className="flex items-center">
            {selected.length === 1 && (
              <div className="mr-2 w-5 h-5 flex items-center justify-center">
                <BrandLogo
                  src={logos.find(l => l.name === selected[0])?.logo || ''}
                  alt={selected[0]}
                  width={20}
                  height={20}
                />
              </div>
            )}
            <span className="truncate">{displayValue()}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full min-w-[240px] p-0">
        <Command>
          {renderContent()}
        </Command>
      </PopoverContent>
    </Popover>
  );
} 