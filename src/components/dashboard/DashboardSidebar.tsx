'use client';

import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useDashboard } from "@/app/contexts/DashboardContext";
import { logout } from "@/app/lib/Service";

const menuItems = [
  { href: '/dashboard', icon: 'pi-chart-bar', label: 'Tableau de bord' },
  { href: '/dashboard/products', icon: 'pi-box', label: 'Produits' },
  { href: '/dashboard/orders', icon: 'pi-shopping-cart', label: 'Commandes' },
  { href: '/dashboard/customers', icon: 'pi-users', label: 'Clients' },
];

const settingsItems = [
  { href: '/dashboard/settings', icon: 'pi-cog', label: 'Paramètres' },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { sidebarCollapsed, setSidebarCollapsed, isMobile } = useDashboard();

  const navigateTo = (href: string) => {
    router.push(href);
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  // Version mobile - Barre en bas
  if (isMobile) {
    const mobileItems = [
      ...menuItems,
      ...settingsItems,
      { href: '/logout', icon: 'pi-sign-out', label: 'Déconnexion', action: handleLogout }
    ];

    return (
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-green-800 to-green-700 text-white z-50 shadow-xl"
      >
        <nav className="flex justify-around py-2">
          {mobileItems.map((item) => (
            <motion.button
              key={item.href}
              whileTap={{ scale: 0.95 }}
              onClick={() => ('action' in item && item.action) ? item.action() : navigateTo(item.href)}
              className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                pathname === item.href
                  ? 'bg-green-500/60 bg-opacity-20 text-white'
                  : 'text-green-100 hover:bg-white hover:bg-opacity-10'
              }`}
            >
              <i className={`pi ${item.icon} text-xl`}></i>
              <span className="text-xs mt-1">{item.label}</span>
            </motion.button>
          ))}
        </nav>
      </motion.div>
    );
  }

  // Version desktop - Barre latérale
  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className={`bg-gradient-to-b from-green-800 to-green-700 text-white h-full fixed z-10 shadow-xl transition-all duration-300 ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="p-4 border-b border-green-600 flex justify-between items-center">
        {!sidebarCollapsed ? (
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl font-bold flex items-center"
          >
            <i className="pi pi-box mr-2"></i>
            ModerneMeuble
          </motion.h2>
        ) : (
          <div className="flex justify-center w-full">
            <i className="pi pi-box text-xl"></i>
          </div>
        )}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="text-green-200 hover:text-white p-1 rounded-full hover:bg-green-500/60 hover:bg-opacity-10"
        >
          <i className={`pi ${sidebarCollapsed ? 'pi-chevron-right' : 'pi-chevron-left'}`}></i>
        </motion.button>
      </div>

      <nav className="p-4 overflow-y-auto h-[calc(100%-60px)]">
        <div className="mb-6">
          {!sidebarCollapsed && (
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs uppercase text-green-300 mb-3 tracking-wider"
            >
              Menu Principal
            </motion.h3>
          )}
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <motion.li key={item.href} whileHover={{ scale: 1.02 }}>
                <button
                  onClick={() => navigateTo(item.href)}
                  className={`w-full text-left flex items-center py-2 px-3 rounded-lg transition-all ${
                    pathname === item.href
                      ? 'bg-green-500/60 bg-opacity-20 text-white shadow-md'
                      : 'text-green-200 hover:bg-green-500/60 hover:bg-opacity-10'
                  }`}
                >
                  <i className={`pi ${item.icon} ${sidebarCollapsed ? 'mx-auto' : 'mr-3'}`}></i>
                  {!sidebarCollapsed && (
                    <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                      {item.label}
                    </motion.span>
                  )}
                </button>
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          {!sidebarCollapsed && (
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs uppercase text-green-300 mb-3 tracking-wider"
            >
              Préférences
            </motion.h3>
          )}
          <ul className="space-y-1">
            {settingsItems.map((item) => (
              <motion.li key={item.href} whileHover={{ scale: 1.02 }}>
                <button
                  onClick={() => navigateTo(item.href)}
                  className={`w-full text-left flex items-center py-2 px-3 rounded-lg transition-all ${
                    pathname === item.href
                      ? 'bg-green-500/60 bg-opacity-20 text-white shadow-md'
                      : 'text-green-200 hover:bg-green-500/60 hover:bg-opacity-10'
                  }`}
                >
                  <i className={`pi ${item.icon} ${sidebarCollapsed ? 'mx-auto' : 'mr-3'}`}></i>
                  {!sidebarCollapsed && (
                    <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                      {item.label}
                    </motion.span>
                  )}
                </button>
              </motion.li>
            ))}
            <motion.li whileHover={{ scale: 1.02 }}>
              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center py-2 px-3 rounded-lg transition-all text-green-200 hover:bg-green-500/60 hover:bg-opacity-10"
              >
                <i className={`pi pi-sign-out ${sidebarCollapsed ? 'mx-auto' : 'mr-3'}`}></i>
                {!sidebarCollapsed && (
                  <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                    Déconnexion
                  </motion.span>
                )}
              </button>
            </motion.li>
          </ul>
        </div>

        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 text-center text-green-300 text-xs"
          >
            Version 1.0.0
          </motion.div>
        )}
      </nav>
    </motion.div>
  );
}
