"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export function Hero() {
    return (
        <section className="relative bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white overflow-hidden">
            {/* Effet de fond décoratif */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=1000')] bg-cover bg-center mix-blend-overlay"></div>
            </div>

            <div className="container mx-auto px-4 py-24 md:py-32 flex flex-col md:flex-row items-center relative z-10">
                {/* Contenu texte */}
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="md:w-1/2 mb-12 md:mb-0"
                >
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                        <span className="block mb-2">Meubles Préfabriqués</span>
                        <span className="text-green-300">Modernes & Élégants</span>
                    </h1>
                    
                    <p className="text-lg md:text-xl mb-8 text-green-100 max-w-lg">
                        Découvrez notre collection exclusive de meubles design à monter soi-même. 
                        Qualité premium, style contemporain et praticité inégalée à prix abordable.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link 
                                href="/auth/login" 
                                className="inline-block bg-white text-green-800 px-8 py-4 rounded-xl font-semibold hover:bg-green-100 transition-all shadow-lg hover:shadow-xl"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                    Espace Professionnel
                                </span>
                            </Link>
                        </motion.div>
                        
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <a 
                                href="#products" 
                                className="inline-block border-2 border-green-300 text-green-100 px-8 py-4 rounded-xl font-semibold hover:bg-green-800 hover:border-green-400 hover:text-white transition-all"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    Voir la Collection
                                </span>
                            </a>
                        </motion.div>
                    </div>

                    {/* Avis clients */}
                    <div className="mt-10 flex items-center">
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                                    {/* Placeholder pour les avatars clients */}
                                </div>
                            ))}
                        </div>
                        <div className="ml-4">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-sm text-green-200 mt-1">500+ clients satisfaits ce mois-ci</p>
                        </div>
                    </div>
                </motion.div>

                {/* Image */}
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="md:w-1/2 flex justify-center relative"
                >
                    <div className="relative w-full max-w-lg">
                        <div className="absolute -inset-4 bg-green-600 rounded-2xl transform rotate-1 opacity-20"></div>
                        <div className="relative rounded-xl overflow-hidden shadow-2xl border-4 border-white">
                            <Image
                                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                                alt="Meuble design contemporain"
                                width={600}
                                height={600}
                                className="object-cover w-full h-auto"
                                priority
                            />
                            {/* Badge sur l'image */}
                            <div className="absolute bottom-4 left-4 bg-white text-green-800 px-3 py-1 rounded-full text-sm font-semibold shadow-md flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                                </svg>
                                Nouvelle Collection
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

           
        </section>
    );
}