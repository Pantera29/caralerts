import { useState } from "react";
import { AlertFormData, NotificationFrequency } from "@/types/alert";
import { CAR_BRANDS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { InfoIcon, X, Bell } from "lucide-react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
  const [selectedBrand, setSelectedBrand] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "precio_maximo" || name === "kilometraje_maximo" || name === "anio_minimo" || name === "anio_maximo") {
      setFormData({
        ...formData,
        [name]: parseInt(value) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleBrandSelect = (value: string) => {
    setSelectedBrand(value);
    if (!formData.marcas.includes(value)) {
      setFormData({
        ...formData,
        marcas: [...formData.marcas, value]
      });
    }
  };

  const removeBrand = (brand: string) => {
    setFormData({
      ...formData,
      marcas: formData.marcas.filter(b => b !== brand)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

  return (
    <TooltipProvider>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-medium">Nueva Alerta de Vehículos</CardTitle>
          <CardDescription className="text-muted-foreground">
            Configura los criterios para recibir notificaciones de vehículos.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-8">
            {/* Sección de Búsqueda */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombre_busqueda">Nombre de la búsqueda</Label>
                <Input
                  id="nombre_busqueda"
                  name="nombre_busqueda"
                  placeholder="Ej: BMW Serie 3 2020+"
                  value={formData.nombre_busqueda}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Marcas</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.marcas.map(brand => (
                    <div 
                      key={brand} 
                      className="inline-flex items-center bg-secondary/50 hover:bg-secondary/60 text-secondary-foreground px-2.5 py-0.5 rounded-md transition-colors"
                    >
                      <span className="text-sm">{brand}</span>
                      <Button 
                        type="button" 
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 p-0 ml-1 hover:bg-transparent"
                        onClick={() => removeBrand(brand)}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Eliminar {brand}</span>
                      </Button>
                    </div>
                  ))}
                </div>
                <Select onValueChange={handleBrandSelect} value={selectedBrand}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar marca" />
                  </SelectTrigger>
                  <SelectContent>
                    {CAR_BRANDS.map(brand => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Sección de Filtros */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Filtros</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="anio_minimo">Año mínimo</Label>
                  <Input
                    id="anio_minimo"
                    name="anio_minimo"
                    type="number"
                    min="1990"
                    max={new Date().getFullYear()}
                    value={formData.anio_minimo}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="anio_maximo">Año máximo</Label>
                  <Input
                    id="anio_maximo"
                    name="anio_maximo"
                    type="number"
                    min="1990"
                    max={new Date().getFullYear()}
                    value={formData.anio_maximo}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="precio_maximo">Precio máximo</Label>
                <Input
                  id="precio_maximo"
                  name="precio_maximo"
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.precio_maximo}
                  onChange={handleInputChange}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(formData.precio_maximo)}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="kilometraje_maximo">Kilometraje máximo</Label>
                <Input
                  id="kilometraje_maximo"
                  name="kilometraje_maximo"
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.kilometraje_maximo}
                  onChange={handleInputChange}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  {formData.kilometraje_maximo.toLocaleString()} km
                </p>
              </div>
            </div>

            <Separator />

            {/* Sección de Notificaciones */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-medium">Notificaciones</h3>
              </div>

              <div className="space-y-4">
                <Label>Frecuencia de notificaciones</Label>
                <RadioGroup
                  value={formData.frecuencia}
                  onValueChange={(value) => 
                    setFormData({
                      ...formData,
                      frecuencia: value as NotificationFrequency
                    })
                  }
                  className="space-y-4"
                >
                  <div className="flex items-start space-x-4 rounded-md border p-4">
                    <RadioGroupItem value="horaria" id="horaria" />
                    <div className="flex-1 space-y-1">
                      <Label htmlFor="horaria" className="font-medium">Cada hora</Label>
                      <p className="text-sm text-muted-foreground">
                        Recibirás notificaciones cada hora si hay vehículos nuevos que coincidan con tus criterios.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 rounded-md border p-4">
                    <RadioGroupItem value="cada12horas" id="cada12horas" />
                    <div className="flex-1 space-y-1">
                      <Label htmlFor="cada12horas" className="font-medium">Dos veces al día</Label>
                      <p className="text-sm text-muted-foreground">
                        Recibirás notificaciones a las 8:00 AM y 8:00 PM si hay vehículos nuevos.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 rounded-md border p-4">
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
                <div className="flex items-center gap-2">
                  <Label htmlFor="telegram_chat_id">Chat ID de Telegram</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full p-0">
                        <InfoIcon className="h-4 w-4" />
                        <span className="sr-only">Información sobre Chat ID</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" align="center" className="max-w-xs">
                      <p>Para obtener tu Chat ID, inicia una conversación con @userinfobot en Telegram y te enviará tu ID.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  id="telegram_chat_id"
                  name="telegram_chat_id"
                  placeholder="Ej: 123456789"
                  value={formData.telegram_chat_id}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end pt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? "Creando alerta..." : "Crear alerta"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </TooltipProvider>
  );
} 