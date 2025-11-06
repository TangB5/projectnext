'use client';

import {useState} from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {login} from '@/app/lib/Service';
import {useRouter} from 'next/navigation';
import {useAuth} from "@/app/lib/authProvider";

export default function LoginPage() {
    const router = useRouter();
    const {refreshSession} = useAuth()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPending, setIsPending] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error("Veuillez remplir tous les champs.");
            return;
        }

        setIsPending(true);
        try {
            const {user} = await login(email, password);
            toast.success(`Bienvenue ${user.name || user.email} !`);
            await refreshSession();
            router.push("/dashboard");


        } catch (err) {
            if (err instanceof Error) {
                toast.error(err.message || "Erreur de connexion.");
            } else {
                toast.error("Une erreur inattendue est survenue.");
            }
        } finally {
            setIsPending(false);
        }
    };


    const SubmitButton = ({pending}: { pending: boolean }) => (
        <button
            type="submit"
            disabled={pending}
            className={`btn-primary w-full py-3 px-4 text-white font-medium rounded-lg shadow-md transition-all duration-300 flex justify-center items-center ${
                pending ? 'opacity-75 cursor-not-allowed' : 'hover:bg-green-700 hover:shadow-lg'
            }`}
        >
            {pending ? (
                <>
                    <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2
                            5.291A7.962 7.962 0 014 12H0c0 3.042
                            1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                    Connexion en cours...
                </>
            ) : (
                <>
                    <svg
                        className="w-5 h-5 mr-2 -ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11 16l-4-4m0 0l4-4m-4
                            4h14m-5 4v1a3 3 0 01-3
                            3H6a3 3 0 01-3-3V7a3 3
                            0 013-3h7a3 3 0 013 3v1"
                        />
                    </svg>
                    Se connecter
                </>
            )}
        </button>
    );

    return (
        <section className="min-h-screen flex items-center justify-center p-4 bg-gray-100 w-full">
            <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl w-full">
                <div
                    className="hidden md:block md:w-1/2 bg-[url('https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80')] bg-cover bg-center relative">
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <h1 className="logo-font text-4xl font-bold text-white drop-shadow-md">
                            ModerneMeuble
                        </h1>
                    </div>
                </div>

                <div className="w-full md:w-1/2 p-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-1">Bienvenue</h2>
                    <p className="text-gray-600 mb-6">Connectez-vous à votre espace client</p>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="exemple@email.com"
                                className="input-focus w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none transition"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isPending}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="input-focus w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none transition"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isPending}
                                required
                            />
                        </div>

                        <SubmitButton pending={isPending}/>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-600">
                        Pas encore membre ?
                        <Link
                            href="/auth/signup"
                            className="font-medium text-green-700 hover:underline ml-1"
                        >
                            Créez un compte
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    );
}
