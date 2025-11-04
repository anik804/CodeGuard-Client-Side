import { Bell, Clock, HeartPulse, Users } from "lucide-react";
import { StatCard } from "./StatCard";
import { formatTime } from "../../utils/timeFormatter";

export function StatsSection({
  activeStudents,
  totalStudents,
  logsCount,
  timer,
  examStarted,
}) {
  return (
    <section className="p-4 md:p-6 pt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          icon={<Users className="text-cyan-400" />}
          title="Active Students"
          value={activeStudents.toString()}
          subtitle={`${totalStudents} joined`}
        />
        <StatCard
          icon={<Bell className="text-red-400" />}
          title="Active Alerts"
          value={logsCount.toString()}
          highlight
          subtitle="Flagged activities"
        />
        <StatCard
          icon={<HeartPulse className="text-emerald-400" />}
          title="System Health"
          value="98%"
          subtitle="All systems operational"
        />
        <StatCard
          icon={<Clock className="text-purple-400" />}
          title="Session Time"
          value={formatTime(timer)}
          subtitle={examStarted ? "Exam in progress" : "Ready to start"}
        />
      </div>
    </section>
  );
}

