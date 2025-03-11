export type CarBrand = string;

export interface AlertFormData {
  nombre_busqueda: string;
  marcas: string[];
  anio_minimo: number;
  anio_maximo: number;
  precio_maximo: number;
  kilometraje_maximo: number;
  telegram_chat_id: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
} 