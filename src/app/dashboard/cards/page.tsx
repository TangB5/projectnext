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
  red: "bg-red-500",
  green: "bg-green-500",
  blue: "bg-blue-500",
  yellow: "bg-yellow-500",
  gray: "bg-gray-500",
};

const TEXT_COLOR_MAP: Record<string, string> = {
  red: "text-red-500",
  green: "text-green-500",
  blue: "text-blue-500",
  yellow: "text-yellow-500",
  gray: "text-gray-500",
};

const BORDER_COLOR_MAP: Record<string, string> = {
  red: "border-red-500",
  green: "border-green-500",
  blue: "border-blue-500",
  yellow: "border-yellow-500",
  gray: "border-gray-500",
};

export default function Cards({bgcolor, text, icon, bordercolor, title, value, color}: CardsProps) {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm border-l-4 ${BORDER_COLOR_MAP[bordercolor]} hover:shadow-md transition-shadow`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-gray-500 mb-2">{title}</h3>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className={`${COLORS_MAP[bgcolor]} p-3 rounded-full ${TEXT_COLOR_MAP[color]}`}>
          <i className={`pi ${icon} text-xl`}></i>
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-2">{text}</p>
    </div>
  );
}
