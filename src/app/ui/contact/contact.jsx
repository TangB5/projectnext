"use client";
import { useEffect, useState } from "react";
import { getContactInfo, sendContactMessage } from "@/app/lib/Service";

export function Contact() {
    const [contact, setContact] = useState(null);

    useEffect(() => {
        const fetchContact = async () => {
            try {
                const data = await getContactInfo();
                setContact(data);
            } catch (err) {
                console.error("Erreur récupération contact:", err);
            }
        };
        fetchContact();
    }, []);

    if (!contact) return <p>Chargement des informations...</p>;

    return (
        <section id="contact" className="py-16 bg-green-900 text-white">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">Contactez-nous</h2>
                <div className="flex flex-col md:flex-row">
                    {/* Informations */}
                    <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
                        <h3 className="text-xl font-bold mb-4">Informations</h3>
                        <p className="mb-6">
                            Vous avez des questions sur nos produits ou besoin d’assistance ? Notre équipe est là pour vous aider.
                        </p>

                        <InfoItem icon="pi pi-map-marker" title="Adresse" value={contact.address} />
                        <InfoItem icon="pi pi-phone" title="Téléphone" value={contact.phone} />
                        <InfoItem icon="pi pi-envelope" title="Email" value={contact.email} />

                        <div className="flex space-x-4 mt-6">
                            <SocialLink href={contact.social.facebook} icon="pi pi-facebook" />
                            <SocialLink href={contact.social.instagram} icon="pi pi-instagram" />
                            <SocialLink href={contact.social.pinterest} icon="pi pi-pinterest" />
                        </div>
                    </div>

                    {/* Formulaire */}
                    <div className="w-full md:w-1/2 lg:w-2/5">
                        <ContactForm />
                    </div>
                </div>
            </div>
        </section>
    );
}

function InfoItem({ icon, title, value }) {
    return (
        <div className="mb-4 flex items-start">
            <i className={`${icon} mt-1 mr-4 text-stone-200`}></i>
            <div>
                <h4 className="font-bold">{title}</h4>
                <p>{value}</p>
            </div>
        </div>
    );
}

function SocialLink({ href, icon }) {
    return (
        <a
            href={href || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-800 w-10 h-10 rounded-full flex items-center justify-center hover:bg-green-700 transition"
        >
            <i className={icon}></i>
        </a>
    );
}

function ContactForm() {
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        try {
            await sendContactMessage(data);
            alert("✅ Message envoyé !");
            e.target.reset();
        } catch (err) {
            alert("❌ " + err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white text-gray-800 p-6 sm:p-8 rounded-xl shadow-xl border border-gray-100 space-y-5">
            <input type="text" name="name" placeholder="Nom complet" required className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-700" />
            <input type="email" name="email" placeholder="Email" required className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-700" />
            <select name="subject" required className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-700">
                <option value="">Sélectionnez un sujet</option>
                <option value="question">Question générale</option>
                <option value="order">Commande</option>
                <option value="technical">Problème technique</option>
                <option value="other">Autre</option>
            </select>
            <textarea name="message" placeholder="Votre message..." required className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-700 min-h-[120px]" />
            <button type="submit" className="w-full bg-gradient-to-r from-green-700 to-green-600 text-white px-6 py-3.5 rounded-lg font-medium hover:from-green-800 hover:to-green-700 transition-all shadow-md hover:shadow-lg active:scale-[0.98]">
                Envoyer le message
            </button>
        </form>
    );
}
