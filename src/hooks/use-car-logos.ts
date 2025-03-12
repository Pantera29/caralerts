import { useState, useEffect } from 'react';

// Interfaz para los datos del logo
export interface CarLogo {
  name: string;
  logo: string;
  id?: string;
}

// URL del JSON raw de GitHub
const CAR_LOGOS_URL = 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/data.json';

// Mapeo de nombres para asegurar coincidencia correcta
// Algunas marcas tienen nombres ligeramente diferentes en el dataset
const BRAND_NAME_MAP: Record<string, string[]> = {
  'Acura': ['Acura'],
  'Alfa Romeo': ['Alfa Romeo', 'Alfaromeo', 'Alfa'],
  'Audi': ['Audi'],
  'BAIC': ['BAIC', 'Baic'],
  'BMW': ['BMW'],
  'Buick': ['Buick'],
  'BYD': ['BYD', 'Byd'],
  'Cadillac': ['Cadillac'],
  'Changan': ['Changan'],
  'Chevrolet': ['Chevrolet', 'Chevy'],
  'Chirey': ['Chirey', 'Chery'],
  'Chrysler': ['Chrysler'],
  'Citroën': ['Citroen', 'Citroën'],
  'Cupra': ['Cupra'],
  'Dodge': ['Dodge'],
  'Fiat': ['Fiat'],
  'Ford': ['Ford'],
  'GMC': ['GMC', 'Gmc'],
  'Great Wall': ['Great Wall', 'Greatwall'],
  'Honda': ['Honda'],
  'Hyundai': ['Hyundai'],
  'Infiniti': ['Infiniti'],
  'JAC': ['JAC', 'Jac'],
  'Jaguar': ['Jaguar'],
  'Jeep': ['Jeep'],
  'Jetour': ['Jetour'],
  'Kia': ['Kia'],
  'Land Rover': ['Land Rover', 'Landrover'],
  'Lexus': ['Lexus'],
  'Lincoln': ['Lincoln'],
  'Mazda': ['Mazda'],
  'Mercedes-Benz': ['Mercedes-Benz', 'Mercedes Benz', 'Mercedes', 'Mercedesbenz'],
  'MG': ['MG', 'Mg'],
  'Mini': ['Mini', 'MINI'],
  'Mitsubishi': ['Mitsubishi'],
  'Nissan': ['Nissan'],
  'Omoda': ['Omoda'],
  'Peugeot': ['Peugeot'],
  'Porsche': ['Porsche'],
  'RAM': ['RAM', 'Ram'],
  'Renault': ['Renault'],
  'Seat': ['Seat', 'SEAT'],
  'SEV': ['SEV', 'Sev'],
  'Smart': ['Smart'],
  'Subaru': ['Subaru'],
  'Suzuki': ['Suzuki'],
  'Tesla': ['Tesla'],
  'Toyota': ['Toyota'],
  'Volkswagen': ['Volkswagen', 'VW'],
  'Volvo': ['Volvo']
};

// Función para normalizar nombres (minúsculas, sin acentos, sin espacios)
function normalizeName(name: string): string {
  return name.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

// Generar la URL local para el logo SVG basado en el nombre de la marca
function getLocalSvgUrl(brandName: string): string {
  // Normalizar el nombre para el archivo (minúsculas, sin espacios ni caracteres especiales)
  const normalizedName = brandName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[ -]/g, "");
  
  return `/car-logos/${normalizedName}.svg`;
}

/**
 * Hook para cargar los logos de coches desde GitHub o localmente
 */
export function useCarLogos(preloadedData?: CarLogo[]) {
  const [logos, setLogos] = useState<CarLogo[]>(preloadedData || []);
  const [loading, setLoading] = useState<boolean>(!preloadedData);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Si ya tenemos datos precargados, no necesitamos hacer la solicitud
    if (preloadedData) {
      setLogos(preloadedData);
      setLoading(false);
      return;
    }

    const fetchLogos = async () => {
      try {
        setLoading(true);
        
        // Buscar en el repositorio externo
        const response = await fetch(CAR_LOGOS_URL);
        
        if (!response.ok) {
          throw new Error(`Error al cargar los datos: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Crear mapas para búsqueda eficiente
        const exactMap = new Map();
        const normalizedMap = new Map();
        
        data.forEach((item: any) => {
          if (!item.name) return;
          
          // Guardar con nombre exacto
          exactMap.set(item.name.toLowerCase(), {
            name: item.name,
            logo: item.image?.optimized || item.image?.originalSrc || '',
            id: item.id
          });
          
          // Guardar con nombre normalizado
          const normalized = normalizeName(item.name);
          normalizedMap.set(normalized, {
            name: item.name,
            logo: item.image?.optimized || item.image?.originalSrc || '',
            id: item.id
          });
        });
        
        // Buscar los logos para nuestras marcas
        const brandLogos: CarLogo[] = [];
        
        Object.entries(BRAND_NAME_MAP).forEach(([ourBrandName, possibleNames]) => {
          let found = false;
          
          // Intentar con cada posible nombre
          for (const name of possibleNames) {
            // Intentar coincidencia exacta primero
            const exactMatch = exactMap.get(name.toLowerCase());
            if (exactMatch) {
              brandLogos.push({
                name: ourBrandName,
                logo: exactMatch.logo,
                id: exactMatch.id
              });
              found = true;
              break;
            }
            
            // Intentar coincidencia normalizada
            const normalizedName = normalizeName(name);
            const normalizedMatch = normalizedMap.get(normalizedName);
            if (normalizedMatch) {
              brandLogos.push({
                name: ourBrandName,
                logo: normalizedMatch.logo,
                id: normalizedMatch.id
              });
              found = true;
              break;
            }
          }
          
          // Si no se encontró ningún logo, usar logo vacío (para usar iniciales como fallback)
          if (!found) {
            console.warn(`No se encontró logo para la marca: ${ourBrandName}`);
            brandLogos.push({
              name: ourBrandName,
              logo: '',
            });
          }
        });
        
        // Ordenar alfabéticamente las marcas
        brandLogos.sort((a, b) => a.name.localeCompare(b.name));
        
        console.log("Logos cargados correctamente:", brandLogos);
        setLogos(brandLogos);
        setLoading(false);
      } catch (err) {
        console.error("Error cargando los logos:", err);
        setError(err instanceof Error ? err : new Error('Error desconocido'));
        setLoading(false);
        
        // Si falla la carga, usar datos de fallback con nuestros nombres de marcas
        const fallbackData = Object.keys(BRAND_NAME_MAP).map(name => ({ 
          name, 
          logo: '' // Logo vacío para usar iniciales como fallback
        }))
        // Ordenar alfabéticamente las marcas fallback
        .sort((a, b) => a.name.localeCompare(b.name));
        
        setLogos(fallbackData);
      }
    };

    fetchLogos();
  }, [preloadedData]);

  return { logos, loading, error };
} 