"use client";
import { useEffect, useState } from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
 
} from "recharts";
import { Skeleton } from "../../ui/skeleton"; // Composant Skeleton pour le loading

interface SaleData {
  month: string;
  sales: number;
  previousYearSales?: number;
  orders: number;
}

interface Order {
  createdAt: string;
  total: number;
}

type ChartType = "line" | "area" | "bar";

type Currency = "FCFA" | "EUR" | "USD";

export default function SalesDashboard() {

  const [data, setData] = useState<SaleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"12m" | "6m" | "3m">("12m");
  const [chartType, setChartType] = useState<ChartType>("line");
  

const [currency, setCurrency] = useState<Currency>("FCFA");
  const API_BASE_URL = process.env.BACKEND_URL || "http://localhost:3000";

  const formatCurrency = (value: number) => {
    switch(currency) {
      case "FCFA": return `${Math.round(value).toLocaleString()} FCFA`;
      case "EUR": return `€${(value / 650).toLocaleString(undefined, {maximumFractionDigits: 2})}`;
      case "USD": return `$${(value / 600).toLocaleString(undefined, {maximumFractionDigits: 2})}`;
      default: return `${value.toLocaleString()}`;
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
    try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/api/orders`);
        if (!res.ok) {
            throw new Error("Failed to fetch orders");
        }

        // C'est l'étape clé : déstructurez la réponse pour obtenir le tableau 'orders' et le 'total'.
        const { orders }: { orders: Order[], total: number } = await res.json();

        // Calculer les ventes pour cette année et l'année précédente
        const currentDate = new Date();
        const salesMap: Record<string, SaleData> = {};

        // Préparer les 12 derniers mois et l'année précédente
        const months = Array.from({ length: 12 }, (_, i) => {
            const date = new Date(currentDate);
            date.setMonth(date.getMonth() - i);
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        }).reverse();

        // Initialiser la structure de données
        months.forEach(month => {
            salesMap[month] = {
                month: month.split('-')[1],
                sales: 0,
                orders: 0,
                previousYearSales: 0 // Ajoutez ici l'initialisation de l'année précédente
            };
        });

        // Remplir avec les données actuelles
        orders.forEach(order => {
            const date = new Date(order.createdAt);
            const year = date.getFullYear();
            const month = `${year}-${String(date.getMonth() + 1).padStart(2, '0')}`;

            if (salesMap[month]) {
                salesMap[month].sales += order.total;
                salesMap[month].orders += 1;
            }

            // Calculer les ventes pour l'année précédente
            const previousYearMonth = `${year - 1}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            // Supposons que votre API renvoie également des commandes de l'année précédente
            // Pour cet exemple, nous simulons la logique.
            // En réalité, vous devriez filtrer les commandes de l'année précédente
            // dans une requête API distincte ou une logique de filtrage plus avancée.
            if (salesMap[previousYearMonth]) {
                // salesMap[previousYearMonth].previousYearSales += order.total; // Ceci est la logique.
                // Pour l'instant, nous laissons à 0 car votre API ne les fournit pas encore séparément.
            }
        });

        // Convertir en tableau pour le graphique
        const chartData = Object.values(salesMap)
            .sort((a, b) => {
                // Trie par date (année et mois) pour un ordre correct
                const dateA = new Date(`2000-${a.month}-01`);
                const dateB = new Date(`2000-${b.month}-01`);
                return dateA.getTime() - dateB.getTime();
            });

        // Afficher les données mises à jour
        setData(chartData);

    } catch (err) {
        console.error(err);
        // Gérer l'erreur, peut-être en définissant un état d'erreur
    } finally {
        setLoading(false);
    }
};

    fetchOrders();
  }, [timeRange]);

  const renderChart = () => {
    switch(chartType) {
      case "area":
        return (
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis 
              dataKey="month" 
              tick={{ fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => formatCurrency(value).split(' ')[0]}
            />
            <Tooltip 
              formatter={(value) => [formatCurrency(Number(value)), "Ventes"]}
              labelFormatter={(label) => `Mois: ${label}`}
              contentStyle={{
                background: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="sales" 
              stroke="#22c55e" 
              fillOpacity={1} 
              fill="url(#colorSales)" 
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        );
      case "bar":
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis 
              dataKey="month" 
              tick={{ fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => formatCurrency(value).split(' ')[0]}
            />
            <Tooltip 
              formatter={(value) => [formatCurrency(Number(value)), "Ventes"]}
              labelFormatter={(label) => `Mois: ${label}`}
              contentStyle={{
                background: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar 
              dataKey="sales" 
              fill="#22c55e"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        );
      default:
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis 
              dataKey="month" 
              tick={{ fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => formatCurrency(value).split(' ')[0]}
            />
            <Tooltip 
              formatter={(value) => [formatCurrency(Number(value)), "Ventes"]}
              labelFormatter={(label) => `Mois: ${label}`}
              contentStyle={{
                background: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="sales" 
              stroke="#22c55e" 
              strokeWidth={2}
              activeDot={{ r: 6 }}
              dot={{ r: 3 }}
            />
          </LineChart>
        );
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Analyse des ventes
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Performance des ventes sur les {timeRange === '12m' ? '12' : timeRange === '6m' ? '6' : '3'} derniers mois
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              onClick={() => setTimeRange("3m")}
              className={`px-3 py-1 text-sm font-medium rounded-l-md ${
                timeRange === "3m" 
                  ? "bg-green-600 text-white" 
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              3 mois
            </button>
            <button
              onClick={() => setTimeRange("6m")}
              className={`px-3 py-1 text-sm font-medium ${
                timeRange === "6m" 
                  ? "bg-green-600 text-white" 
                  : "bg-white text-gray-700 hover:bg-gray-50 border-t border-b border-gray-200"
              }`}
            >
              6 mois
            </button>
            <button
              onClick={() => setTimeRange("12m")}
              className={`px-3 py-1 text-sm font-medium rounded-r-md ${
                timeRange === "12m" 
                  ? "bg-green-600 text-white" 
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              12 mois
            </button>
          </div>

          <select
  value={chartType}
  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setChartType(e.target.value as ChartType)}
  className="text-sm rounded-md border border-gray-200 focus:ring-green-500 focus:border-green-500"
>
  <option value="line">Ligne</option>
  <option value="area">Aire</option>
  <option value="bar">Barres</option>
</select>

        <select
  value={currency}
  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
    setCurrency(e.target.value as Currency)
  }
  className="text-sm rounded-md border border-gray-200 focus:ring-green-500 focus:border-green-500"
>
  <option value="FCFA">FCFA</option>
  <option value="EUR">EUR</option>
  <option value="USD">USD</option>
</select>
        </div>
      </div>

      <div className="h-80">
        {loading ? (
          <div className="flex flex-col gap-4 h-full">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-full w-full" />
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>Aucune donnée de vente disponible</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        )}
      </div>

      {!loading && data.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500">Ventes totales</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(data.reduce((acc, curr) => acc + curr.sales, 0))}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500">Commandes totales</p>
            <p className="text-2xl font-bold text-gray-900">
              {data.reduce((acc, curr) => acc + curr.orders, 0)}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500">Moyenne/mois</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(data.reduce((acc, curr) => acc + curr.sales, 0) / data.length)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}