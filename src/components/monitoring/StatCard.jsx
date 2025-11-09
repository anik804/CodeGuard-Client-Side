export function StatCard({ icon, title, value, highlight, subtitle }) {
  return (
    <div
      className={`glass-card rounded-xl p-5 flex justify-between items-center shadow-lg hover:shadow-xl transition-all border-2 ${
        highlight ? "border-red-300 bg-red-50/50" : "border-gray-200"
      }`}
    >
      <div className="flex-1">
        <p className="text-xs md:text-sm text-gray-600 font-medium mb-1">{title}</p>
        <p
          className={`text-2xl md:text-3xl font-bold mb-1 ${
            highlight ? "text-red-600" : "text-gray-800"
          }`}
        >
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-gray-500">{subtitle}</p>
        )}
      </div>
      <div className={`p-3 rounded-full ${highlight ? "bg-red-100 border-2 border-red-300" : "bg-blue-100 border-2 border-blue-200"}`}>
        {icon}
      </div>
    </div>
  );
}

