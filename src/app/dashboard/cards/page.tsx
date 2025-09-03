
 export interface CardsProps {
    bgcolor: string;
    text: string;   
    icon: string;
    bordercolor: string;
    title: string;
    value: string | number;
    color: string;
    
}

export default function Cards({bgcolor, text, icon , bordercolor,title, value,color}: CardsProps) {

    return (


              <div className={`bg-white p-6 rounded-lg shadow-sm border-l-4 border-${bordercolor} hover:shadow-md transition-shadow`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-gray-500 mb-2">{title}</h3>
                    <p className="text-3xl font-bold">{value}</p>
                  </div>
                  <div className={`bg-${bgcolor} p-3 rounded-full text-${color}`}>
                    <i className={`pi ${icon} text-xl`}></i>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">{text}</p>
              </div>

              
            

    )
}