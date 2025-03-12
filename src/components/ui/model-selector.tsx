import { useState, useEffect, useMemo } from 'react';
import { X, Search, CarFront, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { modelosPorMarca } from '@/data/car-models';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

export interface ModelSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
  selectedBrands: string[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function ModelSelector({
  value,
  onChange,
  selectedBrands,
  placeholder = "Seleccionar modelos (opcional)",
  className,
  disabled = false,
}: ModelSelectorProps) {
  const [selectedModel, setSelectedModel] = useState<string>("");
  
  console.log("ModelSelector - render con marcas:", selectedBrands);
  console.log("ModelSelector - disabled:", disabled || selectedBrands.length === 0);
  
  // Función para normalizar los nombres de las marcas para que coincidan con modelosPorMarca
  const normalizeBrandName = (brand: string): string => {
    // Mapa de conversión para las marcas principales
    const brandMap: Record<string, string> = {
      'Alfa Romeo': 'ALFA ROMEO',
      'BMW': 'BMW',
      'Audi': 'AUDI',
      'Chevrolet': 'CHEVROLET',
      'Ford': 'FORD',
      'Honda': 'HONDA',
      'Hyundai': 'HYUNDAI',
      'Jeep': 'JEEP',
      'Kia': 'KIA',
      'Mazda': 'MAZDA',
      'Mercedes-Benz': 'MERCEDES-BENZ',
      'Nissan': 'NISSAN',
      'Renault': 'RENAULT',
      'Seat': 'SEAT',
      'Subaru': 'SUBARU',
      'Suzuki': 'SUZUKI',
      'Toyota': 'TOYOTA',
      'Volkswagen': 'VOLKSWAGEN',
      'Volvo': 'VOLVO'
    };
    
    return brandMap[brand] || brand.toUpperCase();
  };
  
  // Obtener los modelos disponibles basados en las marcas seleccionadas
  const availableModels = useMemo(() => {
    let models: { name: string, brand: string }[] = [];
    
    console.log("ModelSelector - Calculando modelos para marcas:", selectedBrands);
    
    selectedBrands.forEach(brand => {
      const normalizedBrand = normalizeBrandName(brand);
      console.log("ModelSelector - Buscando modelos para marca:", brand, "normalizada a:", normalizedBrand);
      const brandModels = modelosPorMarca[normalizedBrand] || [];
      console.log("ModelSelector - Modelos encontrados:", brandModels.length);
      
      models = [
        ...models,
        ...brandModels.map(model => ({ 
          name: model,
          brand: brand
        }))
      ];
    });
    
    console.log("ModelSelector - Total modelos disponibles:", models.length);
    return models;
  }, [selectedBrands]);
  
  // Efecto para limpiar modelos que ya no pertenecen a marcas seleccionadas
  useEffect(() => {
    // Crear una lista de todos los modelos disponibles en las marcas seleccionadas
    const validModels = new Set(availableModels.map(model => model.name));
    
    // Filtrar modelos seleccionados que ya no son válidos
    const newValue = value.filter(model => validModels.has(model));
    
    // Si hay algún cambio, actualizar los modelos seleccionados
    if (value.length !== newValue.length) {
      onChange(newValue);
    }
  }, [selectedBrands, availableModels]);
  
  // Manejador para añadir un modelo
  const handleAddModel = (modelName: string) => {
    console.log("ModelSelector - handleAddModel:", modelName);
    if (modelName && !value.includes(modelName)) {
      const newValue = [...value, modelName];
      console.log("ModelSelector - nuevos modelos:", newValue);
      onChange(newValue);
    }
    setSelectedModel("");
  };
  
  // Manejador para eliminar un modelo
  const handleRemoveModel = (modelName: string) => {
    console.log("ModelSelector - handleRemoveModel:", modelName);
    const newValue = value.filter(model => model !== modelName);
    console.log("ModelSelector - modelos después de eliminar:", newValue);
    onChange(newValue);
  };
  
  // Agrupar modelos por marca para visualización
  const modelsByBrand = useMemo(() => {
    const grouped: Record<string, { name: string, brand: string }[]> = {};
    
    availableModels.forEach(model => {
      if (!grouped[model.brand]) {
        grouped[model.brand] = [];
      }
      grouped[model.brand].push(model);
    });
    
    return grouped;
  }, [availableModels]);
  
  return (
    <div className={cn("space-y-3", className)}>
      {/* Lista de modelos seleccionados */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {value.map(model => {
            // Encontrar a qué marca pertenece este modelo
            const brandModel = availableModels.find(m => m.name === model);
            const brand = brandModel?.brand || '';
            
            return (
              <Badge
                key={model}
                variant="secondary"
                className="px-2 py-1 rounded-md h-auto flex items-center gap-1 bg-gray-100 hover:bg-gray-200"
              >
                <CarFront className="h-3 w-3 text-gray-500" />
                <span className="text-xs font-medium">
                  {model} 
                  {brand && <span className="text-xs text-muted-foreground ml-1">({brand})</span>}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-1 rounded-full hover:bg-gray-300"
                  onClick={() => handleRemoveModel(model)}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Eliminar {model}</span>
                </Button>
              </Badge>
            );
          })}
        </div>
      )}
      
      {/* Selector de modelos (usando Select en vez de Popover) */}
      <div className="flex items-center gap-2">
        <Select
          value={selectedModel}
          onValueChange={handleAddModel}
          disabled={disabled || selectedBrands.length === 0}
        >
          <SelectTrigger className={cn("w-full", className)}>
            <div className="flex items-center gap-2">
              <CarFront className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder={placeholder} />
            </div>
          </SelectTrigger>
          <SelectContent>
            {Object.entries(modelsByBrand).map(([brand, models]) => (
              <div key={brand} className="py-1">
                <div className="px-2 text-xs font-semibold text-muted-foreground mb-1">
                  {brand}
                </div>
                {models
                  .filter(model => !value.includes(model.name))
                  .map(model => (
                    <SelectItem 
                      key={`${brand}-${model.name}`} 
                      value={model.name}
                      className="flex items-center py-2"
                    >
                      <div className="flex items-center gap-2">
                        <CarFront className="h-4 w-4 text-gray-500" />
                        <span>{model.name}</span>
                      </div>
                    </SelectItem>
                  ))
                }
              </div>
            ))}
          </SelectContent>
        </Select>
        
        {selectedBrands.length === 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertCircle className="h-4 w-4 text-amber-500" />
            </TooltipTrigger>
            <TooltipContent className="bg-white border p-2 shadow-md">
              <p className="text-xs">Selecciona al menos una marca para ver modelos disponibles</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      
      {/* Información adicional */}
      {selectedBrands.length > 0 && (
        <div className="text-xs text-muted-foreground mt-1">
          <p>Seleccionar modelos específicos te ayudará a recibir alertas más precisas, pero no es obligatorio.</p>
          {value.length > 1 && (
            <p className="mt-1 text-amber-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              <span>Mercado Libre solo utilizará el primer modelo seleccionado en la búsqueda.</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
} 