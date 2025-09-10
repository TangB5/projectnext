import Image from "next/image";
import { Product } from "@/app/types";
import { useState } from "react";
import { Heart, Eye, ShoppingCart, ZoomIn } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onView?: (product: Product) => void;
  onLike?: (id: string) => void;
  onOrder?: (product: Product) => void;
  disabled?: boolean;
  isOrdering?: boolean;
  isLiked?: boolean;
}

export default function ProductCard({
  product,
  onLike,
  onOrder,
  disabled,
  isOrdering,
  isLiked = false,
}: ProductCardProps) {
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  if (!product) return null;

  const handleViewImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowImageModal(true);
  };

  const handleCloseModal = () => setShowImageModal(false);

  return (
    <>
      <div
        key={product._id}
        className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-emerald-100 relative cursor-pointer"
      >
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2 z-10">
          {product.isPromo && (
            <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md animate-pulse">
              -{product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : "20"}%
            </span>
          )}
          {product.is_new && (
            <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
              Nouveau
            </span>
          )}
        </div>

        {/* Image container */}
        <div className="relative overflow-hidden h-64">
          {product.image && (
            <>
              <Image
                src={product.image}
                alt={product.name}
                width={500}
                height={320}
                className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${imageLoading ? "blur-md" : "blur-0"}`}
                onLoad={() => setImageLoading(false)}
              />
              {/* Overlay bouton zoom */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button
                  onClick={handleViewImage}
                  className="p-3 bg-white/90 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-white hover:scale-110 z-20"
                  aria-label="Agrandir l'image"
                >
                  <ZoomIn className="w-5 h-5 text-emerald-700" />
                </button>
              </div>
            </>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-bold text-lg bg-black/70 px-4 py-2 rounded-lg">Épuisé</span>
            </div>
          )}
        </div>

        {/* Infos */}
        <div className="p-5 space-y-4">
          <div>
            <h3 className="font-bold text-lg text-gray-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2 mt-1">{product.description}</p>
          </div>

          <div className="inline-block bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
            {product.category}
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-emerald-700 text-xl">{product.price.toLocaleString()} FCFA</span>
            {product.isPromo && product.oldPrice && (
              <span className="text-sm text-gray-400 line-through">{product.oldPrice.toLocaleString()} FCFA</span>
            )}
          </div>

          {product.stock > 0 && (
            <div className="text-xs text-gray-500">
              {product.stock < 10 ? `Plus que ${product.stock} en stock` : "En stock"}
            </div>
          )}

          {/* Actions buttons */}
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOrder?.(product);
              }}
              disabled={disabled || isOrdering || product.stock === 0}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${product.stock === 0
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-emerald-700 hover:bg-emerald-800 text-white shadow-md hover:shadow-lg"
                } ${(disabled || isOrdering) ? "opacity-70 cursor-wait" : ""}`}
            >
              {isOrdering
                ? <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Ajout...</span>
                </>
                : product.stock === 0
                  ? "Indisponible"
                  : <>
                    <ShoppingCart className="w-4 h-4" />
                    <span>Commander</span>
                  </>
              }
            </button>

            {/* View & Like buttons */}
            <div className="flex gap-3 items-center">
              {/* Eye button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowImageModal(true); // ouvre le modal directement
                }}
                className="p-1 text-gray-600 hover:text-emerald-600 transition-colors flex items-center justify-center z-20 relative"
                aria-label="Voir l'image"
              >
                <Eye className="w-5 h-5" />
              </button>

              {/* Like button */}
              {onLike && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsAnimating(true);
                      onLike(product._id);
                      setTimeout(() => setIsAnimating(false), 1000);
                    }}
                    className="p-1 text-gray-600 hover:text-red-500 transition-all duration-300 flex items-center justify-center relative"
                    aria-label={isLiked ? "Retirer des favoris" : "Ajouter aux favoris"}
                  >
                    <Heart
                      className={`w-5 h-5 transition-all duration-300 ${isLiked ? "fill-red-500 text-red-500 scale-110" : "text-gray-600 hover:scale-110"}`}
                    />
                    {isAnimating && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Heart
                          className="w-5 h-5 fill-red-500 text-red-500 animate-ping"
                          style={{ animationDuration: '1s' }}
                        />
                      </div>
                    )}
                  </button>

                  {(product.likes ?? 0) > 0 && (
                    <span className={`text-sm font-medium transition-all duration-300 ${isLiked ? 'text-red-600' : 'text-gray-600'}`}>
                      {product.likes}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={handleCloseModal}
        >
          <div
            className="relative max-w-4xl max-h-full"
            onClick={(e) => e.stopPropagation()} // empêche de fermer si on clique sur l'image
          >
            <button
              onClick={handleCloseModal}
              className="absolute -top-12 right-0 text-white hover:text-emerald-300 transition-colors"
              aria-label="Fermer"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="bg-white p-2 rounded-lg">
              <Image
                src={product.image}
                alt={product.name}
                width={5000}
                height={5000}
                className="max-w-full max-h-[80vh] object-contain rounded"
              />
            </div>
            <p className="text-white text-center mt-4 text-lg">{product.name}</p>
          </div>
        </div>
      )}
    </>
  );
}
