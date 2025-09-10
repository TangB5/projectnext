import { Frown } from "lucide-react";

export default function ProductEmptyState() {
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
