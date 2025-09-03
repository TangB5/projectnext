'use client';
import { Dispatch, SetStateAction } from "react"
import SaleCard from "../../dashboard/saleCard/page";
import Popular from "../../dashboard/popularCard/page";
import LatestCommands from "../../dashboard/latesCommands/page";
import ProductsManage from "../productManage/ProductManage";
import OderaManage from "../odersManage/OrdersManage";
import Setting from "../setting/seting";
import CustomerManage from "@/app/ui/customer/CustomerManage";
import Cards from "../cards/Cards";


interface MainProps {
    activeTab: string;
    showProductModal: boolean;
    setShowProductModal: Dispatch<SetStateAction<boolean>>;
}

export default function Main({ activeTab, showProductModal, setShowProductModal }: MainProps) {
    return (
        <main className="p-6">
            {/* Dashboard Home */}
            <div id="dashboard-home" className={`${activeTab === 'dashboard-home' ? 'block' : 'hidden'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                   <Cards
                      bgcolor="bg-green-100"
                      text="+12% ce mois"
                      icon="pi pi-shopping-cart"
                      bordercolor="border-green-500"
                      title="Ventes totales"
                      value="12,345fcfa"
                      color="text-green-800"
                    />
                    <Cards
                      bgcolor="bg-blue-100"
                      text="+8% ce mois"
                      icon="pi pi-users"
                      bordercolor="border-blue-500"
                      title="Commandes"
                      value={1234}
                      color="text-blue-800"
                    />
                    <Cards
                      bgcolor="bg-amber-100"
                      text="+15% ce mois"
                      icon="pi pi-box"
                      bordercolor="border-amber-500"
                      title="Produits en stock"
                      value={56}
                      color="text-amber-800"
                    />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <SaleCard/>
                    <Popular/>
                </div>
                <LatestCommands/>
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
