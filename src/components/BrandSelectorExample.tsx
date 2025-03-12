import { useState } from 'react';
import { BrandSelector } from '@/components/ui/brand-selector';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export function BrandSelectorExample() {
  const [singleValue, setSingleValue] = useState<string>('');
  const [multipleValue, setMultipleValue] = useState<string[]>([]);
  const [enableMultiple, setEnableMultiple] = useState<boolean>(false);

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto border">
        <CardHeader>
          <CardTitle>Selector de Marcas de Automóviles</CardTitle>
          <CardDescription>
            Componente personalizado con logos de marcas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="flex items-center space-x-2">
            <Switch 
              id="multiple-mode"
              checked={enableMultiple}
              onCheckedChange={setEnableMultiple}
            />
            <Label htmlFor="multiple-mode">
              {enableMultiple ? 'Selección múltiple' : 'Selección única'}
            </Label>
          </div>

          {enableMultiple ? (
            <div className="space-y-4">
              <Label>Selecciona varias marcas</Label>
              <BrandSelector
                value={multipleValue}
                onChange={(value) => {
                  if (Array.isArray(value)) {
                    setMultipleValue(value);
                  }
                }}
                multiple={true}
                placeholder="Seleccionar marcas de coches"
              />
              <div className="text-sm mt-2">
                <p>Marcas seleccionadas: {multipleValue.length > 0 
                  ? multipleValue.join(', ')
                  : 'Ninguna'}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Label>Selecciona una marca</Label>
              <BrandSelector
                value={singleValue}
                onChange={(value) => {
                  if (typeof value === 'string') {
                    setSingleValue(value);
                  }
                }}
                multiple={false}
                placeholder="Seleccionar una marca de coche"
              />
              <div className="text-sm mt-2">
                <p>Marca seleccionada: {singleValue || 'Ninguna'}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 