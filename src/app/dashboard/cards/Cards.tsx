"use client";

import { useEffect, useState } from "react";
import Cards from "@/app/ui/cards/Cards";
import { getProducts, getAllCommandes } from "@/app/lib/apiHelpers";
import { Product, Order } from "@/app/types";

export default function DashboardPage() {
  const [totalVentes, setTotalVentes] = useState<number>(0);
  const [totalCommandes, setTotalCommandes] = useState<number>(0);
  const [totalProduits, setTotalProduits] = useState<number>(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const products: Product[] = await getProducts();
        const commandes: Order[] = await getAllCommandes();

        setTotalProduits(products.length);
        setTotalCommandes(commandes.length);

        const ventes = commandes.reduce((sum, c) => sum + Number(c.total || 0), 0);
        setTotalVentes(ventes);

      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
  );
}
