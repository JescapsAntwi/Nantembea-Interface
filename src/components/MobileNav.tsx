import { NavLink } from "react-router-dom";
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
  LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type MobileNavProps = {
  isOpen: boolean;
  onClose: () => void;
};

type NavItemProps = {
  icon: LucideIcon;
  title: string;
  to: string;
  onClick: () => void;
  highlight?: boolean;
};

function NavItem({ icon: Icon, title, to, onClick, highlight }: NavItemProps) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-md px-4 py-3 text-base transition-all hover:bg-accent hover:text-black",
          isActive
            ? "bg-primary/10 text-primary font-medium"
            : highlight 
              ? "text-rose-500" 
              : "text-muted-foreground"
        )
      }
    >
      <Icon className={cn("h-5 w-5", highlight && "text-rose-500")} />
      <span>{title}</span>
    </NavLink>
  );
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const { logout } = useAuth();

  if (!isOpen) return null;

  const handleLogout = () => {
    onClose();
    logout();
  };

  return (
    <div className="fixed inset-0 top-16 z-20 h-[calc(100vh-4rem)] w-full animate-slide-in bg-background p-4 md:hidden">
      <div className="h-full overflow-auto rounded-lg bg-gradient-to-b from-purple-50 to-transparent dark:from-purple-900/10 dark:to-background pb-safe">
        <nav className="flex flex-col gap-1 p-2">
          <NavItem icon={BarChart3} title="Dashboard" to="/" onClick={onClose} />
          <NavItem icon={Users} title="Patients" to="/patients" onClick={onClose} />
          <NavItem icon={Calendar} title="Appointments" to="/appointments" onClick={onClose} />
          <NavItem icon={FileText} title="Medical Records" to="/records" onClick={onClose} />
          <NavItem icon={Pill} title="Medications" to="/medications" onClick={onClose} />
          <NavItem icon={TestTube} title="Laboratory" to="/laboratory" onClick={onClose} />
          <NavItem icon={UserCircle} title="Staff" to="/staff" onClick={onClose} />
          <NavItem icon={Share} title="Referrals" to="/referrals" onClick={onClose} />
          <NavItem icon={Heart} title="Health Programs" to="/programs" onClick={onClose} />
          <NavItem icon={Wrench} title="Equipment" to="/equipment" onClick={onClose} />
          <NavItem icon={LineChart} title="Reports" to="/reports" onClick={onClose} />
          
          <div className="mt-4 border-t border-border pt-4">
            <NavItem icon={Settings} title="Settings" to="/settings" onClick={onClose} />
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-md px-4 py-3 text-base text-rose-500 transition-all hover:bg-rose-500/10 hover:text-black"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}
