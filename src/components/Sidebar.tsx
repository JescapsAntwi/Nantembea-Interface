
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Calendar,
  LucideIcon,
  Users,
  FileText,
  Pill,
  TestTube,
  UserCircle,
  Share,
  Heart,
  Wrench,
  LineChart,
  Settings,
  LogOut
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type SidebarItemProps = {
  icon: LucideIcon;
  title: string;
  to: string;
};

function SidebarItem({ icon: Icon, title, to }: SidebarItemProps) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all hover:bg-accent group",
          isActive
            ? "bg-primary/10 text-primary font-medium"
            : "text-muted-foreground"
        )
      }
    >
      <Icon className={cn(
        "h-4 w-4",
        isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary/80"
      )} />
      <span className={isActive ? "text-primary" : "group-hover:text-foreground"}>{title}</span>
    </NavLink>
  );
}

export default function Sidebar() {
  const { logout } = useAuth();

  return (
    <div className="hidden border-r bg-sidebar pt-0 md:block md:w-64 lg:w-72">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex-1 overflow-auto py-2 px-4">
          <nav className="grid items-start gap-2 text-base font-medium">
            <SidebarItem icon={BarChart3} title="Dashboard" to="/" />
            <SidebarItem icon={Users} title="Patients" to="/patients" />
            <SidebarItem icon={Calendar} title="Appointments" to="/appointments" />
            <SidebarItem icon={FileText} title="Medical Records" to="/records" />
            <SidebarItem icon={Pill} title="Medications" to="/medications" />
            <SidebarItem icon={TestTube} title="Laboratory" to="/laboratory" />
            <SidebarItem icon={UserCircle} title="Staff" to="/staff" />
            <SidebarItem icon={Share} title="Referrals" to="/referrals" />
            <SidebarItem icon={Heart} title="Health Programs" to="/programs" />
            <SidebarItem icon={Wrench} title="Equipment" to="/equipment" />
            <SidebarItem icon={LineChart} title="Reports" to="/reports" />
          </nav>
        </div>
        <div className="mt-auto border-t p-4">
          <nav className="grid items-start gap-2 text-sm">
            <NavLink
              to="/settings"
              className={({ isActive }) => cn(
                "flex items-center gap-3 rounded-md px-3 py-2 transition-all group",
                isActive ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-accent"
              )}
            >
              <Settings className="h-4 w-4 group-hover:text-primary/80" />
              <span className="group-hover:text-foreground">Settings</span>
            </NavLink>
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-rose-500 transition-all hover:bg-rose-500/10"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
