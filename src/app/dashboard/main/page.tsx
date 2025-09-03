
import { Dispatch, SetStateAction } from "react"
import Cards from "../cards/page";
import SaleCard from "../saleCard/page";
import Popular from "../popularCard/page";
import LatestCommands from "../latesCommands/page";
import ProductsManage from "../productManage/page";
import OderaManage from "../odersManage/page";
import CustomerManage from "../customerManage/page";
import Setting from "../setting/page";
import '../../globals.css'

interface MainProps {
    activeTab: string;
    showProductModal: boolean;
    setShowProductModal: Dispatch<SetStateAction<boolean>>;
}
export default function Main({activeTab, showProductModal, setShowProductModal}: MainProps) {
    

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
         <OderaManage
         activeTab={activeTab}
         />
          
          {/* Customers Management */}
          <CustomerManage
            activeTab={activeTab}
            />
          
          {/* Settings */}
         <Setting 
            activeTab={activeTab}
          />
        </main>
    )
}