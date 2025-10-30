'use client';

import Cards from "@/app/ui/cards/Cards";
import SaleCard from "@/app/dashboard/saleCard/page";
import Popular from "@/app/dashboard/popularCard/page";
import { useDashboardStats } from "@/app/hooks/useDashboardStats";

export default function DashboardPage() {
  const { totalVentes, totalCommandes, totalProduits, loading } = useDashboardStats();

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <Cards
          bgcolor="green-100"
          text="+12% ce mois"
          icon="pi pi-shopping-cart"
          bordercolor="green-500"
          title="Ventes totales"
          value={`${totalVentes} fcfa`}
          color="green-800"
        />
        <Cards
          bgcolor="blue-100"
          text="+8% ce mois"
          icon="pi pi-users"
          bordercolor="blue-500"
          title="Commandes"
          value={totalCommandes}
          color="blue-800"
        />
        <Cards
          bgcolor="amber-100"
          text="+15% ce mois"
          icon="pi pi-box"
          bordercolor="amber-500"
          title="Produits en stock"
          value={totalProduits}
          color="amber-800"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <SaleCard />
        <Popular />
      </div>
    </div>
  );
}
