import { Users, Bell, ChevronLeft } from "lucide-react";
import { Button } from "../ui/button";

export function SidebarToggles({
  sidebarOpen,
  activityLogOpen,
  studentsCount,
  flaggedCount,
  onToggleSidebar,
  onToggleActivityLog,
}) {
  return (
    <div className="fixed right-4 top-20 z-30 flex flex-col gap-2">
      {!sidebarOpen && (
        <Button
          variant="outline"
          onClick={onToggleSidebar}
          className="shadow-xl border border-slate-700/50 bg-slate-800/95 backdrop-blur-xl hover:bg-slate-700/95 text-slate-200 flex items-center gap-2 h-9 px-3"
        >
          <Users className="w-4 h-4 text-cyan-400" />
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline text-xs font-medium">Participants</span>
          <span className="px-1.5 py-0.5 bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-semibold rounded">
            {studentsCount}
          </span>
        </Button>
      )}
      {!activityLogOpen && (
        <Button
          variant="outline"
          onClick={onToggleActivityLog}
          className="shadow-xl border border-slate-700/50 bg-slate-800/95 backdrop-blur-xl hover:bg-slate-700/95 text-slate-200 flex items-center gap-2 h-9 px-3 relative"
        >
          <Bell className="w-4 h-4 text-red-400" />
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline text-xs font-medium">Activity</span>
          {flaggedCount > 0 && (
            <>
              <span className="px-1.5 py-0.5 bg-red-500/20 border border-red-400/40 text-red-300 text-xs font-semibold rounded">
                {flaggedCount}
              </span>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border border-white"></span>
            </>
          )}
        </Button>
      )}
    </div>
  );
}

