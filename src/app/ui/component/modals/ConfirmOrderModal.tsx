"use client";

import Image from "next/image";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
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

    const headerTemplate = (
        <div className="flex items-center gap-3 p-4 border-b border-gray-100 bg-white">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <i className="pi pi-shopping-bag text-white text-lg"></i>
            </div>
            <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">Finaliser votre commande</h2>
                <p className="text-sm text-gray-600">Remplissez les informations de livraison</p>
            </div>
            <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            >
                <i className="pi pi-times text-gray-500"></i>
            </button>
        </div>
    );

    const footerTemplate = (
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center p-6 border-t border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <i className="pi pi-shield-check text-emerald-500"></i>
                <span>Paiement 100% sécurisé</span>
            </div>
            <div className="flex gap-3">
                <button
                    onClick={onClose}
                    className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200 flex items-center gap-2 font-medium"
                >
                    <i className="pi pi-arrow-left"></i>
                    Retour
                </button>
                <button
                    onClick={handleConfirm}
                    disabled={isOrdering || !isFormValid}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl shadow-emerald-200 flex items-center gap-2 font-semibold"
                >
                    {isOrdering ? (
                        <>
                            <ProgressSpinner
                                style={{ width: '20px', height: '20px' }}
                                strokeWidth="4"
                                animationDuration=".5s"
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
            className="confirm-order-modal"
            style={{ width: "100%", maxWidth: "940px" }}
            contentClassName="p-0 bg-white "
            closeOnEscape={!isOrdering}
            closable={!isOrdering}
            maskClassName="backdrop-blur-md bg-black/50"
        >
            <div className="space-y-6 p-6 max-h-[70vh] overflow-y-auto">

                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-100">
                    <div className="flex gap-4 items-start">
                        <div className="relative">
                            <Image
                                src={product.image}
                                alt={product.name}
                                width={100}
                                height={100}
                                className="rounded-xl border-2 border-white shadow-md"
                            />
                            {product.stock < 10 && (
                                <Badge
                                    value="Stock limité"
                                    className="absolute -top-2 -right-2 bg-amber-500 text-white"
                                />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-gray-900 text-lg leading-tight">
                                    {product.name}
                                </h3>
                                <span className="text-emerald-700 font-bold text-lg">
                                    {product.price.toLocaleString()} FCFA
                                </span>
                            </div>

                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                {product.description || "Produit de qualité supérieure"}
                            </p>

                            {/* Contrôle de quantité */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-gray-700">Quantité :</span>
                                    <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-200 p-1">
                                        <button
                                            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                                            disabled={quantity <= 1}
                                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <i className="pi pi-minus text-sm text-gray-600"></i>
                                        </button>
                                        <span className="w-12 text-center font-semibold text-gray-900">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() => onQuantityChange(Math.min(product.stock, quantity + 1))}
                                            disabled={quantity >= product.stock}
                                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <i className="pi pi-plus text-sm text-gray-600"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-gray-500 mb-1">Stock disponible</div>
                                    <div className="text-sm font-medium text-gray-900">{product.stock} unités</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Informations de contact */}
                <div className="grid md:grid-cols-2 gap-4">
                    {/* Numéro de téléphone */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-900 flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <i className="pi pi-phone text-blue-600"></i>
                            </div>
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
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                            <i className="pi pi-info-circle text-gray-400"></i>
                            Pour les notifications de livraison
                        </div>
                    </div>

                    {/* Méthode de paiement */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-900 flex items-center gap-2">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                <i className="pi pi-credit-card text-purple-600"></i>
                            </div>
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
                                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center ">
                                        <i className={`${option.icon} text-emerald-600`}></i>
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
                    <label className="block text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                            <i className="pi pi-map-marker text-orange-600"></i>
                        </div>
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
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                        <i className="pi pi-map text-gray-400"></i>
                        Précisez bien votre localisation pour une livraison rapide
                    </div>
                </div>

                {/* Récapitulatif */}
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <i className="pi pi-receipt text-gray-600"></i>
                        Récapitulatif de la commande
                    </h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Sous-total ({quantity} article{quantity > 1 ? 's' : ''})</span>
                            <span className="text-gray-900">{(product.price * quantity).toLocaleString()} FCFA</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Frais de livraison</span>
                            <span className="text-green-600">Gratuit</span>
                        </div>
                        <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                            <span className="font-semibold text-gray-900">Total à payer</span>
                            <span className="font-bold text-emerald-700 text-lg">
                                {totalAmount.toLocaleString()} FCFA
                            </span>
                        </div>
                    </div>
                </div>

                {/* Garanties */}
                <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-white rounded-xl p-3 border border-gray-200">
                        <i className="pi pi-truck text-blue-500 text-xl mb-2"></i>
                        <div className="text-xs font-medium text-gray-900">Livraison rapide</div>
                    </div>
                    <div className="bg-white rounded-xl p-3 border border-gray-200">
                        <i className="pi pi-shield text-green-500 text-xl mb-2"></i>
                        <div className="text-xs font-medium text-gray-900">Paiement sécurisé</div>
                    </div>
                    <div className="bg-white rounded-xl p-3 border border-gray-200">
                        <i className="pi pi-refresh text-orange-500 text-xl mb-2"></i>
                        <div className="text-xs font-medium text-gray-900">Retour facile</div>
                    </div>
                </div>
            </div>
        </Dialog>
    );
}