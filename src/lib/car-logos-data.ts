export interface CarBrandLogo {
  name: string;      // Nombre de la marca
  label: string;     // Etiqueta para mostrar (por lo general igual al nombre)
  logo?: string;     // Campo opcional para URL del logo (no utilizado actualmente)
}

// Lista de marcas de automóviles populares
// Nota: Ya no usamos las URLs de imágenes, sino que generamos círculos con iniciales de colores
export const CAR_LOGOS: CarBrandLogo[] = [
  {
    name: "Acura",
    label: "Acura"
  },
  {
    name: "Alfa Romeo",
    label: "Alfa Romeo"
  },
  {
    name: "Audi",
    label: "Audi"
  },
  {
    name: "BAIC",
    label: "BAIC"
  },
  {
    name: "BMW",
    label: "BMW"
  },
  {
    name: "Buick",
    label: "Buick"
  },
  {
    name: "BYD",
    label: "BYD"
  },
  {
    name: "Cadillac",
    label: "Cadillac"
  },
  {
    name: "Changan",
    label: "Changan"
  },
  {
    name: "Chevrolet",
    label: "Chevrolet"
  },
  {
    name: "Chirey",
    label: "Chirey"
  },
  {
    name: "Chrysler",
    label: "Chrysler"
  },
  {
    name: "Citroën",
    label: "Citroën"
  },
  {
    name: "Cupra",
    label: "Cupra"
  },
  {
    name: "Dodge",
    label: "Dodge"
  },
  {
    name: "Fiat",
    label: "Fiat"
  },
  {
    name: "Ford",
    label: "Ford"
  },
  {
    name: "GMC",
    label: "GMC"
  },
  {
    name: "Great Wall",
    label: "Great Wall"
  },
  {
    name: "Honda",
    label: "Honda"
  },
  {
    name: "Hyundai",
    label: "Hyundai"
  },
  {
    name: "Infiniti",
    label: "Infiniti"
  },
  {
    name: "JAC",
    label: "JAC"
  },
  {
    name: "Jaguar",
    label: "Jaguar"
  },
  {
    name: "Jeep",
    label: "Jeep"
  },
  {
    name: "Jetour",
    label: "Jetour"
  },
  {
    name: "Kia",
    label: "Kia"
  },
  {
    name: "Land Rover",
    label: "Land Rover"
  },
  {
    name: "Lexus",
    label: "Lexus"
  },
  {
    name: "Lincoln",
    label: "Lincoln"
  },
  {
    name: "Mazda",
    label: "Mazda"
  },
  {
    name: "Mercedes-Benz",
    label: "Mercedes-Benz"
  },
  {
    name: "MG",
    label: "MG"
  },
  {
    name: "Mini",
    label: "Mini"
  },
  {
    name: "Mitsubishi",
    label: "Mitsubishi"
  },
  {
    name: "Nissan",
    label: "Nissan"
  },
  {
    name: "Omoda",
    label: "Omoda"
  },
  {
    name: "Peugeot",
    label: "Peugeot"
  },
  {
    name: "Porsche",
    label: "Porsche"
  },
  {
    name: "RAM",
    label: "RAM"
  },
  {
    name: "Renault",
    label: "Renault"
  },
  {
    name: "Seat",
    label: "Seat"
  },
  {
    name: "SEV",
    label: "SEV"
  },
  {
    name: "Smart",
    label: "Smart"
  },
  {
    name: "Subaru",
    label: "Subaru"
  },
  {
    name: "Suzuki",
    label: "Suzuki"
  },
  {
    name: "Tesla",
    label: "Tesla"
  },
  {
    name: "Toyota",
    label: "Toyota"
  },
  {
    name: "Volkswagen",
    label: "Volkswagen"
  },
  {
    name: "Volvo",
    label: "Volvo"
  }
]; 