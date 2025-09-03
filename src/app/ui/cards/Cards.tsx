
import React from 'react';

export interface CardsProps {
  bgcolor: string;
  text: string;
  icon: string;
  bordercolor: string;
  title: string;
  value: string | number;
  color: string;
}


const COLORS_MAP: Record<string, string> = {
  "green-100": "bg-green-100",
  "blue-100": "bg-blue-100",
  "amber-100": "bg-amber-100",
  
};

const TEXT_COLOR_MAP: Record<string, string> = {
  "green-800": "text-green-800",
  "blue-800": "text-blue-800",
  "amber-800": "text-amber-800",
};

const BORDER_COLOR_MAP: Record<string, string> = {
  "green-500": "border-green-500",
  "blue-500": "border-blue-500",
  "amber-500": "border-amber-500",
};


export default function Cards({ bgcolor, text, icon, bordercolor, title, value, color }: CardsProps) {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm border-l-4 ${BORDER_COLOR_MAP[bordercolor]} hover:shadow-md transition-shadow`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-gray-500 mb-2">{title}</h3>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className={`${COLORS_MAP[bgcolor]} p-3 rounded-full ${TEXT_COLOR_MAP[color]}`}>
          {/* Assurez-vous que les classes d'icônes sont correctement formatées */}
          <i className={icon + " text-xl"}></i>
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-2">{text}</p>
    </div>
  );
}