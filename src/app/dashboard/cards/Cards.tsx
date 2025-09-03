import Cards from '@/app/ui/cards/Cards';

export default function DashboardPage() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Cards
        bgcolor="green-100"
        text="+12% ce mois"
        icon="pi pi-shopping-cart"
        bordercolor="green-500"
        title="Ventes totales"
        value="12,345fcfa"
        color="green-800"
      />
      <Cards
        bgcolor="blue-100"
        text="+8% ce mois"
        icon="pi pi-users"
        bordercolor="blue-500"
        title="comandes"
        value={1234}
        color="blue-800"
      />
      <Cards
        bgcolor="amber-100"
        text="+15% ce mois"
        icon="pi pi-box"
        bordercolor="amber-500"
        title="Produits en stock"
        value={56}
        color="amber-800"
      />
    </div>
  );
}