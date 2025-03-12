// Mapeo de marcas de automóviles populares a sus modelos más comunes
export const modelosPorMarca: Record<string, string[]> = {
  "ACURA": [
    "MDX", "RDX", "TLX", "ILX", "NSX", "RLX", "TL", "TSX", "ZDX", "RSX"
  ],
  "ALFA ROMEO": [
    "Giulia", "Stelvio", "Tonale", "4C", "Giulietta", "MiTo", "Brera", "Spider", "159", "156"
  ],
  "AUDI": [
    "A3", "A4", "Q5", "Q3", "A6", "Q7", "A5", "Q8", "e-tron", "TT"
  ],
  "BAIC": [
    "X25", "X35", "BJ40", "X55", "D20", "X65", "BJ80", "M50S", "M60", "BJ20"
  ],
  "BMW": [
    "Serie 3", "X3", "X5", "Serie 5", "X1", "Serie 1", "X6", "Serie 7", "X7", "Serie 4"
  ],
  "BUICK": [
    "Encore", "Envision", "Enclave", "LaCrosse", "Regal", "Verano", "GL8", "Excelle", "Cascada", "Lucerne"
  ],
  "BYD": [
    "Han", "Tang", "Song", "Yuan", "Dolphin", "Seal", "Qin", "Atto 3", "e6", "Destroyer 05"
  ],
  "CADILLAC": [
    "Escalade", "XT5", "CT5", "XT4", "CTS", "CT4", "XT6", "ATS", "SRX", "XTS"
  ],
  "CHANGAN": [
    "CS35", "CS55", "CS75", "Eado", "CS15", "CS85", "UNI-T", "UNI-K", "Alsvin", "Hunter"
  ],
  "CHEVROLET": [
    "Silverado", "Equinox", "Tahoe", "Suburban", "Camaro", "Malibu", "Blazer", "Traverse", "Colorado", "Trax"
  ],
  "CHIREY": [
    "Tiggo 7", "Tiggo 8", "Tiggo 5", "Tiggo 4", "Arrizo 5", "Tiggo 3", "Tiggo 2", "Tiggo 7 Pro", "Tiggo 8 Pro", "Fulwin"
  ],
  "CHRYSLER": [
    "300", "Pacifica", "Town & Country", "200", "Sebring", "PT Cruiser", "Voyager", "Aspen", "Crossfire", "Concorde"
  ],
  "CITROËN": [
    "C3", "C4", "C5 Aircross", "C3 Aircross", "Berlingo", "C-Elysée", "C5", "C4 Cactus", "C1", "DS3"
  ],
  "CUPRA": [
    "Formentor", "Leon", "Ateca", "Born", "Tavascan", "Terramar", "Urban Rebel", "Leon Competición", "e-Racer", "Ateca Limited Edition"
  ],
  "DODGE": [
    "Charger", "Challenger", "Durango", "Journey", "Grand Caravan", "Ram 1500", "Dart", "Caliber", "Avenger", "Nitro"
  ],
  "FIAT": [
    "500", "Panda", "Tipo", "500X", "Argo", "Cronos", "Mobi", "Toro", "Uno", "Doblo"
  ],
  "FORD": [
    "F-150", "Escape", "Explorer", "Edge", "Mustang", "Expedition", "Ranger", "Focus", "Fusion", "Bronco"
  ],
  "GMC": [
    "Sierra", "Yukon", "Terrain", "Acadia", "Canyon", "Savana", "Hummer EV", "Envoy", "Jimmy", "Denali"
  ],
  "GREAT WALL": [
    "Haval H6", "Haval H9", "Wingle", "Haval H2", "Poer", "Haval Jolion", "Haval F7", "Cannon", "Tank 300", "Ora"
  ],
  "HONDA": [
    "CR-V", "Civic", "Accord", "HR-V", "Pilot", "Odyssey", "Fit", "City", "Ridgeline", "Insight"
  ],
  "HYUNDAI": [
    "Tucson", "Santa Fe", "Elantra", "Kona", "Accent", "Palisade", "Sonata", "Creta", "Venue", "Ioniq"
  ],
  "INFINITI": [
    "QX60", "QX80", "QX50", "Q50", "QX30", "Q60", "QX55", "Q70", "FX", "JX"
  ],
  "JAC": [
    "S3", "S7", "J7", "T6", "S5", "Sei4", "S4", "E-JS1", "T8", "S2"
  ],
  "JAGUAR": [
    "F-Pace", "XF", "XE", "E-Pace", "I-Pace", "F-Type", "XJ", "XK", "S-Type", "X-Type"
  ],
  "JEEP": [
    "Grand Cherokee", "Wrangler", "Cherokee", "Compass", "Renegade", "Gladiator", "Commander", "Wagoneer", "Liberty", "Patriot"
  ],
  "JETOUR": [
    "X70", "X90", "X70 Plus", "X95", "Dasheng", "Dashing", "T1", "X70S", "X70M", "X90 Plus"
  ],
  "KIA": [
    "Sportage", "Sorento", "Seltos", "Rio", "Forte", "Soul", "Telluride", "Niro", "Carnival", "Stinger"
  ],
  "LAND ROVER": [
    "Range Rover", "Range Rover Sport", "Discovery", "Evoque", "Defender", "Velar", "Discovery Sport", "Freelander", "Range Rover Vogue", "LR4"
  ],
  "LEXUS": [
    "RX", "NX", "ES", "GX", "LX", "IS", "UX", "LS", "GS", "CT"
  ],
  "LINCOLN": [
    "Navigator", "Aviator", "Corsair", "Nautilus", "MKZ", "Continental", "MKC", "MKX", "Town Car", "MKT"
  ],
  "MAZDA": [
    "CX-5", "3", "CX-30", "6", "CX-9", "MX-5", "CX-8", "2", "CX-3", "BT-50"
  ],
  "MERCEDES-BENZ": [
    "Clase C", "Clase E", "GLC", "GLE", "Clase A", "Clase S", "GLA", "CLA", "GLB", "GLS"
  ],
  "MG": [
    "HS", "ZS", "3", "5", "RX5", "ZS EV", "6", "GT", "GS", "RX8"
  ],
  "MINI": [
    "Cooper", "Countryman", "Clubman", "Cooper S", "Cooper SE", "John Cooper Works", "Paceman", "Roadster", "Coupe", "Convertible"
  ],
  "MITSUBISHI": [
    "Outlander", "ASX", "Montero Sport", "L200", "Eclipse Cross", "Mirage", "Xpander", "Lancer", "Pajero", "Colt"
  ],
  "NISSAN": [
    "X-Trail", "Sentra", "Versa", "Kicks", "Rogue", "Pathfinder", "Altima", "Qashqai", "Frontier", "Murano"
  ],
  "OMODA": [
    "5", "7", "9", "E5", "3", "C5", "Jaecoo 7", "C7", "Space", "Life"
  ],
  "PEUGEOT": [
    "208", "2008", "3008", "308", "5008", "508", "Partner", "Rifter", "Traveller", "301"
  ],
  "PORSCHE": [
    "Cayenne", "Macan", "911", "Panamera", "Taycan", "718 Cayman", "718 Boxster", "Carrera GT", "918 Spyder", "Cayman GT4"
  ],
  "RAM": [
    "1500", "2500", "3500", "ProMaster", "ProMaster City", "700", "1200", "4000", "5500", "Chassis Cab"
  ],
  "RENAULT": [
    "Captur", "Duster", "Kwid", "Sandero", "Logan", "Koleos", "Clio", "Oroch", "Stepway", "Kangoo"
  ],
  "SEAT": [
    "Leon", "Ateca", "Ibiza", "Arona", "Tarraco", "Toledo", "Alhambra", "Mii", "Exeo", "Altea"
  ],
  "SEV": [
    "A50", "A30", "B30", "A70", "C50", "C10", "A20", "H50", "T50", "B50"
  ],
  "SMART": [
    "Fortwo", "Forfour", "EQ Fortwo", "EQ Forfour", "Roadster", "Crossblade", "ForJeremy", "#1", "#3", "Brabus"
  ],
  "SUBARU": [
    "Forester", "Outback", "XV", "Impreza", "Legacy", "Ascent", "WRX", "BRZ", "Crosstrek", "Levorg"
  ],
  "SUZUKI": [
    "Vitara", "Swift", "Jimny", "S-Cross", "Ignis", "Ertiga", "Grand Vitara", "Baleno", "Ciaz", "XL7"
  ],
  "TESLA": [
    "Model 3", "Model Y", "Model S", "Model X", "Cybertruck", "Roadster", "Semi", "Model S Plaid", "Model X Plaid", "Model Y Performance"
  ],
  "TOYOTA": [
    "Corolla", "RAV4", "Hilux", "Camry", "Tacoma", "Highlander", "4Runner", "Prius", "Land Cruiser", "Yaris"
  ],
  "VOLKSWAGEN": [
    "Jetta", "Tiguan", "Golf", "Taos", "Polo", "T-Cross", "Teramont", "Passat", "Virtus", "ID.4"
  ],
  "VOLVO": [
    "XC60", "XC90", "XC40", "S60", "S90", "V60", "V90", "C40", "V40", "S40"
  ]
}; 