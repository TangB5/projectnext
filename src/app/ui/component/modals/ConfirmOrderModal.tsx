"use client";

import Image from "next/image";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Badge } from "primereact/badge";
import { ProgressSpinner } from "primereact/progressspinner";
import { Product } from "@/app/types";
import "primeicons/primeicons.css";

export interface ConfirmOrderModalProps {
    isOpen: boolean;
    product: Product | null;
    quantity: number;
    onQuantityChange: (q: number) => void;
    onClose: () => void;
    onConfirm: (data: {
        address: string;
        phone: string;
        paymentMethod: string;
    }) => void;
    isOrdering: boolean;
    address: string;
    onAddressChange: (value: string) => void;
    phone: string;
    onPhoneChange: (value: string) => void;
    paymentMethod: string;
    onPaymentChange: (value: string) => void;
}

export default function ConfirmOrderModal({
                                              isOpen,
                                              product,
                                              quantity,
                                              onQuantityChange,
                                              onClose,
                                              onConfirm,
                                              isOrdering,
                                              address,
                                              onAddressChange,
                                              phone,
                                              onPhoneChange,
                                              paymentMethod,
                                              onPaymentChange,
                                          }: ConfirmOrderModalProps) {
    const paymentOptions = [
        {
            label: "Carte bancaire",
            value: "Carte bancaire",
            icon: "pi pi-credit-card",
            description: "Paiement sécurisé par carte"
        },
        {
            label: "Mobile Money",
            value: "Mobile Money",
            icon: "pi pi-mobile",
            description: "Paiement via Orange Money, MTN Money..."
        },
        {
            label: "Paiement à la livraison",
            value: "Paiement à la livraison",
            icon: "pi pi-truck",
            description: "Payez lorsque vous recevez votre commande"
        },
    ];

    if (!product) return null;

    const handleConfirm = () => {
        onConfirm({ address, phone, paymentMethod });
    };

    const totalAmount = product.price * quantity;
    const isFormValid = address.trim() && phone.trim() && paymentMethod;

    // Rendu du Header (Minimaliste, fond blanc)
    const headerTemplate = (
        <div className="flex items-center gap-3 p-4 border-b border-gray-100 bg-white">
            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                <i className="pi pi-shopping-bag text-green-600 text-lg"></i>
            </div>
            <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">Finaliser votre commande</h2>
                <p className="text-sm text-gray-600">Confirmez les détails de livraison et paiement</p>
            </div>
            <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                disabled={isOrdering}
            >
                <i className="pi pi-times text-gray-500"></i>
            </button>
        </div>
    );

    // Rendu du Footer (Minimaliste, fond blanc cassé)
    const footerTemplate = (
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center p-4 md:p-6 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <i className="pi pi-shield-check text-green-600"></i>
                <span>Paiement sécurisé</span>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
                <button
                    onClick={onClose}
                    className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
                    disabled={isOrdering}
                >
                    <i className="pi pi-arrow-left"></i>
                    Retour
                </button>
                <button
                    onClick={handleConfirm}
                    disabled={isOrdering || !isFormValid}
                    className="flex-1 sm:flex-none px-8 py-2.5 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md shadow-green-200/50 flex items-center justify-center gap-2 font-semibold"
                >
                    {isOrdering ? (
                        <>
                            <ProgressSpinner
                                style={{ width: '20px', height: '20px' }}
                                strokeWidth="4"
                                fill="transparent"
                                animationDuration=".5s"
                                className="!text-white"
                            />
                            Traitement...
                        </>
                    ) : (
                        <>
                            <i className="pi pi-check-circle text-lg"></i>
                            Confirmer la commande
                        </>
                    )}
                </button>
            </div>
        </div>
    );

    return (
        <Dialog
            visible={isOpen}
            header={headerTemplate}
            footer={footerTemplate}
            modal
            draggable={false}
            onHide={onClose}
            // Correction de la double barre de défilement : taille maximale et centrage
            className="confirm-order-modal w-full max-w-lg md:max-w-3xl lg:max-w-4xl h-full max-h-[90vh] flex flex-col"
            contentClassName="p-0 bg-white flex-1 overflow-y-auto" // Le contenu interne prend tout l'espace restant et défile
            closeOnEscape={!isOrdering}
            closable={!isOrdering}
            maskClassName="backdrop-blur-sm bg-black/40"
        >
            {/* Le contenu principal défile */}
            <div className="space-y-6 p-4 md:p-6">

                {/* Bloc Produit (Minimaliste : Image, Nom, Prix total) */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex gap-4 items-center">
                        {/* Image du produit */}
                        <div className="relative flex-shrink-0">
                            <Image
                                src={product.image}
                                alt={product.name}
                                width={80} // Taille réduite
                                height={80}
                                className="rounded-lg border border-gray-200"
                            />
                            {/* Badge vert discret */}
                            {product.stock < 10 && (
                                <Badge
                                    value="Stock limité"
                                    className="absolute -top-2 -right-2 bg-green-600 text-white"
                                />
                            )}
                        </div>

                        {/* Infos et Quantité */}
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-bold text-gray-900 text-lg leading-tight truncate">
                                    {product.name}
                                </h3>
                                {/* Affichage du prix total ici */}
                                <span className="text-green-700 font-bold text-lg whitespace-nowrap ml-4">
                                    {totalAmount.toLocaleString()} FCFA
                                </span>
                            </div>

                            {/* Contrôle de quantité */}
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-gray-700">Qté :</span>
                                <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-0.5">
                                    <button
                                        onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                                        disabled={quantity <= 1 || isOrdering}
                                        className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <i className="pi pi-minus text-xs text-gray-600"></i>
                                    </button>
                                    <span className="w-6 text-center font-semibold text-gray-900 text-sm">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => onQuantityChange(Math.min(product.stock, quantity + 1))}
                                        disabled={quantity >= product.stock || isOrdering}
                                        className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <i className="pi pi-plus text-xs text-gray-600"></i>
                                    </button>
                                </div>
                                <div className="text-xs text-gray-500 hidden sm:block">
                                    ({product.price.toLocaleString()} FCFA/unité)
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section Informations (Fond blanc) */}
                <h3 className="text-lg font-semibold text-gray-900 mt-6 pb-2 border-b border-gray-100">Détails de livraison et paiement</h3>

                {/* Informations de contact (Grid responsive) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Numéro de téléphone */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-800 flex items-center gap-2">
                            <i className="pi pi-phone text-green-600"></i>
                            Numéro de téléphone
                        </label>
                        <InputText
                            value={phone}
                            onChange={(e) => onPhoneChange(e.target.value)}
                            placeholder="+225 01 23 45 67 89"
                            className="w-full"
                            keyfilter="num"
                            disabled={isOrdering}
                        />
                    </div>

                    {/* Méthode de paiement */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-800 flex items-center gap-2">
                            <i className="pi pi-wallet text-green-600"></i>
                            Mode de paiement
                        </label>
                        <Dropdown
                            value={paymentMethod}
                            onChange={(e) => onPaymentChange(e.value)}
                            options={paymentOptions}
                            optionLabel="label"
                            placeholder="Sélectionnez..."
                            panelClassName="bg-white"
                            className="w-full"
                            disabled={isOrdering}
                            itemTemplate={(option) => (
                                <div className="flex items-center gap-3 p-2">
                                    <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center ">
                                        <i className={`${option.icon} text-green-600`}></i>
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-900">{option.label}</div>
                                        <div className="text-xs text-gray-600">{option.description}</div>
                                    </div>
                                </div>
                            )}
                        />
                    </div>
                </div>

                {/* Adresse de livraison */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-800 flex items-center gap-2">
                        <i className="pi pi-map-marker text-green-600"></i>
                        Adresse de livraison
                    </label>
                    <InputTextarea
                        autoResize
                        rows={3}
                        value={address}
                        onChange={(e) => onAddressChange(e.target.value)}
                        placeholder="Entrez votre adresse complète (rue, ville, code postal)..."
                        className="w-full"
                        disabled={isOrdering}
                    />
                    <div className="text-xs text-gray-500 mt-1">
                        Précisez bien votre localisation pour une livraison rapide.
                    </div>
                </div>

                {/* Garanties (Minimaliste) */}
                <div className="grid grid-cols-3 gap-3 text-center pt-4">
                    <div className="bg-white rounded-xl p-3 border border-gray-200">
                        <i className="pi pi-truck text-green-600 text-xl mb-1"></i>
                        <div className="text-xs font-medium text-gray-700">Livraison rapide</div>
                    </div>
                    <div className="bg-white rounded-xl p-3 border border-gray-200">
                        <i className="pi pi-shield text-green-600 text-xl mb-1"></i>
                        <div className="text-xs font-medium text-gray-700">Paiement sécurisé</div>
                    </div>
                    <div className="bg-white rounded-xl p-3 border border-gray-200">
                        <i className="pi pi-refresh text-green-600 text-xl mb-1"></i>
                        <div className="text-xs font-medium text-gray-700">Retour facile</div>
                    </div>
                </div>
            </div>
        </Dialog>
    );
}