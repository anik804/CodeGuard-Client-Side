export function StatCard({ icon, title, value, highlight, subtitle }) {
  return (
    <div
      className={`bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 flex justify-between items-center shadow-xl hover:shadow-2xl transition-all border ${
        highlight ? "border-red-500/30 bg-red-500/10" : "border-slate-700/50"
      }`}
    >
      <div className="flex-1">
        <p className="text-xs md:text-sm text-slate-400 font-medium mb-1">{title}</p>
        <p
          className={`text-2xl md:text-3xl font-bold mb-1 ${
            highlight ? "text-red-400" : "text-slate-200"
          }`}
        >
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-slate-400">{subtitle}</p>
        )}
      </div>
      <div className={`p-3 rounded-full ${highlight ? "bg-red-500/20 border border-red-400/40" : "bg-slate-700/50 border border-slate-600/50"}`}>
        {icon}
      </div>
    </div>
  );
}

