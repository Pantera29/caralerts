import { useState, useEffect, useRef } from "react";
import { AlertFormData, NotificationFrequency } from "@/types/alert";
import { toast } from "sonner";
import { 
  InfoIcon, 
  Bell, 
  Search, 
  Car, 
  Calendar, 
  DollarSign, 
  Gauge, 
  Send, 
  Tag,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Loader2,
  CarFront
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BrandSelectorSimple } from "@/components/ui/brand-selector-simple";
import { ModelSelector } from "@/components/ui/model-selector";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";

const initialFormData: AlertFormData = {
  nombre_busqueda: "",
  marcas: [],
  modelos: [],
  anio_minimo: 2015,
  anio_maximo: new Date().getFullYear(),
  precio_maximo: 500000,
  kilometraje_maximo: 100000,
  telegram_chat_id: "",
  frecuencia: "diaria"
};

// Tipo para los resultados de la búsqueda
interface SearchResults {
  kavak: {
    count: number;
    url: string;
  };
  mercadoLibre: {
    count: number;
    url: string;
  };
  telegramSent: boolean;
  noAlertsToProcess?: boolean;
}

// Pasar los modelos seleccionados a los resultados de búsqueda
interface SearchResultsWithModels extends SearchResults {
  modelos?: string[];
}

export function AlertForm() {
  const [formData, setFormData] = useState<AlertFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof AlertFormData, string>>>({});
  const [isFormValid, setIsFormValid] = useState(false);
  
  // Nuevos estados para la funcionalidad de búsqueda inmediata
  const [searchingResults, setSearchingResults] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResultsWithModels | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  
  // Referencia para el scroll automático a los resultados
  const resultsRef = useRef<HTMLDivElement>(null);

  // Efecto para hacer scroll hacia los resultados cuando estén disponibles
  useEffect(() => {
    if ((searchResults || searchError) && !searchingResults && resultsRef.current) {
      // Pequeño timeout para asegurar que los componentes se han renderizado
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
    }
  }, [searchResults, searchError, searchingResults]);

  useEffect(() => {
    // Verificar si el formulario es válido
    const requiredFields: (keyof AlertFormData)[] = ['nombre_busqueda', 'marcas', 'telegram_chat_id'];
    const hasRequiredFields = requiredFields.every(field => {
      if (field === 'marcas') {
        return formData[field].length > 0;
      }
      return !!formData[field];
    });
    
    const hasNoErrors = Object.keys(formErrors).length === 0 || 
      Object.values(formErrors).every(error => error === '');
    
    setIsFormValid(hasRequiredFields && hasNoErrors);
  }, [formData, formErrors]);

  const validateField = (name: keyof AlertFormData, value: any): string => {
    if (name === 'nombre_busqueda' && (!value || value.trim() === '')) {
      return 'El nombre de búsqueda es obligatorio';
    }
    if (name === 'marcas' && (!value || value.length === 0)) {
      return 'Selecciona al menos una marca';
    }
    if (name === 'anio_minimo' && value > formData.anio_maximo) {
      return 'El año mínimo debe ser menor o igual al año máximo';
    }
    if (name === 'telegram_chat_id' && (!value || !/^\d+$/.test(value))) {
      return 'Introduce un Chat ID válido (solo números)';
    }
    return '';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "precio_maximo" || name === "kilometraje_maximo" || name === "anio_minimo" || name === "anio_maximo") {
      const numericValue = parseInt(value) || 0;
      setFormData({
        ...formData,
        [name]: numericValue
      });
      
      // Validar después de actualizar
      const error = validateField(name as keyof AlertFormData, numericValue);
      setFormErrors(prev => ({
        ...prev,
        [name]: error
      }));
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
      
      // Validar después de actualizar
      const error = validateField(name as keyof AlertFormData, value);
      setFormErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleBrandChange = (value: string | string[]) => {
    // Asegurar que marcas siempre sea un array
    const brands = Array.isArray(value) ? value : [value];
    
    console.log('handleBrandChange - valor recibido:', value);
    console.log('handleBrandChange - marcas formateadas:', brands);
    
    setFormData({
      ...formData,
      marcas: brands
    });
    
    // Validar después de actualizar
    const error = validateField('marcas', brands);
    setFormErrors(prev => ({
      ...prev,
      marcas: error
    }));
  };

  // Función para ejecutar la búsqueda inmediata
  const runImmediateSearch = async () => {
    setSearchingResults(true);
    setSearchError(null);
    
    try {
      const response = await fetch("https://kavak-meli-bot.francolonghi29.workers.dev/run", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        mode: "cors",
        credentials: "omit"
      });
      
      if (!response.ok) {
        throw new Error(`Error al ejecutar la búsqueda: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Resultados de la búsqueda:', data);
      
      // Si el formato de respuesta incluye resultados directamente (como en el telegram)
      if (data.kavak && typeof data.kavak === 'string' && data.kavak.includes('resultados')) {
        // Ejemplo: "16+ resultados" -> extraer el número
        const kavakCountMatch = data.kavak.match(/(\d+)(\+)?\s+resultados/);
        const mercadoLibreCountMatch = data.mercadoLibre && data.mercadoLibre.match(/(\d+)(\+)?\s+resultados/);
        
        const kavakCount = kavakCountMatch ? parseInt(kavakCountMatch[1]) : 0;
        const mercadoLibreCount = mercadoLibreCountMatch ? parseInt(mercadoLibreCountMatch[1]) : 0;
        
        // Extraer las URLs correctas
        let kavakUrl = '#';
        let mercadoLibreUrl = '#';
        
        // Buscar URLs como objetos o como propiedades directas
        if (data.urls) {
          kavakUrl = data.urls.kavak || '#';
          mercadoLibreUrl = data.urls.mercadoLibre || '#';
        } else {
          kavakUrl = data.kavakUrl || data.kavak_url || '#';
          mercadoLibreUrl = data.mercadoLibreUrl || data.mercadolibre_url || '#';
        }
        
        // Crear un objeto con el formato que espera nuestro componente
        setSearchResults({
          kavak: {
            count: kavakCount,
            url: kavakUrl
          },
          mercadoLibre: {
            count: mercadoLibreCount,
            url: mercadoLibreUrl
          },
          telegramSent: data.telegramSent || true,
          modelos: formData.modelos
        });
        
        if (kavakCount > 0 || mercadoLibreCount > 0) {
          toast.success("¡Búsqueda completada con éxito!", {
            description: `Se encontraron resultados: ${kavakCount} en Kavak y ${mercadoLibreCount} en Mercado Libre.`
          });
        } else {
          toast.info("Búsqueda completada", {
            description: "No se encontraron vehículos que coincidan con tus criterios en este momento."
          });
        }
        return;
      }
      
      // Si no hay resultados específicos, crear un objeto con valores predeterminados
      if (data.success && !data.kavak && !data.mercadoLibre) {
        // API devolvió éxito pero sin resultados detallados
        if (data.message && data.message.includes("No hay alertas")) {
          toast.info("No hay alertas para procesar", {
            description: "La alerta se ha creado correctamente, pero no hay resultados disponibles en este momento."
          });
          
          // Crear resultados simulados para mostrar el componente de resultados
          setSearchResults({
            kavak: {
              count: 0,
              url: '#'
            },
            mercadoLibre: {
              count: 0,
              url: '#'
            },
            telegramSent: false,
            noAlertsToProcess: true,
            modelos: formData.modelos
          });
          return;
        }
      }
      
      // Formato original esperado por el componente
      setSearchResults({
        kavak: {
          count: data.kavak?.count || 0,
          url: data.kavak?.url || '#'
        },
        mercadoLibre: {
          count: data.mercadoLibre?.count || 0,
          url: data.mercadoLibre?.url || '#'
        },
        telegramSent: data.telegramSent || false,
        modelos: formData.modelos
      });
      
      if (data.kavak?.count > 0 || data.mercadoLibre?.count > 0) {
        toast.success("¡Búsqueda completada con éxito!", {
          description: `Se encontraron resultados: ${data.kavak?.count || 0} en Kavak y ${data.mercadoLibre?.count || 0} en Mercado Libre.`
        });
      } else {
        toast.info("Búsqueda completada", {
          description: "No se encontraron vehículos que coincidan con tus criterios en este momento."
        });
      }
    } catch (error) {
      console.error('Error al ejecutar la búsqueda:', error);
      setSearchError(error instanceof Error ? error.message : 'Error desconocido');
      toast.error("Error al ejecutar la búsqueda", {
        description: "No se pudieron obtener los resultados. Por favor, intenta nuevamente."
      });
    } finally {
      setSearchingResults(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar todos los campos antes de enviar
    let hasErrors = false;
    const errors: Partial<Record<keyof AlertFormData, string>> = {};
    
    Object.entries(formData).forEach(([key, value]) => {
      const fieldName = key as keyof AlertFormData;
      const error = validateField(fieldName, value);
      if (error) {
        errors[fieldName] = error;
        hasErrors = true;
      }
    });
    
    setFormErrors(errors);
    
    if (hasErrors) {
      toast.error("Por favor, corrige los errores en el formulario", {
        description: "Hay campos con información incorrecta o incompleta."
      });
      return;
    }
    
    setIsSubmitting(true);
    setSearchResults(null);
    setSearchError(null);

    try {
      // Agregar flag para ejecutar inmediatamente
      const requestData = {
        ...formData,
        ejecutar_inmediatamente: true
      };
      
      // Información de depuración para la consola
      console.log('Enviando datos completos de alerta:', {
        ...requestData,
        marcas: requestData.marcas.join(', '),
        modelos: requestData.modelos.length > 0 ? requestData.modelos.join(', ') : 'ninguno'
      });
      
      const response = await fetch("https://kavak-meli-bot.francolonghi29.workers.dev/api/alerts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        mode: "cors",
        credentials: "omit",
        body: JSON.stringify(requestData)
      });
      
      const data = await response.json();
      console.log('Respuesta del servidor:', data);

      if (data.success) {
        toast.success("¡Alerta creada con éxito!", {
          description: "Verificando si hay vehículos disponibles..."
        });
        
        // NUEVO: Si la respuesta ya incluye resultados de ejecución inmediata
        if (data.ejecucion?.realizada) {
          // Usar los resultados directamente de la respuesta
          setSearchResults({
            kavak: {
              count: data.ejecucion.kavak?.count || 0,
              url: data.ejecucion.kavak?.url || '#'
            },
            mercadoLibre: {
              count: data.ejecucion.mercadoLibre?.count || 0,
              url: data.ejecucion.mercadoLibre?.url || '#'
            },
            telegramSent: data.ejecucion.telegramSent || false,
            modelos: formData.modelos
          });
          
          // Mostrar mensaje apropiado según los resultados
          const kavakCount = data.ejecucion.kavak?.count || 0;
          const mlCount = data.ejecucion.mercadoLibre?.count || 0;
          
          if (kavakCount > 0 || mlCount > 0) {
            toast.success("¡Se encontraron vehículos!", {
              description: `Encontramos ${kavakCount} en Kavak y ${mlCount} en Mercado Libre.`
            });
          } else {
            toast.info("Búsqueda completada", {
              description: "No se encontraron vehículos que coincidan con tus criterios en este momento."
            });
          }
        } else {
          // Si no hay resultados en la respuesta o hubo un error
          if (data.ejecucion?.error) {
            toast.warning("La alerta se creó, pero hubo un error al ejecutarla", {
              description: data.ejecucion.error
            });
          }
          
          // Ejecutar búsqueda como respaldo
          await runImmediateSearch();
        }
        
        setFormData(initialFormData);
      } else {
        toast.error("Error al crear la alerta", {
          description: data.message || "Por favor, intenta nuevamente."
        });
      }
    } catch (error) {
      toast.error("Error de conexión", {
        description: "No se pudo conectar con el servidor. Por favor, verifica tu conexión e intenta nuevamente."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Variantes de animación para framer-motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05,
        delayChildren: 0.1
      } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  // Componente para mostrar los resultados de la búsqueda
  const SearchResultsComponent = () => {
    if (!searchResults) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        className="mt-6"
      >
        <Card className={`overflow-hidden ${searchResults.noAlertsToProcess ? 'border-amber-200 bg-amber-50/50' : 'border-green-200 bg-green-50/50'}`}>
          <CardHeader className={`${searchResults.noAlertsToProcess ? 'bg-amber-100/50 border-b border-amber-200' : 'bg-green-100/50 border-b border-green-200'} py-4 px-6`}>
            <CardTitle className={`text-lg font-medium flex items-center gap-2 ${searchResults.noAlertsToProcess ? 'text-amber-800' : 'text-green-800'}`}>
              {searchResults.noAlertsToProcess ? (
                <>
                  <InfoIcon className="h-5 w-5 text-amber-600" />
                  Alerta creada con éxito
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Resultados de la búsqueda inmediata
                </>
              )}
            </CardTitle>
            <CardDescription className={searchResults.noAlertsToProcess ? 'text-amber-700' : 'text-green-700'}>
              {searchResults.noAlertsToProcess 
                ? "Tu alerta ha sido creada con éxito pero no hay resultados disponibles en este momento"
                : "Hemos ejecutado tu alerta y estos son los resultados encontrados"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-5 space-y-4">
            {searchResults.noAlertsToProcess ? (
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <p className="text-amber-700">
                  Tu alerta ha sido registrada correctamente. Recibirás notificaciones en Telegram cuando encontremos vehículos que coincidan con tus criterios de búsqueda.
                </p>
                <p className="text-sm text-gray-600 mt-3">
                  Las búsquedas se ejecutarán según la frecuencia que has seleccionado y te notificaremos cuando encontremos resultados.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Resultados de Kavak */}
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <div className="bg-blue-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="flex-shrink-0 w-6 h-6">
                          <img src="https://www.kavak.com/favicon.ico" alt="Kavak" className="w-full h-full object-contain" />
                        </div>
                        <h3 className="font-medium">Kavak</h3>
                      </div>
                      <Badge variant={searchResults.kavak.count > 0 ? "success" : "outline"} className="rounded-full">
                        {searchResults.kavak.count} {searchResults.kavak.count === 1 ? 'resultado' : 'resultados'}
                      </Badge>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-600 mb-3">
                        {searchResults.kavak.count > 0 
                          ? `Se encontraron ${searchResults.kavak.count} vehículos en Kavak que coinciden con tus criterios.` 
                          : "No se encontraron vehículos en Kavak que coincidan con tus criterios."}
                      </p>
                      <a 
                        href={searchResults.kavak.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1 text-sm font-medium ${searchResults.kavak.count > 0 ? 'text-blue-600 hover:text-blue-800' : 'text-gray-400 cursor-not-allowed'}`}
                      >
                        <ExternalLink className="h-4 w-4" />
                        Ver todos
                      </a>
                    </div>
                  </div>
                  
                  {/* Resultados de Mercado Libre */}
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <div className="bg-yellow-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="flex-shrink-0 w-6 h-6">
                          <img src="https://http2.mlstatic.com/frontend-assets/ui-navigation/5.19.0/mercadolibre/favicon.svg" alt="Mercado Libre" className="w-full h-full object-contain" />
                        </div>
                        <h3 className="font-medium">Mercado Libre</h3>
                      </div>
                      <Badge variant={searchResults.mercadoLibre.count > 0 ? "success" : "outline"} className="rounded-full">
                        {searchResults.mercadoLibre.count} {searchResults.mercadoLibre.count === 1 ? 'resultado' : 'resultados'}
                      </Badge>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-600 mb-3">
                        {searchResults.mercadoLibre.count > 0 
                          ? `Se encontraron ${searchResults.mercadoLibre.count} vehículos en Mercado Libre que coinciden con tus criterios.` 
                          : "No se encontraron vehículos en Mercado Libre que coincidan con tus criterios."}
                      </p>
                      <a 
                        href={searchResults.mercadoLibre.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1 text-sm font-medium ${searchResults.mercadoLibre.count > 0 ? 'text-yellow-600 hover:text-yellow-800' : 'text-gray-400 cursor-not-allowed'}`}
                      >
                        <ExternalLink className="h-4 w-4" />
                        Ver todos
                      </a>
                    </div>
                  </div>
                </div>
                
                {/* Estado de la notificación Telegram */}
                <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                      <img src="https://telegram.org/img/favicon.ico" alt="Telegram" className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Notificación por Telegram</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {searchResults.telegramSent 
                          ? "Se ha enviado una notificación con los resultados a tu cuenta de Telegram." 
                          : "No se ha enviado notificación a Telegram porque no se encontraron resultados."}
                      </p>
                    </div>
                    <div className="ml-auto">
                      <Badge variant={searchResults.telegramSent ? "success" : "outline"}>
                        {searchResults.telegramSent ? "Enviado" : "No enviado"}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                {/* Mostrar información sobre los modelos usados en la búsqueda */}
                {searchResults.modelos && searchResults.modelos.length > 0 && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <CarFront className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 flex items-center gap-1">
                          Modelos específicos
                        </h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {searchResults.modelos.map((modelo, index) => (
                            <Badge 
                              key={modelo} 
                              variant="secondary" 
                              className={cn(
                                "bg-white border border-blue-200", 
                                index === 0 && searchResults.modelos!.length > 1 ? "ring-1 ring-amber-400" : ""
                              )}
                            >
                              {modelo}
                              {index === 0 && searchResults.modelos!.length > 1 && (
                                <span className="ml-1 text-[10px] text-amber-600">(ML)</span>
                              )}
                            </Badge>
                          ))}
                        </div>
                        {searchResults.modelos.length > 1 && (
                          <p className="text-xs text-amber-600 flex items-center gap-1 mt-2">
                            <AlertCircle className="h-3 w-3" />
                            Mercado Libre solo utiliza el primer modelo en la búsqueda.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            
            {/* Botón para ejecutar la búsqueda nuevamente */}
            <div className="flex justify-center mt-4">
              <Button 
                type="button" 
                variant="outline"
                size="sm"
                onClick={runImmediateSearch}
                disabled={searchingResults}
                className="gap-2"
              >
                {searchingResults ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Buscando...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    <span>Ejecutar búsqueda nuevamente</span>
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  // Componente para mostrar errores de búsqueda
  const SearchErrorComponent = () => {
    if (!searchError) return null;
    
    return (
      <motion.div 
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        className="mt-6"
      >
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error al ejecutar la búsqueda</AlertTitle>
          <AlertDescription>
            {searchError}
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={runImmediateSearch}
              disabled={searchingResults}
              className="mt-2 gap-2"
            >
              {searchingResults ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Intentando nuevamente...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  <span>Intentar nuevamente</span>
                </>
              )}
            </Button>
          </AlertDescription>
        </Alert>
      </motion.div>
    );
  };

  return (
    <TooltipProvider>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full"
      >
        <Card className="w-full max-w-4xl mx-auto border border-gray-200 shadow-lg rounded-xl overflow-hidden bg-white">
          <CardHeader className="bg-gray-50 border-b border-gray-200 px-6 py-5">
            <motion.div variants={itemVariants}>
              <CardTitle className="text-2xl font-semibold text-foreground">Nueva Alerta de Vehículos</CardTitle>
              <CardDescription className="text-muted-foreground mt-1">
                Configura los criterios para recibir notificaciones de vehículos.
              </CardDescription>
              <p className="text-xs text-gray-500 mt-2">
                Los campos marcados con <span className="text-red-500">*</span> son obligatorios.
              </p>
            </motion.div>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-8 p-6">
              {/* Sección de Búsqueda */}
              <motion.div variants={itemVariants} className="space-y-5">
                <div className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-medium">Información de búsqueda</h3>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="nombre_busqueda" className="text-sm font-medium flex items-center gap-1">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      Nombre de la búsqueda
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="nombre_busqueda"
                        name="nombre_busqueda"
                        placeholder="Ej: BMW Serie 3 2020+"
                        value={formData.nombre_busqueda}
                        onChange={handleInputChange}
                        required
                        className={`pl-8 transition-all ${formErrors.nombre_busqueda ? 'border-destructive focus-visible:ring-destructive' : 'focus-visible:ring-primary/20'}`}
                      />
                      <Search className="h-4 w-4 text-muted-foreground absolute left-2.5 top-2.5" />
                    </div>
                    {formErrors.nombre_busqueda && (
                      <p className="text-xs text-destructive mt-1">{formErrors.nombre_busqueda}</p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium flex items-center gap-1">
                        <Car className="h-4 w-4 text-muted-foreground" />
                        Marcas
                        <span className="text-red-500 ml-1">*</span>
                      </Label>
                      {formData.marcas.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          {formData.marcas.length} {formData.marcas.length === 1 ? 'marca seleccionada' : 'marcas seleccionadas'}
                        </p>
                      )}
                    </div>
                    
                    <BrandSelectorSimple 
                      value={formData.marcas}
                      onChange={(brands) => handleBrandChange(brands)}
                      placeholder="Seleccionar marcas"
                      className={formErrors.marcas ? 'border-destructive' : ''}
                    />
                    
                    {formErrors.marcas && (
                      <p className="text-xs text-destructive mt-1">{formErrors.marcas}</p>
                    )}
                  </div>

                  {/* Selector de Modelos (nuevo) */}
                  <div className="mt-5">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium flex items-center gap-1">
                        <CarFront className="h-4 w-4 text-muted-foreground" />
                        Modelos específicos
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InfoIcon className="h-3.5 w-3.5 ml-1 text-muted-foreground/70" />
                          </TooltipTrigger>
                          <TooltipContent className="bg-white p-3 shadow-lg rounded-lg max-w-xs text-sm border border-gray-200">
                            <p>Los modelos te permiten definir búsquedas más específicas. Selecciona primero las marcas para ver sus modelos disponibles.</p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      {formData.modelos.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          {formData.modelos.length} {formData.modelos.length === 1 ? 'modelo seleccionado' : 'modelos seleccionados'}
                        </p>
                      )}
                    </div>
                    
                    <ModelSelector
                      value={formData.modelos}
                      onChange={(models) => setFormData({...formData, modelos: models})}
                      selectedBrands={formData.marcas}
                      placeholder="Seleccionar modelos (opcional)"
                      className={formErrors.modelos ? 'border-destructive' : ''}
                    />
                    
                    {formErrors.modelos && (
                      <p className="text-xs text-destructive mt-1">{formErrors.modelos}</p>
                    )}
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Separator className="bg-border/60" />
              </motion.div>

              {/* Sección de Filtros */}
              <motion.div variants={itemVariants} className="space-y-5">
                <div className="flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-medium">Filtros</h3>
                </div>
                
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="anio_minimo" className="text-sm font-medium flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        Año mínimo
                      </Label>
                      <div className="relative">
                        <Input
                          id="anio_minimo"
                          name="anio_minimo"
                          type="number"
                          min="1990"
                          max={new Date().getFullYear()}
                          value={formData.anio_minimo}
                          onChange={handleInputChange}
                          required
                          className={`transition-all ${formErrors.anio_minimo ? 'border-destructive' : ''}`}
                        />
                      </div>
                      {formErrors.anio_minimo && (
                        <p className="text-xs text-destructive mt-1">{formErrors.anio_minimo}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="anio_maximo" className="text-sm font-medium flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        Año máximo
                      </Label>
                      <Input
                        id="anio_maximo"
                        name="anio_maximo"
                        type="number"
                        min="1990"
                        max={new Date().getFullYear()}
                        value={formData.anio_maximo}
                        onChange={handleInputChange}
                        required
                        className={`transition-all ${formErrors.anio_maximo ? 'border-destructive' : ''}`}
                      />
                      {formErrors.anio_maximo && (
                        <p className="text-xs text-destructive mt-1">{formErrors.anio_maximo}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="precio_maximo" className="text-sm font-medium flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        Precio máximo
                      </Label>
                      <div className="relative">
                        <Input
                          id="precio_maximo"
                          name="precio_maximo"
                          type="number"
                          min="0"
                          step="1000"
                          value={formData.precio_maximo}
                          onChange={handleInputChange}
                          required
                          className={`transition-all ${formErrors.precio_maximo ? 'border-destructive' : ''}`}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="kilometraje_maximo" className="text-sm font-medium flex items-center gap-1">
                        <Gauge className="h-4 w-4 text-muted-foreground" />
                        Kilometraje máximo
                      </Label>
                      <div className="relative">
                        <Input
                          id="kilometraje_maximo"
                          name="kilometraje_maximo"
                          type="number"
                          min="0"
                          step="1000"
                          value={formData.kilometraje_maximo}
                          onChange={handleInputChange}
                          required
                          className={`transition-all ${formErrors.kilometraje_maximo ? 'border-destructive' : ''}`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Separator className="bg-border/60" />
              </motion.div>

              {/* Sección de Notificaciones */}
              <motion.div variants={itemVariants} className="space-y-5">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-medium">Notificaciones</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label className="text-sm font-medium">Frecuencia de notificaciones</Label>
                    <RadioGroup
                      value={formData.frecuencia}
                      onValueChange={(value) => 
                        setFormData({
                          ...formData,
                          frecuencia: value as NotificationFrequency
                        })
                      }
                      className="space-y-3"
                    >
                      <div className="flex items-start space-x-4 rounded-md border border-border/60 p-3 hover:bg-muted/30 transition-colors">
                        <RadioGroupItem value="horaria" id="horaria" />
                        <div className="flex-1 space-y-1">
                          <Label htmlFor="horaria" className="font-medium">Cada hora</Label>
                          <p className="text-sm text-muted-foreground">
                            Recibirás notificaciones cada hora si hay vehículos nuevos que coincidan con tus criterios.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4 rounded-md border border-border/60 p-3 hover:bg-muted/30 transition-colors">
                        <RadioGroupItem value="cada12horas" id="cada12horas" />
                        <div className="flex-1 space-y-1">
                          <Label htmlFor="cada12horas" className="font-medium">Dos veces al día</Label>
                          <p className="text-sm text-muted-foreground">
                            Recibirás notificaciones a las 8:00 AM y 8:00 PM si hay vehículos nuevos.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4 rounded-md border border-border/60 p-3 hover:bg-muted/30 transition-colors">
                        <RadioGroupItem value="diaria" id="diaria" />
                        <div className="flex-1 space-y-1">
                          <Label htmlFor="diaria" className="font-medium">Una vez al día</Label>
                          <p className="text-sm text-muted-foreground">
                            Recibirás una notificación diaria a las 8:00 AM con los vehículos nuevos.
                          </p>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="telegram_chat_id" className="text-sm font-medium flex items-center gap-1">
                          <Send className="h-4 w-4 text-muted-foreground" />
                          Chat ID de Telegram
                          <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full p-0 bg-gray-100 hover:bg-gray-200">
                              <InfoIcon className="h-4 w-4 text-gray-500" />
                              <span className="sr-only">Información sobre Chat ID</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent 
                            side="top" 
                            align="center" 
                            className="max-w-xs bg-white shadow-lg p-3 rounded-lg text-sm border border-gray-200"
                          >
                            <p className="text-gray-700">Para obtener tu Chat ID, inicia una conversación con <span className="font-medium">@userinfobot</span> en Telegram y te enviará tu ID.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <div className="relative">
                        <Input
                          id="telegram_chat_id"
                          name="telegram_chat_id"
                          placeholder="Ej: 123456789"
                          value={formData.telegram_chat_id}
                          onChange={handleInputChange}
                          required
                          className={`pl-8 transition-all ${formErrors.telegram_chat_id ? 'border-destructive' : ''}`}
                        />
                        <Send className="h-4 w-4 text-muted-foreground absolute left-2.5 top-2.5" />
                      </div>
                      {formErrors.telegram_chat_id && (
                        <p className="text-xs text-destructive mt-1">{formErrors.telegram_chat_id}</p>
                      )}
                    </div>

                    <div className="bg-muted/30 p-3 rounded-md border border-border/60 mt-4">
                      <p className="text-sm text-muted-foreground">
                        Al crear una alerta, recibirás notificaciones automáticas en Telegram cuando encontremos vehículos que coincidan con tus criterios de búsqueda.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </CardContent>
            
            <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 p-6 border-t border-gray-200 bg-gray-50">
              <div className="space-y-2 text-sm">
                <p className="text-gray-500">
                  Tu privacidad es importante para nosotros. Tus datos solo se utilizarán para enviarte notificaciones.
                </p>
                {!isFormValid && (
                  <p className="text-amber-600 flex items-center gap-1">
                    <InfoIcon className="h-4 w-4" />
                    <span>Completa todos los campos requeridos para continuar</span>
                  </p>
                )}
              </div>
              <Button 
                type="submit" 
                disabled={isSubmitting || !isFormValid || searchingResults}
                className={`w-full sm:w-auto min-w-[140px] gap-2 text-white transition-all ${isFormValid ? 'bg-blue-600 hover:bg-blue-700 hover:shadow-md' : 'bg-blue-400 cursor-not-allowed'}`}
              >
                {isSubmitting || searchingResults ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    <span>{isSubmitting ? 'Creando...' : 'Buscando...'}</span>
                  </>
                ) : (
                  <>
                    <Bell className="h-4 w-4" />
                    <span>Crear alerta</span>
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        {searchingResults && (
          <div className="w-full max-w-4xl mx-auto mt-6">
            <Card className="p-6 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <p className="text-lg font-medium text-muted-foreground">Buscando vehículos...</p>
                <p className="text-sm text-muted-foreground">Esto puede tomar unos segundos</p>
              </div>
            </Card>
          </div>
        )}
        
        <div ref={resultsRef}>
          {searchError && <SearchErrorComponent />}
          {searchResults && <SearchResultsComponent />}
        </div>
      </motion.div>
    </TooltipProvider>
  );
}