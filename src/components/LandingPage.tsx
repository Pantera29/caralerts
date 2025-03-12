import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Car, Bell, Search, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertForm } from "@/components/AlertForm";

interface LandingPageProps {
  showFormInitially?: boolean;
  onFormVisibilityChange?: (isVisible: boolean) => void;
}

export function LandingPage({ 
  showFormInitially = false, 
  onFormVisibilityChange 
}: LandingPageProps) {
  const [showForm, setShowForm] = useState(showFormInitially);

  useEffect(() => {
    setShowForm(showFormInitially);
  }, [showFormInitially]);

  const handleSetShowForm = (value: boolean) => {
    setShowForm(value);
    if (onFormVisibilityChange) {
      onFormVisibilityChange(value);
    }
  };

  // Variantes de animación
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
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

  const features = [
    {
      icon: <Search className="h-5 w-5" />,
      title: "Búsqueda personalizada",
      description: "Define exactamente qué vehículos te interesan por marca, año y precio."
    },
    {
      icon: <Bell className="h-5 w-5" />,
      title: "Notificaciones en tiempo real",
      description: "Recibe alertas en Telegram cuando aparezcan vehículos que coincidan con tus criterios."
    },
    {
      icon: <Car className="h-5 w-5" />,
      title: "Encuentra las mejores ofertas",
      description: "No te pierdas ninguna oportunidad con nuestro sistema de alertas."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-slate-950 dark:to-slate-900 pt-16">
      {!showForm ? (
        <div className="container mx-auto px-4 py-20 max-w-6xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-col items-center text-center"
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="mb-8">
              <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-4 py-1.5 rounded-full mb-4">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                </span>
                <span className="text-sm font-medium">Nuevo servicio disponible</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
                Alertas de vehículos <span className="text-blue-600 dark:text-blue-400">a tu medida</span>
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                Configura alertas personalizadas y recibe notificaciones en Telegram cuando encontremos vehículos que coincidan con tus criterios de búsqueda.
              </p>
              <div className="flex items-center justify-center mt-3">
                <p className="text-lg font-medium text-blue-600 dark:text-blue-400">
                  Búsquedas automáticas en <span className="font-bold">Kavak</span> y <span className="font-bold">Mercado Libre</span>
                </p>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div variants={itemVariants} className="mb-16">
              <Button 
                onClick={() => handleSetShowForm(true)}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 py-6 h-auto text-lg font-medium shadow-lg hover:shadow-xl transition-all group"
              >
                Crear mi primera alerta
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>

            {/* Features */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-slate-100 dark:border-slate-700"
                >
                  <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-300">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Testimonial/Benefits Section */}
            <motion.div variants={itemVariants} className="mt-16 bg-gradient-to-r from-blue-600 to-teal-500 rounded-2xl p-8 w-full text-white">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">¿Por qué usar CarAlerts?</h2>
                <div className="space-y-4">
                  {[
                    "Ahorra tiempo al no tener que revisar constantemente diferentes sitios web",
                    "No te pierdas ninguna oportunidad, incluso cuando no estés buscando activamente",
                    "Configura diferentes alertas para diferentes tipos de vehículos",
                    "Personaliza la frecuencia de notificaciones según tus preferencias"
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-6 w-6 flex-shrink-0 mt-0.5" />
                      <p className="text-lg">{benefit}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-8 text-center">
                  <Button 
                    onClick={() => handleSetShowForm(true)}
                    variant="secondary"
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-blue-50 rounded-xl font-medium"
                  >
                    Comenzar ahora
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Footer */}
            <motion.div variants={itemVariants} className="mt-20 text-center text-slate-500 dark:text-slate-400">
              <p>© {new Date().getFullYear()} CarAlerts. Todos los derechos reservados.</p>
            </motion.div>
          </motion.div>
        </div>
      ) : (
        <div className="bg-white min-h-screen pt-16">
          <div className="container mx-auto px-4 py-2">
            <div className="w-full flex flex-col mb-8">
              <div className="w-full flex justify-start mb-4">
                <Button 
                  onClick={() => handleSetShowForm(false)} 
                  variant="ghost" 
                  className="text-blue-600"
                >
                  ← Volver a la página principal
                </Button>
              </div>
              <div className="text-center">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Configura tu alerta</h2>
                <p className="text-slate-600 max-w-2xl mx-auto">
                  Completa el formulario a continuación para recibir notificaciones cuando encontremos vehículos que coincidan con tus criterios.
                </p>
                <p className="text-blue-600 text-sm font-medium mt-2">
                  Búsquedas automáticas en <span className="font-bold">Kavak</span> y <span className="font-bold">Mercado Libre</span>
                </p>
              </div>
            </div>
            <AlertForm />
          </div>
        </div>
      )}
    </div>
  );
} 