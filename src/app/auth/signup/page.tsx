import Link from 'next/link';
import RegisterForm from '../validations/registerForm';

export default function Signup() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100 w-full">
            <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl w-full">
                {/* Colonne de l'image */}
                <div className="hidden md:block md:w-1/2 bg-[url('https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80')] bg-cover bg-center relative">
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" className="text-white">
                            <path fill="currentColor" d="M20 9V7c0-1.65-1.35-3-3-3H7C5.35 4 4 5.35 4 7v2c-1.65 0-3 1.35-3 3v5c0 1.65 1.35 3 3 3v1c0 .55.45 1 1 1s1-.45 1-1v-1h12v1c0 .55.45 1 1 1s1-.45 1-1v-1c1.65 0 3-1.35 3-3v-5c0-1.65-1.35-3-3-3zM6 7c0-.55.45-1 1-1h10c.55 0 1 .45 1 1v2.78c-.61.55-1 1.34-1 2.22v2H7v-2c0-.88-.39-1.67-1-2.22V7zm15 10c0 .55-.45 1-1 1H4c-.55 0-1-.45-1-1v-5c0-.55.45-1 1-1s1 .45 1 1v4h14v-4c0-.55.45-1 1-1s1 .45 1 1v5z"/>
                        </svg>
                        <h1 className="logo-font text-4xl font-bold text-white drop-shadow-md">modernmeuble</h1>
                    </div>
                </div>

                {/* Colonne du formulaire */}
                <div className="w-full md:w-1/2 p-8">
                    <div className="text-center mb-8 md:hidden">
                        <h1 className="logo-font text-3xl font-bold text-gray-800">Élégance</h1>
                    </div>

                    <h2 className="text-2xl font-semibold text-gray-800 mb-1">{`Commencez l'aventure`}</h2>
                    <p className="text-gray-600 mb-6">Créez votre compte en 2 minutes</p>

                    <RegisterForm />

                    <p className="mt-8 text-center text-sm text-gray-600">
                        Déjà membre ?
                        <Link href="/auth/login" className="font-medium text-green-700 hover:underline ml-1">Connectez-vous</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}