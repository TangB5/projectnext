'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function About() {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section id="about" className="py-20 bg-gradient-to-b from-white to-stone-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <motion.div 
            className="md:w-1/2"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6 text-green-900 font-serif">Notre Philosophie</h2>
            <div className="w-20 h-1 bg-green-700 mb-6"></div>
            
            <p className="text-gray-600 mb-6 text-lg leading-relaxed">
              {`Depuis 2010, ModerneMeuble révolutionne l'ameublement avec des designs contemporains accessibles à tous. 
              Nous croyons que le beau design devrait être à la portée de tous, sans compromis sur la qualité.`}
            </p>
            
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  <p className="text-gray-600 leading-relaxed">
                    {`Nos créations sont le fruit d'une collaboration entre designers internationaux et artisans locaux, 
                    garantissant à la fois innovation et savoir-faire traditionnel.`}
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    {`Nous utilisons exclusivement des matériaux durables et certifiés, avec une attention particulière 
                    portée à l'empreinte écologique de chaque produit.`}
                  </p>
                  <ul className="list-disc pl-5 text-gray-600 space-y-3">
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-green-700 rounded-full mt-2 mr-2"></span>
                      <span>Design primé plusieurs fois récompensé</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-green-700 rounded-full mt-2 mr-2"></span>
                      <span>Assemblage facile en moins de 30 minutes</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-green-700 rounded-full mt-2 mr-2"></span>
                      <span>Garantie 5 ans sur tous nos produits</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-green-700 rounded-full mt-2 mr-2"></span>
                      <span>Service client disponible 7j/7</span>
                    </li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
            
            <button 
              onClick={toggleExpand}
              className="mt-8 flex items-center gap-2 bg-green-800 hover:bg-green-900 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg group"
            >
              {expanded ? (
                <>
                  <span>Voir moins</span>
                  <ChevronUp className="w-5 h-5 transition-transform group-hover:-translate-y-1" />
                </>
              ) : (
                <>
                  <span>En savoir plus</span>
                  <ChevronDown className="w-5 h-5 transition-transform group-hover:translate-y-1" />
                </>
              )}
            </button>
          </motion.div>
          
          <motion.div 
            className="md:w-1/2 relative"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <img 
              src="https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
              alt="Atelier de fabrication" 
              className="rounded-xl shadow-xl w-full hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02]"
            />
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-green-700 rounded-xl z-[-1] hidden md:block"></div>
            <div className="absolute -top-6 -right-6 w-16 h-16 bg-green-600 rounded-xl z-[-1] hidden md:block"></div>
          </motion.div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="mt-16"
            >
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                <motion.div 
                  className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-green-700"
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                >
                  <h3 className="text-2xl font-semibold text-green-800 mb-4">Éco-responsabilité</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Tous nos matériaux sont sourcés de manière responsable et 95% de nos emballages sont recyclables.
                  </p>
                </motion.div>
                
                <motion.div 
                  className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-green-700"
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                >
                  <h3 className="text-2xl font-semibold text-green-800 mb-4">Innovation</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Notre laboratoire de design explore en permanence de nouvelles formes et fonctionnalités.
                  </p>
                </motion.div>
                
                <motion.div 
                  className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-green-700"
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                >
                  <h3 className="text-2xl font-semibold text-green-800 mb-4">Satisfaction client</h3>
                  <p className="text-gray-600 leading-relaxed">
                    98% de nos clients recommandent nos produits, avec un service après-vente disponible 7j/7.
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}