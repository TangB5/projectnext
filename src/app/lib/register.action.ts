
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/";

// Interfaces de données
interface RegisterData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    terms: boolean;
}

interface RegisterResult {
    success: boolean;
    message?: string;
    errors?: Record<string, string[]>;
}

export async function register(data: RegisterData): Promise<RegisterResult> {

    const { name, email, password, confirmPassword, terms } = data;

    // --- 1. Validation Côté Client (Basique) ---
    const errors: Record<string, string[]> = {};
    if (!name) errors.name = ['Le nom est requis'];
    if (!email) errors.email = ['L\'email est requis'];
    if (!password) errors.password = ['Le mot de passe est requis'];
    if (password.length < 8) errors.password = ['Le mot de passe doit contenir au moins 8 caractères'];
    if (password !== confirmPassword) errors.confirmPassword = ['Les mots de passe ne correspondent pas'];
    if (!terms) errors.general = ['Vous devez accepter les conditions générales.'];

    if (Object.keys(errors).length > 0) {
        return { success: false, errors, message: "Veuillez corriger les erreurs dans le formulaire." };
    }

    // --- 2. Appel à l'API Backend ---
    try {
        const response = await fetch(`${API_BASE_URL}api/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });

        const responseData = await response.json();

        if (!response.ok) {
            const backendErrors: Record<string, string[]> = {};

            if (responseData.errors) {
                Object.keys(responseData.errors).forEach(key => {
                    backendErrors[key] = Array.isArray(responseData.errors[key]) ? responseData.errors[key] : [responseData.errors[key]];
                });
            }

            if (Object.keys(backendErrors).length === 0) {
                backendErrors.general = [responseData.message || "L'inscription a échoué en raison d'une erreur serveur."];
            }

            return { success: false, errors: backendErrors, message: responseData.message || "L'inscription a échoué." };
        }

        // --- Succès ---
        return { success: true, message: 'Inscription réussie !' };
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        return { success: false, errors: { general: ['Une erreur réseau est survenue ou la réponse du serveur était invalide.'] }, message: 'Une erreur est survenue.' };
    }
}