import { useState, useEffect } from "react";
import { AlertFormData, NotificationFrequency } from "@/types/alert";
import { toast } from "sonner";
import { 
  InfoIcon, 
  X, 
  Bell, 
  Search, 
  Car, 
  Calendar, 
  DollarSign, 
  Gauge, 
  Send, 
  Tag
} from "lucide-react";
import { motion } from "framer-motion";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BrandSelectorSimple } from "@/components/ui/brand-selector-simple";

const initialFormData: AlertFormData = {
  nombre_busqueda: "",
  marcas: [],
  anio_minimo: 2015,
  anio_maximo: new Date().getFullYear(),
  precio_maximo: 500000,
  kilometraje_maximo: 100000,
  telegram_chat_id: "",
  frecuencia: "diaria"
};

export function AlertForm() {
  const [formData, setFormData] = useState<AlertFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof AlertFormData, string>>>({});
  const [isFormValid, setIsFormValid] = useState(false);

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
    console.log("AlertForm - handleBrandChange recibió:", value);
    
    const brands = Array.isArray(value) ? value : [value];
    console.log("AlertForm - brands array:", brands);
    
    setFormData(prevData => {
      const newFormData = {
        ...prevData,
        marcas: brands
      };
      console.log("AlertForm - nuevo formData:", newFormData);
      return newFormData;
    });
    
    // Validar después de actualizar
    const error = validateField('marcas', brands);
    setFormErrors(prev => ({
      ...prev,
      marcas: error
    }));
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

    try {
      console.log('Enviando formData:', formData);
      console.log('Frecuencia seleccionada:', formData.frecuencia);
      
      const response = await fetch("https://kavak-meli-bot.francolonghi29.workers.dev/api/alerts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        mode: "cors",
        credentials: "omit",
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      console.log('Respuesta del servidor:', data);

      if (data.success) {
        toast.success("¡Alerta creada con éxito!", {
          description: "Recibirás notificaciones en Telegram cuando encontremos vehículos que coincidan con tus criterios."
        });
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
                disabled={isSubmitting || !isFormValid}
                className={`w-full sm:w-auto min-w-[140px] gap-2 text-white transition-all ${isFormValid ? 'bg-blue-600 hover:bg-blue-700 hover:shadow-md' : 'bg-blue-400 cursor-not-allowed'}`}
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    <span>Creando...</span>
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
      </motion.div>
    </TooltipProvider>
  );
} 