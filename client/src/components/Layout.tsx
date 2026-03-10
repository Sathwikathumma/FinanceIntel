import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Upload, 
  MessageSquare, 
  TrendingUp, 
  LogOut, 
  Menu,
  X,
  Wallet
} from "lucide-react";
import { useUser, useLogout } from "@/hooks/use-auth";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/upload", label: "Upload Data", icon: Upload },
  { href: "/chat", label: "AI Advisor", icon: MessageSquare },
  { href: "/simulator", label: "Scenario Simulator", icon: TrendingUp },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { data: user } = useUser();
  const logout = useLogout();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location]);

  if (!user) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden glass-panel sticky top-0 z-50 flex items-center justify-between p-4 border-b-0">
        <div className="flex items-center gap-2 text-primary">
          <Wallet className="w-6 h-6" />
          <span className="font-bold tracking-tight">Finance Intel</span>
        </div>
        <button 
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 bg-secondary rounded-lg text-secondary-foreground"
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <AnimatePresence>
        {(isMobileOpen || window.innerWidth >= 768) && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`
              fixed md:sticky top-0 left-0 z-40
              w-64 h-screen glass-panel border-r-border/50
              flex flex-col
              ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}
          >
            <div className="p-6 hidden md:flex items-center gap-3 text-primary mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-foreground">FinIntel</span>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4 md:mt-0">
              {NAV_ITEMS.map((item) => {
                const isActive = location === item.href;
                return (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium
                      ${isActive 
                        ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' 
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                      }
                    `}
                  >
                    <item.icon className={`w-5 h-5 ${isActive ? 'text-primary-foreground' : ''}`} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-border/50 mt-auto">
              <div className="mb-4 px-4 py-3 bg-secondary rounded-xl">
                <p className="text-xs text-muted-foreground">Logged in as</p>
                <p className="font-semibold text-sm text-foreground truncate">{user.username}</p>
              </div>
              <button
                onClick={() => logout.mutate()}
                disabled={logout.isPending}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-destructive bg-destructive/10 hover:bg-destructive hover:text-destructive-foreground rounded-xl transition-colors duration-200"
              >
                <LogOut className="w-4 h-4" />
                {logout.isPending ? "Logging out..." : "Logout"}
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[100vw] md:max-w-[calc(100vw-16rem)] min-h-screen overflow-x-hidden">
        <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile overlay backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </div>
  );
}
