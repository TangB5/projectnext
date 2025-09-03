"use client";

import Image from "next/image";
import { useState } from "react";
import { CheckCircle, Frown, XCircle } from "lucide-react";
import { Product } from "@/app/types";
import { useSession } from "../../lib/SessionProvider";
import { createCommande } from "@/app/lib/apiHelpers";

interface ProductsCardsProps {
  products: Product[];
  onLike?: (productId: string) => void;
  onView?: (product: Product) => void; 
}

const ProductsCards = ({ products, onLike, onView }: ProductsCardsProps) => {
  const { session, loading } = useSession();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isOrdering, setIsOrdering] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  
  const handleCommandClick = (product: Product) => {
    if (loading) {
      return;
    }
    if (!session?.userId) {
      setSelectedProduct(product);
      setShowLoginModal(true);
      return;
    }
    setSelectedProduct(product);
    setShowConfirmModal(true);
  };

  const confirmOrder = async () => {
    if (!selectedProduct || !session?.userId) return;
    setIsOrdering(true);
    try {
      await createCommande(
       session.userId,
       [
          {
            productId: selectedProduct._id,
            quantity: quantity,
            price: selectedProduct.price
          }
        ]
      );
      setModalMessage(`Commande de ${quantity} x ${selectedProduct.name} confirmée !`);
      setShowSuccessModal(true);
      setShowConfirmModal(false);
      setQuantity(1);
    } catch (error: unknown) {
      console.error("Erreur commande :", error);
      let message = "Erreur lors de la commande, veuillez réessayer.";
      if (error instanceof Error) {
        message = error.message;
      }
      setModalMessage(message);
      setShowErrorModal(true);
      setShowConfirmModal(false);
    } finally {
      setIsOrdering(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <svg className="animate-spin h-8 w-8 text-emerald-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="ml-4 text-gray-600">Chargement des produits...</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-gray-50 rounded-xl">
        <Frown className="w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-2xl font-bold text-gray-700 mb-2">Aucun produit disponible</h3>
        <p className="text-gray-500 mb-6 max-w-md">
          {`Nous n'avons trouvé aucun produit correspondant à cette catégorie.`}
          <br />
          Veuillez recharger ou réessayer plus tard!
        </p>
      </div>
    );
  }
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 sm:px-0">
        {products.map((product) => (
          <div 
            key={product._id} 
            className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-emerald-100 relative cursor-pointer"
            onClick={() => onView && onView(product)}
          >
            {/* Badges de statut - Gestion de la superposition */}
            <div className="absolute top-3 left-3 flex gap-2 z-10">
              {product.isPromo && (
                <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  Promo
                </span>
              )}
              {/* Utilisation de `isNew` ou `is_new` en fonction de ce qui est renvoyé par le backend */}
              {( product.is_new) && (
                <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  Nouveau
                </span>
              )}
              {/* Le badge "Rupture" ou "En stock" est maintenant géré dans la carte elle-même */}
            </div>

            {/* Bouton favoris */}
            {onLike && (
              <div className="absolute top-3 right-3 z-20">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onLike(product._id);
                  }}
                  className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all w-10 h-10 flex items-center justify-center"
                  aria-label={(product.likes ?? 0) > 0 ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                >
                  {(product.likes ?? 0) > 0 ? (
                    <i className="pi pi-heart-fill text-red-500 text-lg" />
                  ) : (
                    <i className="pi pi-heart hover:text-red-500 text-lg transition-colors" />
                  )}
                </button>
                {/* Badge compteur de likes */}
                {(product.likes ?? 0) > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-md">
                    {product.likes}
                  </span>
                )}
              </div>
            )}
            
            {/* Image avec effet de zoom */}
            <div className="relative overflow-hidden h-56">
              <Image
                src={product.image}
                alt={product.name}
                width={500}
                height={300}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                priority={false}
              />
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">Épuisé</span>
                </div>
              )}
            </div>

            {/* Contenu */}
            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-bold text-lg text-gray-800 line-clamp-1">{product.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem]">{product.description}</p>
              </div>

              {/* Prix */}
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-emerald-700 text-lg">
                    {product.price.toLocaleString()} FCFA
                  </span>
                  {/* Section 'Économisez' qui n'apparaît que pour les promos avec un ancien prix */}
                  {product.isPromo && product.oldPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      {product.oldPrice.toLocaleString()} FCFA
                    </span>
                  )}
                </div>
                {product.isPromo && product.oldPrice && (
                  <span className="text-xs text-amber-600 font-medium">
                    Économisez {(product.oldPrice - product.price).toLocaleString()} FCFA
                  </span>
                )}
              </div>

              {/* Bouton Commander */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCommandClick(product);
                }}
                disabled={loading || isOrdering || product.stock === 0}
                className={`w-full py-2.5 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                  product.stock === 0
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-emerald-700 hover:bg-emerald-800 text-white shadow-md hover:shadow-emerald-200"
                } ${
                  (loading || isOrdering) ? "opacity-70 cursor-wait" : ""
                }`}
              >
                {product.stock === 0 ? (
                  "Indisponible"
                ) : (
                  <>
                    {loading || isOrdering ? (
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <i className="pi pi-shopping-cart text-sm" />
                    )}
                    Commander
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {showLoginModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Veuillez vous connecter</h2>
            <p className="mb-2">
              Vous devez être connecté pour commander le produit :
              <span className="font-semibold"> {selectedProduct.name}</span>
            </p>
            {selectedProduct.image && (
              <Image
                src={selectedProduct.image}
                alt={selectedProduct.name}
                width={200}
                height={200}
                className="w-full h-40 object-cover rounded mb-4"
              />
            )}
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setShowLoginModal(false)}
              >
                Annuler
              </button>
              <a
                href="/auth/login"
                className="bg-emerald-700 text-white px-4 py-2 rounded hover:bg-emerald-800"
              >
                Se connecter
              </a>
            </div>
          </div>
        </div>
      )}

      {showConfirmModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md animate-fade-in">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Confirmer votre commande</h2>
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">Voulez-vous commander :</p>
              <div className="flex gap-4 items-start">
                {selectedProduct.image && (
                  <Image
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    width={200}
                    height={200}
                    className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                  />
                )}
                <div>
                  <p className="font-semibold text-lg text-gray-800">{selectedProduct.name}</p>
                  <p className="text-emerald-700 font-medium">{selectedProduct.price.toLocaleString()} FCFA</p>
                </div>
              </div>
              <div className="pt-2">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Quantité</label>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    min={1}
                    max={selectedProduct.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(selectedProduct.stock, Number(e.target.value))))}
                    className="w-16 border border-gray-300 rounded-lg px-3 py-2 text-center font-medium"
                  />
                  <button 
                    onClick={() => setQuantity(Math.min(selectedProduct.stock, quantity + 1))}
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
                    disabled={quantity >= selectedProduct.stock}
                  >
                    +
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Stock disponible: {selectedProduct.stock}</p>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Total</span>
                  <span className="text-xl font-bold text-emerald-800">
                    {(selectedProduct.price * quantity).toLocaleString()} FCFA
                  </span>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-5 py-2.5 rounded-lg border border-gray-300 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setShowConfirmModal(false)}
              >
                Annuler
              </button>
              <button
                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-emerald-700 to-emerald-600 font-medium text-white hover:from-emerald-800 hover:to-emerald-700 transition-colors shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                onClick={confirmOrder}
                disabled={isOrdering}
              >
                {isOrdering ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Traitement...
                  </span>
                ) : (
                  "Confirmer la commande"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-sm text-center animate-fade-in">
            <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Succès !</h2>
            <p className="text-gray-600 mb-6">{modalMessage}</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-2.5 rounded-lg bg-emerald-700 text-white font-medium hover:bg-emerald-800 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-sm text-center animate-fade-in">
            <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Erreur</h2>
            <p className="text-gray-600 mb-6">{modalMessage}</p>
            <button
              onClick={() => setShowErrorModal(false)}
              className="w-full py-2.5 rounded-lg bg-red-700 text-white font-medium hover:bg-red-800 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductsCards;