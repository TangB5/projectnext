'use client';
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import SaleCard from "../../dashboard/saleCard/page";
import Popular from "../../dashboard/popularCard/page";
import ProductsManage from "../productManage/ProductManage";
import OderaManage from "../odersManage/OrdersManage";
import Setting from "../setting/seting";
import CustomerManage from "@/app/ui/customer/CustomerManage";
import { getProducts, getAllOrders } from "@/app/lib/Service";
import { Product, Order } from "@/app/types";


import Cards from "../cards/Cards";


interface MainProps {
    activeTab: string;
    showProductModal: boolean;
    setShowProductModal: Dispatch<SetStateAction<boolean>>;
}

export default function Main({ activeTab, showProductModal, setShowProductModal }: MainProps) {
    const [totalVentes, setTotalVentes] = useState<number>(0);
    const [totalCommandes, setTotalCommandes] = useState<number>(0);
    const [totalProduits, setTotalProduits] = useState<number>(0);

    useEffect(() => {
        async function fetchData() {
            try {
                const products: Product[] = await getProducts();
                const { orders }: { orders: Order[]; total: number } = await getAllOrders();

                // Comptes simples
                setTotalProduits(products.length);
                setTotalCommandes(orders.length);

                const ventes = orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
                setTotalVentes(ventes);

            } catch (err) {
                console.error("Erreur lors du chargement des données :", err);
            }
        }

        fetchData();
    }, []);
      

    return (
        <main className="p-6">
            {/* Dashboard Home */}
            <div id="dashboard-home" className={`${activeTab === 'dashboard-home' ? 'block' : 'hidden'}`}>
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
                    <SaleCard/>
                    <Popular/>
                </div>

            </div>
            
            {/* Products Management */}
            <ProductsManage 
                activeTab={activeTab} 
                showProductModal={showProductModal} 
                setShowProductModal={setShowProductModal}
            />
            
            {/* Orders Management */}
            <OderaManage activeTab={activeTab} />
            
            {/* Customers Management */}
            <CustomerManage activeTab={activeTab} />
            
            {/* Settings */}
            <Setting activeTab={activeTab} />
        </main>
    );
}
