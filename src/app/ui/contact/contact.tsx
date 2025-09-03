export function Contact(){
     return (
        <section id="contact" className="py-16 bg-green-900 text-white">
        <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Contactez-nous</h2>
            
            <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
                    <h3 className="text-xl font-bold mb-4">Informations</h3>
                    <p className="mb-6">{`Vous avez des questions sur nos produits ou besoin d'assistance ? Notre équipe est là pour vous aider.`}</p>
                    
                    <div className="mb-4 flex items-start">
                        <i className="pi pi-map-marker mt-1 mr-4 text-stone-200"></i>
                        <div>
                            <h4 className="font-bold">Adresse</h4>
                            <p>123 Rue du Design, 75000 Paris</p>
                        </div>
                    </div>
                    
                    <div className="mb-4 flex items-start">
                        <i className="pi pi-phone mt-1 mr-4 text-stone-200"></i>
                        <div>
                            <h4 className="font-bold">Téléphone</h4>
                            <p>01 23 45 67 89</p>
                        </div>
                    </div>
                    
                    <div className="mb-4 flex items-start">
                        <i className="pi pi-envelope mt-1 mr-4 text-stone-200"></i>
                        <div>
                            <h4 className="font-bold">Email</h4>
                            <p>contact@modernemeuble.com</p>
                        </div>
                    </div>
                    
                    <div className="flex space-x-4 mt-6">
                        <a href="#" className="bg-green-800 w-10 h-10 rounded-full flex items-center justify-center hover:bg-green-700 transition">
                            <i className="pi pi-facebook"></i>
                        </a>
                        <a href="#" className="bg-green-800 w-10 h-10 rounded-full flex items-center justify-center hover:bg-green-700 transition">
                            <i className="pi pi-instagram"></i>
                        </a>
                        <a href="#" className="bg-green-800 w-10 h-10 rounded-full flex items-center justify-center hover:bg-green-700 transition">
                            <i className="pi pi-pinterest"></i>
                        </a>
                    </div>
                </div>
                
                <div className="w-full md:w-1/2 lg:w-2/5">
  <form className="bg-white text-gray-800 p-6 sm:p-8 rounded-xl shadow-xl border border-gray-100">
    <h2 className="text-2xl font-bold text-gray-800 mb-6">Contactez-nous</h2>
    
    <div className="space-y-5">
      {/* Champ Nom complet */}
      <div className="relative">
        <label 
          htmlFor="name" 
          className="absolute -top-2 left-3 bg-white px-1 text-sm font-medium text-gray-600"
        >
          Nom complet
        </label>
        <input 
          type="text" 
          id="name" 
          required
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-700 focus:ring-1 focus:ring-green-500 transition-all"
          placeholder="Jean Dupont"
        />
      </div>
      
      {/* Champ Email */}
      <div className="relative">
        <label 
          htmlFor="email" 
          className="absolute -top-2 left-3 bg-white px-1 text-sm font-medium text-gray-600"
        >
          Email
        </label>
        <input 
          type="email" 
          id="email" 
          required
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-700 focus:ring-1 focus:ring-green-500 transition-all"
          placeholder="votre@email.com"
        />
      </div>
      
      {/* Champ Sujet */}
      <div className="relative">
        <label 
          htmlFor="subject" 
          className="absolute -top-2 left-3 bg-white px-1 text-sm font-medium text-gray-600"
        >
          Sujet
        </label>
        <select
          id="subject"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-700 focus:ring-1 focus:ring-green-500 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiAjdjE3MTcxNyIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwb2x5bGluZSBwb2ludHM9IjYgOSAxMiAxNSAxOCA5Ij48L3BvbHlsaW5lPjwvc3ZnPg==')] bg-no-repeat bg-[right_1rem_center] bg-[length:1.5rem] cursor-pointer"
        >
          <option value="" disabled defaultValue={""}>Sélectionnez un sujet</option>
          <option value="question">Question générale</option>
          <option value="order">Commande</option>
          <option value="technical">Problème technique</option>
          <option value="other">Autre</option>
        </select>
      </div>
      
      {/* Champ Message */}
      <div className="relative">
        <label 
          htmlFor="message" 
          className="absolute -top-2 left-3 bg-white px-1 text-sm font-medium text-gray-600"
        >
          Message
        </label>
        <textarea 
          id="message" 
          rows={5} 
          required
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-700 focus:ring-1 focus:ring-green-500 transition-all min-h-[120px]"
          placeholder="Décrivez votre demande en détails..."
        ></textarea>
      </div>
      
      {/* Bouton Submit */}
      <button 
        type="submit" 
        className="w-full bg-gradient-to-r from-green-700 to-green-600 text-white px-6 py-3.5 rounded-lg font-medium hover:from-green-800 hover:to-green-700 transition-all shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
        </svg>
        Envoyer le message
      </button>
    </div>
    
    <div className="mt-4 text-sm text-gray-500 text-center">
      Nous vous répondrons dans les 24 heures
    </div>
  </form>
</div>
            </div>
        </div>
    </section>
     );
}