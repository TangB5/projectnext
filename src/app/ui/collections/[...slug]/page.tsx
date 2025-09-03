export default async function CollectionPage({ params }:{ params: Promise<{ slug: string[] }> }

) {
 const {slug}= await params;

 if (!slug || slug.length === 0) {
        return <div className="container mx-auto px-4 py-8">Collection not found</div>;
    }
    else if (slug.length > 1) {
        return <div className="container mx-auto px-4 py-8">Invalid collection slug</div>;
    }
    else if (slug.length === 1 && slug[0] === 'all') {
        return <div className="container mx-auto px-4 py-8">All collections</div>;
    }
    else if (slug.length === 1 && slug[0] === 'Salon') {
        return <div className="container mx-auto px-4 py-8">New arrivals</div>;
    }
    else if (slug.length === 1 && slug[0] === 'Cuisine') {
        return <div className="container mx-auto px-4 py-8">Sale items</div>;
    }
    else if (slug.length === 1 && slug[0] === 'Chambre') {
        return <div className="container mx-auto px-4 py-8">Popular items</div>;
    }
    else if (slug.length === 1 && slug[0] === 'Bureau') {
        return <div className="container mx-auto px-4 py-8">Furniture collection    </div>;
    }
    else if (slug.length === 1 && slug[0] === 'Exterieur') {
        return <div className="container mx-auto px-4 py-8">Outdoor collection</div>;
    }

    return 
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Collection: </h1>
            <p className="text-gray-600 mb-6">Explore our exclusive collection of furniture.</p>
            
        </div>
    ;
}