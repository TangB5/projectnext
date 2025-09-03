'use client'

import { useFormStatus } from 'react-dom'
import { register } from '@/app/api/route'
import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

function SubmitButton() {
  const { pending } = useFormStatus()

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
  )
}

export default function Register() {
  const [formState, formAction] = useActionState(register, {})
  const router = useRouter()

 useEffect(() => {
  if (formState?.success) {
    const timer = setTimeout(() => {
      router.push('/auth/login');
    }, 3000); // 3 secondes avant redirection
    
    return () => clearTimeout(timer);
  }
}, [formState, router]);

  return (
    <form className="space-y-5" action={formAction}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
        <input
          name="name" // Changé de fullname à name pour correspondre à votre modèle User
          autoComplete="off"
          type="text"
          placeholder="Jean Dupont"
          className="input-focus w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none transition"
          required
        />
        {formState?.errors?.name && (
          <p className="text-red-500 text-sm mt-1">{formState.errors.name}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          name="email"
          autoComplete="off"
          type="email"
          placeholder="exemple@email.com"
          className="input-focus w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none transition"
          required
        />
        {formState?.errors?.email && (
          <p className="text-red-500 text-sm mt-1">{formState.errors.email}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
        <input
          name="password"
          autoComplete="off"
          type="password"
          placeholder="••••••••"
          className="input-focus w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none transition"
          required
          minLength={8}
        />
        {formState?.errors?.password && (
          <p className="text-red-500 text-sm mt-1">{formState.errors.password}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
        <input
          name="confirmPassword"
          autoComplete="off"
          type="password"
          placeholder="••••••••"
          className="input-focus w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none transition"
          required
        />
        {formState?.errors?.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">{formState.errors.confirmPassword}</p>
        )}
      </div>

      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            name="terms"
            type="checkbox"
            id="terms"
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            required
          />
        </div>
        <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
          {`J'accepte `}les <a href="#" className="text-green-700 hover:underline">conditions générales</a> et la{' '}
          <a href="#" className="text-green-700 hover:underline">politique de confidentialité</a>
        </label>
      </div>

      {formState?.success ? (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg max-w-sm w-full text-center animate-fade-in">
      <svg
        className="w-16 h-16 text-green-500 mx-auto mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Inscription réussie !
      </h3>
      <p className="text-gray-600 mb-4">
        Vous allez être redirigé vers la page de connexion...
      </p>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-green-500 h-2 rounded-full animate-progress"
          style={{ animationDuration: "3s" }}
        />
      </div>
    </div>
  </div>
) : formState?.message && !formState?.errors ? (
  <div
    className={`p-4 rounded-lg mb-4 ${
      formState.status === 200
        ? "bg-green-50 text-green-800"
        : "bg-red-50 text-red-800"
    }`}
  >
    <div className="flex items-start">
      {formState.status === 200 ? (
        <svg
          className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg
          className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      )}
      <p className="text-sm">{formState.message}</p>
    </div>
  </div>
) : null}

      <SubmitButton />
    </form>
  )
}