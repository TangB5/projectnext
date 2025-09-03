import Link from "next/link";
import { Footer } from "./ui/footer/footer";
import { Navbar } from "./ui/nav/navbar";
import 'primeicons/primeicons.css';
export default function NotFound() {
    return (
 
        


    <div className="min-h-screen flex flex-col">
        {/* <!-- Header --> */}
        <Navbar/>

        {/* <!-- Main Content --> */}
        <main className="flex-grow flex items-center justify-center p-4">
            <div className="container mx-auto text-center">
                <div className="max-w-3xl mx-auto">
                    {/* <!-- Illustration --> */}
                    <div className="mb-8">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="h-40 mx-auto text-green-700">
                            <path fill="currentColor" d="M256,16C123.452,16,16,123.452,16,256S123.452,496,256,496,496,388.548,496,256,388.548,16,256,16ZM223.4,374.6c-25.9,8.3-64.4,13.1-100.4,13.1-7.4,0-14.9-.2-22.3-.6C54.2,383.7,32,339.2,32,288c0-88.8,93.3-160,208-160s208,71.2,208,160c0,51.2-22.2,95.7-68.7,100-.3-.3-1.4-1.1-4.3-1.1-28.6,0-63.2-8.2-91.5-22.2-6.1-3-11.7-6.1-16.8-9.3l-14.3-8.8-16.4,10.3ZM144.4,208A32,32,0,1,1,176,240,32,32,0,0,1,144.4,208Zm224,0a32,32,0,1,1,32,32A32,32,0,0,1,368.4,208ZM256,416c-53,0-112-21.5-112-80s59-80,112-80,112,21.5,112,80S309,416,256,416Z"/>
                        </svg>
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-bold font-playfair text-green-900 mb-4">404</h1>
                    <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">Oups! Cette pièce semble vide...</h2>
                    
                    <p className="text-lg text-gray-600 mb-8">{`
                        La page que vous cherchez a peut-être été déplacée ou n'existe plus. 
                        Revenez à notre catalogue de meubles ou explorez nos nouvelles créations.`}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/" className="bg-green-700 hover:bg-green-800 text-white font-medium py-3 px-6 rounded-lg transition duration-300">
                           {` Retour à l'accueil`}
                        </Link>
                        <a href="/catalogue" className="border-2 border-green-700 text-green-700 hover:bg-green-50 font-medium py-3 px-6 rounded-lg transition duration-300">
                            Voir le catalogue
                        </a>
                    </div>
                </div>
            </div>
        </main>

        {/* <!-- Footer --> */}
        <Footer />
    </div>

    );
}