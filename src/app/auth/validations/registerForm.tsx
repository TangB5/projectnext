'use client'

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation'; // Import standard Next.js
import { register } from '@/app/lib/register.action'; // Import standard par alias

// Interfaces (doivent correspondre au helper)
interface RegisterState {
    success: boolean;
    message?: string;
    errors?: Record<string, string[]>;
    isSubmitting: boolean;
}

// --- Composant Bouton de Soumission ---
function SubmitButton({ pending }: { pending: boolean }) {
    return (
        <button
            type="submit"
            disabled={pending}
            className="btn-primary w-full py-3 px-4 text-white font-medium rounded-lg shadow-md hover:bg-green-700 transition flex justify-center items-center gap-2"
        >
            {pending ? (
                <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                        <div className="w-2 h-6 bg-white rounded-full animate-wave" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-6 bg-white rounded-full animate-wave" style={{ animationDelay: '100ms' }} />
                        <div className="w-2 h-6 bg-white rounded-full animate-wave" style={{ animationDelay: '200ms' }} />
                        <div className="w-2 h-6 bg-white rounded-full animate-wave" style={{ animationDelay: '300ms' }} />
                        <div className="w-2 h-6 bg-white rounded-full animate-wave" style={{ animationDelay: '400ms' }} />
                    </div>
                    <span>Traitement...</span>
                </div>
            ) : "S'inscrire"}
        </button>
    );
}

// --- Composant principal du Formulaire ---
export default function RegisterForm() {
    const [formState, setFormState] = useState<RegisterState>({ success: false, isSubmitting: false });
    const router = useRouter();

    // Redirection après succès
    useEffect(() => {
        if (formState.success) {
            const timer = setTimeout(() => {
                router.push('/auth/login');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [formState.success, router]);


    // Fonction de soumission gérée par React
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setFormState(prev => ({ ...prev, isSubmitting: true, errors: undefined, message: undefined }));

        const formData = new FormData(event.currentTarget);

        const data = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            confirmPassword: formData.get('confirmPassword') as string,
            terms: !!formData.get('terms'),
        };

        const result = await register(data); // Appel au helper d'API

        setFormState({
            success: result.success,
            message: result.message,
            errors: result.errors,
            isSubmitting: false,
        });
    };


    return (
        <form className="space-y-5" onSubmit={handleSubmit}>

            {/* ... (Reste des champs et affichage des erreurs) ... */}

            {formState?.errors?.general && (
                <p className="text-red-500 text-sm mt-1 p-2 bg-red-100 rounded">
                    {formState.errors.general[0]}
                </p>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                <input name="name" type="text" placeholder="Jean Dupont" className="input-focus w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none transition" required />
                {formState?.errors?.name && (<p className="text-red-500 text-sm mt-1">{formState.errors.name[0]}</p>)}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input name="email" type="email" placeholder="exemple@email.com" className="input-focus w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none transition" required />
                {formState?.errors?.email && (<p className="text-red-500 text-sm mt-1">{formState.errors.email[0]}</p>)}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                <input name="password" type="password" placeholder="••••••••" className="input-focus w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none transition" required minLength={8} />
                {formState?.errors?.password && (<p className="text-red-500 text-sm mt-1">{formState.errors.password[0]}</p>)}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
                <input name="confirmPassword" type="password" placeholder="••••••••" className="input-focus w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none transition" required />
                {formState?.errors?.confirmPassword && (<p className="text-red-500 text-sm mt-1">{formState.errors.confirmPassword[0]}</p>)}
            </div>

            <div className="flex items-start">
                <div className="flex items-center h-5">
                    <input name="terms" type="checkbox" id="terms" className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" required />
                </div>
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
                    {`J'accepte `}les <a href="#" className="text-green-700 hover:underline">conditions générales</a> et la{' '}
                    <a href="#" className="text-green-700 hover:underline">politique de confidentialité</a>
                </label>
            </div>


            {formState.success && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-sm w-full text-center animate-fade-in">
                        <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Inscription réussie !</h3>
                        <p className="text-gray-600 mb-4">Vous allez être redirigé vers la page de connexion...</p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full animate-progress" style={{ animationDuration: "3s" }} />
                        </div>
                    </div>
                </div>
            )}

            <SubmitButton pending={formState.isSubmitting} />
        </form>
    );
}