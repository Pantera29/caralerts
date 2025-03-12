export type CarBrand = string;

export type NotificationFrequency = 'horaria' | 'cada12horas' | 'diaria';

export interface AlertFormData {
  nombre_busqueda: string;
  marcas: string[];
  modelos: string[];
  anio_minimo: number;
  anio_maximo: number;
  precio_maximo: number;
  kilometraje_maximo: number;
  telegram_chat_id: string;
  frecuencia: NotificationFrequency;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
} 