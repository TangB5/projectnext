import { Navbar } from './ui/nav/navbar';
import { Hero } from './ui/hero/hero';
import { Avantages } from './ui/avantage/avantage';
import { About } from './ui/about/apropos';
import { Contact } from './ui/contact/contact';
import { Footer } from './ui/footer/footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductsCards from './ui/component/productcard/productsCard';
export default function Home() {  
  return (    
    <div className='bg-gray-50'>
       {/* <!-- Navigation principale --> */}
   <Navbar />

    {/* <!-- Hero Section --> */}
   <Hero />

    {/* <!-- Section Produits --> */}
    <ProductsCards/>

    {/* <!-- Section Avantages --> */}
    <Avantages/>

    {/* <!-- Section À propos --> */}
    <About/>

    {/* <!-- Section Contact --> */}
    <Contact/>

<ToastContainer position="top-right" autoClose={3000} />
    {/* <!-- Footer --> */}
    <Footer />
    </div>
)}