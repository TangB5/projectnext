"use client";
import 'primeicons/primeicons.css';
import { motion } from 'framer-motion';

export function Avantages() {
    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5
            }
        }
    };

    return (
        <section className="py-20 bg-gradient-to-b from-stone-100 to-stone-200">
            <div className="container mx-auto px-4 max-w-6xl">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold mb-4 text-green-900 font-serif">Pourquoi choisir nos meubles ?</h2>
                    <div className="w-24 h-1 bg-green-700 mx-auto"></div>
                </motion.div>
                
                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-3 gap-10"
                    variants={container}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <motion.div 
                        className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 text-center"
                        variants={item}
                        whileHover={{ y: -5 }}
                    >
                        <div className="bg-green-700 text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                            <i className="pi pi-truck text-3xl"></i>
                        </div>
                        <h3 className="font-bold text-xl mb-4 text-green-900">Livraison rapide</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Livraison express en 48h pour toute commande passée avant 16h. 
                            <span className="block mt-2 text-green-700 font-medium">Suivi en temps réel</span>
                        </p>
                    </motion.div>
                    
                    <motion.div 
                        className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 text-center"
                        variants={item}
                        whileHover={{ y: -5 }}
                    >
                        <div className="bg-green-700 text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
                                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                                <path fill="currentColor" d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
                            </svg>
                        </div>
                        <h3 className="font-bold text-xl mb-4 text-green-900">Montage facile</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Notices illustrées et pièces numérotées. 
                            <span className="block mt-2 text-green-700 font-medium">Aucun outil spécial requis</span>
                        </p>
                    </motion.div>
                    
                    <motion.div 
                        className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 text-center"
                        variants={item}
                        whileHover={{ y: -5 }}
                    >
                        <div className="bg-green-700 text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
                                <path fill="currentColor" d="M17 8C8 10 5 9 3 11c-2 2-1 6 4 9 5 3 9 1 10-1 1-2 1-5-3-8-3-2-5-1-7-1z"/>
                                <path fill="currentColor" d="M16 12c0 0-6-2-8-1-2 1-3 4-1 5 2 1 7 0 9-2 2-2 0-2 0-2z"/>
                            </svg>
                        </div>
                        <h3 className="font-bold text-xl mb-4 text-green-900">Éco-responsable</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Bois FSC et emballages 100% recyclables. 
                            <span className="block mt-2 text-green-700 font-medium">Neutre en carbone</span>
                        </p>
                    </motion.div>
                </motion.div>

                <div className="text-center mt-16">
                    <button className="bg-green-800 hover:bg-green-900 text-white font-medium py-3 px-8 rounded-full transition-colors duration-300 shadow-md hover:shadow-lg">
                        Découvrir notre collection
                    </button>
                </div>
            </div>
        </section>
    );
}