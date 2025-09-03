"use client"
import 'primeicons/primeicons.css';
import { motion } from 'framer-motion';

export function Footer() {
  const listItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3
      }
    })
  };

  return (
    <footer className="bg-gradient-to-b from-green-900 to-green-950 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Logo et description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center mb-6">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                width="32" 
                height="32"
                className="text-green-400 mr-3"
              >
                <path fill="currentColor" d="M20 9V7c0-1.65-1.35-3-3-3H7C5.35 4 4 5.35 4 7v2c-1.65 0-3 1.35-3 3v5c0 1.65 1.35 3 3 3v1c0 .55.45 1 1 1s1-.45 1-1v-1h12v1c0 .55.45 1 1 1s1-.45 1-1v-1c1.65 0 3-1.35 3-3v-5c0-1.65-1.35-3-3-3zM6 7c0-.55.45-1 1-1h10c.55 0 1 .45 1 1v2.78c-.61.55-1 1.34-1 2.22v2H7v-2c0-.88-.39-1.67-1-2.22V7zm15 10c0 .55-.45 1-1 1H4c-.55 0-1-.45-1-1v-5c0-.55.45-1 1-1s1 .45 1 1v4h14v-4c0-.55.45-1 1-1s1 .45 1 1v5z"/>
              </svg>
              <h3 className="text-2xl font-bold font-serif tracking-wide">ModerneMeuble</h3>
            </div>
            <p className="text-green-100 mb-6 leading-relaxed">
              Des meubles modernes et préfabriqués pour tous les intérieurs. Qualité, design et praticité.
            </p>
            <div className="flex space-x-4">
              {['pi-facebook', 'pi-instagram', 'pi-pinterest', 'pi-twitter'].map((icon, index) => (
                <motion.a
                  key={icon}
                  href="#"
                  className="bg-green-800 hover:bg-green-700 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                  whileHover={{ y: -3 }}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={listItemVariants}
                >
                  <i className={`pi ${icon} text-lg`}></i>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-bold mb-6 pb-2 border-b border-green-800">Navigation</h4>
            <ul className="space-y-3">
              {['Nos produits', 'À propos', 'Contact', 'Blog'].map((item, index) => (
                <motion.li
                  key={item}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={listItemVariants}
                >
                  <a 
                    href={`#${item.toLowerCase().replace(' ', '-')}`} 
                    className="text-green-200 hover:text-white transition-colors duration-300 flex items-center"
                  >
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    {item}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Informations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-bold mb-6 pb-2 border-b border-green-800">Informations</h4>
            <ul className="space-y-3">
              {['Livraison', 'Paiement sécurisé', 'Conditions générales', 'FAQ'].map((item, index) => (
                <motion.li
                  key={item}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={listItemVariants}
                >
                  <a 
                    href="#" 
                    className="text-green-200 hover:text-white transition-colors duration-300 flex items-center"
                  >
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    {item}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-bold mb-6 pb-2 border-b border-green-800">Newsletter</h4>
            <p className="text-green-100 mb-6 leading-relaxed">
              Abonnez-vous pour recevoir nos offres exclusives et nouveautés.
            </p>
            <form className="flex flex-col space-y-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <input 
                  type="email" 
                  placeholder="Votre email" 
                  className="px-5 py-3 rounded-lg focus:outline-none text-gray-800 w-full bg-white focus:ring-2 focus:ring-green-400"
                />
              </motion.div>
              <motion.button
                type="submit"
                className="bg-green-700 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>S&rsquo;abonner</span>
                <i className="pi pi-send"></i>
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          className="border-t border-green-800 pt-8 flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <p className="text-green-300 mb-4 md:mb-0 text-center md:text-left">
            &copy; {new Date().getFullYear()} ModerneMeuble. Tous droits réservés.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-green-300 hover:text-white transition">Mentions légales</a>
            <span className="text-green-600">•</span>
            <a href="#" className="text-green-300 hover:text-white transition">Politique de confidentialité</a>
            <span className="text-green-600">•</span>
            <a href="#" className="text-green-300 hover:text-white transition">CGV</a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}