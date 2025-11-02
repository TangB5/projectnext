"use client";
import { Dispatch, SetStateAction, useRef } from "react";
import { useState, useEffect } from "react";
import Pagination from "../../dashboard/pagination/paginatio1";
import Image from "next/image";
import { toast } from 'react-toastify';
import { createProduct, getProducts, deleteProduct, updateProduct } from "@/app/lib/Service";
import { supabase } from "../../lib/supabaseClient";
import { Product } from "@/app/types";

interface ProductsManageProps {
  activeTab: string;
  showProductModal: boolean;
  setShowProductModal: Dispatch<SetStateAction<boolean>>;
}



export default function ProductsManage({
  activeTab,
  showProductModal,
  setShowProductModal,
}: ProductsManageProps) {
  const [formData, setFormData] = useState<Product>({
    _id: '',
    name: '',
    category: '',
    description: '',
    price: 0,
    stock: 0,
    image: '',
    status: 'En stock',
    statusColor: 'green',
    createdAt: new Date().toISOString(),
    likes:0,
    is_new: false,
    isPromo: false,
    oldPrice: 0,
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const [formVisible, setFormVisible] = useState(true);
  // CRUD
  // states
  const [delet, setDelet] = useState<Product | null>(null);
  const [showDeletModal, setShowDeletModal] = useState(false);
  const BUCKET_NAME = 'meublemoderne';

  // handler pour ouvrir la modale de confirmation
  const handleOpenDelete = (product: Product) => {
    setDelet(product);
    setShowDeletModal(true);
  };

  // fonction pour supprimer
  const handleDeleteConfirm = async () => {
    if (!delet) return;

    try {
      await deleteProduct(delet._id);

      setProducts(prev => prev.filter(p => p._id !== delet._id));
      toast.success("Produit supprimé avec succès !");
      setShowDeletModal(false);
      setDelet(null);
    } catch (error) {
      console.error('Erreur suppression :', error);
      toast.error("Erreur lors de la  suppression ");
    }
  };



  const [view, setView] = useState<Product | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);


  const handleOpenView = (product: Product) => {
    setView(product);
    setShowViewModal(true);
  };


  const [update, setUpdate] = useState<Product | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);


  const handleOpenUpdate = (product: Product) => {
    setUpdate(product);
    setShowUpdateModal(true);
  };


  const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!update) {
      toast.error("Aucun produit à mettre à jour.");
      return;
    }

    try {
      const status = formData.stock > 10 ? "En stock" : "Rupture";
      const statusColor = formData.stock > 10 ? "green" : "red";

      const updatedProductData = {
        name: formData.name !== '' ? formData.name : update.name,
        description: formData.description !== '' ? formData.description : update.description,
        category: formData.category !== '' ? formData.category : update.category,
        
        // Utilisez une condition explicite pour les nombres
        price: formData.price !== 0 ? formData.price : update.price,
        stock: formData.stock !== 0 ? formData.stock : update.stock,
        
        status,
        statusColor,
        image: formData.image !== '' ? formData.image : update.image,
        
        // Ces champs booléens peuvent rester avec ?? si vous les initialisez à null
        isPromo: formData.isPromo ?? update.isPromo,
        is_new: formData.is_new ?? update.is_new,
        oldPrice: formData.oldPrice !== 0 ? formData.oldPrice : update.oldPrice,
      };

      const updated = await updateProduct(update._id, updatedProductData);

      toast.success("Produit mis à jour avec succès !");
      setShowUpdateModal(false);
      setUpdate(null);

      // Met à jour la liste localement
      setProducts(prev =>
        prev.map(p => (p._id === update._id ? updated : p))
      );
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err);
      toast.error("Échec de la mise à jour !");
    }
  };







const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => {
  const { name, value, type } = e.target;

  if (type === 'checkbox') {
    const { checked } = e.target as HTMLInputElement;

    setFormData((prev) => ({
      ...prev,
      [name]: checked,  // Mise à jour de l'état avec 'checked'
    }));
  } else {
    // Pour les autres types d'éléments (text, select, textarea)
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value,
    }));
  }
  
};




  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Prévisualisation
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload direct vers Supabase
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file);

    if (uploadError) {
      console.error("Erreur d'upload :", uploadError.message);
      return;
    }

    // URL publique
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    // On stocke directement l'URL dans formData
    setFormData(prev => ({
      ...prev,
      image: publicUrlData.publicUrl,
    }));
  };



  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setFormData(prev => ({
      ...prev,
      image: ''
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { name, category, description, price, stock, image ,likes} = formData;

      if (!image) {
        throw new Error("Veuillez sélectionner une image avant de soumettre.");
      }

      const productData = {
        name,
        category,
        description,
        price,
        stock,
        status: stock > 10 ? "En stock" : "Rupture",
        statusColor: stock > 10 ? "green" : "red",
        createdAt: new Date().toISOString(),
        image, // déjà une URL string
        isPromo: formData.isPromo || false,
        is_new: formData.is_new || true,
        likes,
        oldPrice: formData.oldPrice || null,
      };

      await createProduct(productData);

      toast.success("Produit créé avec succès !");
      setFormVisible(false);

      // Réinitialisation
      setFormData({
        _id: "",
        name: "",
        category: "",
        description: "",
        price: 0,
        stock: 0,
        image: "",
        status: "En stock",
        statusColor: "green",
        createdAt: new Date().toISOString(),
        isPromo: false,
        is_new: false,
        likes: 0,
        oldPrice: 0,
      });
      setPreviewImage(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Une erreur inconnue est survenue";
      setError(errorMessage);
      toast.error(`Erreur : ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };



    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getProducts();

                const productsArray = response.products || [];


                setProducts(productsArray);
                setFilteredProducts(productsArray);
                setLoading(false);

            } catch (err) {
                setError(err instanceof Error ? err.message : "Une erreur est survenue");
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);
  useEffect(() => {
    const filtered = products.filter((product) => {
      const query = searchQuery.toLowerCase();
      return (
        product.name.toLowerCase().includes(query) ||
        product.price.toString().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    });
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  // const getSupabaseImageUrl = (fileName: string) => {
  //   if (!fileName) return '';
  //   const { data: publicUrlData } = supabase.storage
  //     .from(BUCKET_NAME)
  //     .getPublicUrl(fileName);
  //   return publicUrlData.publicUrl;
  // };


  return (
    <div
      id="products-management"
      className={`${activeTab === "products-management" ? "block" : "hidden"}`}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-lg font-bold flex items-center">
          <i className="pi pi-box mr-2 text-green-700"></i>
          Gestion des produits
        </h3>
        <button
          onClick={() => setShowProductModal(true)}
          className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition flex items-center w-full sm:w-auto justify-center"
        >
          <i className="pi pi-plus mr-2"></i>
          Ajouter un produit
        </button>
      </div>

      {/* Add Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-opacity duration-300 ease-in-out">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 transform transition-all duration-300 scale-100">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                  <i className="pi pi-plus-circle mr-3 text-green-600"></i>
                  Ajouter un nouveau produit
                </h3>
                <p className="text-sm text-gray-500 mt-1">Remplissez les détails du produit</p>
              </div>
              <button
                onClick={() => {
                  setShowProductModal(false);
                  setPreviewImage(null);
                }}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition"
              >
                <i className="pi pi-times text-lg"></i>
              </button>
            </div>

            {formVisible ? (
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                {success && (
                  <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 flex items-start">
                    <i className="pi pi-check-circle text-lg mr-3 mt-0.5"></i>
                    <div>
                      <p className="font-medium">Produit créé avec succès!</p>
                      <p className="text-sm">Le produit a été ajouté à votre catalogue.</p>
                    </div>
                  </div>
                )}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-start">
                    <i className="pi pi-exclamation-circle text-lg mr-3 mt-0.5"></i>
                    <div>
                      <p className="font-medium">Erreur lors de la création</p>
                      <p className="text-sm">{error}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Nom du produit <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                        placeholder="Canapé Lagon"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition min-h-[100px]"
                        placeholder="Description du produit"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Catégorie <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[center_right_1rem]"
                        required
                      >
                        <option value="">Sélectionner une catégorie</option>
                        <option value="Salon">Salon</option>
                        <option value="Cuisine">Cuisine</option>
                        <option value="Chambre">Chambre</option>
                        <option value="Bureau">Bureau</option>
                        <option value="Extérieur">Extérieur</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Prix (FCFA) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">FCFA</span>
                        <input
                          type="number"
                          name="price"
                          value={formData.price || ''}
                          onChange={handleInputChange}
                          className="w-full pl-14 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                          placeholder="299"
                          required
                          min="0"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Stock disponible <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="stock"
                        value={formData.stock || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                        placeholder="15"
                        required
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Image du produit
                      </label>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        className="hidden"
                        accept="image/*"
                      />
                      <div className="flex items-center space-x-4">
                        <div className="relative group">
                          {previewImage ? (
                            <>
                              <Image
                                src={previewImage}
                                alt="Preview"
                                className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                                width={80}
                                height={80}
                              />
                              <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm hover:bg-red-600 transition"
                              >
                                <i className="pi pi-times text-xs"></i>
                              </button>
                            </>
                          ) : (
                            <div
                              onClick={handleImageClick}
                              className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
                            >
                              <i className="pi pi-image text-xl text-gray-400 mb-1"></i>
                              <span className="text-xs text-gray-500">Ajouter une image</span>
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={handleImageClick}
                          className="text-sm bg-white border border-gray-300 hover:bg-gray-50 px-3 py-2 rounded-lg transition"
                        >
                          {previewImage ? 'Changer l\'image' : 'Parcourir...'}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Format recommandé : JPG/PNG (1:1 ratio)</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-700">Options supplémentaires</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <label className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                        <input
                          type="checkbox"
                          name="isPromo"
                          checked={formData.isPromo || false}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">Produit en promo</span>
                      </label>
                      <label className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                        <input
                          type="checkbox"
                          name="is_new"
                          checked={formData.is_new || false}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">Nouveau produit</span>
                      </label>
                     
                    </div>
                  </div>

                  {formData.isPromo && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Ancien prix (FCFA)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">FCFA</span>
                        <input
                          type="number"
                          name="oldPrice"
                          value={formData.oldPrice || ''}
                          onChange={handleInputChange}
                          className="w-full pl-14 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                          placeholder="399"
                          min="0"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col-reverse sm:flex-row justify-end space-y-2 space-y-reverse sm:space-y-0 sm:space-x-3 mt-8">
                  <button
                    type="button"
                    onClick={() => {
                      setShowProductModal(false);
                      setError(null);
                      setSuccess(false);
                      setPreviewImage(null);
                    }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                    disabled={isLoading}
                  >
                    Annuler
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium flex items-center justify-center space-x-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <i className="pi pi-spinner pi-spin"></i>
                        <span>Enregistrement...</span>
                      </>
                    ) : (
                      <>
                        <i className="pi pi-check"></i>
                        <span>Enregistrer le produit</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <i className="pi pi-check text-green-600 text-xl"></i>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Produit ajouté avec succès!</h3>
                <p className="text-sm text-gray-500 mb-6">Le produit a été ajouté à votre catalogue.</p>
                <button
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Fermer
                </button>
              </div>
            )}
          </div>
        </div>
      )}





      {/* Products Table */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-64">
            <i className="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="Rechercher un produit..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button className="p-2 border rounded-lg hover:bg-gray-100">
              <i className="pi pi-filter text-gray-600"></i>
            </button>
            <button className="p-2 border rounded-lg hover:bg-gray-100">
              <i className="pi pi-download text-gray-600"></i>
            </button>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[180px]">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[250px] max-w-[300px]">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Créé le
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.length > 0 ? (
                currentProducts.map((product, index) => (
                  <tr key={product._id || index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-md overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={48}
                          height={48}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{product.name}</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {product.is_new && (
                            <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                              Nouveau
                            </span>
                          )}
                          {product.isPromo && (
                            <span className="text-xs px-1.5 py-0.5 bg-orange-100 text-orange-800 rounded-full">
                              Promo
                            </span>
                          )}
                          {product.likes && (
                            <span className="text-xs px-1.5 py-0.5 bg-pink-100 text-pink-800 rounded-full">
                              Populaire
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-[300px]">
                      <div className="line-clamp-2">{product.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">
                          {product.price} fcfa
                        </span>
                        {product.isPromo && product.oldPrice && (
                          <span className="text-xs text-gray-400 line-through">
                            {product.oldPrice} fcfa
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'
                          }`}></span>
                        <span className="text-sm text-gray-700">
                          {product.stock}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${product.statusColor === "green"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                        }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(product.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleOpenView(product)}
                          className="text-gray-500 hover:text-blue-600 p-1.5 rounded-full hover:bg-blue-50 transition"
                          title="Voir"
                        >
                          <i className="pi pi-eye text-sm"></i>
                        </button>
                        <button
                          onClick={() => handleOpenUpdate(product)}
                          className="text-gray-500 hover:text-green-600 p-1.5 rounded-full hover:bg-green-50 transition"
                          title="Modifier"
                        >
                          <i className="pi pi-pencil text-sm"></i>
                        </button>
                        <button
                          onClick={() => handleOpenDelete(product)}
                          className="text-gray-500 hover:text-red-600 p-1.5 rounded-full hover:bg-red-50 transition"
                          title="Supprimer"
                        >
                          <i className="pi pi-trash text-sm"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="bg-gray-100 p-4 rounded-full mb-3">
                        <i className="pi pi-search text-2xl text-gray-400"></i>
                      </div>
                      <h4 className="text-gray-700 font-medium mb-1">Aucun produit trouvé</h4>
                      <p className="text-sm text-gray-500 max-w-md">
                        Essayez de modifier vos critères de recherche ou ajoutez un nouveau produit
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {filteredProducts.length > 0 ? (
            currentProducts.map((product, index) => (
              <div
                key={product._id || index}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                {/* Header produit avec badge */}
                <div className="flex justify-between items-start mb-3 gap-2">
                  <h3 className="font-semibold text-gray-900 line-clamp-2 text-base">
                    {product.name}
                  </h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${product.statusColor === "green"
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                      }`}
                  >
                    {product.status}
                  </span>
                </div>

                {/* Image produit avec ratio carré */}
                <div className="relative aspect-square w-full mb-3 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={index < 3}
                  />
                </div>

                {/* Métadonnées produit */}
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                    #{index + 1}
                  </span>
                  <span className="text-xs text-gray-500">
                    {product.category}
                  </span>
                </div>

                {/* Description avec effet de dégradé */}
                <div className="relative mb-3">
                  <p className="text-sm text-gray-600 line-clamp-3 h-[60px]">
                    {product.description}
                  </p>
                  <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent"></div>
                </div>

                {/* Prix et stock */}
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {product.price} fcfa
                      {product.oldPrice && (
                        <span className="ml-2 text-xs text-gray-400 line-through">
                          {product.oldPrice} fcfa
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500">
                      <span className={`inline-block w-2 h-2 rounded-full mr-1 ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'
                        }`}></span>
                      {product.stock > 0 ? `${product.stock} en stock` : 'Rupture'}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <div className="flex space-x-1">
                    {product.is_new && (
                      <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
                        Nouveau
                      </span>
                    )}
                    {product.isPromo && (
                      <span className="text-xs px-2 py-1 bg-orange-50 text-orange-600 rounded-full">
                        Promo
                      </span>
                    )}
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleOpenView(product)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition"
                      aria-label="Voir"
                    >
                      <i className="pi pi-eye text-sm"></i>
                    </button>
                    <button
                      onClick={() => handleOpenUpdate(product)}
                      className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full transition"
                      aria-label="Modifier"
                    >
                      <i className="pi pi-pencil text-sm"></i>
                    </button>
                    <button
                      onClick={() => handleOpenDelete(product)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                      aria-label="Supprimer"
                    >
                      <i className="pi pi-trash text-sm"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
              <div className="bg-gray-100 p-5 rounded-full mb-3">
                <i className="pi pi-search text-2xl text-gray-400"></i>
              </div>
              <h4 className="text-gray-700 font-medium mb-1">Aucun produit trouvé</h4>
              <p className="text-sm text-gray-500 max-w-xs">
                Essayez de modifier vos critères de recherche
              </p>
            </div>
          )}
        </div>

       {showDeletModal && delet && (
  <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-opacity duration-300">
    <div
      className="bg-white rounded-xl shadow-xl max-w-md w-full mx-2 overflow-hidden transform transition-all duration-300"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header avec icône d'avertissement */}
      <div className="bg-red-50 px-6 py-4 flex items-center gap-3 border-b border-red-100">
        <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-red-100">
          <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-red-800">Action irréversible</h3>
      </div>

      {/* Contenu principal */}
      <div className="p-6">
        <div className="mb-4">
          <p className="text-gray-700 mb-2">
            Vous êtes sur le point de supprimer définitivement le produit :
          </p>
          <p className="font-medium text-gray-900 text-lg truncate">{delet.name}</p>
          
          {delet.image && (
            <div className="mt-3 flex justify-center">
              <div className="relative w-20 h-20 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                <Image
                  src={delet.image}
                  alt={delet.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Cette action ne peut pas être annulée. Toutes les données associées à ce produit seront perdues.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
        <button
          onClick={() => setShowDeletModal(false)}
          className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          autoFocus
        >
          Annuler
        </button>
        <button
          onClick={handleDeleteConfirm}
          className="px-4 py-2.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition font-medium flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Supprimer définitivement
        </button>
      </div>
    </div>
  </div>
)}


        {showViewModal && view && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-opacity duration-300">
            <div
              className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden transform transition-all duration-300 scale-95"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header avec bouton fermer */}
              <div className="flex justify-between items-center p-6 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-gray-900 truncate max-w-xs">{view.name}</h2>

                  {/* Badge status */}
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${view.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {view.stock > 0 ? 'Disponible' : 'Rupture'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Bouton like */}
                  {typeof view.likes === 'boolean' && (
                    <button
                      className={`p-2 rounded-full transition ${view.likes
                          ? 'text-red-500 hover:bg-red-50'
                          : 'text-gray-400 hover:bg-gray-100'
                        }`}
                      aria-label={view.likes ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                    >
                      <svg
                        className="w-6 h-6"
                        viewBox="0 0 24 24"
                        fill={view.likes ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="M12 21s-6.716-4.327-9.193-7.028C.76 11.763.5 9.28 2.05 7.66 3.6 6.04 6.06 6.2 7.6 7.76L12 12.2l4.4-4.44c1.54-1.56 4-1.72 5.55-.1 1.55 1.62 1.3 4.1-.76 6.33C18.716 16.673 12 21 12 21z" />
                      </svg>
                    </button>
                  )}

                  {/* Bouton fermer */}
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition"
                    aria-label="Fermer"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Contenu scrollable */}
              <div className="overflow-y-auto flex-1">
                <div className="md:flex">
                  {/* Section image */}
                  <div className="md:w-1/2 p-6 flex flex-col">
                    <div className="relative aspect-square w-full bg-gray-50 rounded-lg overflow-hidden mb-4">
                      <Image
  src={view.image ||'/placeholder-product.png'}
  alt={view.name}
  fill
  className="object-contain"
  sizes="(max-width: 768px) 100vw, 50vw"
/>


                    </div>

                    {/* Gallery thumbnails (optionnel) */}
                    <div className="flex gap-2 overflow-x-auto py-2">
                      {[view.image, '/placeholder-thumbnail.png'].map((img, i) => (
                        <button
                          key={i}
                          className="w-16 h-16 flex-shrink-0 border border-gray-200 rounded-md overflow-hidden"
                        >
                          <Image
                            src={img}
                            alt={`Vue ${i + 1} de ${view.name}`}
                            width={64}
                            height={64}
                            className="object-cover w-full h-full"
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Section détails */}
                  <div className="md:w-1/2 p-6 space-y-6">
                    {/* Badges */}
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                        {view.category}
                      </span>

                      {view.is_new && (
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                          Nouveau
                        </span>
                      )}

                      {view.isPromo && (
                        <span className="px-3 py-1 bg-amber-100 text-amber-800 text-sm font-medium rounded-full">
                          Promotion
                        </span>
                      )}
                    </div>

                    {/* Prix */}
                    <div className="space-y-2">
                      <div className="flex items-baseline gap-3 flex-wrap">
                        <p className="text-3xl font-bold text-gray-900">
                          {view.price.toLocaleString()} FCFA
                        </p>

                        {view.isPromo && view.oldPrice && view.oldPrice > view.price && (
                          <>
                            <p className="text-lg text-gray-400 line-through">
                              {view.oldPrice.toLocaleString()} FCFA
                            </p>
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded">
                              Économisez {Math.round(((view.oldPrice - view.price) / view.oldPrice) * 100)}%
                            </span>
                          </>
                        )}
                      </div>

                      {view.stock > 0 && (
                        <p className="text-sm text-green-600">
                          <span className="font-medium">{view.stock}</span> unités disponibles
                        </p>
                      )}
                    </div>

                    {/* Description */}
                    <div className="prose prose-sm max-w-none text-gray-700">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                      <p>{view.description}</p>
                    </div>

                    {/* Métadonnées */}
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Référence</p>
                        <p className="text-gray-900 font-mono">#{view._id?.slice(-8)}</p>
                      </div>

                      {view.createdAt && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">{`Date d'ajout`}</p>
                          <p className="text-gray-900">
                            {new Date(view.createdAt).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer avec actions */}
              <div className="p-6 pt-4 border-t border-gray-100 bg-gray-50">
                <div className="flex flex-col sm:flex-row justify-end gap-3">
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium"
                  >
                    Fermer
                  </button>

                  {view.stock > 0 ? (
                    <button
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition font-medium flex items-center justify-center gap-2"
                      onClick={() => {
                        // Ajouter au panier
                        setShowViewModal(false);
                      }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Ajouter au panier
                    </button>
                  ) : (
                    <button
                      className="px-6 py-3 bg-gray-200 text-gray-600 rounded-lg cursor-not-allowed font-medium"
                      disabled
                    >
                      Produit indisponible
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {showUpdateModal && update && (
  <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-opacity duration-300">
    <div 
      className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300"
      onClick={(e) => e.stopPropagation()}
    >
      <form
        onSubmit={handleUpdateSubmit}
        encType="multipart/form-data"
        className="divide-y divide-gray-200"
      >
        {/* Header */}
        <div className="px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Modifier le produit</h2>
            <p className="text-sm text-gray-500">ID: #{update._id?.slice(-8)}</p>
          </div>
          <button
            type="button"
            onClick={() => setShowUpdateModal(false)}
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition"
            aria-label="Fermer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenu */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nom */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom du produit <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                defaultValue={update.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                required
              />
            </div>

            {/* Catégorie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                defaultValue={update.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[center_right_1rem]"
                required
              >
                <option value="">Sélectionner une catégorie</option>
                <option value="Salon">Salon</option>
                <option value="Cuisine">Cuisine</option>
                <option value="Chambre">Chambre</option>
                <option value="Bureau">Bureau</option>
                <option value="Extérieur">Extérieur</option>
              </select>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                defaultValue={update.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                required
              ></textarea>
            </div>

            {/* Prix */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prix (FCFA) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">FCFA</span>
                <input
                  type="number"
                  name="price"
                  defaultValue={update.price}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                  required
                  min="0"
                />
              </div>
            </div>

            {/* Ancien prix */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ancien prix (FCFA)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">FCFA</span>
                <input
                  type="number"
                  name="oldPrice"
                  defaultValue={update.oldPrice}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                  min="0"
                />
              </div>
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="stock"
                defaultValue={update.stock}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                required
                min="0"
              />
            </div>

            {/* Date de création */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de création
              </label>
              <input
                type="date"
                name="createdAt"
                defaultValue={update.createdAt?.split('T')[0] || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              />
            </div>

            {/* Options */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Options
              </label>
<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
  <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition cursor-pointer">
    <input
      type="checkbox"
      name="is_new"
      checked={formData.is_new ?? update?.is_new ?? false}
      onChange={handleInputChange}
      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
    />
    <span className="ml-2 text-sm text-gray-700">Nouveau produit</span>
  </label>
  <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition cursor-pointer">
    <input
      type="checkbox"
      name="isPromo"
      checked={  formData.isPromo ?? update?.isPromo ?? false}
      onChange={handleInputChange}
      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
    />
    <span className="ml-2 text-sm text-gray-700">En promotion</span>
  </label>
  
 
</div>

            </div>

            {/* Image */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image du produit
              </label>
              <input
                type="file"
                name="image"
                onChange={handleImageChange}
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
              />
              <div className="flex items-center gap-4">
                <div className="relative group">
                  {(previewImage || update.image) ? (
                    <>
                      <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                        <Image
                          src={previewImage || update.image}
                          alt="Preview"
                          width={96}
                          height={96}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition shadow-sm"
                        aria-label="Supprimer l'image"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </>
                  ) : (
                    <div
                      onClick={handleImageClick}
                      className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
                    >
                      <svg className="w-6 h-6 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs text-gray-500">Ajouter une image</span>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleImageClick}
                  className="text-sm bg-white border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-md transition"
                >
                  {previewImage || update.image ? "Changer l'image" : "Parcourir..."}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">Format recommandé : JPG/PNG (ratio 1:1)</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => setShowUpdateModal(false)}
            className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition font-medium"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition font-medium flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Enregistrer les modifications
          </button>
        </div>
      </form>
    </div>
  </div>
)}




        <Pagination
          data={filteredProducts}
          label="produits"
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  );
}