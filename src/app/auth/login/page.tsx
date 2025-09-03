'use client'

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

const API_BASE_URL = process.env.BACKEND_URL || 'http://localhost:3000/api';


  const handleSubmit = async  (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.message || 'La connexion a échoué.');
        toast.error(errorData.message || 'La connexion a échoué.');
      } else {
        toast.success('Connexion réussie !');
        router.push('/dashboard');
      }
    } catch  {
      setError('Une erreur est survenue.');
      toast.error('Une erreur est survenue.');
    } finally {
      setIsPending(false);
    }
  };

  function SubmitButton({ pending }: { pending: boolean }) {
    return (
      <button
        type="submit"
        className={`btn-primary w-full py-3 px-4 text-white font-medium rounded-lg shadow-md transition-all duration-300 flex justify-center items-center
          ${pending ? 'opacity-75 cursor-not-allowed' : 'hover:bg-green-700 hover:shadow-lg'}`}
        disabled={pending}
      >
        {pending ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Se connecter
          </>
        )}
      </button>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center p-4 bg-gray-100 w-full">
      <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl w-full">
        <div className="hidden md:block md:w-1/2 bg-[url('https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80')] bg-cover bg-center relative">
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" className="text-white">
              <path fill="currentColor" d="M20 9V7c0-1.65-1.35-3-3-3H7C5.35 4 4 5.35 4 7v2c-1.65 0-3 1.35-3 3v5c0 1.65 1.35 3 3 3v1c0 .55.45 1 1 1s1-.45 1-1v-1h12v1c0 .55.45 1 1 1s1-.45 1-1v-1c1.65 0 3-1.35 3-3v-5c0-1.65-1.35-3-3-3zM6 7c0-.55.45-1 1-1h10c.55 0 1 .45 1 1v2.78c-.61.55-1 1.34-1 2.22v2H7v-2c0-.88-.39-1.67-1-2.22V7zm15 10c0 .55-.45 1-1 1H4c-.55 0-1-.45-1-1v-5c0-.55.45-1 1-1s1 .45 1 1v4h14v-4c0-.55.45-1 1-1s1 .45 1 1v5z"/>
            </svg>
            <h1 className="logo-font text-4xl font-bold text-white drop-shadow-md">ModerneMeuble</h1>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8">
          <div className="text-center mb-8 md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" className="text-white">
              <path fill="currentColor" d="M20 9V7c0-1.65-1.35-3-3-3H7C5.35 4 4 5.35 4 7v2c-1.65 0-3 1.35-3 3v5c0 1.65 1.35 3 3 3v1c0 .55.45 1 1 1s1-.45 1-1v-1h12v1c0 .55.45 1 1 1s1-.45 1-1v-1c1.65 0 3-1.35 3-3v-5c0-1.65-1.35-3-3-3zM6 7c0-.55.45-1 1-1h10c.55 0 1 .45 1 1v2.78c-.61.55-1 1.34-1 2.22v2H7v-2c0-.88-.39-1.67-1-2.22V7zm15 10c0 .55-.45 1-1 1H4c-.55 0-1-.45-1-1v-5c0-.55.45-1 1-1s1 .45 1 1v4h14v-4c0-.55.45-1 1-1s1 .45 1 1v5z"/>
            </svg>
            <h1 className="logo-font text-3xl font-bold text-gray-800">ModerneMeuble</h1>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 mb-1">Bienvenue</h2>
          <p className="text-gray-600 mb-6">Connectez-vous à votre espace client</p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                name="email"
                type="email"
                placeholder="exemple@email.com"
                className="input-focus w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                className="input-focus w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-600">Se souvenir de moi</label>
              </div>
              <Link href="/auth/forgot-password" className="text-sm text-green-800 hover:underline">Mot de passe oublié ?</Link>
            </div>
            <div className="space-y-4">
              {error && (
                <div className="animate-fade-in">
                  <div
                    className="flex items-start p-4 mb-4 text-red-700 bg-red-100 rounded-lg border border-red-200"
                    role="alert"
                  >
                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div className="ml-3 text-sm font-medium">
                      {error}
                    </div>
                  </div>
                </div>
              )}
              <SubmitButton pending={isPending} />
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Pas encore membre ?
            <Link href="../../auth/singup" className="font-medium text-green-700 hover:underline ml-1">Créez un compte</Link>
          </p>
        </div>
      </div>
    </section>
  );
}